/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  VICE.DEV — SITE CONFIG                                       ║
 * ║  This is the main file to edit when you fork the template.   ║
 * ║  Projects, skills and blog posts live in src/content/.       ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

export const siteConfig = {
  /** Brand shown in the navbar, HUD and loading screen. */
  brand: "VICE.DEV",
  /** Name of your fictional city. Shows up on the map + loading screen. */
  cityName: "VICE SHORES",

  player: {
    firstName: "Alex",
    lastName: "Rivera",
    /** Big subtitle under your name in the hero. */
    role: "FULL STACK DEVELOPER | DIGITAL CREATOR",
    tagline: "WELCOME TO MY WORLD.",
    intro:
      "I'm Alex — a developer building digital experiences, one mission at a time.",
    location: "Miami, FL · Remote friendly",
    /** Optional avatar image (e.g. "/images/avatar.jpg"). Leave empty for a generated one. */
    avatar: "",
    email: "hello@example.com",
    /** Shown in the phone Contacts app. Leave empty to hide. */
    phone: "",
    /** Path to your resume inside /public. Replace public/resume.pdf with your own. */
    resumeUrl: "/resume.pdf",
    /** Availability indicator in the Hire section + HUD. */
    available: true,
    availabilityText: "Open to freelance & full-time missions",
    timezone: "America/New_York",
  },

  /** The game-style HUD in the hero corner. Purely for fun — set whatever you like. */
  hud: {
    level: 99,
    xp: 92,
    currentMission: "BUILD SOMETHING GREAT",
    cash: "$1,337,000",
  },

  /** Long-form bio shown in the Character section. Each string is a paragraph. */
  bio: [
    "I'm a full stack developer who treats every product like an open world: there's a main storyline (ship value), side quests (performance, accessibility, DX) and a lot of hidden details worth discovering.",
    "Over the last 6+ years I've built SaaS platforms, real-time dashboards and e-commerce experiences for startups and agencies. I love TypeScript, design systems and making interfaces that feel alive.",
  ],

  /** Character stats panel. These are self-assessed values, not measurements. */
  stats: [
    { label: "Frontend development", value: 95 },
    { label: "Backend development", value: 85 },
    { label: "UI / UX", value: 80 },
    { label: "Problem solving", value: 90 },
    { label: "Teamwork", value: 88 },
  ],

  languages: [
    { name: "English", level: "Native" },
    { name: "Spanish", level: "Fluent" },
    { name: "Portuguese", level: "Conversational" },
  ],

  /** Story-mode timeline: work + education. Newest first. */
  experience: [
    {
      kind: "work",
      title: "Senior Full Stack Engineer",
      org: "Neon Labs",
      period: "2023 — Present",
      description:
        "Leading a squad building a real-time analytics platform with Next.js, tRPC and PostgreSQL. Cut dashboard load time by 63%.",
    },
    {
      kind: "work",
      title: "Frontend Engineer",
      org: "Sunset Digital Agency",
      period: "2020 — 2023",
      description:
        "Shipped 30+ marketing sites and web apps for clients in fashion, music and hospitality. Built the agency's component library.",
    },
    {
      kind: "work",
      title: "Junior Developer",
      org: "Ocean Drive Startups",
      period: "2019 — 2020",
      description: "Full stack work on a booking platform. First taste of production pagers at 3am.",
    },
    {
      kind: "education",
      title: "B.Sc. Computer Science",
      org: "Vice Shores University",
      period: "2015 — 2019",
      description: "Focus on human-computer interaction and distributed systems. Graduated with honours.",
    },
  ] as { kind: "work" | "education"; title: string; org: string; period: string; description: string }[],

  /** Personal achievements shown in the Character section. */
  achievements: [
    "Speaker at Neon JS Conf 2025",
    "1st place — Sunrise Hackathon 2024",
    "Open-source maintainer (2k+ GitHub stars)",
  ],

  /** Beach Club — things you do when you're off the clock. */
  interests: [
    { icon: "🌴", title: "Street photography", text: "Chasing golden hour and neon reflections." },
    { icon: "🎧", title: "Synthwave production", text: "Making retro tracks on weekends." },
    { icon: "🏄", title: "Surfing", text: "Bad at it. Love it anyway." },
    { icon: "🎮", title: "Open-world games", text: "Hundreds of hours of side quests." },
    { icon: "☕", title: "Coffee nerd", text: "Pour-over, always." },
    { icon: "📚", title: "Sci-fi novels", text: "Gibson, Stephenson, Le Guin." },
  ],

  /** Skill tree branches. Skills themselves live in src/content/skills.ts (or the DB). */
  skillBranches: [
    { id: "frontend", label: "FRONTEND", color: "#FF4F91", icon: "◆" },
    { id: "backend", label: "BACKEND", color: "#45C9FF", icon: "▲" },
    { id: "devops", label: "DEVOPS", color: "#FF9D55", icon: "●" },
    { id: "design", label: "DESIGN", color: "#B583FF", icon: "■" },
  ],

  /** Social links (phone Social app, footer, terminal). Remove any you don't use. */
  socials: [
    { label: "GitHub", handle: "@alexrivera", url: "https://github.com/" },
    { label: "LinkedIn", handle: "in/alexrivera", url: "https://www.linkedin.com/" },
    { label: "X", handle: "@alexrivera", url: "https://x.com/" },
  ],

  /** Options in the "Select your mission" picker on the contact form. */
  missionTypes: [
    { id: "freelance", label: "Freelance project" },
    { id: "fulltime", label: "Full-time opportunity" },
    { id: "collab", label: "Collaboration" },
    { id: "hello", label: "Just saying hello" },
  ],

  /** Loading-screen tips. Shown at random. */
  loadingTips: [
    "TIP: Press ` (backtick) anywhere to open the developer terminal.",
    "TIP: Visit every map location to unlock the Explorer achievement.",
    "TIP: Your phone has apps. Some of them are useful.",
    "TIP: Try switching the city to night mode and turning on the rain.",
    "TIP: There are secret locations in this city. Some respond to old-school codes.",
    "TIP: Recruiters can skip straight to the Missions. We won't tell.",
  ],

  /**
   * Radio stations. type "synth" stations are generated live in the browser
   * (no audio files, no copyright worries). To use your own music, add
   * { id, name, genre, type: "file", src: "/audio/your-track.mp3" } and drop
   * the mp3 in public/audio/.
   */
  radio: [
    { id: "vice-fm", name: "VICE FM 88.1", genre: "Synthwave", type: "synth", preset: "synthwave" },
    { id: "lagoon", name: "LO-FI LAGOON", genre: "Chill beats", type: "synth", preset: "lofi" },
    { id: "night-drive", name: "NIGHT DRIVE 104", genre: "Darkwave", type: "synth", preset: "darkwave" },
  ] as RadioStation[],

  seo: {
    title: "Alex Rivera — Full Stack Developer",
    description:
      "An open-world developer portfolio. Explore the city, take on missions and meet the developer behind them.",
    keywords: ["developer", "portfolio", "full stack", "next.js", "react", "typescript"],
  },
};

export type RadioStation =
  | { id: string; name: string; genre: string; type: "synth"; preset: "synthwave" | "lofi" | "darkwave" }
  | { id: string; name: string; genre: string; type: "file"; src: string };

export const fullName = `${siteConfig.player.firstName} ${siteConfig.player.lastName}`;

/** Map locations — each is a section of the homepage. Coordinates are in the 1000×620 map viewBox. */
export const mapLocations = [
  { id: "about", name: "DOWNTOWN", label: "About me", icon: "🏙️", x: 470, y: 250, color: "#FF4F91" },
  { id: "skills", name: "TECH DISTRICT", label: "Skills & tech", icon: "💻", x: 640, y: 190, color: "#45C9FF" },
  { id: "missions", name: "BUSINESS BAY", label: "Projects", icon: "🏢", x: 330, y: 370, color: "#FF9D55" },
  { id: "experience", name: "UNIVERSITY", label: "Experience & education", icon: "🎓", x: 250, y: 180, color: "#B583FF" },
  { id: "interests", name: "BEACH CLUB", label: "Personal interests", icon: "🌴", x: 735, y: 420, color: "#5CF2B4" },
  { id: "contact", name: "SAFEHOUSE", label: "Contact", icon: "📞", x: 545, y: 470, color: "#FFE066" },
] as const;

export type MapLocationId = (typeof mapLocations)[number]["id"];
