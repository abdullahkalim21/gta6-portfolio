"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { MissionArt } from "@/components/ui/MissionArt";

const difficultyStars: Record<string, number> = { EASY: 1, MEDIUM: 2, HARD: 3, LEGENDARY: 4 };

export function MissionCard({ project, index }: { project: Project; index: number }) {
  const done = project.status === "COMPLETED";
  const stars = difficultyStars[project.difficulty] ?? 2;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: (index % 3) * 0.08, duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="glass group relative flex flex-col overflow-hidden rounded-2xl"
      style={{ boxShadow: `0 0 0 1px ${project.color}22` }}
    >
      <div className="relative aspect-[5/3] overflow-hidden">
        <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
          <MissionArt title={project.title} color={project.color} image={project.image} />
        </div>
        <div className="absolute left-3 top-3 flex gap-2">
          <span
            className="font-hud rounded-md px-2 py-1 text-[0.6rem] font-bold"
            style={{ background: done ? "rgba(92,242,180,.9)" : "rgba(255,224,102,.9)", color: "#0d0a1c" }}
          >
            {done ? "✓ MISSION COMPLETED" : "◐ IN PROGRESS"}
          </span>
        </div>
        <span className="font-hud absolute right-3 top-3 rounded-md bg-black/50 px-2 py-1 text-[0.6rem]">
          #{String(index + 1).padStart(3, "0")}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between">
          <p className="font-hud text-[0.6rem] text-[var(--muted)]">
            Mission #{String(index + 1).padStart(3, "0")} · {project.year}
          </p>
          <p className="text-xs" aria-label={`Difficulty: ${project.difficulty}`} title={project.difficulty}>
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} style={{ color: i < stars ? project.color : "rgba(255,255,255,.15)" }}>
                ◆
              </span>
            ))}
          </p>
        </div>
        <h3 className="font-display mt-2 text-3xl leading-none">
          <span className="text-[var(--muted)]">Project: </span>
          {project.title}
        </h3>
        <p className="mt-3 flex-1 text-sm text-[var(--muted)]">{project.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tech stack">
          {project.tech.map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-white/10 pt-4">
          <p className="font-hud whitespace-nowrap text-xs" style={{ color: project.color }}>
            Reward: +{project.reward} XP
          </p>
          <div className="flex items-center gap-3 whitespace-nowrap">
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noreferrer" className="relative z-10 text-xs text-[var(--muted)] hover:text-white" aria-label={`${project.title} source code`}>
                Code
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="relative z-10 text-xs text-[var(--muted)] hover:text-white" aria-label={`${project.title} live demo`}>
                Live
              </a>
            )}
            <Link href={`/projects/${project.slug}`} className="font-hud text-xs font-bold text-white after:absolute after:inset-0 hover:text-pink">
              View mission ↗
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
