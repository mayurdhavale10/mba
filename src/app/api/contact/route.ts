import { NextResponse } from "next/server";
import { z } from "zod";
import { assertRateLimit } from "@/lib/rate-limit";
import { errorBody, AppError, BadRequestError } from "@/lib/errors";
import { getCollection } from "@/lib/db/mongo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  email: z.string().trim().email(),
  message: z.string().trim().min(10).max(2000),
});

type ContactDoc = {
  name?: string;
  email: string;
  message: string;
  userId?: string | null;
  createdAt: Date;
  ua?: string | null;
};

export async function POST(request: Request) {
  try {
    const { remaining, resetAt } = assertRateLimit(request, { limit: 20, windowMs: 60_000 });
    const json = (await request.json()) as unknown;
    const parsed = ContactSchema.safeParse(json);
    if (!parsed.success) throw new BadRequestError("Invalid contact payload", parsed.error.flatten());

    const session = await getServerSession(authOptions);
    const col = await getCollection<ContactDoc>("contact_messages");
    await col.insertOne({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
      userId: session?.user?.id ?? null,
      createdAt: new Date(),
      ua: request.headers.get("user-agent"),
    });

    const res = NextResponse.json({ ok: true }, { status: 200 });
    res.headers.set("X-RateLimit-Remaining", String(remaining));
    res.headers.set("X-RateLimit-Reset", String(resetAt));
    return res;
  } catch (e) {
    const status = e instanceof AppError ? e.status : 500;
    return NextResponse.json(errorBody(e), { status });
  }
}
