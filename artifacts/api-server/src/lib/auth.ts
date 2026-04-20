import crypto from "node:crypto";

const secret = process.env.AUTH_SECRET || "stibada-masa-dev-secret";

export function hashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  if (!stored.startsWith("scrypt:")) return password === stored;
  const [, salt, hash] = stored.split(":");
  const candidate = hashPassword(password, salt).split(":")[2];
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(candidate));
}

export function signToken(payload: { id: string; role: string; nama: string; email?: string }) {
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 1000 * 60 * 60 * 8 })).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyToken(token: string) {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as { exp: number; id: string; role: string; nama: string; email?: string };
  if (payload.exp < Date.now()) return null;
  return payload;
}