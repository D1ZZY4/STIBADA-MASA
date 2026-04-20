import { Router, type IRouter } from "express";
import { getDB } from "../lib/mongodb";
import { hashPassword, signToken, verifyPassword } from "../lib/auth";

const router: IRouter = Router();

router.post("/auth/login", async (req, res): Promise<void> => {
  const { nim, password, role } = req.body;
  if (!nim || !password || !role) {
    res.status(400).json({ error: "nim, password, and role are required" });
    return;
  }

  const db = getDB();
  let user = null;
  let collectionName = "";

  if (role === "mahasiswa") collectionName = "mahasiswa";
  else if (role === "dosen") collectionName = "dosen";
  else if (role === "admin") collectionName = "admin";
  else if (role === "rektor") collectionName = "rektor";
  else {
    res.status(400).json({ error: "Invalid role" });
    return;
  }

  user = await db.collection(collectionName).findOne({ $or: [{ nim }, { email: nim }, { nidn: nim }] });

  if (!user || !verifyPassword(password, user.password)) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  if (typeof user.password === "string" && !user.password.startsWith("scrypt:")) {
    await db.collection(collectionName).updateOne({ _id: user._id }, { $set: { password: hashPassword(password), lastPasswordUpgradeAt: new Date().toISOString() } });
  }

  const { password: _pw, ...userData } = user;
  const responseUser = {
    id: user._id.toHexString(),
    nama: user.nama,
    role,
    email: user.email,
    avatar: user.avatar || null,
    nim: user.nim || null,
    nidn: user.nidn || null,
    prodi: user.prodi || null,
  };

  const token = signToken({ id: user._id.toHexString(), role, nama: user.nama, email: user.email });
  await db.collection("auditLogs").insertOne({ actorId: user._id.toHexString(), actorRole: role, action: "auth.login", target: collectionName, createdAt: new Date().toISOString() });
  res.json({ token, user: responseUser });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  res.status(401).json({ error: "Gunakan token login untuk mengakses profil" });
});

export default router;
