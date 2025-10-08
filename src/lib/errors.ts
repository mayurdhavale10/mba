// src/lib/errors.ts
export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "PROVIDER_ERROR"
  | "RATE_LIMITED"
  | "INTERNAL";

export class AppError extends Error {
  status: number;
  code: ErrorCode;
  details?: unknown;

  constructor(message: string, status = 500, code: ErrorCode = "INTERNAL", details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", details?: unknown) {
    super(message, 400, "BAD_REQUEST", details);
  }
}
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", details?: unknown) {
    super(message, 401, "UNAUTHORIZED", details);
  }
}
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", details?: unknown) {
    super(message, 403, "FORBIDDEN", details);
  }
}
export class NotFoundError extends AppError {
  constructor(message = "Not found", details?: unknown) {
    super(message, 404, "NOT_FOUND", details);
  }
}
export class ProviderError extends AppError {
  constructor(message = "Provider error", details?: unknown) {
    super(message, 502, "PROVIDER_ERROR", details);
  }
}
export class RateLimitedError extends AppError {
  resetAt: number;
  constructor(message = "Too many requests", resetAt: number, details?: unknown) {
    super(message, 429, "RATE_LIMITED", details);
    this.resetAt = resetAt;
  }
}

// Helper to format NextResponse payloads
export function errorBody(e: unknown) {
  if (e instanceof AppError) {
    return { error: { code: e.code, message: e.message, details: e.details } };
  }
  const msg = e instanceof Error ? e.message : "Internal error";
  return { error: { code: "INTERNAL" as const, message: msg } };
}
