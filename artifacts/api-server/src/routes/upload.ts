import { Router, type IRouter } from "express";
import multer from "multer";
import { getDB, ObjectId } from "../lib/mongodb";
import { requireRole } from "../middlewares/security";

const router: IRouter = Router();

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter(_req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Hanya file gambar yang diperbolehkan (JPEG, PNG, WebP, dll)"));
      return;
    }
    cb(null, true);
  },
});

router.post(
  "/upload/image",
  requireRole(["admin", "rektor", "dosen"]),
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        res.status(413).json({ error: "Ukuran file melebihi batas maksimal 5 MB" });
        return;
      }
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      next();
    });
  },
  async (req, res): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ error: "File gambar wajib disertakan" });
      return;
    }
    const db = getDB();
    const doc = {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      data: req.file.buffer.toString("base64"),
      uploadedBy: (req as unknown as { user?: { role?: string } }).user?.role || "admin",
      createdAt: new Date().toISOString(),
    };
    const result = await db.collection("images").insertOne(doc);
    const id = result.insertedId.toHexString();
    res.status(201).json({
      id,
      url: `/api/images/${id}`,
      filename: doc.filename,
      mimetype: doc.mimetype,
      size: doc.size,
    });
  },
);

router.get("/images/:id", async (req, res): Promise<void> => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "ID gambar tidak valid" });
    return;
  }
  const db = getDB();
  const doc = await db.collection("images").findOne({ _id: new ObjectId(id) });
  if (!doc) {
    res.status(404).json({ error: "Gambar tidak ditemukan" });
    return;
  }
  const buf = Buffer.from(doc["data"] as string, "base64");
  res
    .set("Content-Type", doc["mimetype"] as string)
    .set("Cache-Control", "public, max-age=31536000, immutable")
    .send(buf);
});

router.get("/upload/images", requireRole(["admin", "rektor"]), async (_req, res): Promise<void> => {
  const db = getDB();
  const images = await db
    .collection("images")
    .find({}, { projection: { data: 0 } })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();
  res.json(
    images.map((img) => ({
      id: (img._id as ObjectId).toHexString(),
      url: `/api/images/${(img._id as ObjectId).toHexString()}`,
      filename: img["filename"],
      mimetype: img["mimetype"],
      size: img["size"],
      createdAt: img["createdAt"],
    })),
  );
});

router.delete("/upload/images/:id", requireRole(["admin"]), async (req, res): Promise<void> => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "ID gambar tidak valid" });
    return;
  }
  const db = getDB();
  const result = await db.collection("images").deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    res.status(404).json({ error: "Gambar tidak ditemukan" });
    return;
  }
  res.status(204).send();
});

export default router;
