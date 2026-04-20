import { Router, type IRouter } from "express";
import { getDB } from "../lib/mongodb";

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

  if (!user || user.password !== password) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
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

  res.json({ token: `mock-token-${user._id.toHexString()}`, user: responseUser });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  res.json({ id: "mock", nama: "Mock User", role: "mahasiswa", email: "mock@kampus.ac.id" });
});

export default router;
