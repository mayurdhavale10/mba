// src/domain/essay/models/feedbackSession.repo.ts
import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/db/mongo";
import type { Feedback } from "../types";

export type FeedbackSessionDoc = {
  _id?: ObjectId;
  essayHash: string;
  essayText?: string;
  feedback: Feedback;
  provider: "webllm" | "openai" | "ollama" | "fallback";
  wordCount: number;
  readingLevel?: string;
  userId?: string | null;
  createdAt: Date;
};

const COLL = "feedback_sessions";

/** Create a new saved session; returns the inserted id as string. */
export async function insertSession(doc: FeedbackSessionDoc): Promise<string> {
  const col = await getCollection<FeedbackSessionDoc>(COLL);
  const res = await col.insertOne(doc);
  return res.insertedId.toString();
}

/** Find one by essay hash (used for dedupe/fast return). */
export async function findByHash(essayHash: string) {
  const col = await getCollection<FeedbackSessionDoc>(COLL);
  return col.findOne({ essayHash });
}

/** List recent sessions for a user (without full essay text). */
export async function listRecentByUser(userId: string, limit = 10) {
  const col = await getCollection<FeedbackSessionDoc>(COLL);
  return col
    .find({ userId })
    .project({ essayText: 0 })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

/** (Optional) Ensure useful indexes; call once at startup if desired. */
export async function ensureIndexes() {
  const col = await getCollection<FeedbackSessionDoc>(COLL);
  await col.createIndexes([
    { key: { essayHash: 1 }, name: "by_essayHash" },
    { key: { userId: 1, createdAt: -1 }, name: "by_user_recent" },
    { key: { createdAt: -1 }, name: "by_createdAt_desc" },
  ]);
}
