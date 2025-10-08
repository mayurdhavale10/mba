// src/domain/essay/adapters/ocr.adapter.ts
import { isSupportedImageMime } from "@/lib/ocr";

/** Server OCR placeholder (we OCR in client for MVP). */
export async function extractTextFromImage(_buf: ArrayBuffer, mime: string): Promise<string> {
  if (!isSupportedImageMime(mime)) throw new Error("Unsupported image type");
  throw new Error("Server OCR not implemented; use client-side tesseract in Product UI.");
}
