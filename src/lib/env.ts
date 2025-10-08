// src/lib/env.ts
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.string().url().default("http://localhost:3000"),

  // Auth.js
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(16),
  GITHUB_ID: z.string().min(1),
  GITHUB_SECRET: z.string().min(1),
  AUTH_TRUST_HOST: z.string().optional(), // "true" on Vercel

  // LLM
  LLM_PROVIDER: z.enum(["webllm", "openai", "ollama"]).default("webllm"),
  OPENAI_API_KEY: z.string().optional(),
  OLLAMA_BASE_URL: z.string().url().optional(),

  // Mongo
  MONGODB_URI: z.string().url(),
  MONGODB_DB: z.string().optional(),

  // Rate limit
  RATE_LIMIT_REQUESTS: z.coerce.number().int().positive().default(10),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
});

export const env = EnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  APP_URL: process.env.APP_URL,

  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  GITHUB_ID: process.env.GITHUB_ID,
  GITHUB_SECRET: process.env.GITHUB_SECRET,
  AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,

  LLM_PROVIDER: process.env.LLM_PROVIDER,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL,

  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_DB: process.env.MONGODB_DB,

  RATE_LIMIT_REQUESTS: process.env.RATE_LIMIT_REQUESTS,
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
});

export const IS_DEV = env.NODE_ENV !== "production";
