import { NextResponse } from "next/server";
import { EssayInputSchema } from "@/domain/essay/validators/essay.schema";
import { generate } from "@/domain/essay/services/feedback.service";
import { assertRateLimit } from "@/lib/rate-limit";
import { errorBody, AppError } from "@/lib/errors";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(request: Request) {
  try {
    const { remaining, resetAt } = assertRateLimit(request);
    const body = await request.json();
    const { essayText, options } = EssayInputSchema.parse(body);

    const session = await getServerSession(authOptions); // v4-safe
    const { feedback, sessionId } = await generate(essayText, {
      save: options?.save === true && !!session?.user?.id,
      userId: session?.user?.id ?? null,
    });

    const res = NextResponse.json({ feedback, sessionId }, { status: 200 });
    res.headers.set("X-RateLimit-Remaining", String(remaining));
    res.headers.set("X-RateLimit-Reset", String(resetAt));
    return res;
  } catch (e) {
    const status = e instanceof AppError ? e.status : 500;
    return NextResponse.json(errorBody(e), { status });
  }
}
