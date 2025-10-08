import { z } from "zod";

// shared pieces
const FeedbackItemSchema = z.object({
  issue: z.string().min(2),
  suggestion: z.string().min(2),
  example: z.string().optional(),
});

const BucketFeedbackSchema = z.object({
  score: z.number().int().min(1).max(5),
  highlights: z.array(FeedbackItemSchema).min(1),
});

export const FeedbackSchema = z.object({
  summary: z.array(z.string().min(2)).min(3).max(5),
  buckets: z.object({
    Clarity: BucketFeedbackSchema,
    Structure: BucketFeedbackSchema,
    Storytelling: BucketFeedbackSchema,
  }),
  readingLevel: z.string().optional(),
});

export type FeedbackDTO = z.infer<typeof FeedbackSchema>;
