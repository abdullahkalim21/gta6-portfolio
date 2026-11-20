"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useVisitOnView } from "./useVisitOnView";

export function StorySection() {
  const ref = useVisitOnView<HTMLElement>("experience");
  const entries = siteConfig.experience;

  return (
    <section ref={ref} id="experience" className="relative mx-auto max-w-5xl px-4 py-24 sm:px-6">
      <SectionHeader
        kicker="🎓 UNIVERSITY — EXPERIENCE & EDUCATION"
        title="Story"
        accent="mode"
        description="The main storyline so far. Chapters are listed newest first."
      />

      <ol className="relative border-l border-white/10 pl-8 sm:pl-12">
        {entries.map((e, i) => {
          const color = e.kind === "education" ? "var(--color-violet)" : "var(--color-pink)";
          return (
            <motion.li
              key={`${e.org}-${e.period}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.05 }}
              className="relative pb-10 last:pb-0"
            >
              <span
                className="absolute -left-[2.55rem] top-1 grid h-5 w-5 place-items-center rounded-full border-2 bg-[var(--bg)] sm:-left-[3.55rem]"
                style={{ borderColor: color, boxShadow: `0 0 14px ${color}` }}
                aria-hidden
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
              </span>
              <div className="glass rounded-xl p-5 transition hover:border-white/25 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-hud text-[0.65rem]" style={{ color }}>
                    Chapter {entries.length - i} · {e.kind === "education" ? "Education" : "Work"}
                  </p>
                  <p className="font-hud text-[0.65rem] text-[var(--muted)]">{e.period}</p>
                </div>
                <h3 className="font-display mt-2 text-3xl leading-tight">{e.title}</h3>
                <p className="text-sm font-semibold text-ocean">{e.org}</p>
                <p className="mt-3 text-[var(--muted)]">{e.description}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
