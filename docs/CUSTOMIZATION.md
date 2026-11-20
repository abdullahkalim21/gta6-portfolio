# Customization guide

Everything you need to change lives in three places:

| Where | What |
|---|---|
| `src/config/site.ts` | Your identity: name, bio, stats, experience, socials, interests, map, radio, SEO |
| `src/content/` | Your projects, skills and blog posts |
| `public/` | Resume, avatar, screenshots, videos, music |

If you set up a database ([DATABASE.md](DATABASE.md)), projects, skills and posts can also be managed from `/admin`. The files in `src/content/` stay as the fallback and seed data.

---

## 1. Identity: `src/config/site.ts`

### Player

```ts
player: {
  firstName: "Alex",
  lastName: "Rivera",
  role: "FULL STACK DEVELOPER | DIGITAL CREATOR",
  tagline: "WELCOME TO MY WORLD.",
  intro: "I'm Alex — a developer building digital experiences, one mission at a time.",
  location: "Miami, FL · Remote friendly",
  avatar: "",                 // e.g. "/images/avatar.jpg" (leave empty for a generated silhouette)
  email: "hello@example.com",
  phone: "",                  // optional, shown in the phone Contacts app
  resumeUrl: "/resume.pdf",
  available: true,            // drives the availability indicator
  availabilityText: "Open to freelance & full-time missions",
}
```

### Brand and city

- `brand`: shown in the navbar, HUD and loading screen (default `VICE.DEV`).
- `cityName`: your fictional city (default `VICE SHORES`). The first word is highlighted on the loading screen.

### HUD

```ts
hud: { level: 99, xp: 92, currentMission: "BUILD SOMETHING GREAT", cash: "$1,337,000" }
```

These values are just for fun.

### Bio, stats, languages, achievements

- `bio`: an array of paragraphs.
- `stats`: `{ label, value }` from 0 to 100. These are self-assessed, and the UI says so.
- `languages`: `{ name, level }`.
- `achievements`: short strings for real-world wins (talks, awards, OSS).

### Experience timeline ("Story mode")

```ts
experience: [
  { kind: "work", title: "Senior Engineer", org: "Company", period: "2023 — Present", description: "…" },
  { kind: "education", title: "B.Sc. Computer Science", org: "University", period: "2015 — 2019", description: "…" },
]
```

List newest first. `kind: "education"` entries are tinted violet.

### Interests ("Beach Club")

`{ icon, title, text }`. Use an emoji for `icon`.

### Socials

`{ label, handle, url }`. Shown in the footer, Hire section, phone Social app and terminal. Delete any you don't use.

### Contact form mission types

`missionTypes: [{ id, label }]`. The `freelance` and `collab` ids also show a budget dropdown.

### SEO

The `seo` block feeds page titles, descriptions, social preview cards and structured data. See **[SEO.md](SEO.md)** for every field and the setup checklist. Also set `NEXT_PUBLIC_SITE_URL` in production.

---

## 2. Projects: `src/content/projects.ts`

```ts
{
  slug: "nexus-saas",            // URL: /projects/nexus-saas
  title: "Nexus SaaS",
  summary: "One or two sentences for the card.",
  description: `## The brief
Markdown case study…`,
  tech: ["Next.js", "TypeScript"],
  difficulty: "LEGENDARY",       // EASY | MEDIUM | HARD | LEGENDARY
  status: "COMPLETED",           // COMPLETED | IN_PROGRESS
  reward: 500,                   // XP shown on the card
  year: 2025,
  repoUrl: "https://github.com/…",   // or null
  liveUrl: "https://…",              // or null
  image: "/images/projects/nexus.png", // or null for generated art
  videoUrl: null,                // e.g. "/videos/nexus.mp4", shown on the case study page
  color: "#FF4F91",              // accent color
  featured: true,                // featured projects appear on the homepage (max 6)
  order: 1,                      // lower = first
}
```

**Screenshots:** put them in `public/images/projects/` and reference them as `/images/projects/file.png`. A 5:3 ratio (e.g. 1500×900) looks best. Without one, the card gets generated "app window" art in the project's accent color.

## 3. Skills: `src/content/skills.ts`

```ts
{ name: "React", branch: "frontend", tier: 2, level: 95, description: "Hooks, RSC, perf.", order: 2 }
```

- `branch` must match an `id` in `siteConfig.skillBranches`.
- `tier` runs from 1 (root, bottom of the branch) to 4 (mastery, top). Several skills can share a tier.
- To add or rename a branch, edit `skillBranches` (`id`, `label`, `color`, `icon`).

## 4. Blog: `src/content/posts.ts`

```ts
{ slug, title, excerpt, content /* Markdown */, tag: "DEV LOG", color: "#45C9FF", published: true, publishedAt: "2026-10-02T12:00:00.000Z" }
```

Delete every post to hide the homepage news section.

> Markdown is rendered with raw HTML escaped, so `<script>` and other tags show up as text.

---

## 5. Colors and fonts

Design tokens live at the top of `src/app/globals.css`:

```css
@theme {
  --color-pink: #ff4f91;
  --color-orange: #ff9d55;
  --color-ocean: #45c9ff;
  --color-midnight: #171329;
  --color-miami: #f5e9e2;
}
```

Sky palettes for each time of day are the `:root[data-time="…"]` blocks below that. Change the `--sky-*`, `--sun-*`, `--city*` and `--window` variables to restyle the hero.

Fonts load with `next/font/google` in `src/app/layout.tsx` (Anton for display, Inter for body, JetBrains Mono for the HUD). Swap them there.

## 6. The map

`mapLocations` in `src/config/site.ts`:

```ts
{ id: "about", name: "DOWNTOWN", label: "About me", icon: "🏙️", x: 470, y: 250, color: "#FF4F91" }
```

- `id` must match a section `id` on the homepage (`about`, `skills`, `missions`, `experience`, `interests`, `contact`).
- `x` and `y` are coordinates in the 1000×620 SVG viewBox.
- The coastline shape is the `LAND` path in `src/components/city-map/CityMap.tsx`. Replace it to draw your own island.

## 7. Radio

```ts
radio: [
  { id: "vice-fm", name: "VICE FM 88.1", genre: "Synthwave", type: "synth", preset: "synthwave" },
  { id: "mine", name: "MY MIX", genre: "House", type: "file", src: "/audio/my-mix.mp3" },
]
```

- `type: "synth"` stations are generated live. Presets: `synthwave`, `lofi`, `darkwave`. To tweak tempo, chords and drum patterns, edit `PRESETS` in `src/lib/radio-engine.ts`.
- `type: "file"` stations play (and loop) an audio file from `public/audio/`. **Only use music you have the rights to.**

The radio never autoplays. Browsers block that, and visitors would hate it anyway.

## 8. Loading screen

- Tips: `loadingTips` in `site.ts`.
- To disable it entirely, remove `<LoadingScreen />` from `src/app/(site)/page.tsx`.
- It shows once per browser session (`sessionStorage`), never for no-JS visitors, and only on the homepage.

## 9. Achievements

Defined in `src/config/achievements.ts`. To add one:

1. Add `{ id: "my-trophy", title, description, icon }`.
2. Trigger it anywhere inside the site with `useGame().unlock("my-trophy")`, or drop `<UnlockOnMount id="my-trophy" />` into a page.

## 10. Terminal commands

Commands are a plain object in `src/components/terminal/Terminal.tsx`:

```ts
mycommand: { desc: "Shown in help", run: (args) => print("Hello " + args.join(" ")) },
```

Add `hidden: true` to leave a command out of `help`.

## 11. Removing features

Every feature is a self-contained component:

| Remove | Delete from |
|---|---|
| Custom cursor | `<CustomCursor />` in `src/app/(site)/layout.tsx` |
| Film grain | `<div className="grain" />` in the same file |
| Radio mini player | `<MiniPlayer />` in the same file |
| Phone / terminal | `<Phone />` / `<Terminal />` in the same file |
| A homepage section | its line in `src/app/(site)/page.tsx` (also remove its `mapLocations` entry) |
| Admin | the `src/app/admin` and `src/app/api/admin` folders |

## 12. Updating the README screenshots

The images and GIFs in the README live in `docs/media/` and were captured from the placeholder content. After customizing, regenerate them so your README shows *your* site.

**Requirements:** Google Chrome installed, and [ffmpeg](https://ffmpeg.org/download.html) on your PATH (only for the GIF/MP4 step).

```bash
npm run build
npm start                    # keep this running in one terminal
```

In a second terminal:

```bash
npm run media:screenshots    # → docs/media/screenshots/*.jpg (desktop 1440×900 + mobile)
npm run media:video          # → docs/media/.raw/walkthrough.webm (scripted ~48 s tour)
npm run media:encode         # → docs/media/walkthrough.mp4, tour-explore.gif, tour-interact.gif
```

- The first `media:video` run may ask you to run `npx playwright-core install ffmpeg`. That's a small recorder binary Playwright needs.
- Point the scripts at another URL with `BASE_URL=https://your-site.dev npm run media:screenshots`.
- The tour is a plain Playwright script in `scripts/media/video.mjs`. Edit its steps if you changed sections or district names.
- If your tour timing changes, pass a new split point for the two GIFs: `npm run media:encode -- 25`.
- Keep each GIF under about 10 MB so GitHub renders it quickly. The film-grain overlay is hidden during recording because its noise makes GIFs huge.
