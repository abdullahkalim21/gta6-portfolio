import { NextResponse } from "next/server";
import { checkPassword, createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { env } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!env.adminEnabled) {
    return NextResponse.json({ error: "Admin is disabled. Set ADMIN_PASSWORD and AUTH_SECRET." }, { status: 503 });
  }
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (!rateLimit(`login:${ip}`, 8, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (!password || !checkPassword(password)) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
  return res;
}
