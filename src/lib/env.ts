/** Server-side feature flags derived from environment variables. */
export const env = {
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  databaseEnabled: Boolean(process.env.DATABASE_URL),
  adminEnabled: Boolean(process.env.ADMIN_PASSWORD && process.env.AUTH_SECRET),
  emailEnabled: Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL),
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || "",
};
