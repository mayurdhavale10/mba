import crypto from "crypto";
import { getCollection } from "@/lib/db/mongo";
import { env } from "@/lib/env";
import type { Feedback } from "../types";
import { FeedbackSchema } from "../validators/feedback.schema";
import { generateFeedback } from "../adapters/llm.adapter";

type GenerateOptions = { save?: boolean; userId?: string | null };

export type FeedbackSessionDoc = {
  _id?: string;
  essayHash: string;
  essayText?: string;
  feedback: Feedback;
  provider: "webllm" | "openai" | "ollama" | "fallback";
  wordCount: number;
  readingLevel?: string;
  userId?: string | null;
  createdAt: Date;
};

function hashEssay(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export async function generate(essayText: string, opts: GenerateOptions = {}) {
  const essayHash = hashEssay(essayText);
  const wordCount = (essayText.trim().match(/\b\w+\b/g) || []).length;

  const col = await getCollection<FeedbackSessionDoc>("feedback_sessions");
  const existing = await col.findOne({ essayHash }, { projection: { feedback: 1, readingLevel: 1 } });

  let feedback: Feedback;
  if (existing) {
    feedback = FeedbackSchema.parse(existing.feedback);
  } else {
    feedback = await generateFeedback(essayText);
  }

  (["Clarity", "Structure", "Storytelling"] as const).forEach((k) => {
    feedback.buckets[k].score = Math.max(1, Math.min(5, feedback.buckets[k].score));
  });

  let sessionId: string | undefined;
  if (opts.save) {
    const provider: FeedbackSessionDoc["provider"] =
      (env.LLM_PROVIDER as FeedbackSessionDoc["provider"]) ?? "fallback";

    const doc: FeedbackSessionDoc = {
      essayHash,
      essayText,
      feedback,
      provider,
      wordCount,
      readingLevel: feedback.readingLevel,
      userId: opts.userId ?? null,
      createdAt: new Date(),
    };

    const res = await col.insertOne(doc);
    sessionId = String(res.insertedId);
  }

  return { feedback, sessionId };
}
