import { Router, type IRouter } from "express";
import { getDB, ObjectId } from "../lib/mongodb";

const router: IRouter = Router();

function toDosen(doc: Record<string, unknown>) {
  const { _id, password: _pw, ...rest } = doc;
  return { id: (_id as ObjectId).toHexString(), ...rest };
}

router.get("/dosen", async (req, res): Promise<void> => {
  const db = getDB();
  const { search, prodi } = req.query as Record<string, string>;
  const filter: Record<string, unknown> = {};
  if (search) filter["$or"] = [{ nama: { $regex: search, $options: "i" } }, { nidn: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
  if (prodi) filter["prodi"] = prodi;
  const [data, total] = await Promise.all([
    db.collection("dosen").find(filter).toArray(),
    db.collection("dosen").countDocuments(filter),
  ]);
  res.json({ data: data.map(toDosen), total });
});

router.post("/dosen", async (req, res): Promise<void> => {
  const db = getDB();
  const { nidn, nama, email, prodi, jabatan, golongan, telepon, keahlian, password = "dosen123" } = req.body;
  if (!nidn || !nama || !email || !prodi) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const doc = { nidn, nama, email, prodi, jabatan: jabatan || "", golongan: golongan || "", status: "aktif", keahlian: keahlian || [], telepon: telepon || "", password, role: "dosen", createdAt: new Date().toISOString() };
  const result = await db.collection("dosen").insertOne(doc);
  res.status(201).json({ id: result.insertedId.toHexString(), ...doc });
});

router.get("/dosen/:id", async (req, res): Promise<void> => {
  const db = getDB();
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  try {
    const doc = await db.collection("dosen").findOne({ _id: new ObjectId(rawId) });
    if (!doc) { res.status(404).json({ error: "Dosen not found" }); return; }
    res.json(toDosen(doc as Record<string, unknown>));
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

router.put("/dosen/:id", async (req, res): Promise<void> => {
  const db = getDB();
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const update: Record<string, unknown> = {};
  const fields = ["nama", "email", "prodi", "jabatan", "golongan", "status", "telepon", "keahlian"];
  for (const f of fields) {
    if (req.body[f] !== undefined) update[f] = req.body[f];
  }
  try {
    const result = await db.collection("dosen").findOneAndUpdate({ _id: new ObjectId(rawId) }, { $set: update }, { returnDocument: "after" });
    if (!result) { res.status(404).json({ error: "Dosen not found" }); return; }
    res.json(toDosen(result as Record<string, unknown>));
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

export default router;
