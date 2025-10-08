import { z } from "zod";

export const MAX_CHARS = 5000;
export const MIN_CHARS = 50;

// allow common punctuation + newline/tab
const allowed = /^[\s\S]*$/; // relax for now; tighten later if needed

export const EssayInputSchema = z.object({
  essayText: z
    .string()
    .min(MIN_CHARS, `Essay must be at least ${MIN_CHARS} characters`)
    .max(MAX_CHARS, `Essay must be at most ${MAX_CHARS} characters`)
    .regex(allowed, "Essay contains unsupported characters"),
  options: z
    .object({
      save: z.boolean().optional(),
    })
    .optional(),
});

export type EssayInput = z.infer<typeof EssayInputSchema>;
