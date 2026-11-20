import type { Skill } from "@/lib/types";

/**
 * Skill tree. `branch` must match an id in siteConfig.skillBranches.
 * `tier` 1 is the root of the branch, 4 is the top. Several skills can share a tier.
 */
export const skills: Skill[] = [
  // Frontend
  { name: "HTML & CSS", branch: "frontend", tier: 1, level: 98, description: "Semantic markup, modern layout, animation.", order: 1 },
  { name: "React", branch: "frontend", tier: 2, level: 95, description: "Hooks, server components, performance tuning.", order: 2 },
  { name: "Tailwind CSS", branch: "frontend", tier: 2, level: 92, description: "Design tokens and utility-first systems.", order: 3 },
  { name: "Next.js", branch: "frontend", tier: 3, level: 94, description: "App Router, ISR, edge, streaming.", order: 4 },
  { name: "Three.js / R3F", branch: "frontend", tier: 4, level: 70, description: "3D scenes for the web.", order: 5 },

  // Backend
  { name: "Node.js", branch: "backend", tier: 1, level: 90, description: "APIs, workers, streams.", order: 1 },
  { name: "Express", branch: "backend", tier: 2, level: 85, description: "REST services and middleware.", order: 2 },
  { name: "PostgreSQL", branch: "backend", tier: 2, level: 86, description: "Schema design, indexing, query plans.", order: 3 },
  { name: "Prisma", branch: "backend", tier: 3, level: 88, description: "Type-safe data access.", order: 4 },
  { name: "System design", branch: "backend", tier: 4, level: 78, description: "Queues, caching, scaling.", order: 5 },

  // DevOps
  { name: "Git", branch: "devops", tier: 1, level: 93, description: "Branching strategies, clean history.", order: 1 },
  { name: "Docker", branch: "devops", tier: 2, level: 82, description: "Containers for dev and prod.", order: 2 },
  { name: "CI/CD", branch: "devops", tier: 3, level: 80, description: "GitHub Actions, preview deploys.", order: 3 },
  { name: "AWS", branch: "devops", tier: 4, level: 72, description: "Lambda, S3, RDS, CloudFront.", order: 4 },

  // Design
  { name: "Figma", branch: "design", tier: 1, level: 85, description: "Wireframes to hi-fi prototypes.", order: 1 },
  { name: "Design systems", branch: "design", tier: 2, level: 84, description: "Tokens, components, documentation.", order: 2 },
  { name: "Framer Motion", branch: "design", tier: 3, level: 88, description: "Interaction and page transitions.", order: 3 },
  { name: "Accessibility", branch: "design", tier: 4, level: 80, description: "WCAG, keyboard and screen readers.", order: 4 },
];
