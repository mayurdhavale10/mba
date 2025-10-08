// src/components/marketing/Product.tsx
"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { Feedback, Bucket } from "@/domain/essay/types";
import { feedbackToText } from "@/lib/pdf";

const SUPPORTED_IMAGE = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export default function Product() {
  const [essay, setEssay] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const wordCount = useMemo(
    () => (essay.trim().match(/\b\w+\b/g) || []).length,
    [essay]
  );

  const onPickImage = () => fileInputRef.current?.click();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!SUPPORTED_IMAGE.includes(file.type)) {
      setError("Unsupported image type. Use PNG/JPG/WEBP.");
      return;
    }
    setError(null);
    setOcrLoading(true);
    try {
      // Dynamic import so the app builds even if tesseract.js isn’t installed.
      const t = await import("tesseract.js").catch(() => null);
      if (!t) {
        setError("OCR engine not present. Run `npm i tesseract.js` to enable image OCR.");
        return;
      }
      const { createWorker } = t;
      const worker = await createWorker("eng");
      const { data } = await worker.recognize(file);
      await worker.terminate();
      const text = (data?.text || "").trim();
      if (text.length === 0) {
        setError("No text detected in the image. Try a clearer image.");
        return;
      }
      setEssay((prev) => (prev ? prev + "\n\n" + text : text));
    } catch (err) {
      console.error(err);
      setError("OCR failed. Try another image or paste text.");
    } finally {
      setOcrLoading(false);
      // reset input so the same file can be reselected if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const analyze = useCallback(async () => {
    setLoading(true);
    setError(null);
    setFeedback(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essayText: essay, options: { save: false } }),
      });
      const json = await res.json();
      if (!res.ok) {
        const msg = json?.error?.message || "Analysis failed";
        throw new Error(msg);
      }
      setFeedback(json.feedback as Feedback);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [essay]);

  const exportTxt = () => {
    if (!feedback) return;
    const blob = new Blob([feedbackToText(feedback, essay)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mba-essay-feedback.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="product" className="scroll-mt-24">
      <div className="mx-auto max-w-[1100px] px-6 md:px-8 py-12 md:py-20">
        <div className="flex flex-col gap-8">
          <header>
            <h2 className="text-3xl md:text-4xl font-semibold">Essay Review</h2>
            <p className="text-black/70 mt-2">Paste text or OCR from an image, then get structured feedback.</p>
          </header>

          {/* Input area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <label htmlFor="essay" className="text-sm font-medium text-black/70">
                Your essay draft
              </label>
              <textarea
                id="essay"
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                placeholder="Paste your essay here..."
                rows={14}
                className="w-full rounded-xl border border-black/10 p-4 outline-none focus:ring-2 focus:ring-[var(--salmon,#ff6f4d)]"
              />
              <div className="flex items-center justify-between text-sm text-black/60">
                <span>{wordCount} words</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onPickImage}
                    className="px-3 py-1.5 rounded-full border border-black/15 hover:bg-black/5"
                    disabled={ocrLoading}
                  >
                    {ocrLoading ? "OCR..." : "Upload image (OCR)"}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={SUPPORTED_IMAGE.join(",")}
                    className="hidden"
                    onChange={onFile}
                  />
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={analyze}
                  disabled={loading || essay.trim().length < 50}
                  className="px-5 py-3 rounded-full bg-[var(--salmon,#ff6f4d)] text-white font-medium disabled:opacity-50"
                >
                  {loading ? "Analyzing..." : "Analyze"}
                </button>
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>

            {/* Feedback panel */}
            <div className="flex flex-col gap-4">
              {!feedback && (
                <div className="rounded-xl border border-black/10 p-6 text-black/60">
                  The feedback will appear here after analysis.
                </div>
              )}

              {feedback && (
                <>
                  <div className="rounded-xl border border-black/10 p-6">
                    <h3 className="text-lg font-semibold mb-2">Summary</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {feedback.summary.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                    {feedback.readingLevel && (
                      <p className="text-sm text-black/60 mt-2">Reading level: {feedback.readingLevel}</p>
                    )}
                  </div>

                  {(["Clarity", "Structure", "Storytelling"] as Bucket[]).map((b) => {
                    const bucket = feedback.buckets[b];
                    return (
                      <div key={b} className="rounded-xl border border-black/10 p-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{b}</h3>
                          <div className="text-sm px-2 py-0.5 rounded-full bg-black/5">
                            Score: {bucket.score}/5
                          </div>
                        </div>
                        <div className="mt-3 grid gap-3">
                          {bucket.highlights.map((h, i) => (
                            <div key={i} className="rounded-lg border border-black/10 p-3">
                              <p className="text-sm"><span className="font-medium">Issue:</span> {h.issue}</p>
                              <p className="text-sm mt-1"><span className="font-medium">Suggestion:</span> {h.suggestion}</p>
                              {h.example && (
                                <p className="text-sm mt-1 text-black/70"><span className="font-medium">Example:</span> {h.example}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={exportTxt}
                      className="px-4 py-2 rounded-full border border-black/15 hover:bg-black/5 text-sm"
                    >
                      Export .txt
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
