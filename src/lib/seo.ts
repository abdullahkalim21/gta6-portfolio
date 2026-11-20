import type { Metadata } from "next";
import { siteConfig, fullName } from "@/config/site";
import { env } from "@/lib/env";
import type { Post, Project } from "@/lib/types";

/** Absolute URL for a path on this site. */
export const absoluteUrl = (path = "/") => `${env.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * Per-page metadata helper: sets title, description, canonical URL and the
 * Open Graph / X fields consistently. Social images come from the nearest
 * opengraph-image.tsx file automatically.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  noIndex = false,
  hasOwnImage = false,
}: {
  title?: string;
  description: string;
  path: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  noIndex?: boolean;
  /** True when the route segment has its own opengraph-image.tsx (detail pages). */
  hasOwnImage?: boolean;
}): Metadata {
  const ogTitle = title ? `${title} · ${siteConfig.brand}` : siteConfig.seo.title;
  // Next.js merges metadata shallowly: a page's openGraph/twitter/alternates object
  // replaces the root one, so the default image and RSS link must be repeated here.
  const defaultImage = { url: "/opengraph-image", width: 1200, height: 630, alt: `${fullName} — ${siteConfig.seo.jobTitle}` };
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path, types: { "application/rss+xml": [{ url: "/rss.xml", title: `${siteConfig.brand} — Blog` }] } },
    openGraph: {
      type,
      url: path,
      title: ogTitle,
      description,
      siteName: siteConfig.brand,
      locale: siteConfig.seo.locale,
      ...(hasOwnImage ? {} : { images: [defaultImage] }),
      ...(type === "article" && publishedTime ? { publishedTime, authors: [fullName] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      ...(hasOwnImage ? {} : { images: [defaultImage.url] }),
      ...(siteConfig.seo.twitterHandle ? { creator: siteConfig.seo.twitterHandle } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

// ── Structured data (JSON-LD) — helps Google show rich results ──────────

const personId = absoluteUrl("/#person");
const websiteId = absoluteUrl("/#website");

export function personJsonLd() {
  const { player, seo, socials } = siteConfig;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: fullName,
    url: absoluteUrl("/"),
    jobTitle: seo.jobTitle,
    description: seo.description,
    email: `mailto:${player.email}`,
    image: player.avatar ? absoluteUrl(player.avatar) : absoluteUrl("/opengraph-image"),
    address: { "@type": "PostalAddress", addressLocality: player.location.split("·")[0].trim() },
    knowsAbout: seo.knowsAbout,
    knowsLanguage: siteConfig.languages.map((l) => l.name),
    sameAs: socials.map((s) => s.url),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    url: absoluteUrl("/"),
    name: siteConfig.brand,
    description: siteConfig.seo.description,
    inLanguage: siteConfig.seo.locale.replace("_", "-"),
    author: { "@id": personId },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

export function projectJsonLd(p: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": absoluteUrl(`/projects/${p.slug}#project`),
    name: p.title,
    headline: p.title,
    description: p.summary,
    url: absoluteUrl(`/projects/${p.slug}`),
    ...(p.image ? { image: p.image.startsWith("http") ? p.image : absoluteUrl(p.image) } : {}),
    dateCreated: String(p.year),
    keywords: p.tech.join(", "),
    creator: { "@id": personId },
    ...(p.repoUrl ? { codeRepository: p.repoUrl } : {}),
    ...(p.liveUrl ? { sameAs: p.liveUrl } : {}),
  };
}

export function postJsonLd(p: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": absoluteUrl(`/blog/${p.slug}#article`),
    headline: p.title,
    description: p.excerpt,
    url: absoluteUrl(`/blog/${p.slug}`),
    mainEntityOfPage: absoluteUrl(`/blog/${p.slug}`),
    datePublished: p.publishedAt,
    dateModified: p.publishedAt,
    keywords: p.tag,
    author: { "@id": personId, "@type": "Person", name: fullName, url: absoluteUrl("/") },
    publisher: { "@id": personId },
    inLanguage: siteConfig.seo.locale.replace("_", "-"),
  };
}
