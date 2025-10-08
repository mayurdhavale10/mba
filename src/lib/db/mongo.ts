import { MongoClient, Db, Collection, Document, ServerApiVersion } from "mongodb";
import { env } from "../env";

// Global singletons to survive hot-reload / serverless invocations
declare global {
  var __mongoClient: MongoClient | undefined;
  var __mongoDb: Db | undefined;
}

let clientPromise: Promise<MongoClient> | null = null;

async function createClient(): Promise<MongoClient> {
  const client = new MongoClient(env.MONGODB_URI, {
    maxPoolSize: 10,
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
  });
  await client.connect();
  return client;
}

/** Connected MongoClient (cached). */
export async function getClient(): Promise<MongoClient> {
  if (global.__mongoClient) return global.__mongoClient;
  if (!clientPromise) clientPromise = createClient();
  const client = await clientPromise;
  global.__mongoClient = client;
  return client;
}

/** Db instance (cached). Uses MONGODB_DB if provided, else the db from URI. */
export async function getDb(): Promise<Db> {
  if (global.__mongoDb) return global.__mongoDb;
  const client = await getClient();
  const dbName = env.MONGODB_DB ?? client.db().databaseName;
  if (!dbName) throw new Error("DB name missing. Set MONGODB_DB or include it in MONGODB_URI.");
  const db = client.db(dbName);
  global.__mongoDb = db;
  return db;
}

/** Typed collection helper. */
export async function getCollection<T extends Document = Document>(
  name: string
): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}

/** Optional graceful close for tests/dev scripts. */
export async function closeClient(): Promise<void> {
  if (global.__mongoClient) {
    await global.__mongoClient.close(true);
    global.__mongoClient = undefined;
    global.__mongoDb = undefined;
    clientPromise = null;
  }
}
