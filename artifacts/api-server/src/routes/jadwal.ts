import { Router, type IRouter } from "express";
import { getDB, ObjectId } from "../lib/mongodb";

const router: IRouter = Router();

function toJadwal(doc: Record<string, unknown>) {
  const { _id, ...rest } = doc;
  return { id: (_id as ObjectId).toHexString(), ...rest };
}

router.get("/jadwal", async (req, res): Promise<void> => {
  const db = getDB();
  const { mahasiswaId, dosenId, hari, semester } = req.query as Record<string, string>;
  const filter: Record<string, unknown> = {};
  if (dosenId) filter["dosenId"] = dosenId;
  if (hari) filter["hari"] = hari;
  if (semester) filter["semester"] = semester;

  if (mahasiswaId) {
    const krs = await db.collection("krs").find({ mahasiswaId, status: "disetujui" }).toArray();
    const mkIds = krs.map((k) => k["mataKuliahId"] as string);
    if (mkIds.length > 0) {
      filter["mataKuliahId"] = { $in: mkIds };
    }
  }

  const [data, total] = await Promise.all([
    db.collection("jadwal").find(filter).toArray(),
    db.collection("jadwal").countDocuments(filter),
  ]);
  res.json({ data: data.map(toJadwal), total });
});

router.post("/jadwal", async (req, res): Promise<void> => {
  const db = getDB();
  const { mataKuliahId, dosenId, hari, jamMulai, jamSelesai, ruangan, kelas, semester } = req.body;
  if (!mataKuliahId || !dosenId || !hari || !jamMulai || !jamSelesai || !ruangan || !kelas || !semester) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  let mataKuliahNama = "";
  let mataKuliahKode = "";
  let sks = 0;
  let dosenNama = "";
  try {
    const mk = await db.collection("matakuLiah").findOne({ _id: new ObjectId(mataKuliahId) });
    if (mk) { mataKuliahNama = mk["nama"] as string; mataKuliahKode = mk["kode"] as string; sks = mk["sks"] as number; }
    const dosen = await db.collection("dosen").findOne({ _id: new ObjectId(dosenId) });
    if (dosen) dosenNama = dosen["nama"] as string;
  } catch {}
  const doc = { mataKuliahId, mataKuliahNama, mataKuliahKode, dosenId, dosenNama, hari, jamMulai, jamSelesai, ruangan, kelas, semester, sks, createdAt: new Date().toISOString() };
  const result = await db.collection("jadwal").insertOne(doc);
  res.status(201).json({ id: result.insertedId.toHexString(), ...doc });
});

router.put("/jadwal/:id", async (req, res): Promise<void> => {
  const db = getDB();
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const update: Record<string, unknown> = {};
  const fields = ["hari", "jamMulai", "jamSelesai", "ruangan", "kelas"];
  for (const f of fields) {
    if (req.body[f] !== undefined) update[f] = req.body[f];
  }
  try {
    const result = await db.collection("jadwal").findOneAndUpdate({ _id: new ObjectId(rawId) }, { $set: update }, { returnDocument: "after" });
    if (!result) { res.status(404).json({ error: "Jadwal not found" }); return; }
    res.json(toJadwal(result as Record<string, unknown>));
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

router.delete("/jadwal/:id", async (req, res): Promise<void> => {
  const db = getDB();
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  try {
    const result = await db.collection("jadwal").deleteOne({ _id: new ObjectId(rawId) });
    if (result.deletedCount === 0) { res.status(404).json({ error: "Jadwal not found" }); return; }
    res.sendStatus(204);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

export default router;
