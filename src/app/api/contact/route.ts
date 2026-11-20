import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";

const MIN_FILL_TIME_MS = 2500; // humans take longer than this to fill a form

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

async function sendEmail(data: { name: string; email: string; missionType: string; budget?: string | null; message: string }) {
  const mission = siteConfig.missionTypes.find((m) => m.id === data.missionType)?.label ?? data.missionType;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "VICE.DEV <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL],
      reply_to: data.email,
      subject: `New mission: ${mission} — from ${data.name}`,
      html: `<h2>New mission request</h2>
        <p><b>From:</b> ${escapeHtml(data.name)} &lt;${escapeHtml(data.email)}&gt;</p>
        <p><b>Mission:</b> ${escapeHtml(mission)}</p>
        ${data.budget ? `<p><b>Budget:</b> ${escapeHtml(data.budget)}</p>` : ""}
        <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>`,
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
}

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many messages. Take a breather and try again in a few minutes." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) fields[String(issue.path[0])] ??= issue.message;
    // Silently "accept" bot submissions so they don't retry.
    if (fields.company) return NextResponse.json({ ok: true });
    return NextResponse.json({ error: "Please check the highlighted fields.", fields }, { status: 400 });
  }

  const { company: _hp, startedAt, ...data } = parsed.data;
  if (startedAt && Date.now() - startedAt < MIN_FILL_TIME_MS) {
    return NextResponse.json({ ok: true }); // too fast to be human — drop quietly
  }

  let stored = false;
  let emailed = false;

  if (prisma) {
    try {
      await prisma.message.create({ data: { ...data, budget: data.budget || null } });
      stored = true;
    } catch (err) {
      console.error("[contact] failed to store message", err);
    }
  }

  if (env.emailEnabled) {
    try {
      await sendEmail(data);
      emailed = true;
    } catch (err) {
      console.error("[contact] failed to send email", err);
    }
  }

  if (!stored && !emailed) {
    // Neither DB nor email configured (or both failed). Log so local dev still "works".
    console.log("[contact] New message (configure DATABASE_URL or RESEND_API_KEY to keep these):", data);
    if (env.databaseEnabled || env.emailEnabled) {
      return NextResponse.json({ error: `Couldn't deliver your message. Please email ${siteConfig.player.email} directly.` }, { status: 502 });
    }
  }

  return NextResponse.json({ ok: true });
}
