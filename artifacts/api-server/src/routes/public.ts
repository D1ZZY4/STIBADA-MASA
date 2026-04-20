import { Router, type IRouter } from "express";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getDB, ObjectId } from "../lib/mongodb";
import { requireRole } from "../middlewares/security";
import { broadcastRealtime } from "../lib/realtime";

const router: IRouter = Router();

const defaultContent = [
  { key: "visi", type: "profile", title: "Visi STIBADA MASA", content: "Menjadi perguruan tinggi yang membentuk insan akademik beradab, adaptif, dan berdampak bagi masyarakat.", status: "published" },
  { key: "misi", type: "profile", title: "Misi", content: "Menguatkan pembelajaran, penelitian, pengabdian, tata kelola, dan jejaring digital yang relevan dengan kebutuhan zaman.", status: "published" },
  { key: "pmb", type: "admission", title: "Gelombang PMB 2026", content: "Pendaftaran mahasiswa baru dibuka untuk jalur reguler, prestasi, dan transfer.", status: "published" },
];

function toDoc(doc: Record<string, unknown>) {
  const { _id, ...rest } = doc;
  return { id: (_id as ObjectId).toHexString(), ...rest };
}

async function ensurePublicContent() {
  const db = getDB();
  const count = await db.collection("publicContent").countDocuments();
  if (count === 0) await db.collection("publicContent").insertMany(defaultContent.map((item) => ({ ...item, updatedAt: new Date().toISOString() })));
}

router.get("/public/landing", async (_req, res): Promise<void> => {
  await ensurePublicContent();
  const db = getDB();
  const [content, announcements, programs, scholarships, gallery] = await Promise.all([
    db.collection("publicContent").find({ status: "published" }).toArray(),
    db.collection("announcements").find({ audience: { $in: ["publik", "semua"] } }).sort({ createdAt: -1 }).limit(6).toArray(),
    db.collection("programs").find({}).toArray(),
    db.collection("scholarships").find({}).toArray(),
    db.collection("gallery").find({}).sort({ createdAt: -1 }).limit(8).toArray(),
  ]);

  res.json({
    content: content.map(toDoc),
    announcements: announcements.map(toDoc),
    programs: programs.map(toDoc),
    scholarships: scholarships.map(toDoc),
    gallery: gallery.map(toDoc),
    admission: {
      biaya: "Mulai Rp 3.500.000 per semester",
      kontak: "pmb@stibadamasa.ac.id",
      jadwal: "Gelombang 1: Januari-Maret, Gelombang 2: April-Juni, Gelombang 3: Juli-Agustus",
    },
  });
});

router.post("/public/applications", async (req, res): Promise<void> => {
  const db = getDB();
  const { nama, email, telepon, program, jalur = "reguler", pesan = "" } = req.body;
  if (!nama || !email || !telepon || !program) {
    res.status(400).json({ error: "nama, email, telepon, dan program wajib diisi" });
    return;
  }
  const doc = { nama, email, telepon, program, jalur, pesan, status: "baru", createdAt: new Date().toISOString() };
  const result = await db.collection("applications").insertOne(doc);
  await db.collection("auditLogs").insertOne({ actorRole: "public", action: "admission.apply", target: result.insertedId.toHexString(), createdAt: new Date().toISOString() });
  res.status(201).json({ id: result.insertedId.toHexString(), ...doc });
});

router.get("/content", requireRole(["admin", "rektor"]), async (_req, res): Promise<void> => {
  await ensurePublicContent();
  const db = getDB();
  const [content, applications, auditLogs] = await Promise.all([
    db.collection("publicContent").find({}).sort({ updatedAt: -1 }).toArray(),
    db.collection("applications").find({}).sort({ createdAt: -1 }).limit(25).toArray(),
    db.collection("auditLogs").find({}).sort({ createdAt: -1 }).limit(30).toArray(),
  ]);
  res.json({ content: content.map(toDoc), applications: applications.map(toDoc), auditLogs: auditLogs.map(toDoc) });
});

router.post("/content", requireRole(["admin"]), async (req, res): Promise<void> => {
  const db = getDB();
  const { key, type, title, content, status = "published" } = req.body;
  if (!key || !type || !title || !content) {
    res.status(400).json({ error: "key, type, title, dan content wajib diisi" });
    return;
  }
  const doc = { key, type, title, content, status, updatedAt: new Date().toISOString() };
  const result = await db.collection("publicContent").insertOne(doc);
  await db.collection("auditLogs").insertOne({ actorRole: "admin", action: "content.create", target: key, createdAt: new Date().toISOString() });
  if (type === "announcement") broadcastRealtime("announcement.created", doc);
  res.status(201).json({ id: result.insertedId.toHexString(), ...doc });
});

router.put("/content/:id", requireRole(["admin"]), async (req, res): Promise<void> => {
  const db = getDB();
  const { id } = req.params;
  const update = { ...req.body, updatedAt: new Date().toISOString() };
  delete update.id;
  const result = await db.collection("publicContent").findOneAndUpdate({ _id: new ObjectId(id) }, { $set: update }, { returnDocument: "after" });
  if (!result) {
    res.status(404).json({ error: "Konten tidak ditemukan" });
    return;
  }
  await db.collection("auditLogs").insertOne({ actorRole: "admin", action: "content.update", target: id, createdAt: new Date().toISOString() });
  res.json(toDoc(result as Record<string, unknown>));
});

router.post("/analytics/event", async (req, res): Promise<void> => {
  const db = getDB();
  const event = { event: req.body.event || "page_view", path: req.body.path || "/", createdAt: new Date().toISOString() };
  await db.collection("analyticsEvents").insertOne(event);
  res.status(204).send();
});

router.get("/docs", async (_req, res): Promise<void> => {
  res.type("html").send("<!doctype html><html lang=\"id\"><head><title>STIBADA MASA API</title></head><body style=\"font-family:system-ui;padding:32px\"><h1>STIBADA MASA API</h1><p>Spesifikasi OpenAPI tersedia di <a href=\"/api/openapi.yaml\">/api/openapi.yaml</a>.</p><p>Endpoint mencakup autentikasi, data akademik, dashboard, konten publik, pendaftaran, audit trail, dan real-time WebSocket di <code>/api/ws</code>.</p></body></html>");
});

router.get("/openapi.yaml", async (_req, res): Promise<void> => {
  const specPath = path.resolve(process.cwd(), "../../lib/api-spec/openapi.yaml");
  const spec = await readFile(specPath, "utf8");
  res.type("yaml").send(spec);
});

export default router;