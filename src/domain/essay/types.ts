// Domain types
export type Bucket = "Clarity" | "Structure" | "Storytelling";

export type FeedbackItem = {
  issue: string;
  suggestion: string;
  example?: string;
};

export type BucketFeedback = {
  score: number;            // 1..5
  highlights: FeedbackItem[];
};

export type Feedback = {
  summary: string[];        // 3–5 bullets
  buckets: Record<Bucket, BucketFeedback>;
  readingLevel?: string;
};
