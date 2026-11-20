import { ImageResponse } from "next/og";
import { siteConfig, fullName } from "@/config/site";

export const alt = siteConfig.seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          background: "linear-gradient(160deg, #2a1250 0%, #c23a7a 55%, #ff9d55 100%)",
          color: "#F5E9E2",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 80,
            top: 70,
            width: 320,
            height: 320,
            borderRadius: 999,
            background: "linear-gradient(180deg, #FFE066, #FF4F91)",
          }}
        />
        <div style={{ fontSize: 28, letterSpacing: 8, color: "#45C9FF", fontWeight: 700 }}>{siteConfig.brand}</div>
        <div style={{ fontSize: 120, fontWeight: 900, lineHeight: 1, textTransform: "uppercase", marginTop: 12 }}>{fullName}</div>
        <div style={{ fontSize: 30, letterSpacing: 4, marginTop: 20, opacity: 0.9 }}>{siteConfig.player.role}</div>
      </div>
    ),
    size,
  );
}
