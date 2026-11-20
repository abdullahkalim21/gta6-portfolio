import type { Metadata, Viewport } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { siteConfig, fullName } from "@/config/site";
import { env } from "@/lib/env";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: { default: siteConfig.seo.title, template: `%s · ${siteConfig.brand}` },
  description: siteConfig.seo.description,
  keywords: siteConfig.seo.keywords,
  applicationName: siteConfig.brand,
  authors: [{ name: fullName, url: env.siteUrl }],
  creator: fullName,
  publisher: fullName,
  category: "technology",
  formatDetection: { email: false, address: false, telephone: false },
  // Production is indexable; previews and local dev are not (see src/lib/env.ts).
  robots: env.indexable
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } }
    : { index: false, follow: false },
  alternates: {
    types: { "application/rss+xml": [{ url: "/rss.xml", title: `${siteConfig.brand} — City news` }] },
  },
  openGraph: {
    type: "website",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    siteName: siteConfig.brand,
    locale: siteConfig.seo.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    ...(siteConfig.seo.twitterHandle ? { creator: siteConfig.seo.twitterHandle } : {}),
  },
  verification: {
    ...(env.googleVerification ? { google: env.googleVerification } : {}),
    ...(env.bingVerification ? { other: { "msvalidate.01": env.bingVerification } } : {}),
  },
};

export const viewport: Viewport = {
  themeColor: "#171329",
  colorScheme: "dark",
};

const bootScript = `try{var s=JSON.parse(localStorage.getItem("vice:save")||"{}");if(s.time)document.documentElement.dataset.time=s.time;if(sessionStorage.getItem("vice:intro-seen"))document.documentElement.dataset.intro="seen"}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-time="sunset"
      className={`${anton.variable} ${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Restore time-of-day + intro state before paint (prevents flashes). */}
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <noscript>
          <style>{`.intro-screen{display:none!important}`}</style>
        </noscript>
      </head>
      <body>
        {children}
        {process.env.VERCEL === "1" && <Analytics />}
      </body>
    </html>
  );
}
