import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjects } from "@/lib/data";
import { renderMarkdown } from "@/lib/markdown";
import { MissionArt } from "@/components/ui/MissionArt";
import { UnlockOnMount } from "@/components/easter-eggs/UnlockOnMount";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject((await params).slug);
  if (!project) return { title: "Mission not found" };
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  if (!project) notFound();
  const next = projects[(index + 1) % projects.length];
  const done = project.status === "COMPLETED";

  return (
    <article className="pb-24 pt-24">
      <UnlockOnMount id="mission-briefing" />
      <div className="relative h-[46vh] min-h-[320px] overflow-hidden">
        <MissionArt title={project.title} color={project.color} image={project.image} />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/75 to-[var(--bg)]/20" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-5xl px-4 pb-8 sm:px-6">
          <Link href="/projects" className="font-hud text-xs text-[var(--muted)] hover:text-white">
            ‹ All missions
          </Link>
          <p className="font-hud mt-4 text-xs" style={{ color: project.color }}>
            MISSION #{String(index + 1).padStart(3, "0")} · {project.year}
          </p>
          <h1 className="font-display text-6xl leading-none sm:text-8xl">{project.title}</h1>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_17rem]">
        <div>
          <p className="text-xl text-white">{project.summary}</p>
          {project.videoUrl && (
            <video src={project.videoUrl} controls className="mt-8 w-full rounded-xl border border-white/10" preload="metadata" />
          )}
          <div className="prose-vice mt-6" dangerouslySetInnerHTML={{ __html: renderMarkdown(project.description) }} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="glass rounded-xl p-5">
            <p
              className="font-hud inline-block rounded px-2 py-1 text-[0.6rem] font-bold text-[#0d0a1c]"
              style={{ background: done ? "#5cf2b4" : "#ffe066" }}
            >
              {done ? "MISSION COMPLETED" : "IN PROGRESS"}
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--muted)]">Difficulty</dt>
                <dd className="font-semibold">{project.difficulty}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--muted)]">Reward</dt>
                <dd className="font-semibold" style={{ color: project.color }}>
                  +{project.reward} XP
                </dd>
              </div>
              <div>
                <dt className="mb-2 text-[var(--muted)]">Loadout</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary w-full">
              Live demo ↗
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn btn-ghost w-full">
              Source code ↗
            </a>
          )}
        </aside>
      </div>

      {next && next.slug !== project.slug && (
        <div className="mx-auto mt-20 max-w-5xl px-4 sm:px-6">
          <Link href={`/projects/${next.slug}`} className="glass group block rounded-2xl p-6 transition hover:border-pink/50 sm:p-8">
            <p className="font-hud text-xs text-[var(--muted)]">Next mission ▸</p>
            <p className="font-display mt-1 text-4xl group-hover:text-pink sm:text-5xl">{next.title}</p>
          </Link>
        </div>
      )}
    </article>
  );
}
