// src/components/marketing/Product.tsx
"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { Feedback, Bucket } from "@/domain/essay/types";
import { feedbackToText } from "@/lib/pdf";

// pdfjs types
import type {
  PDFDocumentProxy,
  PDFPageProxy,
  TextContent,
  TextItem,
} from "pdfjs-dist/types/src/display/api";

const SUPPORTED_IMAGE = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_OCR_PAGES = 10;

function isTextItem(it: TextContent["items"][number]): it is TextItem {
  return typeof (it as Partial<TextItem>).str === "string";
}

function createCanvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

export default function Product() {
  const [essay, setEssay] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileBusy, setFileBusy] = useState<null | "pdf" | "img">(null);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  const imgInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  const wordCount = useMemo(
    () => (essay.trim().match(/\b\w+\b/g) || []).length,
    [essay]
  );

  // ---------- PDF utils ----------
  async function loadPdf(file: File): Promise<{ pdf: PDFDocumentProxy }> {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
    const data = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data });
    const pdf = (await loadingTask.promise) as PDFDocumentProxy;
    return { pdf };
  }

  async function extractSelectableText(pdf: PDFDocumentProxy) {
    let out = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page: PDFPageProxy = await pdf.getPage(i);
      const content: TextContent = await page.getTextContent();
      const parts = content.items.filter(isTextItem).map((it) => it.str).filter(Boolean);
      out += parts.join(" ") + "\n";
    }
    return out.trim();
  }

  async function ocrPdfPages(pdf: PDFDocumentProxy) {
    const tesseract = await import("tesseract.js").catch(() => null);
    if (!tesseract) throw new Error("OCR engine missing. Install with: npm i tesseract.js");
    const { createWorker } = tesseract;
    const worker = await createWorker("eng");

    let out = "";
    const total = Math.min(pdf.numPages, MAX_OCR_PAGES);
    const scale = 2;

    for (let i = 1; i <= total; i++) {
      setHint(`Scanning page ${i}/${total}…`);
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });
      const canvas = createCanvas(viewport.width, viewport.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;

      const renderTask = page.render({
        canvasContext: ctx as unknown as CanvasRenderingContext2D,
        viewport,
      });
      await renderTask.promise;

      const { data } = await worker.recognize(canvas);
      const text = (data?.text || "").trim();
      if (text) out += text + "\n\n";
    }

    await worker.terminate();
    return out.trim();
  }

  async function extractTextFromPdf(file: File) {
    const { pdf } = await loadPdf(file);
    const selectable = await extractSelectableText(pdf);
    if (selectable) return selectable;
    setHint("No selectable text found. Falling back to OCR…");
    const ocrText = await ocrPdfPages(pdf);
    setHint(null);
    return ocrText;
  }

  // ---------- Image OCR ----------
  async function extractTextFromImage(file: File) {
    const tesseract = await import("tesseract.js").catch(() => null);
    if (!tesseract) throw new Error("OCR engine missing. Run `npm i tesseract.js`.");
    const { createWorker } = tesseract;
    const worker = await createWorker("eng");
    const { data } = await worker.recognize(file);
    await worker.terminate();
    const text = (data?.text || "").trim();
    if (!text) throw new Error("No text detected. Try a clearer image.");
    return text;
  }

  // ---------- Handlers ----------
  const onPickPdf = () => pdfInputRef.current?.click();
  const onPickImage = () => imgInputRef.current?.click();

  const onPdfFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      if (pdfInputRef.current) pdfInputRef.current.value = "";
      return;
    }
    setError(null);
    setHint(null);
    setFileBusy("pdf");
    try {
      const text = await extractTextFromPdf(file);
      if (!text) setError("Could not extract any text from the PDF. Try the image OCR option.");
      else setEssay((prev) => (prev ? prev + "\n\n" + text : text));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to read PDF. Try another file.");
    } finally {
      setFileBusy(null);
      setHint(null);
      if (pdfInputRef.current) pdfInputRef.current.value = "";
    }
  };

  const onImgFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!SUPPORTED_IMAGE.includes(file.type)) {
      setError("Unsupported image type. Use PNG/JPG/WEBP.");
      if (imgInputRef.current) imgInputRef.current.value = "";
      return;
    }
    setError(null);
    setHint(null);
    setFileBusy("img");
    try {
      const text = await extractTextFromImage(file);
      setEssay((prev) => (prev ? prev + "\n\n" + text : text));
    } catch (err) {
      console.error(err);
      setError("Scanning image failed. Try a clearer image.");
    } finally {
      setFileBusy(null);
      if (imgInputRef.current) imgInputRef.current.value = "";
    }
  };

  const analyze = useCallback(async () => {
    setLoading(true);
    setError(null);
    setHint(null);
    setFeedback(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essayText: essay, options: { save: false } }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Analysis failed");
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
    <section id="product" className="scroll-mt-24 bg-[#FAFAFA]">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-12 md:py-20">
        {/* Header */}
        <header className="flex flex-col gap-2 mb-6">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1a1a1a]">
            Essay Review
          </h2>
          <p className="text-[#555555] text-lg">
            Paste text or upload a PDF/image—then get structured, MBA-focused feedback.
          </p>
        </header>

        {/* 12-col layout: Left 5 / Right 7 to reduce empty space */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left: input (sticky for long feedback) */}
          <div className="xl:col-span-5">
            <div className="flex flex-col gap-4 xl:sticky xl:top-24">
              <label htmlFor="essay" className="text-sm font-medium text-[#333333]/80">
                Your essay draft
              </label>

              <textarea
                id="essay"
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                placeholder="Paste your essay here…"
                rows={14}
                className="w-full rounded-xl border border-[#E9E4E2] bg-white p-4 text-[#333333] outline-none
                           focus:ring-2 focus:ring-[#FFD2BF] shadow-sm"
              />

              <div className="flex items-center justify-between text-sm text-[#555555]">
                <span>{wordCount} words</span>

                <div className="flex gap-2 items-center">
                  {/* hidden inputs */}
                  <input
                    ref={pdfInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={onPdfFile}
                  />
                  <input
                    ref={imgInputRef}
                    type="file"
                    accept={SUPPORTED_IMAGE.join(",")}
                    className="hidden"
                    onChange={onImgFile}
                  />

                  <button
                    type="button"
                    onClick={onPickPdf}
                    disabled={fileBusy !== null}
                    className="px-3 py-1.5 rounded-full border border-[#CC6F5E] text-[#333333]
                               hover:bg-[#F8DCD4] focus:outline-none focus:ring-2 focus:ring-[#FFD2BF]
                               disabled:opacity-60 transition-colors"
                  >
                    {fileBusy === "pdf" ? (hint || "Reading PDF…") : "Upload PDF"}
                  </button>

                  <button
                    type="button"
                    onClick={onPickImage}
                    disabled={fileBusy !== null}
                    className="px-3 py-1.5 rounded-full border border-[#CC6F5E] text-[#333333]
                               hover:bg-[#F8DCD4] focus:outline-none focus:ring-2 focus:ring-[#FFD2BF]
                               disabled:opacity-60 transition-colors"
                  >
                    {fileBusy === "img" ? "Scanning image…" : "Upload image (scan text)"}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={analyze}
                  disabled={loading || essay.trim().length < 50}
                  className="px-5 py-3 rounded-full bg-[#FF6F4D] text-white font-medium
                             hover:bg-[#CC6F5E] focus:outline-none focus:ring-2 focus:ring-[#FFD2BF]
                             disabled:opacity-50 transition-colors shadow-sm"
                >
                  {loading ? "Analyzing…" : "Analyze"}
                </button>
              </div>

              {error && <p className="text-sm text-[#B91C1C]">{error}</p>}
              {hint && !error && <p className="text-sm text-[#333333]/70">{hint}</p>}
            </div>
          </div>

          {/* Right: feedback — 2-column grid to reduce vertical space */}
          <div className="xl:col-span-7">
            {!feedback ? (
              <div className="rounded-xl border border-[#E9E4E2] bg-white p-6 text-[#555555] shadow-sm">
                The feedback will appear here after analysis.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Summary spans full width */}
                <div className="md:col-span-2 rounded-xl border border-[#E9E4E2] bg-white shadow-sm overflow-hidden">
                  <div className="bg-[#F8DCD4] px-4 py-2 font-semibold text-[#333333]">
                    Summary
                  </div>
                  <div className="p-6 text-[#333333]">
                    <ul className="list-disc pl-5 space-y-1">
                      {feedback.summary.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                    {feedback.readingLevel && (
                      <p className="text-sm text-[#555555] mt-3">
                        Reading level: {feedback.readingLevel}
                      </p>
                    )}
                  </div>
                </div>

                {/* Buckets flow in two columns */}
                {(["Clarity", "Structure", "Storytelling"] as Bucket[]).map((b) => {
                  const bucket = feedback.buckets[b];
                  return (
                    <div
                      key={b}
                      className="rounded-xl border border-[#E9E4E2] bg-white shadow-sm overflow-hidden"
                    >
                      <div className="flex items-center justify-between bg-[#F8DCD4] px-4 py-2">
                        <h3 className="text-base md:text-lg font-semibold text-[#333333]">
                          {b}
                        </h3>
                        <div className="text-xs md:text-sm px-2 py-0.5 rounded-full bg-white text-[#333333] border border-[#E9E4E2]">
                          Score: {bucket.score}/5
                        </div>
                      </div>

                      <div className="p-6 grid gap-3">
                        {bucket.highlights.map((h, i) => (
                          <div
                            key={i}
                            className="rounded-lg border border-[#E9E4E2] bg-white p-3"
                          >
                            <p className="text-sm text-[#333333]">
                              <span className="font-medium">Issue:</span> {h.issue}
                            </p>
                            <p className="text-sm mt-1 text-[#333333]">
                              <span className="font-medium">Suggestion:</span> {h.suggestion}
                            </p>
                            {h.example && (
                              <p className="text-sm mt-1 text-[#333333]/80">
                                <span className="font-medium">Example:</span> {h.example}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Actions */}
                <div className="md:col-span-2 pt-2">
                  <button
                    type="button"
                    onClick={exportTxt}
                    className="px-4 py-2 rounded-full border border-[#CC6F5E] text-[#333333]
                               hover:bg-[#F8DCD4] focus:outline-none focus:ring-2 focus:ring-[#FFD2BF]
                               text-sm transition-colors"
                  >
                    Export .txt
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
