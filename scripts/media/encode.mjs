// Turns docs/media/.raw/walkthrough.webm into the README media:
//   docs/media/walkthrough.mp4, docs/media/tour-explore.gif, docs/media/tour-interact.gif
// Requires ffmpeg on your PATH (https://ffmpeg.org/download.html).
//   npm run media:encode            # split at 28.3s (default)
//   npm run media:encode -- 25      # split the two GIFs at 25s instead
import { execFileSync } from "node:child_process";

const SRC = "docs/media/.raw/walkthrough.webm";
const OUT = "docs/media";
const split = process.argv[2] || "28.3";
const gif = (colors, dither, fps) =>
  `fps=${fps},scale=800:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=${colors}:stats_mode=diff[p];[b][p]paletteuse=dither=${dither}:diff_mode=rectangle`;

const run = (args) => execFileSync("ffmpeg", ["-y", "-v", "error", ...args], { stdio: "inherit" });

run(["-ss", "0.4", "-i", SRC, "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", `${OUT}/walkthrough.mp4`]);
run(["-ss", "0.4", "-to", split, "-i", SRC, "-vf", gif(96, "bayer:bayer_scale=5", 10), `${OUT}/tour-explore.gif`]);
run(["-ss", split, "-i", SRC, "-vf", gif(64, "none", 9), `${OUT}/tour-interact.gif`]);
console.log("✔ walkthrough.mp4, tour-explore.gif, tour-interact.gif written to docs/media/");
