import type { Project } from "@/lib/types";

/**
 * Your projects ("missions").
 * Used directly when no database is configured, and as seed data for
 * `npm run db:seed` when one is. `description` is Markdown.
 */
export const projects: Project[] = [
  {
    slug: "nexus-saas",
    title: "Nexus SaaS",
    summary: "A full-stack SaaS platform built with Next.js, PostgreSQL, and Stripe.",
    description: `## The brief
A B2B analytics startup needed to go from spreadsheet to self-serve SaaS in eight weeks.

## What I built
- Multi-tenant workspace model with role-based access control
- Usage-based billing with **Stripe** metered subscriptions
- Real-time dashboards backed by PostgreSQL materialized views
- Marketing site + docs on the same Next.js App Router codebase

## Results
- Launched on time with 40 paying teams in month one
- p95 dashboard load under 400ms
- 99.98% uptime over the first year

## Stack
Next.js · TypeScript · Prisma · PostgreSQL · Stripe · Vercel`,
    tech: ["Next.js", "TypeScript", "Prisma", "Stripe"],
    difficulty: "LEGENDARY",
    status: "COMPLETED",
    reward: 500,
    year: 2025,
    repoUrl: "https://github.com/",
    liveUrl: "https://example.com",
    image: null,
    color: "#FF4F91",
    featured: true,
    order: 1,
  },
  {
    slug: "ocean-drive-commerce",
    title: "Ocean Drive Commerce",
    summary: "Headless storefront for a streetwear brand with drops, waitlists and 3D product previews.",
    description: `## The brief
Limited drops were crashing the client's old storefront. They wanted something fast that could survive 20k shoppers in the first minute.

## What I built
- Headless storefront with ISR product pages
- Queue-based checkout to absorb drop traffic
- Interactive 3D product viewer with React Three Fiber

## Results
- Zero downtime across 12 drops
- Conversion up 31% year-over-year`,
    tech: ["Next.js", "Shopify", "Three.js", "Redis"],
    difficulty: "HARD",
    status: "COMPLETED",
    reward: 400,
    year: 2024,
    repoUrl: "https://github.com/",
    liveUrl: "https://example.com",
    image: null,
    color: "#FF9D55",
    featured: true,
    order: 2,
  },
  {
    slug: "palm-radio",
    title: "Palm Radio",
    summary: "A collaborative internet radio where listeners vote the next track in real time.",
    description: `## The idea
What if a radio station was a multiplayer game?

## What I built
- WebSocket rooms with optimistic voting
- Audio streaming pipeline with HLS
- Mobile-first PWA with offline queue

## Results
- 5k monthly listeners, featured on a popular dev newsletter`,
    tech: ["React", "Node.js", "WebSockets", "PostgreSQL"],
    difficulty: "MEDIUM",
    status: "COMPLETED",
    reward: 300,
    year: 2024,
    repoUrl: "https://github.com/",
    liveUrl: null,
    image: null,
    color: "#45C9FF",
    featured: true,
    order: 3,
  },
  {
    slug: "sunset-ui",
    title: "Sunset UI",
    summary: "An open-source React component library with 40+ accessible, themeable components.",
    description: `## Why
Every agency project was rebuilding the same buttons. So I stopped.

## What I built
- 40+ components following WAI-ARIA patterns
- Token-based theming with CSS variables
- Storybook docs + visual regression testing

## Results
- 2k+ GitHub stars, used in production by several teams`,
    tech: ["React", "TypeScript", "Storybook", "Tailwind"],
    difficulty: "MEDIUM",
    status: "IN_PROGRESS",
    reward: 250,
    year: 2026,
    repoUrl: "https://github.com/",
    liveUrl: "https://example.com",
    image: null,
    color: "#B583FF",
    featured: false,
    order: 4,
  },
  {
    slug: "harbor-ops",
    title: "Harbor Ops",
    summary: "Internal DevOps dashboard to manage deploys, feature flags and incident runbooks.",
    description: `## The brief
A fintech team had deploy knowledge spread across five tools and three people's heads.

## What I built
- One dashboard for CI status, deploys and rollbacks
- Feature-flag management with audit logs
- Incident runbooks linked to alerts

## Results
- Mean time to recovery down from 48 to 11 minutes`,
    tech: ["Go", "React", "Docker", "AWS"],
    difficulty: "HARD",
    status: "COMPLETED",
    reward: 350,
    year: 2023,
    repoUrl: null,
    liveUrl: null,
    image: null,
    color: "#5CF2B4",
    featured: false,
    order: 5,
  },
];
