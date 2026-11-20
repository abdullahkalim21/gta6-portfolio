import { ImageResponse } from "next/og";

// iOS home-screen icon (PNG — Apple doesn't use SVG favicons).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FF4F91, #FF9D55)",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 64 64">
          <path d="M16 16h9l7 22 7-22h9L37 48H27z" fill="#fff" />
        </svg>
      </div>
    ),
    size,
  );
}
