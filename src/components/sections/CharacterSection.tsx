"use client";

import { motion } from "framer-motion";
import { siteConfig, fullName } from "@/config/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useVisitOnView } from "./useVisitOnView";

export function CharacterSection() {
  const ref = useVisitOnView<HTMLElement>("about");
  const { player, bio, stats, languages, achievements } = siteConfig;

  return (
    <section ref={ref} id="about" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6" aria-labelledby="about-title">
      <SectionHeader kicker="🏙️ DOWNTOWN — ABOUT ME" title="Meet the" accent="developer" />
      <h3 id="about-title" className="sr-only">About {fullName}</h3>

      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        {/* Character card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass neon-border relative overflow-hidden rounded-2xl"
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-pink/30 via-violet/20 to-transparent">
            {player.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={player.avatar} alt={fullName} className="h-full w-full object-cover" />
            ) : (
              <AvatarSilhouette />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--bg)] to-transparent p-5 pt-16">
              <p className="font-hud text-[0.65rem] text-ocean">PROTAGONIST</p>
              <p className="font-display text-4xl leading-none">{fullName}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{player.location}</p>
            </div>
          </div>
          <div className="space-y-4 p-5">
            <div>
              <p className="label">Languages</p>
              <ul className="flex flex-wrap gap-2">
                {languages.map((l) => (
                  <li key={l.name} className="chip">
                    {l.name} <span className="ml-1 opacity-50">· {l.level}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label">Achievements</p>
              <ul className="space-y-1.5 text-sm">
                {achievements.map((a) => (
                  <li key={a} className="flex gap-2">
                    <span className="text-gold" aria-hidden>
                      ★
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6 sm:p-8"
          >
            <p className="font-hud mb-4 text-xs text-[var(--muted)]">Bio</p>
            <div className="space-y-4 text-lg leading-relaxed">
              {bio.map((p, i) => (
                <p key={i} className={i === 0 ? "text-white" : "text-[var(--muted)]"}>
                  {p}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 sm:p-8"
          >
            <div className="mb-6 flex items-baseline justify-between">
              <p className="font-hud text-xs text-[var(--muted)]">Character stats</p>
              <p className="font-hud text-[0.6rem] text-[var(--muted)] opacity-60">self-assessed</p>
            </div>
            <ul className="space-y-5">
              {stats.map((s, i) => (
                <li key={s.label}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-semibold">{s.label}</span>
                    <span className="font-hud text-ocean">{s.value}</span>
                  </div>
                  <div
                    className="flex gap-1"
                    role="meter"
                    aria-label={s.label}
                    aria-valuenow={s.value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    {Array.from({ length: 20 }).map((_, seg) => {
                      const filled = seg < Math.round(s.value / 5);
                      return (
                        <motion.span
                          key={seg}
                          className="h-2.5 flex-1 rounded-[2px]"
                          initial={{ opacity: 0.15 }}
                          whileInView={{ opacity: filled ? 1 : 0.15 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.08 + seg * 0.025 }}
                          style={{
                            background: filled ? `linear-gradient(90deg, var(--color-pink), var(--color-orange))` : "rgba(255,255,255,.4)",
                          }}
                        />
                      );
                    })}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AvatarSilhouette() {
  return (
    <svg viewBox="0 0 400 500" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="av-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff9d55" />
          <stop offset="0.6" stopColor="#ff4f91" />
          <stop offset="1" stopColor="#2a1250" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#av-bg)" />
      <circle cx="200" cy="200" r="120" fill="#ffe066" opacity="0.5" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x="0" y={215 + i * 22} width="400" height={3 + i * 2} fill="#ff4f91" opacity="0.7" />
      ))}
      <g fill="#120a22">
        <ellipse cx="200" cy="190" rx="62" ry="74" />
        <path d="M138 170 C 140 110, 260 100, 266 170 C 250 140, 160 135, 138 170 Z" />
        <rect x="178" y="250" width="44" height="50" />
        <path d="M60 500 C 60 380, 120 300, 200 300 C 280 300, 340 380, 340 500 Z" />
      </g>
      <rect x="150" y="178" width="100" height="22" rx="8" fill="#45c9ff" opacity="0.9" />
      <rect x="150" y="178" width="100" height="6" rx="3" fill="#fff" opacity="0.5" />
    </svg>
  );
}
