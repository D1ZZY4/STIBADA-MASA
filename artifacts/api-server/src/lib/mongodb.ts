import { MongoClient, Db, ObjectId } from "mongodb";
import { logger } from "./logger";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectDB(): Promise<Db> {
  if (db) return db;

  let mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || "";

  if (!mongoUri) {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    const mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri();
    logger.info("Using in-memory MongoDB (no MONGODB_URI provided)");
  }

  const dbName = process.env.MONGO_DB_NAME || "kampus";
  client = new MongoClient(mongoUri);
  await client.connect();
  db = client.db(dbName);
  logger.info({ dbName }, "Connected to MongoDB");
  return db;
}

export function getDB(): Db {
  if (!db) throw new Error("MongoDB not connected. Call connectDB() first.");
  return db;
}

export { ObjectId };

export async function closeDB(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
