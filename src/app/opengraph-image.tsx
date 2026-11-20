import { siteConfig, fullName } from "@/config/site";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

// Default social preview for every page that doesn't define its own.
export const alt = `${fullName} — ${siteConfig.seo.jobTitle}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    kicker: siteConfig.player.tagline,
    title: fullName,
    subtitle: siteConfig.player.role.replace(/\s*\|\s*/g, " · "),
    chips: siteConfig.seo.knowsAbout.slice(0, 4),
    badge: siteConfig.player.available ? "● AVAILABLE FOR HIRE" : undefined,
    accent: "#5CF2B4",
  });
}
