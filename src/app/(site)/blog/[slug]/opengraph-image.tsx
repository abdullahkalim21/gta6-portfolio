import { getPost, getPosts } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "City news";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return renderOgImage({ kicker: "Story not found", title: "404" });
  return renderOgImage({
    kicker: `Breaking · ${post.tag}`,
    title: post.title,
    subtitle: post.excerpt,
    accent: post.color,
    badge: formatDate(post.publishedAt).toUpperCase(),
  });
}
