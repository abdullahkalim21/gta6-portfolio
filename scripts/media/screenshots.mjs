// Captures the README screenshots from a running site (default http://localhost:3000).
//   npm run build && npm start      # in one terminal
//   npm run media:screenshots        # in another
// Uses your installed Google Chrome through playwright-core (no browser download).
import { chromium } from "playwright-core";
import fs from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = process.argv[2] || "docs/media/screenshots";
fs.mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ channel: "chrome", headless: true });

async function shot(page, name) {
  await page.screenshot({ path: `${OUT}/${name}.jpg`, type: "jpeg", quality: 82 });
  console.log("✔", name);
}
async function scrollTo(page, id, offset = 0) {
  await page.evaluate(
    ([id, offset]) => {
      document.documentElement.style.scrollBehavior = "auto";
      const el = document.getElementById(id);
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + offset);
    },
    [id, offset],
  );
  await wait(1600);
}
async function setWorld(page, time, weather) {
  await page.evaluate(([time, weather]) => {
    const s = JSON.parse(localStorage.getItem("vice:save") || "{}");
    localStorage.setItem("vice:save", JSON.stringify({ ...s, time, weather }));
  }, [time, weather]);
}

// ── Desktop ──────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await wait(3200);
  await shot(page, "01-loading-screen");

  await page.getByRole("button", { name: /Enter the city/i }).click();
  await page.mouse.move(1000, 450);
  await wait(2600);
  await shot(page, "02-hero");

  await setWorld(page, "night", "rain");
  await page.reload({ waitUntil: "networkidle" });
  await page.mouse.move(1000, 450);
  await wait(3000);
  await shot(page, "03-hero-night-rain");
  await setWorld(page, "sunset", "clear");
  await page.reload({ waitUntil: "networkidle" });
  await wait(1500);

  await page.evaluate(() => {
    const card = document.querySelector("#map .neon-border");
    window.scrollTo(0, card.getBoundingClientRect().top + window.scrollY - 90);
  });
  await wait(1600);
  const box = await page.locator('g[aria-label^="BUSINESS BAY"]').boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 - 8, { steps: 8 });
  await wait(1200);
  await shot(page, "04-city-map");

  await scrollTo(page, "about", 0);
  await shot(page, "05-character");

  await scrollTo(page, "skills", 120);
  const nodes = page.locator("#skills ol button");
  const n = await nodes.count();
  for (let i = 0; i < n; i++) if (i % 3 !== 2) await nodes.nth(i).hover();
  await nodes.nth(3).hover();
  await wait(900);
  await shot(page, "06-skill-tree");

  await scrollTo(page, "missions", 0);
  await page.locator("#missions article").nth(1).hover();
  await wait(900);
  await shot(page, "07-missions");

  await scrollTo(page, "experience", 0);
  await shot(page, "08-story-mode");

  await scrollTo(page, "interests", 420);
  await shot(page, "09-trophies");

  await scrollTo(page, "contact", 0);
  await shot(page, "10-hire");

  // Phone
  await page.mouse.move(700, 400);
  await page.locator('button[aria-label="Open smartphone"]').last().click();
  await wait(1400);
  await shot(page, "11-phone");
  await page.locator('[aria-label="Smartphone"] button', { hasText: "Music" }).click();
  await wait(800);
  await page.locator('[aria-label="Smartphone"] button[aria-label="Play"]').click();
  await wait(1500);
  await shot(page, "12-phone-radio");
  await page.locator('[aria-label="Smartphone"] button[aria-label="Pause"]').click();
  await page.keyboard.press("Escape");
  await wait(800);

  // Terminal
  await scrollTo(page, "map", 0);
  await page.keyboard.press("`");
  await wait(900);
  for (const cmd of ["whoami", "skills", "projects"]) {
    await page.keyboard.type(cmd, { delay: 20 });
    await page.keyboard.press("Enter");
    await wait(250);
  }
  await wait(800);
  await shot(page, "13-terminal");
  await page.keyboard.press("Escape");

  // Pages
  await page.goto(BASE + "/projects/nexus-saas", { waitUntil: "networkidle" });
  await wait(2000);
  await shot(page, "14-mission-detail");
  await page.goto(BASE + "/blog/building-an-open-world-portfolio", { waitUntil: "networkidle" });
  await wait(2000);
  await shot(page, "15-city-news");
  await ctx.close();
}

// ── Mobile ───────────────────────────────────────────────
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await ctx.addInitScript(() => sessionStorage.setItem("vice:intro-seen", "1"));
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await wait(2800);
  await shot(page, "m1-mobile-hero");
  await scrollTo(page, "map", 60);
  await shot(page, "m2-mobile-map");
  await page.locator('button[aria-label="Open smartphone"]').last().click();
  await wait(1400);
  await shot(page, "m3-mobile-phone");
  await ctx.close();
}

await browser.close();
