// middleware.ts (temporary no-op)
import { NextResponse } from "next/server";
export const config = { matcher: [] }; // match nothing
export default function middleware() { return NextResponse.next(); }
