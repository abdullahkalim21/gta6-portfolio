"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { achievements } from "@/config/achievements";
import { useGame } from "@/components/providers/GameProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useVisitOnView } from "./useVisitOnView";

export function BeachClubSection() {
  const ref = useVisitOnView<HTMLElement>("interests");
  const { unlocked } = useGame();

  return (
    <section ref={ref} id="interests" className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(92,242,180,.12),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          kicker="🌴 BEACH CLUB — OFF THE CLOCK"
          title="Side"
          accent="quests"
          description="What I get up to when the laptop is closed."
        />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.interests.map((it, i) => (
            <motion.li
              key={it.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ rotate: i % 2 ? 1 : -1, y: -4 }}
              className="glass flex items-start gap-4 rounded-xl p-5"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white/5 text-2xl" aria-hidden>
                {it.icon}
              </span>
              <div>
                <h3 className="font-semibold">{it.title}</h3>
                <p className="text-sm text-[var(--muted)]">{it.text}</p>
              </div>
            </motion.li>
          ))}
        </ul>

        <div className="glass mt-12 rounded-2xl p-6 sm:p-8">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-display text-3xl">
              Your <span className="text-gold">trophies</span>
            </h3>
            <p className="font-hud text-xs text-[var(--muted)]">
              {unlocked.size} / {achievements.length} unlocked · saved in your browser
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {achievements.map((a) => {
              const on = unlocked.has(a.id);
              return (
                <li
                  key={a.id}
                  className="rounded-lg border p-3 transition"
                  style={{
                    borderColor: on ? "rgba(255,224,102,.5)" : "rgba(255,255,255,.08)",
                    background: on ? "rgba(255,224,102,.08)" : "rgba(0,0,0,.2)",
                  }}
                >
                  <p className="text-2xl" style={{ filter: on ? "none" : "grayscale(1) opacity(.35)" }} aria-hidden>
                    {a.icon}
                  </p>
                  <p className="mt-1 text-sm font-semibold" style={{ color: on ? "#fff" : "var(--muted)" }}>
                    {on ? a.title : "???"}
                  </p>
                  <p className="text-xs text-[var(--muted)]">{on ? a.description : "Keep exploring."}</p>
                  <span className="sr-only">{on ? "Unlocked" : "Locked"}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
