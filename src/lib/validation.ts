import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .nullable()
  .transform((v) => (v ? v : null))
  .refine((v) => v === null || /^(https?:\/\/|\/)/.test(v), "Must be a URL starting with http(s):// or /");

const hexColor = z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color like #FF4F91");
const bool = z.union([z.boolean(), z.string()]).transform((v) => v === true || v === "true" || v === "on");

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Tell me your name").max(80),
  email: z.string().trim().email("That email looks off").max(120),
  missionType: z.string().trim().min(1).max(40),
  budget: z.string().trim().max(60).optional().nullable(),
  message: z.string().trim().min(10, "A few more words, please (10+ characters)").max(4000),
  // Spam protection
  company: z.string().max(0, "Bot detected").optional(), // honeypot — must stay empty
  startedAt: z.number().optional(), // ms timestamp when the form was rendered
});

export const projectSchema = z.object({
  slug: z.string().trim().min(1).max(80).regex(/^[a-z0-9-]+$/, "lowercase letters, numbers and dashes only"),
  title: z.string().trim().min(1).max(120),
  summary: z.string().trim().min(1).max(400),
  description: z.string().max(20000).default(""),
  tech: z
    .union([z.array(z.string()), z.string()])
    .transform((v) => (Array.isArray(v) ? v : v.split(",")).map((s) => s.trim()).filter(Boolean)),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD", "LEGENDARY"]),
  status: z.enum(["COMPLETED", "IN_PROGRESS"]),
  reward: z.coerce.number().int().min(0).max(100000),
  year: z.coerce.number().int().min(1990).max(2100),
  repoUrl: optionalUrl,
  liveUrl: optionalUrl,
  image: optionalUrl,
  videoUrl: optionalUrl,
  color: hexColor,
  featured: bool,
  order: z.coerce.number().int(),
});

export const skillSchema = z.object({
  name: z.string().trim().min(1).max(60),
  branch: z.string().trim().min(1).max(40),
  tier: z.coerce.number().int().min(1).max(4),
  level: z.coerce.number().int().min(0).max(100),
  description: z.string().trim().max(200).default(""),
  order: z.coerce.number().int(),
});

export const postSchema = z.object({
  slug: z.string().trim().min(1).max(100).regex(/^[a-z0-9-]+$/, "lowercase letters, numbers and dashes only"),
  title: z.string().trim().min(1).max(160),
  excerpt: z.string().trim().min(1).max(400),
  content: z.string().max(50000).default(""),
  tag: z.string().trim().min(1).max(30),
  color: hexColor,
  published: bool,
  publishedAt: z.coerce.date(),
});

export const messageSchema = z.object({ read: bool });
