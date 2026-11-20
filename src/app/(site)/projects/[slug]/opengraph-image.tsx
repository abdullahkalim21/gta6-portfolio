import { getProject, getProjects } from "@/lib/data";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Mission briefing";

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return renderOgImage({ kicker: "Mission not found", title: "404" });
  return renderOgImage({
    kicker: `Mission · ${project.year} · ${project.difficulty}`,
    title: project.title,
    subtitle: project.summary,
    chips: project.tech,
    accent: project.color,
    badge: `+${project.reward} XP`,
  });
}
