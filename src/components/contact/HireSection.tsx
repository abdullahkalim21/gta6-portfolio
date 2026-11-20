"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { useVisitOnView } from "@/components/sections/useVisitOnView";
import { ContactForm } from "./ContactForm";

export function HireSection({ calendlyUrl }: { calendlyUrl: string }) {
  const ref = useVisitOnView<HTMLElement>("contact");
  const { player, socials } = siteConfig;

  return (
    <section ref={ref} id="contact" className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,79,145,.2),transparent_60%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_22rem]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass neon-border rounded-2xl p-6 sm:p-10"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-hud rounded bg-gold px-2 py-1 text-[0.6rem] font-bold text-[#0d0a1c]">NEW OPPORTUNITY</span>
            <span className={`font-hud flex items-center gap-1.5 text-[0.65rem] ${player.available ? "text-mint" : "text-orange"}`}>
              <span className={`h-2 w-2 rounded-full ${player.available ? "animate-pulse bg-mint" : "bg-orange"}`} />
              {player.available ? "AVAILABLE" : "BOOKED"}
            </span>
          </div>
          <p className="font-hud mt-6 text-xs text-pink">📞 SAFEHOUSE — CONTACT</p>
          <h2 className="font-display mt-2 text-5xl leading-[0.92] sm:text-7xl">
            Hire this <span className="text-sunset">developer</span>
          </h2>
          <p className="mt-3 text-lg text-[var(--muted)]">Got a project? Let&apos;s make something legendary.</p>
          <div className="mt-8">
            <ContactForm />
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-4"
          aria-label="Other ways to reach me"
        >
          <div className="glass rounded-2xl p-6">
            <p className="font-hud text-[0.65rem] text-[var(--muted)]">Status</p>
            <p className="mt-1 font-semibold">{player.availabilityText}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{player.location}</p>
          </div>
          <a href={player.resumeUrl} download className="glass group rounded-2xl p-6 transition hover:border-ocean/50">
            <p className="font-hud text-[0.65rem] text-ocean">Dossier</p>
            <p className="font-display mt-1 text-2xl">Download resume ↓</p>
            <p className="text-sm text-[var(--muted)]">PDF · always up to date</p>
          </a>
          {calendlyUrl && (
            <a href={calendlyUrl} target="_blank" rel="noreferrer" className="glass group rounded-2xl p-6 transition hover:border-pink/50">
              <p className="font-hud text-[0.65rem] text-pink">Meetup</p>
              <p className="font-display mt-1 text-2xl">Book a call ↗</p>
              <p className="text-sm text-[var(--muted)]">Pick a time that works for you</p>
            </a>
          )}
          <div className="glass rounded-2xl p-6">
            <p className="font-hud text-[0.65rem] text-[var(--muted)]">Direct line</p>
            <a href={`mailto:${player.email}`} className="mt-1 block break-all font-semibold hover:text-pink">
              {player.email}
            </a>
            <ul className="mt-4 flex flex-wrap gap-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.url} target="_blank" rel="noreferrer" className="chip hover:border-ocean hover:text-ocean">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
