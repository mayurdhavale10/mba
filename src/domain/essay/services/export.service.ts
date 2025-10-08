// src/domain/essay/services/export.service.ts
import type { Feedback } from "../types";
import { feedbackToText } from "@/lib/pdf";

export function toTxt(feedback: Feedback, essay: string) {
  return feedbackToText(feedback, essay);
}
// For PDF, UI will use jsPDF client-side with the same strings.
