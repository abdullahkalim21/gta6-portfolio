import type { Post } from "@/lib/types";

/** Blog posts ("city news"). `content` is Markdown. */
export const posts: Post[] = [
  {
    slug: "building-an-open-world-portfolio",
    title: "Building an open-world portfolio with Next.js",
    excerpt: "Why I swapped a boring grid of cards for a city map, missions and a phone that actually works.",
    content: `Most developer portfolios look the same. That's fine — until you want to be remembered.

## The rules I set
1. **Recruiters first.** Every gimmick has a skip button and a normal link.
2. **No heavy 3D.** SVG + CSS gets 90% of the vibe at 5% of the cost.
3. **Content is data.** Projects, skills and posts come from one place.

## The stack
Next.js App Router, Tailwind CSS, Framer Motion and an optional PostgreSQL database through Prisma.

## What I'd do differently
Start with the content. The neon can wait.`,
    tag: "DEV LOG",
    color: "#FF4F91",
    published: true,
    publishedAt: "2026-10-02T12:00:00.000Z",
  },
  {
    slug: "procedural-radio-web-audio",
    title: "A radio station with zero audio files",
    excerpt: "Generating synthwave in the browser with the Web Audio API — and why it beats shipping MP3s.",
    content: `The radio on this site doesn't stream anything. Every note is synthesized live.

## How it works
- A tiny step sequencer schedules notes slightly ahead of time using \`AudioContext.currentTime\`.
- Pads are detuned sawtooth oscillators through a low-pass filter.
- Drums are shaped noise and pitch-swept sine waves.

## Why bother?
No licensing, no bandwidth, and it never loops the same way twice.`,
    tag: "TECH",
    color: "#45C9FF",
    published: true,
    publishedAt: "2026-09-14T12:00:00.000Z",
  },
  {
    slug: "accessibility-in-flashy-sites",
    title: "Flashy doesn't have to mean inaccessible",
    excerpt: "Reduced motion, keyboard maps and skip buttons: making a game-like site usable for everyone.",
    content: `A site can glow *and* respect \`prefers-reduced-motion\`.

## Checklist
- Every interactive map pin is a real \`<button>\` with a label
- The intro can be skipped and is remembered per session
- Conventional navigation is always available
- Motion is reduced when the OS asks for it`,
    tag: "ACCESSIBILITY",
    color: "#FF9D55",
    published: true,
    publishedAt: "2026-08-20T12:00:00.000Z",
  },
];
