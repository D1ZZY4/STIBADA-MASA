import { Router, type IRouter } from "express";
import { getDB, ObjectId } from "../lib/mongodb";

const router: IRouter = Router();

function toNilai(doc: Record<string, unknown>) {
  const { _id, ...rest } = doc;
  return { id: (_id as ObjectId).toHexString(), ...rest };
}

function calculateGrade(nilaiAkhir: number): string {
  if (nilaiAkhir >= 90) return "A";
  if (nilaiAkhir >= 85) return "A-";
  if (nilaiAkhir >= 80) return "B+";
  if (nilaiAkhir >= 75) return "B";
  if (nilaiAkhir >= 70) return "B-";
  if (nilaiAkhir >= 65) return "C+";
  if (nilaiAkhir >= 60) return "C";
  if (nilaiAkhir >= 55) return "D";
  return "E";
}

router.get("/nilai", async (req, res): Promise<void> => {
  const db = getDB();
  const { mahasiswaId, dosenId, mataKuliahId, semester } = req.query as Record<string, string>;
  const filter: Record<string, unknown> = {};
  if (mahasiswaId) filter["mahasiswaId"] = mahasiswaId;
  if (dosenId) filter["dosenId"] = dosenId;
  if (mataKuliahId) filter["mataKuliahId"] = mataKuliahId;
  if (semester) filter["semester"] = semester;

  const [data, total] = await Promise.all([
    db.collection("nilai").find(filter).toArray(),
    db.collection("nilai").countDocuments(filter),
  ]);
  res.json({ data: data.map(toNilai), total });
});

router.post("/nilai", async (req, res): Promise<void> => {
  const db = getDB();
  const { mahasiswaId, mataKuliahId, dosenId, semester, nilaiTugas = 0, nilaiUts = 0, nilaiUas = 0 } = req.body;
  if (!mahasiswaId || !mataKuliahId || !dosenId || !semester) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  let mahasiswaNama = "";
  let mahasiswaNim = "";
  let mataKuliahNama = "";
  let mataKuliahKode = "";
  let sks = 0;
  try {
    const m = await db.collection("mahasiswa").findOne({ _id: new ObjectId(mahasiswaId) });
    if (m) { mahasiswaNama = m["nama"] as string; mahasiswaNim = m["nim"] as string; }
    const mk = await db.collection("matakuLiah").findOne({ _id: new ObjectId(mataKuliahId) });
    if (mk) { mataKuliahNama = mk["nama"] as string; mataKuliahKode = mk["kode"] as string; sks = mk["sks"] as number; }
  } catch {}

  const nilaiAkhir = (parseFloat(nilaiTugas) * 0.3 + parseFloat(nilaiUts) * 0.3 + parseFloat(nilaiUas) * 0.4);
  const grade = calculateGrade(nilaiAkhir);

  const doc = { mahasiswaId, mahasiswaNama, mahasiswaNim, mataKuliahId, mataKuliahNama, mataKuliahKode, dosenId, semester, nilaiTugas: parseFloat(nilaiTugas), nilaiUts: parseFloat(nilaiUts), nilaiUas: parseFloat(nilaiUas), nilaiAkhir, grade, sks, createdAt: new Date().toISOString() };
  const result = await db.collection("nilai").insertOne(doc);
  res.status(201).json({ id: result.insertedId.toHexString(), ...doc });
});

router.put("/nilai/:id", async (req, res): Promise<void> => {
  const db = getDB();
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const { nilaiTugas, nilaiUts, nilaiUas } = req.body;
  const update: Record<string, unknown> = {};
  if (nilaiTugas !== undefined) update["nilaiTugas"] = parseFloat(nilaiTugas);
  if (nilaiUts !== undefined) update["nilaiUts"] = parseFloat(nilaiUts);
  if (nilaiUas !== undefined) update["nilaiUas"] = parseFloat(nilaiUas);
  if (Object.keys(update).length > 0) {
    const existing = await db.collection("nilai").findOne({ _id: new ObjectId(rawId) });
    if (existing) {
      const t = (update["nilaiTugas"] ?? existing["nilaiTugas"]) as number;
      const u = (update["nilaiUts"] ?? existing["nilaiUts"]) as number;
      const a = (update["nilaiUas"] ?? existing["nilaiUas"]) as number;
      const nilaiAkhir = t * 0.3 + u * 0.3 + a * 0.4;
      update["nilaiAkhir"] = nilaiAkhir;
      update["grade"] = calculateGrade(nilaiAkhir);
    }
  }
  try {
    const result = await db.collection("nilai").findOneAndUpdate({ _id: new ObjectId(rawId) }, { $set: update }, { returnDocument: "after" });
    if (!result) { res.status(404).json({ error: "Nilai not found" }); return; }
    res.json(toNilai(result as Record<string, unknown>));
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

export default router;
