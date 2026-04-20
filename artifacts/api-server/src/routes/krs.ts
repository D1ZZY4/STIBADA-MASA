import { Router, type IRouter } from "express";
import { getDB, ObjectId } from "../lib/mongodb";

const router: IRouter = Router();

function toKrs(doc: Record<string, unknown>) {
  const { _id, ...rest } = doc;
  return { id: (_id as ObjectId).toHexString(), ...rest };
}

router.get("/krs", async (req, res): Promise<void> => {
  const db = getDB();
  const { mahasiswaId, semester, status } = req.query as Record<string, string>;
  const filter: Record<string, unknown> = {};
  if (mahasiswaId) filter["mahasiswaId"] = mahasiswaId;
  if (semester) filter["semester"] = semester;
  if (status) filter["status"] = status;

  const [data, total] = await Promise.all([
    db.collection("krs").find(filter).toArray(),
    db.collection("krs").countDocuments(filter),
  ]);
  const totalSks = data.reduce((sum, k) => sum + ((k["sks"] as number) || 0), 0);
  res.json({ data: data.map(toKrs), total, totalSks });
});

router.post("/krs", async (req, res): Promise<void> => {
  const db = getDB();
  const { mahasiswaId, mataKuliahId, semester, kelas } = req.body;
  if (!mahasiswaId || !mataKuliahId || !semester) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  let mahasiswaNama = "";
  let mataKuliahNama = "";
  let mataKuliahKode = "";
  let sks = 0;
  try {
    const m = await db.collection("mahasiswa").findOne({ _id: new ObjectId(mahasiswaId) });
    if (m) mahasiswaNama = m["nama"] as string;
    const mk = await db.collection("matakuLiah").findOne({ _id: new ObjectId(mataKuliahId) });
    if (mk) { mataKuliahNama = mk["nama"] as string; mataKuliahKode = mk["kode"] as string; sks = mk["sks"] as number; }
  } catch {}
  const doc = { mahasiswaId, mahasiswaNama, mataKuliahId, mataKuliahNama, mataKuliahKode, sks, semester, status: "pending", kelas: kelas || "", createdAt: new Date().toISOString() };
  const result = await db.collection("krs").insertOne(doc);
  res.status(201).json({ id: result.insertedId.toHexString(), ...doc });
});

router.put("/krs/:id", async (req, res): Promise<void> => {
  const db = getDB();
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const { status } = req.body;
  try {
    const result = await db.collection("krs").findOneAndUpdate({ _id: new ObjectId(rawId) }, { $set: { status } }, { returnDocument: "after" });
    if (!result) { res.status(404).json({ error: "KRS not found" }); return; }
    res.json(toKrs(result as Record<string, unknown>));
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

router.delete("/krs/:id", async (req, res): Promise<void> => {
  const db = getDB();
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  try {
    const result = await db.collection("krs").deleteOne({ _id: new ObjectId(rawId) });
    if (result.deletedCount === 0) { res.status(404).json({ error: "KRS not found" }); return; }
    res.sendStatus(204);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

export default router;
