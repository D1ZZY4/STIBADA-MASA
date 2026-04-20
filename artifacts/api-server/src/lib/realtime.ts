import type { IncomingMessage, ServerResponse } from "node:http";
import crypto from "node:crypto";
import { logger } from "./logger";

const sockets = new Set<import("node:net").Socket>();

function frame(data: string) {
  const payload = Buffer.from(data);
  const header = payload.length < 126 ? Buffer.from([0x81, payload.length]) : Buffer.from([0x81, 126, payload.length >> 8, payload.length & 255]);
  return Buffer.concat([header, payload]);
}

export function handleUpgrade(req: IncomingMessage, socket: import("node:net").Socket) {
  if (req.url !== "/api/ws") {
    socket.destroy();
    return;
  }

  const key = req.headers["sec-websocket-key"];
  if (!key || Array.isArray(key)) {
    socket.destroy();
    return;
  }

  const accept = crypto.createHash("sha1").update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`).digest("base64");
  socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${accept}\r\n\r\n`);
  sockets.add(socket);
  socket.on("close", () => sockets.delete(socket));
  socket.on("error", () => sockets.delete(socket));
}

export function broadcastRealtime(type: string, payload: unknown) {
  const data = frame(JSON.stringify({ type, payload, sentAt: new Date().toISOString() }));
  for (const socket of sockets) {
    try {
      socket.write(data);
    } catch (err) {
      logger.warn({ err }, "Failed to push websocket message");
      sockets.delete(socket);
    }
  }
}