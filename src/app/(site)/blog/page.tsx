import type { Metadata } from "next";
import { getPosts } from "@/lib/data";
import { siteConfig } from "@/config/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NewsCard } from "@/components/sections/NewsSection";

export const revalidate = 60;
export const metadata: Metadata = { title: "City news", description: "Dev logs, deep-dives and dispatches." };

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6">
      <SectionHeader kicker={`📰 ${siteConfig.cityName} DAILY`} title="City" accent="news" description="Stories from the developer, styled like the evening news." />
      {posts.length === 0 ? (
        <p className="text-[var(--muted)]">No stories yet. Check back soon.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <NewsCard key={p.slug} post={p} big={i === 0} />
          ))}
        </div>
      )}
    </section>
  );
}
