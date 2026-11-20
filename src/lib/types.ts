export type Difficulty = "EASY" | "MEDIUM" | "HARD" | "LEGENDARY";
export type ProjectStatus = "COMPLETED" | "IN_PROGRESS";

export interface Project {
  id?: string;
  slug: string;
  title: string;
  summary: string;
  /** Markdown case study rendered on /projects/[slug]. */
  description: string;
  tech: string[];
  difficulty: Difficulty | string;
  status: ProjectStatus | string;
  reward: number;
  year: number;
  repoUrl?: string | null;
  liveUrl?: string | null;
  /** Optional screenshot URL (e.g. /images/projects/nexus.png). Generated art is used when empty. */
  image?: string | null;
  videoUrl?: string | null;
  /** Accent color for the mission card + generated art. */
  color: string;
  featured: boolean;
  order: number;
}

export interface Skill {
  id?: string;
  name: string;
  /** Must match a branch id in siteConfig.skillBranches. */
  branch: string;
  /** 1 = root of the branch, 4 = mastery. Controls position in the tree. */
  tier: number;
  /** 0–100 proficiency shown on hover. */
  level: number;
  description: string;
  order: number;
}

export interface Post {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Markdown. */
  content: string;
  tag: string;
  color: string;
  published: boolean;
  publishedAt: string; // ISO date
}

export interface Message {
  id: string;
  name: string;
  email: string;
  missionType: string;
  budget?: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}
