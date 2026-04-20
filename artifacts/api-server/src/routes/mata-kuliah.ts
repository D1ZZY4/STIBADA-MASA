import { Router, type IRouter } from "express";
import { getDB, ObjectId } from "../lib/mongodb";

const router: IRouter = Router();

function toMK(doc: Record<string, unknown>) {
  const { _id, ...rest } = doc;
  return { id: (_id as ObjectId).toHexString(), ...rest };
}

router.get("/mata-kuliah", async (req, res): Promise<void> => {
  const db = getDB();
  const { prodi, semester } = req.query as Record<string, string>;
  const filter: Record<string, unknown> = {};
  if (prodi) filter["prodi"] = prodi;
  if (semester) filter["semester"] = parseInt(semester, 10);
  const [data, total] = await Promise.all([
    db.collection("matakuLiah").find(filter).toArray(),
    db.collection("matakuLiah").countDocuments(filter),
  ]);
  res.json({ data: data.map(toMK), total });
});

router.post("/mata-kuliah", async (req, res): Promise<void> => {
  const db = getDB();
  const { kode, nama, sks, semester, prodi, dosenId, deskripsi } = req.body;
  if (!kode || !nama || !sks || !semester || !prodi) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  let dosenNama = "";
  if (dosenId) {
    try {
      const dosen = await db.collection("dosen").findOne({ _id: new ObjectId(dosenId) });
      if (dosen) dosenNama = dosen["nama"] as string;
    } catch {}
  }
  const doc = { kode, nama, sks: parseInt(sks, 10), semester: parseInt(semester, 10), prodi, dosenId: dosenId || "", dosenNama, deskripsi: deskripsi || "", status: "aktif", createdAt: new Date().toISOString() };
  const result = await db.collection("matakuLiah").insertOne(doc);
  res.status(201).json({ id: result.insertedId.toHexString(), ...doc });
});

router.get("/mata-kuliah/:id", async (req, res): Promise<void> => {
  const db = getDB();
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  try {
    const doc = await db.collection("matakuLiah").findOne({ _id: new ObjectId(rawId) });
    if (!doc) { res.status(404).json({ error: "Mata kuliah not found" }); return; }
    res.json(toMK(doc as Record<string, unknown>));
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

router.put("/mata-kuliah/:id", async (req, res): Promise<void> => {
  const db = getDB();
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const update: Record<string, unknown> = {};
  const fields = ["nama", "sks", "semester", "prodi", "dosenId", "deskripsi", "status"];
  for (const f of fields) {
    if (req.body[f] !== undefined) update[f] = req.body[f];
  }
  try {
    const result = await db.collection("matakuLiah").findOneAndUpdate({ _id: new ObjectId(rawId) }, { $set: update }, { returnDocument: "after" });
    if (!result) { res.status(404).json({ error: "Mata kuliah not found" }); return; }
    res.json(toMK(result as Record<string, unknown>));
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

router.delete("/mata-kuliah/:id", async (req, res): Promise<void> => {
  const db = getDB();
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  try {
    const result = await db.collection("matakuLiah").deleteOne({ _id: new ObjectId(rawId) });
    if (result.deletedCount === 0) { res.status(404).json({ error: "Mata kuliah not found" }); return; }
    res.sendStatus(204);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

export default router;
