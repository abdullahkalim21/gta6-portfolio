/**
 * Public site URL used for canonical links, Open Graph, sitemap and RSS.
 * Order: NEXT_PUBLIC_SITE_URL → Vercel production domain → Vercel preview URL → localhost.
 */
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit;
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

/** Server-side feature flags derived from environment variables. */
export const env = {
  siteUrl: resolveSiteUrl().replace(/\/$/, ""),
  /** Only production deployments should be indexed by search engines. */
  indexable: process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : process.env.NODE_ENV === "production",
  databaseEnabled: Boolean(process.env.DATABASE_URL),
  adminEnabled: Boolean(process.env.ADMIN_PASSWORD && process.env.AUTH_SECRET),
  emailEnabled: Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL),
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || "",
  googleVerification: process.env.GOOGLE_SITE_VERIFICATION || "",
  bingVerification: process.env.BING_SITE_VERIFICATION || "",
};
