// src/lib/pdf.ts
import type { Bucket, Feedback } from "@/domain/essay/types";

export function feedbackToText(feedback: Feedback, essay: string) {
  let txt = "MBA Essay Feedback\n\n";
  if (feedback.readingLevel) txt += `Reading Level: ${feedback.readingLevel}\n\n`;

  txt +=
    "Summary:\n" +
    feedback.summary.map((s: string) => `- ${s}`).join("\n") +
    "\n\n";

  (Object.keys(feedback.buckets) as Bucket[]).forEach((b: Bucket) => {
    const bucket = feedback.buckets[b];
    txt += `${b} (Score: ${bucket.score}/5)\n`;
    bucket.highlights.forEach((h, i) => {
      txt += ` ${i + 1}. Issue: ${h.issue}\n    Suggestion: ${h.suggestion}\n`;
      if (h.example) txt += `    Example: ${h.example}\n`;
    });
    txt += "\n";
  });

  txt += "---\nOriginal Essay\n---\n" + essay + "\n";
  return txt;
}
