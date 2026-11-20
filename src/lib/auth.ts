import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { env } from "./env";

export const SESSION_COOKIE = "vice_admin";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function sign(payload: string): string {
  return createHmac("sha256", process.env.AUTH_SECRET!).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkPassword(input: string): boolean {
  if (!env.adminEnabled) return false;
  // Compare HMACs so lengths always match and timing doesn't leak the password.
  return safeEqual(sign(`pw:${input}`), sign(`pw:${process.env.ADMIN_PASSWORD}`));
}

export function createSessionToken(): string {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `admin.${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !env.adminEnabled) return false;
  const lastDot = token.lastIndexOf(".");
  if (lastDot < 0) return false;
  const payload = token.slice(0, lastDot);
  const signature = token.slice(lastDot + 1);
  if (!safeEqual(signature, sign(payload))) return false;
  const expires = Number(payload.split(".")[1]);
  return Number.isFinite(expires) && expires > Date.now();
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_MS / 1000,
};
