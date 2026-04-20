import { Router, type IRouter } from "express";
import { getDB, ObjectId } from "../lib/mongodb";
import { requireRole } from "../middlewares/security";

const router: IRouter = Router();

function toDoc(doc: Record<string, unknown>) {
  const { _id, ...rest } = doc;
  return { id: (_id as ObjectId).toHexString(), ...rest };
}

router.get("/gallery", async (_req, res): Promise<void> => {
  const db = getDB();
  const items = await db.collection("gallery").find({}).sort({ createdAt: -1 }).toArray();
  res.json(items.map(toDoc));
});

router.post("/gallery", requireRole(["admin"]), async (req, res): Promise<void> => {
  const db = getDB();
  const { title, description, category, image } = req.body;
  if (!title) {
    res.status(400).json({ error: "Judul galeri wajib diisi" });
    return;
  }
  const doc = {
    title,
    description: description || "",
    category: category || "umum",
    image: image || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const result = await db.collection("gallery").insertOne(doc);
  res.status(201).json({ id: result.insertedId.toHexString(), ...doc });
});

router.put("/gallery/:id", requireRole(["admin"]), async (req, res): Promise<void> => {
  const db = getDB();
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "ID galeri tidak valid" });
    return;
  }
  const update = { ...req.body, updatedAt: new Date().toISOString() };
  delete update.id;
  delete update._id;
  const result = await db.collection("gallery").findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: update },
    { returnDocument: "after" },
  );
  if (!result) {
    res.status(404).json({ error: "Item galeri tidak ditemukan" });
    return;
  }
  res.json(toDoc(result as Record<string, unknown>));
});

router.delete("/gallery/:id", requireRole(["admin"]), async (req, res): Promise<void> => {
  const db = getDB();
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "ID galeri tidak valid" });
    return;
  }
  const result = await db.collection("gallery").deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    res.status(404).json({ error: "Item galeri tidak ditemukan" });
    return;
  }
  res.status(204).send();
});

export default router;
