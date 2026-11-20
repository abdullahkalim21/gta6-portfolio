// Records the README walkthrough video to docs/media/.raw/walkthrough.webm.
//   npm run media:video   (site must be running; first run may ask for: npx playwright-core install ffmpeg)
//   npm run media:encode  (converts it to MP4 + GIFs)
import { chromium } from "playwright-core";
import fs from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = process.argv[2] || "docs/media/.raw";
fs.mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: { dir: OUT, size: { width: 1280, height: 720 } },
});
await ctx.addInitScript(() => document.addEventListener("DOMContentLoaded", () => { const s = document.createElement("style"); s.textContent = ".grain{display:none!important}"; document.head.appendChild(s); }));
const page = await ctx.newPage();

async function smoothTo(y, ms = 1400) {
  await page.evaluate(
    ([y, ms]) =>
      new Promise((res) => {
        document.documentElement.style.scrollBehavior = "auto";
        const start = window.scrollY, t0 = performance.now();
        const step = (t) => {
          const p = Math.min(1, (t - t0) / ms);
          const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          window.scrollTo(0, start + (y - start) * e);
          p < 1 ? requestAnimationFrame(step) : res();
        };
        requestAnimationFrame(step);
      }),
    [y, ms],
  );
}
const topOf = (sel, offset = 0) =>
  page.evaluate(([sel, offset]) => document.querySelector(sel).getBoundingClientRect().top + window.scrollY + offset, [sel, offset]);
async function moveTo(locator, dy = 0) {
  const b = await locator.boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2 + dy, { steps: 14 });
}

await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.mouse.move(900, 600);
await wait(3000); // loading screen
await moveTo(page.getByRole("button", { name: /Enter the city/i }));
await wait(300);
await page.getByRole("button", { name: /Enter the city/i }).click();
await wait(2200);

// Wanted stars easter egg
const stars = page.locator('button[aria-label^="Wanted level"]').first();
await moveTo(stars);
for (let i = 0; i < 3; i++) {
  await stars.click();
  await wait(250);
}
await wait(900);

// Map
await smoothTo(await topOf("#map .neon-border", -80));
await wait(500);
for (const name of ["UNIVERSITY", "TECH DISTRICT", "BUSINESS BAY", "BEACH CLUB"]) {
  await moveTo(page.locator(`g[aria-label^="${name}"]`), -6);
  await wait(800);
}
await page.locator('g[aria-label^="TECH DISTRICT"]').click();
await wait(1600);

// Skill tree
await smoothTo(await topOf("#skills ol", -260), 700);
const nodes = page.locator("#skills ol button");
const n = await nodes.count();
for (let i = 0; i < n; i += 2) {
  await moveTo(nodes.nth(i));
  await wait(120);
}
await wait(700);

// Missions
await smoothTo(await topOf("#missions", 0));
await wait(400);
for (let i = 0; i < 3; i++) {
  await moveTo(page.locator("#missions article").nth(i));
  await wait(650);
}

// Terminal: night + rain
await page.keyboard.press("`");
await wait(700);
for (const cmd of ["whoami", "weather rain", "time night"]) {
  await page.keyboard.type(cmd, { delay: 55 });
  await page.keyboard.press("Enter");
  await wait(600);
}
await wait(500);
await page.keyboard.press("Escape");
await smoothTo(0, 1600);
await page.mouse.move(980, 420, { steps: 10 });
await wait(2000);

// Phone
const phoneBtn = page.locator('button[aria-label="Open smartphone"]').last();
await moveTo(phoneBtn);
await phoneBtn.click();
await wait(1300);
const app = (name) => page.locator('[aria-label="Smartphone"] button', { hasText: name });
await moveTo(app("Trophies"));
await app("Trophies").click();
await wait(1600);
await page.locator('[aria-label="Smartphone"] button[aria-label="Back to home screen"]').click();
await wait(700);
await moveTo(app("Music"));
await app("Music").click();
await wait(1500);
await page.keyboard.press("Escape");
await wait(800);

// Back to sunset for a clean final frame
await page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem("vice:save") || "{}");
  localStorage.setItem("vice:save", JSON.stringify({ ...s, time: "sunset", weather: "clear" }));
});
await smoothTo(await topOf("#contact", 0), 1800);
await wait(1500);

const video = page.video();
await ctx.close();
const path = await video.path();
fs.renameSync(path, `${OUT}/walkthrough.webm`);
console.log("✔ video", `${OUT}/walkthrough.webm`);
await browser.close();
