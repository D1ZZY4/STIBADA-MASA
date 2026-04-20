import { Router, type IRouter } from "express";
import { getDB, ObjectId } from "../lib/mongodb";

const router: IRouter = Router();

function toAbsensi(doc: Record<string, unknown>) {
  const { _id, ...rest } = doc;
  return { id: (_id as ObjectId).toHexString(), ...rest };
}

router.get("/absensi", async (req, res): Promise<void> => {
  const db = getDB();
  const { mahasiswaId, dosenId, jadwalId, tanggal } = req.query as Record<string, string>;
  const filter: Record<string, unknown> = {};
  if (mahasiswaId) filter["mahasiswaId"] = mahasiswaId;
  if (dosenId) filter["dosenId"] = dosenId;
  if (jadwalId) filter["jadwalId"] = jadwalId;
  if (tanggal) filter["tanggal"] = tanggal;

  const [data, total] = await Promise.all([
    db.collection("absensi").find(filter).toArray(),
    db.collection("absensi").countDocuments(filter),
  ]);
  res.json({ data: data.map(toAbsensi), total });
});

router.post("/absensi", async (req, res): Promise<void> => {
  const db = getDB();
  const { mahasiswaId, jadwalId, dosenId, tanggal, status, keterangan = "" } = req.body;
  if (!mahasiswaId || !jadwalId || !tanggal || !status) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  let mahasiswaNama = "";
  let mahasiswaNim = "";
  let mataKuliahNama = "";
  try {
    const m = await db.collection("mahasiswa").findOne({ _id: new ObjectId(mahasiswaId) });
    if (m) { mahasiswaNama = m["nama"] as string; mahasiswaNim = m["nim"] as string; }
    const j = await db.collection("jadwal").findOne({ _id: new ObjectId(jadwalId) });
    if (j) mataKuliahNama = j["mataKuliahNama"] as string;
  } catch {}
  const doc = { mahasiswaId, mahasiswaNama, mahasiswaNim, dosenId: dosenId || "", jadwalId, mataKuliahNama, tanggal, status, keterangan, createdAt: new Date().toISOString() };
  const result = await db.collection("absensi").insertOne(doc);
  res.status(201).json({ id: result.insertedId.toHexString(), ...doc });
});

router.put("/absensi/:id", async (req, res): Promise<void> => {
  const db = getDB();
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const update: Record<string, unknown> = {};
  if (req.body.status !== undefined) update["status"] = req.body.status;
  if (req.body.keterangan !== undefined) update["keterangan"] = req.body.keterangan;
  try {
    const result = await db.collection("absensi").findOneAndUpdate({ _id: new ObjectId(rawId) }, { $set: update }, { returnDocument: "after" });
    if (!result) { res.status(404).json({ error: "Absensi not found" }); return; }
    res.json(toAbsensi(result as Record<string, unknown>));
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

export default router;
