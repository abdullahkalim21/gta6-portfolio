"use client";

import Link from "next/link";
import type { Project } from "@/lib/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useVisitOnView } from "@/components/sections/useVisitOnView";
import { MissionCard } from "./MissionCard";

export function MissionsSection({ projects }: { projects: Project[] }) {
  const ref = useVisitOnView<HTMLElement>("missions");
  const featured = projects.filter((p) => p.featured);
  const list = (featured.length ? featured : projects).slice(0, 6);
  const totalXp = projects.reduce((sum, p) => sum + p.reward, 0);
  const completed = projects.filter((p) => p.status === "COMPLETED").length;

  return (
    <section ref={ref} id="missions" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeader
          kicker="🏢 BUSINESS BAY — PROJECTS"
          title="Mission"
          accent="log"
          description="Every project is a mission: a brief, a plan, a stack and a result."
        />
        <dl className="glass mb-10 grid grid-cols-3 gap-6 rounded-xl px-5 py-4 sm:mb-14">
          <Stat label="Missions" value={String(projects.length)} />
          <Stat label="Completed" value={String(completed)} />
          <Stat label="Total XP" value={totalXp.toLocaleString("en-US")} />
        </dl>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => (
          <MissionCard key={p.slug} project={p} index={i} />
        ))}
      </div>

      {projects.length > list.length && (
        <div className="mt-10 text-center">
          <Link href="/projects" className="btn btn-ghost">
            View all {projects.length} missions ▸
          </Link>
        </div>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-hud text-[0.6rem] text-[var(--muted)]">{label}</dt>
      <dd className="font-display text-3xl">{value}</dd>
    </div>
  );
}
