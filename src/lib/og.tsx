import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { env } from "@/lib/env";

/**
 * Shared renderer for social preview images (Open Graph / X / LinkedIn / Slack / Discord…).
 * 1200×630 PNGs generated at build time by Next.js. Edit the layout here to restyle every card.
 */

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

type FontSpec = { family: string; weight: 400 | 700; name: string };
const FONTS: FontSpec[] = [
  { family: "Anton", weight: 400, name: "Anton" },
  { family: "Inter:wght@400", weight: 400, name: "Inter" },
  { family: "JetBrains+Mono:wght@700", weight: 700, name: "JetBrains Mono" },
];

/** Fetches a subset of a Google Font as TTF. Returns null offline so builds never fail. */
async function loadGoogleFont(family: string, text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`)).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    const res = await fetch(url);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

// Deterministic skyline so every card matches.
const skyline = Array.from({ length: 26 }, (_, i) => {
  const center = 1 - Math.abs(i - 13) / 14;
  return { w: 38 + ((i * 37) % 30), h: 60 + ((i * 53) % 90) + center * 110 };
});

export interface OgCardProps {
  kicker: string;
  title: string;
  subtitle?: string;
  accent?: string;
  chips?: string[];
  /** Small stat shown bottom-right, e.g. "+500 XP". */
  badge?: string;
}

export async function renderOgImage({ kicker, title, subtitle, accent = "#FF4F91", chips = [], badge }: OgCardProps) {
  // Hide the domain on local builds (e.g. the README/GitHub preview); show it once deployed.
  const host = /localhost|127\.0\.0\.1/.test(env.siteUrl) ? "" : env.siteUrl.replace(/^https?:\/\//, "");
  const raw = [kicker, title, subtitle, ...chips, badge, siteConfig.brand, host, "V"].filter(Boolean).join(" ");
  const allText = raw + raw.toUpperCase(); // fonts are subset to exactly these glyphs
  const loaded = await Promise.all(FONTS.map((f) => loadGoogleFont(f.family, allText)));
  const fonts = FONTS.flatMap((f, i) => (loaded[i] ? [{ name: f.name, data: loaded[i]!, weight: f.weight, style: "normal" as const }] : []));
  const has = (name: string) => fonts.some((f) => f.name === name);
  const display = has("Anton") ? "Anton" : "sans-serif";
  const mono = has("JetBrains Mono") ? "JetBrains Mono" : "monospace";
  const body = has("Inter") ? "Inter" : "sans-serif";
  const titleSize = title.length > 34 ? 76 : title.length > 22 ? 96 : 120;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(170deg, #1d0f3d 0%, #5a1a5e 42%, #c23a7a 72%, #ff9d55 100%)",
          color: "#F5E9E2",
          fontFamily: body,
          overflow: "hidden",
        }}
      >
        {/* Sun with synthwave stripes */}
        <div
          style={{
            position: "absolute",
            right: 70,
            top: 70,
            width: 380,
            height: 380,
            borderRadius: 999,
            background:
              "linear-gradient(180deg, #FFE066 0%, #FF9D55 45%, #FF4F91 52%, transparent 52%, transparent 56%, #FF4F91 56%, #FF4F91 64%, transparent 64%, transparent 69%, #FF4F91 69%, #FF4F91 77%, transparent 77%, transparent 83%, #FF4F91 83%)",
            opacity: 0.95,
          }}
        />
        {/* Skyline */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", alignItems: "flex-end", height: 280 }}>
          {skyline.map((b, i) => (
            <div key={i} style={{ width: b.w, height: b.h, marginRight: 8, background: "#1b1035", opacity: 0.92, display: "flex" }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 4, background: "#FF4F91", display: "flex" }} />
        {/* Readability scrim */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(90deg, rgba(13,10,28,.92) 0%, rgba(13,10,28,.75) 48%, rgba(13,10,28,0) 80%)", display: "flex" }} />

        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 64px", width: "100%" }}>
          {/* Top row */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                background: "linear-gradient(135deg, #FF4F91, #FF9D55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: display,
                fontSize: 32,
                color: "#fff",
              }}
            >
              V
            </div>
            <div style={{ marginLeft: 16, fontFamily: display, fontSize: 34, letterSpacing: 1 }}>{siteConfig.brand}</div>
          </div>

          {/* Main copy */}
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 820 }}>
            <div style={{ fontFamily: mono, fontSize: 24, letterSpacing: 4, color: "#45C9FF", textTransform: "uppercase" }}>{kicker}</div>
            <div
              style={{
                fontFamily: display,
                fontSize: titleSize,
                lineHeight: 0.95,
                marginTop: 14,
                textTransform: "uppercase",
                color: "#fff",
                display: "flex",
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div style={{ fontSize: 28, lineHeight: 1.35, marginTop: 22, color: "rgba(245,233,226,.85)", display: "flex" }}>
                {subtitle.length > 120 ? subtitle.slice(0, 117) + "…" : subtitle}
              </div>
            )}
            {chips.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", marginTop: 26 }}>
                {chips.slice(0, 5).map((c) => (
                  <div
                    key={c}
                    style={{
                      fontFamily: mono,
                      fontSize: 20,
                      padding: "8px 16px",
                      marginRight: 12,
                      borderRadius: 999,
                      border: "2px solid rgba(255,255,255,.25)",
                      background: "rgba(13,10,28,.55)",
                      display: "flex",
                    }}
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: 2, color: "rgba(245,233,226,.8)" }}>{host}</div>
            {badge && (
              <div style={{ fontFamily: mono, fontSize: 24, padding: "10px 20px", borderRadius: 10, background: accent, color: "#0d0a1c", display: "flex" }}>
                {badge}
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: fonts.length ? fonts : undefined },
  );
}
