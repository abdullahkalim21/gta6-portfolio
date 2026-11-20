/**
 * Copies the static content in src/content/ into your database.
 *   npm run db:seed
 * Safe to re-run: projects/posts are upserted by slug, skills are replaced.
 */
import { PrismaClient } from "@prisma/client";
import { projects } from "../src/content/projects";
import { skills } from "../src/content/skills";
import { posts } from "../src/content/posts";

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Add it to your .env file first (see docs/DATABASE.md).");
  }

  for (const { id: _id, ...p } of projects) {
    const data = { ...p, repoUrl: p.repoUrl ?? null, liveUrl: p.liveUrl ?? null, image: p.image ?? null, videoUrl: p.videoUrl ?? null };
    await prisma.project.upsert({ where: { slug: p.slug }, update: data, create: data });
  }
  console.log(`✔ ${projects.length} projects`);

  await prisma.skill.deleteMany();
  await prisma.skill.createMany({ data: skills.map(({ id: _id, ...s }) => s) });
  console.log(`✔ ${skills.length} skills`);

  for (const { id: _id, ...p } of posts) {
    const data = { ...p, publishedAt: new Date(p.publishedAt) };
    await prisma.post.upsert({ where: { slug: p.slug }, update: data, create: data });
  }
  console.log(`✔ ${posts.length} posts`);
  console.log("Mission complete. Database seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
