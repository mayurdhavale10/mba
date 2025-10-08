import { RateLimitedError } from "./errors";
import { env } from "./env";

// Map<key, { tokens, updatedAt }>
const buckets = new Map<string, { tokens: number; updatedAt: number }>();

type Options = {
  limit?: number;    // max requests per window
  windowMs?: number; // window length
  key?: string;      // custom key (defaults to IP)
};

function getIp(req: Request): string {
  const h = req.headers.get("x-forwarded-for");
  if (h) return h.split(",")[0]!.trim();
  // Fallback when not behind a proxy
  return "anonymous";
}

/**
 * Assert the requester has capacity left.
 * Throws RateLimitedError if the bucket is empty.
 * Returns { remaining, resetAt } on success.
 */
export function assertRateLimit(request: Request, opts: Options = {}) {
  const limit = opts.limit ?? env.RATE_LIMIT_REQUESTS;
  const windowMs = opts.windowMs ?? env.RATE_LIMIT_WINDOW_MS;
  const key = opts.key ?? getIp(request);

  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket) {
    buckets.set(key, { tokens: limit - 1, updatedAt: now });
    return { remaining: limit - 1, resetAt: now + windowMs };
  }

  // Refill based on elapsed time
  const elapsed = now - bucket.updatedAt;
  const refill = Math.floor(elapsed / windowMs) * limit;
  let tokens = Math.min(limit, bucket.tokens + refill);
  const nextReset = bucket.updatedAt + windowMs;

  if (tokens <= 0) {
    throw new RateLimitedError("Too many requests", nextReset, { key, limit, windowMs });
  }

  tokens -= 1;
  buckets.set(key, { tokens, updatedAt: now });
  return { remaining: tokens, resetAt: nextReset };
}
