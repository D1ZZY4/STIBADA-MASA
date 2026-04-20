import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/auth";

const buckets = new Map<string, { count: number; resetAt: number }>();

export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Content-Security-Policy", "default-src 'self'; connect-src 'self' ws: wss:; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'");
  next();
}

export function rateLimit(req: Request, res: Response, next: NextFunction) {
  const key = req.ip || req.socket.remoteAddress || "local";
  const now = Date.now();
  const windowMs = 60_000;
  const max = req.path.includes("/auth/login") ? 20 : 240;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    next();
    return;
  }

  bucket.count += 1;
  if (bucket.count > max) {
    res.status(429).json({ error: "Terlalu banyak permintaan. Coba lagi sebentar lagi." });
    return;
  }

  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : "";
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    res.status(401).json({ error: "Autentikasi diperlukan" });
    return;
  }

  res.locals.user = payload;
  next();
}

export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    requireAuth(req, res, () => {
      if (!roles.includes(res.locals.user.role)) {
        res.status(403).json({ error: "Akses tidak diizinkan" });
        return;
      }
      next();
    });
  };
}