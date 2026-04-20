import { Router, type IRouter } from "express";
import { getDB, ObjectId } from "../lib/mongodb";
import { broadcastRealtime } from "../lib/realtime";

const router: IRouter = Router();

function toDoc(doc: Record<string, unknown>) {
  const { _id, ...rest } = doc;
  return { id: (_id as ObjectId).toHexString(), ...rest };
}

router.get("/diskusi/rooms", async (req, res): Promise<void> => {
  const db = getDB();
  const { userId } = req.query as Record<string, string>;
  const filter: Record<string, unknown> = {};
  if (userId) filter["participants"] = userId;
  const [data, total] = await Promise.all([
    db.collection("diskusiRooms").find(filter).sort({ lastMessageAt: -1 }).toArray(),
    db.collection("diskusiRooms").countDocuments(filter),
  ]);
  res.json({ data: data.map(toDoc), total });
});

router.post("/diskusi/rooms", async (req, res): Promise<void> => {
  const db = getDB();
  const { nama, type, participants = [] } = req.body;
  if (!nama || !type) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const doc = { nama, type, participants, lastMessage: "", lastMessageAt: new Date().toISOString(), unreadCount: 0, createdAt: new Date().toISOString() };
  const result = await db.collection("diskusiRooms").insertOne(doc);
  res.status(201).json({ id: result.insertedId.toHexString(), ...doc });
});

router.get("/diskusi", async (req, res): Promise<void> => {
  const db = getDB();
  const { roomId, userId, type } = req.query as Record<string, string>;
  const filter: Record<string, unknown> = {};
  if (roomId) filter["roomId"] = roomId;
  if (userId) filter["senderId"] = userId;

  const [data, total] = await Promise.all([
    db.collection("diskusi").find(filter).sort({ createdAt: 1 }).toArray(),
    db.collection("diskusi").countDocuments(filter),
  ]);
  res.json({ data: data.map(toDoc), total });
});

router.post("/diskusi", async (req, res): Promise<void> => {
  const db = getDB();
  const { roomId, senderId, pesan } = req.body;
  if (!roomId || !senderId || !pesan) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  let senderNama = "";
  let senderRole = "mahasiswa";
  let senderAvatar = "";
  const collections = ["mahasiswa", "dosen", "admin", "rektor"];
  for (const col of collections) {
    try {
      const user = await db.collection(col).findOne({ _id: new ObjectId(senderId) });
      if (user) {
        senderNama = user["nama"] as string;
        senderRole = col === "matakuLiah" ? "admin" : col;
        senderAvatar = (user["avatar"] as string) || "";
        break;
      }
    } catch {}
  }
  const now = new Date().toISOString();
  const doc = { roomId, senderId, senderNama, senderRole, senderAvatar, pesan, createdAt: now };
  const result = await db.collection("diskusi").insertOne(doc);
  await db.collection("diskusiRooms").updateOne({ _id: new ObjectId(roomId) }, { $set: { lastMessage: pesan, lastMessageAt: now } });
  broadcastRealtime("diskusi.message", { roomId, pesan, senderNama, senderRole });
  res.status(201).json({ id: result.insertedId.toHexString(), ...doc });
});

export default router;
