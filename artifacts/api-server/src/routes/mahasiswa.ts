import { Router, type IRouter } from "express";
import { getDB, ObjectId } from "../lib/mongodb";

const router: IRouter = Router();

function toMahasiswa(doc: Record<string, unknown>) {
  const { _id, password: _pw, ...rest } = doc;
  return { id: (_id as ObjectId).toHexString(), ...rest };
}

router.get("/mahasiswa", async (req, res): Promise<void> => {
  const db = getDB();
  const { search, prodi, semester, page = "1", limit = "20" } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = {};
  if (search) filter["$or"] = [{ nama: { $regex: search, $options: "i" } }, { nim: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
  if (prodi) filter["prodi"] = prodi;
  if (semester) filter["semester"] = parseInt(semester, 10);

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, parseInt(limit, 10) || 20);
  const skip = (pageNum - 1) * limitNum;

  const [data, total] = await Promise.all([
    db.collection("mahasiswa").find(filter).skip(skip).limit(limitNum).toArray(),
    db.collection("mahasiswa").countDocuments(filter),
  ]);

  res.json({ data: data.map(toMahasiswa), total, page: pageNum, limit: limitNum });
});

router.post("/mahasiswa", async (req, res): Promise<void> => {
  const db = getDB();
  const { nim, nama, email, prodi, angkatan, semester = 1, telepon, alamat, password = "mahasiswa123" } = req.body;
  if (!nim || !nama || !email || !prodi || !angkatan) {
    res.status(400).json({ error: "Missing required fields: nim, nama, email, prodi, angkatan" });
    return;
  }
  const doc = { nim, nama, email, prodi, angkatan: parseInt(angkatan, 10), semester: parseInt(semester, 10), ipk: 0, sks: 0, status: "aktif", telepon: telepon || "", alamat: alamat || "", password, role: "mahasiswa", createdAt: new Date().toISOString() };
  const result = await db.collection("mahasiswa").insertOne(doc);
  res.status(201).json({ id: result.insertedId.toHexString(), ...doc });
});

router.get("/mahasiswa/:id", async (req, res): Promise<void> => {
  const db = getDB();
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  try {
    const doc = await db.collection("mahasiswa").findOne({ _id: new ObjectId(rawId) });
    if (!doc) { res.status(404).json({ error: "Mahasiswa not found" }); return; }
    res.json(toMahasiswa(doc as Record<string, unknown>));
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

router.put("/mahasiswa/:id", async (req, res): Promise<void> => {
  const db = getDB();
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const { nama, email, prodi, semester, status, telepon, alamat } = req.body;
  const update: Record<string, unknown> = {};
  if (nama !== undefined) update["nama"] = nama;
  if (email !== undefined) update["email"] = email;
  if (prodi !== undefined) update["prodi"] = prodi;
  if (semester !== undefined) update["semester"] = parseInt(semester, 10);
  if (status !== undefined) update["status"] = status;
  if (telepon !== undefined) update["telepon"] = telepon;
  if (alamat !== undefined) update["alamat"] = alamat;
  try {
    const result = await db.collection("mahasiswa").findOneAndUpdate({ _id: new ObjectId(rawId) }, { $set: update }, { returnDocument: "after" });
    if (!result) { res.status(404).json({ error: "Mahasiswa not found" }); return; }
    res.json(toMahasiswa(result as Record<string, unknown>));
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

router.delete("/mahasiswa/:id", async (req, res): Promise<void> => {
  const db = getDB();
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  try {
    const result = await db.collection("mahasiswa").deleteOne({ _id: new ObjectId(rawId) });
    if (result.deletedCount === 0) { res.status(404).json({ error: "Mahasiswa not found" }); return; }
    res.sendStatus(204);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

export default router;
