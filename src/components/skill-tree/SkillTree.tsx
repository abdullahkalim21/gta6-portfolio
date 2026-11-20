"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import type { Skill } from "@/lib/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useVisitOnView } from "@/components/sections/useVisitOnView";

export function SkillTree({ skills }: { skills: Skill[] }) {
  const ref = useVisitOnView<HTMLElement>("skills");
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());
  const [focus, setFocus] = useState<Skill | null>(null);

  const branches = useMemo(
    () =>
      siteConfig.skillBranches.map((b) => ({
        ...b,
        tiers: [1, 2, 3, 4]
          .map((t) => skills.filter((s) => s.branch === b.id && s.tier === t).sort((a, c) => a.order - c.order))
          .filter((t) => t.length > 0),
      })),
    [skills],
  );

  const reveal = (s: Skill) => {
    setFocus(s);
    setUnlocked((u) => (u.has(s.name) ? u : new Set(u).add(s.name)));
  };

  const focusBranch = siteConfig.skillBranches.find((b) => b.id === focus?.branch);

  return (
    <section ref={ref} id="skills" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeader
        kicker="💻 TECH DISTRICT — SKILLS"
        title="Skill"
        accent="tree"
        description="Hover or tab through the nodes to unlock them. Each branch grows from fundamentals to mastery."
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="font-hud text-xs text-[var(--muted)]">
          Skill points spent: <span className="text-gold">{unlocked.size}</span> / {skills.length}
        </p>
        <div className="glass min-h-[3.5rem] flex-1 rounded-xl px-4 py-2 sm:max-w-md" aria-live="polite">
          {focus ? (
            <div className="flex items-center gap-3">
              <span className="font-hud text-xl" style={{ color: focusBranch?.color }}>
                {focus.level}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{focus.name}</p>
                <p className="truncate text-xs text-[var(--muted)]">{focus.description}</p>
              </div>
            </div>
          ) : (
            <p className="py-2 text-sm text-[var(--muted)]">Select a skill to inspect it.</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {branches.map((b, bi) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: bi * 0.1 }}
            className="glass relative overflow-hidden rounded-2xl p-5"
          >
            <div className="absolute inset-x-0 top-0 h-1" style={{ background: b.color, boxShadow: `0 0 20px ${b.color}` }} />
            <p className="font-hud flex items-center gap-2 text-xs" style={{ color: b.color }}>
              <span aria-hidden>{b.icon}</span> {b.label}
            </p>

            <ol className="relative mt-6 flex flex-col-reverse gap-6">
              {/* trunk */}
              <span
                className="absolute bottom-6 left-1/2 top-6 w-0.5 -translate-x-1/2"
                style={{ background: `linear-gradient(to top, ${b.color}, transparent)` }}
                aria-hidden
              />
              {b.tiers.map((tier, ti) => (
                <li key={ti} className="relative flex flex-wrap justify-center gap-3">
                  <span className="font-hud absolute -left-1 top-1/2 -translate-y-1/2 text-[0.55rem] text-[var(--muted)] opacity-60" aria-hidden>
                    T{tier[0].tier}
                  </span>
                  {tier.map((s) => {
                    const on = unlocked.has(s.name);
                    return (
                      <button
                        key={s.name}
                        type="button"
                        onMouseEnter={() => reveal(s)}
                        onFocus={() => reveal(s)}
                        onClick={() => reveal(s)}
                        aria-label={`${s.name}, level ${s.level}. ${s.description}`}
                        className="group relative z-10 flex flex-col items-center"
                      >
                        <motion.span
                          animate={on ? { scale: [1, 1.25, 1], rotate: [45, 45, 45] } : { rotate: 45 }}
                          transition={{ duration: 0.45 }}
                          className="grid h-12 w-12 place-items-center rounded-lg border-2 transition-colors duration-300"
                          style={{
                            borderColor: on ? b.color : "rgba(255,255,255,.2)",
                            background: on ? `${b.color}33` : "rgba(13,10,28,.85)",
                            boxShadow: on ? `0 0 22px ${b.color}aa` : "none",
                          }}
                        >
                          <span className="-rotate-45 text-xs font-bold" style={{ color: on ? "#fff" : "rgba(255,255,255,.5)" }}>
                            {on ? s.level : "🔒"}
                          </span>
                        </motion.span>
                        <span
                          className="mt-3 max-w-[6.5rem] text-center text-xs font-semibold leading-tight transition-colors"
                          style={{ color: on ? "#fff" : "var(--muted)" }}
                        >
                          {s.name}
                        </span>
                      </button>
                    );
                  })}
                </li>
              ))}
            </ol>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
