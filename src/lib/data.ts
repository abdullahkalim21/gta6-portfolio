import "server-only";
import { prisma } from "./db";
import type { Post, Project, Skill } from "./types";
import { projects as staticProjects } from "@/content/projects";
import { skills as staticSkills } from "@/content/skills";
import { posts as staticPosts } from "@/content/posts";

/**
 * Data access layer. Reads from PostgreSQL when DATABASE_URL is set and falls
 * back to the static files in src/content/ otherwise (or if the DB is down or empty).
 */

async function fromDb<T>(label: string, query: () => Promise<T[]>, fallback: T[]): Promise<T[]> {
  if (!prisma) return fallback;
  try {
    const rows = await query();
    return rows.length > 0 ? rows : fallback;
  } catch (err) {
    console.warn(`[vice.dev] Could not load ${label} from the database, using static content.`, (err as Error).message);
    return fallback;
  }
}

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export async function getProjects(): Promise<Project[]> {
  return fromDb(
    "projects",
    () => prisma!.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
    [...staticProjects].sort(byOrder),
  );
}

export async function getProject(slug: string): Promise<Project | null> {
  const all = await getProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getSkills(): Promise<Skill[]> {
  return fromDb("skills", () => prisma!.skill.findMany({ orderBy: { order: "asc" } }), [...staticSkills].sort(byOrder));
}

function serializePost(p: Omit<Post, "publishedAt"> & { publishedAt: Date | string }): Post {
  return { ...p, publishedAt: typeof p.publishedAt === "string" ? p.publishedAt : p.publishedAt.toISOString() };
}

export async function getPosts(): Promise<Post[]> {
  const fallback = staticPosts
    .filter((p) => p.published)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  return fromDb(
    "posts",
    async () =>
      (await prisma!.post.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } })).map(serializePost),
    fallback,
  );
}

export async function getPost(slug: string): Promise<Post | null> {
  const all = await getPosts();
  return all.find((p) => p.slug === slug) ?? null;
}
