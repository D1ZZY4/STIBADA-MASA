import { Router, type IRouter } from "express";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getDB, ObjectId } from "../lib/mongodb";
import { requireRole } from "../middlewares/security";
import { broadcastRealtime } from "../lib/realtime";

const router: IRouter = Router();

const defaultContent = [
  { key: "home.hero", page: "Beranda", section: "Hero", type: "page", title: "STIBADA MASA — Pusat Studi Bahasa Arab & Dakwah Sunan Ampel", content: "Sekolah Tinggi Ilmu Bahasa Arab dan Dakwah Masjid Agung Sunan Ampel Surabaya. Terakreditasi BAN-PT, terintegrasi sistem PMB & SIAKAD untuk layanan akademik yang transparan.", image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1400&q=85", status: "published", order: 1 },
  { key: "home.profile", page: "Beranda", section: "Profil Kampus", type: "page", title: "Visi & Misi STIBADA MASA", content: "Berakar pada nilai-nilai luhur Sunan Ampel, kami menyiapkan ahli Bahasa Arab yang berkarakter Islami, kompeten secara akademik, dan bermanfaat bagi masyarakat.", image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1000&q=85", status: "published", order: 2 },
  { key: "home.portal", page: "Beranda", section: "CTA Portal", type: "page", title: "Portal Akademik Terintegrasi", content: "Satu pintu untuk Mahasiswa, Dosen, Admin, dan Rektor. Terhubung langsung dengan sistem PMB dan SIAKAD STIBADA MASA.", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=85", status: "published", order: 3 },
  { key: "visi", page: "Beranda", section: "Profil Kampus", type: "profile", title: "Visi", content: "Menjadi program studi pendidikan Bahasa Arab yang Unggul, Berkarakter Islami berdasarkan nilai-nilai luhur Sunan Ampel.", image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=900&q=85", status: "published", order: 4 },
  { key: "misi", page: "Beranda", section: "Profil Kampus", type: "profile", title: "Misi", content: "1) Menyelenggarakan pendidikan & pengajaran Bahasa Arab yang berkualitas dan berkarakter Islami berdasarkan nilai-nilai luhur Sunan Ampel. 2) Melaksanakan penelitian dalam bidang Pendidikan Bahasa Arab yang berkontribusi pada pengembangan ilmu. 3) Mengabdikan ilmu kepada masyarakat melalui dakwah dan pengabdian berbasis nilai-nilai luhur Sunan Ampel.", image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=900&q=85", status: "published", order: 5 },
  { key: "tujuan", page: "Beranda", section: "Profil Kampus", type: "profile", title: "Tujuan", content: "1) Menghasilkan lulusan yang kompeten dan berakhlak mulia dalam bidang Pendidikan Bahasa Arab. 2) Menjadi rujukan penelitian Pendidikan Bahasa Arab. 3) Memberikan kontribusi nyata melalui dakwah dan pengabdian masyarakat.", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=85", status: "published", order: 6 },
  { key: "home.akreditasi", page: "Beranda", section: "Profil Kampus", type: "feature", title: "Terakreditasi BAN-PT", content: "Sertifikat Akreditasi BAN-PT berlaku 2022–2027. Penjaminan mutu pendidikan tinggi yang independen dan terpercaya.", image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=900&q=85", status: "published", order: 7 },
  { key: "home.integrasi", page: "Beranda", section: "Profil Kampus", type: "feature", title: "Integrasi PMB & SIAKAD", content: "Pendaftaran online, KRS, nilai, jadwal, dan layanan administrasi terhubung dalam satu sistem akademik terpadu.", image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85", status: "published", order: 8 },
  { key: "pendaftaran.hero", page: "Pendaftaran", section: "Hero", type: "page", title: "Pendaftaran Mahasiswa Baru", content: "Mulai perjalanan akademikmu di STIBADA MASA. Proses pendaftaran mudah, transparan, dan dapat dipantau secara daring.", image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=85", status: "published", order: 8 },
  { key: "pendaftaran.form", page: "Pendaftaran", section: "Formulir", type: "image", title: "Formulir Pendaftaran Daring", content: "Isi dengan data yang benar dan lengkap", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=85", status: "published", order: 9 },
  { key: "pendaftaran.help", page: "Pendaftaran", section: "Bantuan", type: "layout", title: "Butuh Bantuan?", content: "Hubungi tim PMB melalui pmb@stibadamasa.ac.id atau datang ke kantor PMB Senin–Jumat 08.00–16.00 WIB.", image: "", status: "published", order: 10 },
  { key: "program-studi.hero", page: "Program Studi", section: "Hero", type: "page", title: "Program Studi", content: "Pilih program studi yang sesuai dengan minat, bakat, dan tujuan karir Anda.", image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=85", status: "published", order: 11 },
  { key: "beasiswa.hero", page: "Beasiswa", section: "Hero", type: "page", title: "Raih Masa Depan dengan Beasiswa STIBADA MASA", content: "Tersedia berbagai jalur beasiswa untuk mendukung mahasiswa berprestasi dan yang membutuhkan bantuan pembiayaan.", image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=85", status: "published", order: 12 },
  { key: "galeri.hero", page: "Galeri", section: "Hero", type: "page", title: "Dokumentasi & Kegiatan Kampus", content: "Rekam jejak kegiatan akademik, non-akademik, dan momen berharga civitas STIBADA MASA.", image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=85", status: "published", order: 13 },
  { key: "pengumuman.hero", page: "Pengumuman", section: "Hero", type: "page", title: "Pengumuman yang rapi, mudah dicari, dan selalu terbaru.", content: "Temukan berita akademik, PMB, beasiswa, dan agenda penting STIBADA MASA dalam satu halaman yang terstruktur.", image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80", status: "published", order: 14 },
  { key: "informasi-pmb.hero", page: "Informasi PMB", section: "Hero", type: "page", title: "Informasi PMB", content: "Detail lengkap biaya, jadwal penerimaan per gelombang, kontak PMB, dan FAQ calon mahasiswa.", image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=85", status: "published", order: 15 },
  { key: "layout.footer", page: "Global", section: "Footer", type: "layout", title: "STIBADA MASA", content: "Platform akademik modern untuk layanan belajar-mengajar, administrasi, komunikasi, dan penerimaan mahasiswa baru STIBADA MASA Surabaya.", image: "", status: "published", order: 16 },
];

const defaultSiteSettings = {
  brandName: "STIBADA MASA",
  tagline: "Sekolah Tinggi Ilmu Bahasa Arab dan Dakwah Masjid Agung Sunan Ampel",
  contactEmail: "humas@stibada.ac.id",
  contactPhone: "081234502771 · Senin–Kamis 08.00–16.00",
  address: "Jl. Ampel Masjid No.53, Ampel, Kec. Semampir, Kota Surabaya, Jawa Timur 60151",
  admissionFee: "Terjangkau, terintegrasi sistem PMB online",
  admissionSchedule: "Gelombang 1: Januari–Maret · Gelombang 2: April–Juni · Gelombang 3: Juli–Agustus",
  footerNote: "Terakreditasi BAN-PT (Sertifikat 2022–2027) · Terintegrasi PMB & SIAKAD",
  layoutMode: "modern",
};

function toDoc(doc: Record<string, unknown>) {
  const { _id, ...rest } = doc;
  return { id: (_id as ObjectId).toHexString(), ...rest };
}

async function ensurePublicContent() {
  const db = getDB();
  const now = new Date().toISOString();
  await Promise.all(defaultContent.map((item) => db.collection("publicContent").updateOne(
    { key: item.key },
    { $set: { ...item, updatedAt: now } },
    { upsert: true },
  )));
  await db.collection("systemSettings").updateOne(
    { key: "publicSite" },
    { $set: { key: "publicSite", ...defaultSiteSettings, updatedAt: now } },
    { upsert: true },
  );
}

router.get("/public/landing", async (_req, res): Promise<void> => {
  await ensurePublicContent();
  const db = getDB();
  const [content, announcements, programs, scholarships, gallery, settings] = await Promise.all([
    db.collection("publicContent").find({ status: "published" }).toArray(),
    db.collection("announcements").find({ audience: { $in: ["publik", "semua"] }, status: { $ne: "draft" } }).sort({ createdAt: -1 }).limit(12).toArray(),
    db.collection("programs").find({}).toArray(),
    db.collection("scholarships").find({}).toArray(),
    db.collection("gallery").find({}).sort({ createdAt: -1 }).limit(8).toArray(),
    db.collection("systemSettings").findOne({ key: "publicSite" }),
  ]);

  res.json({
    content: content.map(toDoc),
    announcements: announcements.map(toDoc),
    programs: programs.map(toDoc),
    scholarships: scholarships.map(toDoc),
    gallery: gallery.map(toDoc),
    admission: {
      biaya: (settings?.["admissionFee"] as string) || defaultSiteSettings.admissionFee,
      kontak: (settings?.["contactEmail"] as string) || defaultSiteSettings.contactEmail,
      jadwal: (settings?.["admissionSchedule"] as string) || defaultSiteSettings.admissionSchedule,
    },
    settings: settings ? toDoc(settings) : { id: "publicSite", ...defaultSiteSettings },
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
  const [content, applications, auditLogs, announcements, programs, scholarships, gallery, settings] = await Promise.all([
    db.collection("publicContent").find({}).sort({ updatedAt: -1 }).toArray(),
    db.collection("applications").find({}).sort({ createdAt: -1 }).limit(25).toArray(),
    db.collection("auditLogs").find({}).sort({ createdAt: -1 }).limit(30).toArray(),
    db.collection("announcements").find({}).sort({ createdAt: -1 }).toArray(),
    db.collection("programs").find({}).toArray(),
    db.collection("scholarships").find({}).toArray(),
    db.collection("gallery").find({}).sort({ createdAt: -1 }).toArray(),
    db.collection("systemSettings").findOne({ key: "publicSite" }),
  ]);
  res.json({
    content: content.map(toDoc),
    applications: applications.map(toDoc),
    auditLogs: auditLogs.map(toDoc),
    announcements: announcements.map(toDoc),
    programs: programs.map(toDoc),
    scholarships: scholarships.map(toDoc),
    gallery: gallery.map(toDoc),
    settings: settings ? toDoc(settings) : { id: "publicSite", ...defaultSiteSettings },
  });
});

router.post("/content", requireRole(["admin"]), async (req, res): Promise<void> => {
  const db = getDB();
  const { key, type, title, content, status = "published", image = "", page = "Global", section = "Umum", order = 99 } = req.body;
  if (!key || !type || !title || !content) {
    res.status(400).json({ error: "key, type, title, dan content wajib diisi" });
    return;
  }
  const doc = { key, type, title, content, status, image, page, section, order: Number(order) || 99, updatedAt: new Date().toISOString() };
  const result = await db.collection("publicContent").findOneAndUpdate(
    { key },
    { $set: doc },
    { upsert: true, returnDocument: "after" },
  );
  await db.collection("auditLogs").insertOne({ actorRole: "admin", action: "content.create", target: key, createdAt: new Date().toISOString() });
  if (type === "announcement") broadcastRealtime("announcement.created", doc);
  res.status(201).json(toDoc(result as Record<string, unknown>));
});

router.put("/content/:id", requireRole(["admin"]), async (req, res): Promise<void> => {
  const db = getDB();
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "ID konten tidak valid" });
    return;
  }
  const update = { ...req.body, updatedAt: new Date().toISOString() };
  delete update.id;
  delete update._id;
  if (update.order !== undefined) update.order = Number(update.order) || 99;
  const result = await db.collection("publicContent").findOneAndUpdate({ _id: new ObjectId(id) }, { $set: update }, { returnDocument: "after" });
  if (!result) {
    res.status(404).json({ error: "Konten tidak ditemukan" });
    return;
  }
  await db.collection("auditLogs").insertOne({ actorRole: "admin", action: "content.update", target: id, createdAt: new Date().toISOString() });
  res.json(toDoc(result as Record<string, unknown>));
});

router.delete("/content/:id", requireRole(["admin"]), async (req, res): Promise<void> => {
  const db = getDB();
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "ID konten tidak valid" });
    return;
  }
  const result = await db.collection("publicContent").deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    res.status(404).json({ error: "Konten tidak ditemukan" });
    return;
  }
  await db.collection("auditLogs").insertOne({ actorRole: "admin", action: "content.delete", target: id, createdAt: new Date().toISOString() });
  res.status(204).send();
});

router.put("/settings/public-site", requireRole(["admin"]), async (req, res): Promise<void> => {
  const db = getDB();
  const update = { ...defaultSiteSettings, ...req.body, key: "publicSite", updatedAt: new Date().toISOString() };
  delete update.id;
  delete update._id;
  const result = await db.collection("systemSettings").findOneAndUpdate(
    { key: "publicSite" },
    { $set: update },
    { upsert: true, returnDocument: "after" },
  );
  await db.collection("auditLogs").insertOne({ actorRole: "admin", action: "settings.public-site.update", target: "publicSite", createdAt: new Date().toISOString() });
  res.json(toDoc(result as Record<string, unknown>));
});

router.post("/announcements", requireRole(["admin"]), async (req, res): Promise<void> => {
  const db = getDB();
  const { title, content, audience = "publik", category = "Akademik", status = "published", image = "" } = req.body;
  if (!title || !content) {
    res.status(400).json({ error: "Judul dan isi pengumuman wajib diisi" });
    return;
  }
  const doc = { title, content, audience, category, status, image, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  const result = await db.collection("announcements").insertOne(doc);
  await db.collection("auditLogs").insertOne({ actorRole: "admin", action: "announcement.create", target: title, createdAt: new Date().toISOString() });
  if (status !== "draft") broadcastRealtime("announcement.created", doc);
  res.status(201).json({ id: result.insertedId.toHexString(), ...doc });
});

router.put("/announcements/:id", requireRole(["admin"]), async (req, res): Promise<void> => {
  const db = getDB();
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "ID pengumuman tidak valid" });
    return;
  }
  const update = { ...req.body, updatedAt: new Date().toISOString() };
  delete update.id;
  delete update._id;
  const result = await db.collection("announcements").findOneAndUpdate({ _id: new ObjectId(id) }, { $set: update }, { returnDocument: "after" });
  if (!result) {
    res.status(404).json({ error: "Pengumuman tidak ditemukan" });
    return;
  }
  await db.collection("auditLogs").insertOne({ actorRole: "admin", action: "announcement.update", target: id, createdAt: new Date().toISOString() });
  res.json(toDoc(result as Record<string, unknown>));
});

router.delete("/announcements/:id", requireRole(["admin"]), async (req, res): Promise<void> => {
  const db = getDB();
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "ID pengumuman tidak valid" });
    return;
  }
  const result = await db.collection("announcements").deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    res.status(404).json({ error: "Pengumuman tidak ditemukan" });
    return;
  }
  await db.collection("auditLogs").insertOne({ actorRole: "admin", action: "announcement.delete", target: id, createdAt: new Date().toISOString() });
  res.status(204).send();
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