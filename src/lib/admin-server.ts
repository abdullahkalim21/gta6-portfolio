import "server-only";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { ZodTypeAny } from "zod";
import { prisma } from "./db";
import { isAdmin } from "./auth";
import { messageSchema, postSchema, projectSchema, skillSchema } from "./validation";

type Delegate = {
  findMany: (args?: unknown) => Promise<unknown[]>;
  create: (args: { data: unknown }) => Promise<unknown>;
  update: (args: { where: { id: string }; data: unknown }) => Promise<unknown>;
  delete: (args: { where: { id: string } }) => Promise<unknown>;
};

export const resourceSchemas: Record<string, ZodTypeAny> = {
  projects: projectSchema,
  skills: skillSchema,
  posts: postSchema,
  messages: messageSchema,
};

export function getDelegate(resource: string): Delegate | null {
  if (!prisma) return null;
  const map: Record<string, unknown> = {
    projects: prisma.project,
    skills: prisma.skill,
    posts: prisma.post,
    messages: prisma.message,
  };
  return (map[resource] as Delegate) ?? null;
}

export const orderBy: Record<string, unknown> = {
  projects: [{ order: "asc" }, { createdAt: "desc" }],
  skills: [{ branch: "asc" }, { order: "asc" }],
  posts: { publishedAt: "desc" },
  messages: { createdAt: "desc" },
};

/** Returns an error response if the request isn't allowed, otherwise null. */
export async function guard(resource?: string): Promise<NextResponse | null> {
  if (!prisma) return NextResponse.json({ error: "Database not configured. Set DATABASE_URL." }, { status: 503 });
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (resource && !resourceSchemas[resource]) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  return null;
}

export function revalidateSite() {
  revalidatePath("/", "layout");
}

export function prismaError(err: unknown) {
  const e = err as { code?: string; message?: string };
  if (e.code === "P2002") return NextResponse.json({ error: "That slug is already taken." }, { status: 409 });
  if (e.code === "P2025") return NextResponse.json({ error: "Record not found." }, { status: 404 });
  console.error("[admin]", err);
  return NextResponse.json({ error: "Database error. Check the server logs." }, { status: 500 });
}
