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
  authors: [{ name: fullName }],
  openGraph: {
    type: "website",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    siteName: siteConfig.brand,
  },
  twitter: { card: "summary_large_image", title: siteConfig.seo.title, description: siteConfig.seo.description },
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
