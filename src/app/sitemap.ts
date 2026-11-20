import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "@/lib/data";
import { env } from "@/lib/env";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const base = env.siteUrl;
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/projects`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.7 },
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, changeFrequency: "yearly" as const, priority: 0.6 })),
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.publishedAt, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
