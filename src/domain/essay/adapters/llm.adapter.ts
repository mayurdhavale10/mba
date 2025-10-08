// src/domain/essay/adapters/llm.adapter.ts
import { env } from "@/lib/env";
import { Feedback } from "../types";
import { FeedbackSchema } from "../validators/feedback.schema";

type Provider = "webllm" | "openai" | "ollama" | "fallback";

const PROVIDER = (env.LLM_PROVIDER as Provider) ?? "fallback";

function withTimeout<T>(p: Promise<T>, ms: number, label = "timeout"): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error(label)), ms);
    p.then((v) => { clearTimeout(id); resolve(v); }, (e) => { clearTimeout(id); reject(e); });
  });
}

async function retry<T>(fn: () => Promise<T>, attempts = 2, delayMs = 250): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i <= attempts; i++) {
    try { return await fn(); } 
    catch (e) { lastErr = e; if (i < attempts) await new Promise(r => setTimeout(r, delayMs * (i + 1))); }
  }
  throw lastErr;
}

/** Very small, deterministic analysis used when a model isn't available. */
function deterministicFallback(essay: string): Feedback {
  const wc = (essay.trim().match(/\b\w+\b/g) || []).length;
  const passive = /\b(is|was|were|be|been|being|are)\s+\w+ed\b/i.test(essay);
  const longish = /[,;:]/.test(essay) || /\b(however|moreover|furthermore|nevertheless)\b/i.test(essay);
  const story = /\b(learned|realized|decided|challenge|impact|result|led|built|launched|grew|revenue|team)\b/i.test(essay);

  const clamp = (n: number) => Math.max(1, Math.min(5, n));

  const fb: Feedback = {
    summary: [
      `Length ~${wc} words.`,
      passive ? "Voice drifts passive—prefer active." : "Mostly active voice.",
      "Tighten long sentences and add explicit transitions.",
      story ? "Good action/outcome signals—add concrete metrics." : "Add a specific challenge, decision, and measurable outcome.",
    ].slice(0, 4),
    buckets: {
      Clarity: {
        score: clamp(5 - (passive ? 1 : 0) - (longish ? 1 : 0)),
        highlights: [
          longish
            ? { issue: "Some sentences are long/complex.", suggestion: "Split to 15–20 words; cut filler.", example: "Turn multi-clause lines into two sentences." }
            : { issue: "Sentences are reasonably sized.", suggestion: "Scan for jargon; use plain words." },
          passive
            ? { issue: "Passive voice appears.", suggestion: "Use active subject–verb phrasing.", example: "'I led the team' vs 'The team was led by me'." }
            : { issue: "Voice is mostly active.", suggestion: "Keep verbs vivid and specific." },
        ],
      },
      Structure: {
        score: clamp(3 + (wc > 250 && wc < 900 ? 1 : 0)),
        highlights: [
          { issue: "Intro–body–conclusion can be sharper.", suggestion: "Hook + context → 2–3 body paras (problem→action→result) → reflection." },
          { issue: "Transitions may be implicit.", suggestion: "Use signposts: 'First', 'Next', 'Finally' and link paragraphs." },
        ],
      },
      Storytelling: {
        score: clamp(story ? 4 : 3),
        highlights: [
          story
            ? { issue: "Action/outcomes present but could be specific.", suggestion: "Add 1–2 metrics and a clear moment of change." }
            : { issue: "Feels descriptive over narrative.", suggestion: "Add challenge, your decision, and outcome (e.g., +18% revenue)." },
          { issue: "Reflection may be brief.", suggestion: "State what you learned and how it shapes your MBA goals." },
        ],
      },
    },
    readingLevel: (() => {
      const sentences = essay.split(/[.!?]+\s/).filter(Boolean);
      const avg = sentences.length ? wc / sentences.length : wc;
      if (avg < 12) return "Easy (Grade ~6–8)";
      if (avg < 18) return "Moderate (Grade ~9–10)";
      if (avg < 24) return "Challenging (Grade ~11–12)";
      return "Dense (College+)";
    })(),
  };
  // ensure strict shape
  return FeedbackSchema.parse(fb);
}

// ---- Provider stubs (swap in real impls later) ----
async function callWebLLM(_essay: string): Promise<Feedback> {
  // For server-side, we don't run WebLLM (usually client-only). Use fallback until you add a client route.
  return deterministicFallback(_essay);
}

async function callOpenAI(_essay: string): Promise<Feedback> {
  // Example placeholder. Later:
  //  - build a prompt
  //  - call OpenAI Chat Completions
  //  - parse JSON
  // const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY! });
  // const content = ...
  // const parsed = FeedbackSchema.parse(JSON.parse(extractedJson));
  return deterministicFallback(_essay);
}

async function callOllama(_essay: string): Promise<Feedback> {
  // Placeholder—HTTP POST to OLLAMA_BASE_URL /api/chat, then parse JSON.
  return deterministicFallback(_essay);
}

export async function generateFeedback(essay: string): Promise<Feedback> {
  const fn =
    PROVIDER === "openai" ? () => callOpenAI(essay)
    : PROVIDER === "ollama" ? () => callOllama(essay)
    : PROVIDER === "webllm" ? () => callWebLLM(essay)
    : () => Promise.resolve(deterministicFallback(essay));

  // retries + timeout guard
  const result = await withTimeout(retry(fn, 2, 250), 10_000, "llm-timeout");
  // final validation
  return FeedbackSchema.parse(result);
}
