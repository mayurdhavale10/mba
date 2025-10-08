export function isSupportedImageMime(mime: string) {
  return ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(mime);
}

// Server OCR not used in MVP; we OCR in the browser via tesseract.js.
export async function ocrBuffer(buf: ArrayBuffer, mime: string): Promise<string> {
  void buf; // intentionally unused for now
  void mime; // intentionally unused for now
  throw new Error("Server OCR not implemented; use client-side tesseract in Product UI.");
}
