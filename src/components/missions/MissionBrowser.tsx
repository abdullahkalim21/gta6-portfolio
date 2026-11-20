"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/types";
import { MissionCard } from "./MissionCard";

export function MissionBrowser({ projects }: { projects: Project[] }) {
  const [tech, setTech] = useState<string>("ALL");
  const [status, setStatus] = useState<string>("ALL");
  const allTech = useMemo(() => Array.from(new Set(projects.flatMap((p) => p.tech))).sort(), [projects]);
  const list = projects.filter((p) => (tech === "ALL" || p.tech.includes(tech)) && (status === "ALL" || p.status === status));

  return (
    <div>
      <div className="glass mb-8 flex flex-col gap-4 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {[
            ["ALL", "All missions"],
            ["COMPLETED", "Completed"],
            ["IN_PROGRESS", "In progress"],
          ].map(([v, l]) => (
            <button
              key={v}
              type="button"
              aria-pressed={status === v}
              onClick={() => setStatus(v)}
              className={`chip !px-3 !py-1.5 transition ${status === v ? "!border-pink !bg-pink/20 text-white" : "hover:border-white/30"}`}
            >
              {l}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <span className="font-hud text-[0.65rem] text-[var(--muted)]">Tech</span>
          <select value={tech} onChange={(e) => setTech(e.target.value)} className="field !w-auto !py-2">
            <option value="ALL">Any</option>
            {allTech.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      {list.length === 0 ? (
        <p className="py-16 text-center text-[var(--muted)]">No missions match those filters.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <MissionCard key={p.slug} project={p} index={projects.indexOf(p)} />
          ))}
        </div>
      )}
    </div>
  );
}
