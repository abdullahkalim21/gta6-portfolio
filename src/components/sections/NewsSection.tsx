import Link from "next/link";
import type { Post } from "@/lib/types";
import { siteConfig } from "@/config/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatDate } from "@/lib/format";

export function NewsCard({ post, big = false }: { post: Post; big?: boolean }) {
  return (
    <article className={`glass group relative flex flex-col overflow-hidden rounded-2xl ${big ? "md:row-span-2" : ""}`}>
      <div className="h-1.5" style={{ background: post.color, boxShadow: `0 0 18px ${post.color}` }} />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between">
          <span className="font-hud rounded px-2 py-0.5 text-[0.6rem] font-bold text-[#0d0a1c]" style={{ background: post.color }}>
            {post.tag}
          </span>
          <time className="font-hud text-[0.6rem] text-[var(--muted)]" dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
        </div>
        <h3 className={`font-display mt-4 leading-[1.02] ${big ? "text-4xl sm:text-5xl" : "text-2xl"}`}>
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 group-hover:text-pink">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-sm text-[var(--muted)]">{post.excerpt}</p>
        <p className="font-hud mt-5 text-[0.65rem] text-ocean">Read the story ▸</p>
      </div>
    </article>
  );
}

export function NewsSection({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;
  const [first, ...rest] = posts.slice(0, 3);
  return (
    <section id="news" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeader kicker={`📰 ${siteConfig.cityName} DAILY`} title="City" accent="news" description="Dev logs, deep-dives and dispatches from the city." />
        <Link href="/blog" className="btn btn-ghost mb-10 sm:mb-14">
          All stories ▸
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <NewsCard post={first} big />
        {rest.map((p) => (
          <NewsCard key={p.slug} post={p} />
        ))}
      </div>
    </section>
  );
}
