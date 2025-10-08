// src/domain/essay/services/ocr.service.ts
import { extractTextFromImage } from "../adapters/ocr.adapter";

export async function ocrFromServer(buf: ArrayBuffer, mime: string) {
  // Not used in MVP; included for future server OCR.
  return extractTextFromImage(buf, mime);
}
