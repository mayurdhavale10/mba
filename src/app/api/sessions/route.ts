import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { errorBody, AppError, UnauthorizedError, BadRequestError } from "@/lib/errors";
import { assertRateLimit } from "@/lib/rate-limit";
import { listRecentByUser } from "@/domain/essay/models/feedbackSession.repo";
import { EssayInputSchema } from "@/domain/essay/validators/essay.schema";
import { generate } from "@/domain/essay/services/feedback.service";

export async function GET(request: Request) {
  try {
    const { remaining, resetAt } = assertRateLimit(request, { limit: 30, windowMs: 60_000 });
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new UnauthorizedError("Sign in to view sessions");

    const items = await listRecentByUser(session.user.id, 10);
    const res = NextResponse.json({ items }, { status: 200 });
    res.headers.set("X-RateLimit-Remaining", String(remaining));
    res.headers.set("X-RateLimit-Reset", String(resetAt));
    return res;
  } catch (e) {
    const status = e instanceof AppError ? e.status : 500;
    return NextResponse.json(errorBody(e), { status });
  }
}

export async function POST(request: Request) {
  try {
    const { remaining, resetAt } = assertRateLimit(request);
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new UnauthorizedError("Sign in to save sessions");

    const body = await request.json();
    const parsed = EssayInputSchema.parse(body);
    if (!parsed.essayText) throw new BadRequestError("essayText required");

    const { feedback, sessionId } = await generate(parsed.essayText, { save: true, userId: session.user.id });

    const res = NextResponse.json({ sessionId, feedback }, { status: 200 });
    res.headers.set("X-RateLimit-Remaining", String(remaining));
    res.headers.set("X-RateLimit-Reset", String(resetAt));
    return res;
  } catch (e) {
    const status = e instanceof AppError ? e.status : 500;
    return NextResponse.json(errorBody(e), { status });
  }
}
