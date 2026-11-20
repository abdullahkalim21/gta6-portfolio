import type { MetadataRoute } from "next";
import { siteConfig, fullName } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${fullName} — ${siteConfig.brand}`,
    short_name: siteConfig.brand,
    description: siteConfig.seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#171329",
    theme_color: "#171329",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
