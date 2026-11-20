import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPosts } from "@/lib/data";
import { renderMarkdown } from "@/lib/markdown";
import { formatDate } from "@/lib/format";
import { fullName, siteConfig } from "@/config/site";
import { UnlockOnMount } from "@/components/easter-eggs/UnlockOnMount";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, pageMetadata, postJsonLd } from "@/lib/seo";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return { title: "Story not found", robots: { index: false } };
  return pageMetadata({ title: post.title, description: post.excerpt, path: `/blog/${post.slug}`, type: "article", publishedTime: post.publishedAt, hasOwnImage: true });
}

export default async function PostPage({ params }: Props) {
  const post = await getPost((await params).slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
      <UnlockOnMount id="reader" />
      <JsonLd
        data={[
          postJsonLd(post),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <Link href="/blog" className="font-hud text-xs text-[var(--muted)] hover:text-white">
        ‹ {siteConfig.cityName} Daily
      </Link>
      <div className="mt-8 border-y-2 py-2" style={{ borderColor: post.color }}>
        <p className="font-hud flex justify-between text-[0.65rem]">
          <span style={{ color: post.color }}>BREAKING · {post.tag}</span>
          <time dateTime={post.publishedAt} className="text-[var(--muted)]">
            {formatDate(post.publishedAt)}
          </time>
        </p>
      </div>
      <h1 className="font-display mt-6 text-5xl leading-[0.95] sm:text-7xl">{post.title}</h1>
      <p className="mt-5 text-xl text-white/90">{post.excerpt}</p>
      <p className="font-hud mt-4 text-[0.65rem] text-[var(--muted)]">Reporting: {fullName}</p>
      <div className="prose-vice mt-10" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
    </article>
  );
}
