/** Field definitions for the generic admin editor (safe to import on the client). */

export type FieldType = "text" | "textarea" | "markdown" | "number" | "checkbox" | "select" | "color" | "date" | "tags";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  help?: string;
}

export interface ResourceDef {
  id: "projects" | "skills" | "posts" | "messages";
  label: string;
  singular: string;
  titleField: string;
  subtitleField?: string;
  creatable: boolean;
  fields: FieldDef[];
  defaults: Record<string, unknown>;
}

export const adminResources: ResourceDef[] = [
  {
    id: "projects",
    label: "Missions",
    singular: "mission",
    titleField: "title",
    subtitleField: "slug",
    creatable: true,
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "slug", label: "Slug", type: "text", help: "URL: /projects/<slug>" },
      { name: "summary", label: "Summary", type: "textarea" },
      { name: "description", label: "Case study (Markdown)", type: "markdown" },
      { name: "tech", label: "Tech stack", type: "tags", help: "Comma separated" },
      { name: "difficulty", label: "Difficulty", type: "select", options: ["EASY", "MEDIUM", "HARD", "LEGENDARY"] },
      { name: "status", label: "Status", type: "select", options: ["COMPLETED", "IN_PROGRESS"] },
      { name: "reward", label: "Reward XP", type: "number" },
      { name: "year", label: "Year", type: "number" },
      { name: "repoUrl", label: "Repository URL", type: "text", placeholder: "https://github.com/…" },
      { name: "liveUrl", label: "Live URL", type: "text", placeholder: "https://…" },
      { name: "image", label: "Screenshot URL", type: "text", placeholder: "/images/projects/x.png or https://…", help: "Leave empty for generated art" },
      { name: "videoUrl", label: "Video URL", type: "text", placeholder: "/videos/demo.mp4" },
      { name: "color", label: "Accent color", type: "color" },
      { name: "featured", label: "Featured on homepage", type: "checkbox" },
      { name: "order", label: "Sort order", type: "number" },
    ],
    defaults: {
      title: "",
      slug: "",
      summary: "",
      description: "## The brief\n\n## What I built\n\n## Results\n",
      tech: [],
      difficulty: "MEDIUM",
      status: "COMPLETED",
      reward: 300,
      year: new Date().getFullYear(),
      repoUrl: "",
      liveUrl: "",
      image: "",
      videoUrl: "",
      color: "#FF4F91",
      featured: false,
      order: 0,
    },
  },
  {
    id: "skills",
    label: "Skills",
    singular: "skill",
    titleField: "name",
    subtitleField: "branch",
    creatable: true,
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "branch", label: "Branch", type: "select", options: [] /* filled from siteConfig.skillBranches */ },
      { name: "tier", label: "Tier (1 = root, 4 = mastery)", type: "number" },
      { name: "level", label: "Level (0–100)", type: "number" },
      { name: "description", label: "Description", type: "text" },
      { name: "order", label: "Sort order", type: "number" },
    ],
    defaults: { name: "", branch: "frontend", tier: 1, level: 80, description: "", order: 0 },
  },
  {
    id: "posts",
    label: "News",
    singular: "post",
    titleField: "title",
    subtitleField: "slug",
    creatable: true,
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "slug", label: "Slug", type: "text", help: "URL: /blog/<slug>" },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "content", label: "Content (Markdown)", type: "markdown" },
      { name: "tag", label: "Tag", type: "text", placeholder: "DEV LOG" },
      { name: "color", label: "Accent color", type: "color" },
      { name: "publishedAt", label: "Publish date", type: "date" },
      { name: "published", label: "Published", type: "checkbox" },
    ],
    defaults: { title: "", slug: "", excerpt: "", content: "", tag: "DEV LOG", color: "#45C9FF", published: true, publishedAt: new Date().toISOString() },
  },
  {
    id: "messages",
    label: "Inbox",
    singular: "message",
    titleField: "name",
    subtitleField: "email",
    creatable: false,
    fields: [{ name: "read", label: "Mark as read", type: "checkbox" }],
    defaults: {},
  },
];
