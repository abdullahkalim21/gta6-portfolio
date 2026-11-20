"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { useGame } from "@/components/providers/GameProvider";

type Status = { state: "idle" } | { state: "sending" } | { state: "sent" } | { state: "error"; message: string };

export function ContactForm({ compact = false }: { compact?: boolean }) {
  const { unlock } = useGame();
  const [mission, setMission] = useState<string>(siteConfig.missionTypes[0]?.id ?? "hello");
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const startedAt = useRef(Date.now());
  const uid = useId();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus({ state: "sending" });
    setFieldErrors({});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, missionType: mission, startedAt: startedAt.current }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string; fields?: Record<string, string> };
      if (!res.ok) {
        if (json.fields) setFieldErrors(json.fields);
        setStatus({ state: "error", message: json.error ?? "Something went wrong. Try again or email me directly." });
        return;
      }
      setStatus({ state: "sent" });
      unlock("contact");
      form.reset();
    } catch {
      setStatus({ state: "error", message: "Network error. Check your connection and try again." });
    }
  }

  if (status.state === "sent") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center" role="status">
        <p className="font-hud text-xs text-mint">TRANSMISSION RECEIVED</p>
        <p className="font-display mt-2 text-5xl text-sunset">Mission accepted</p>
        <p className="mx-auto mt-3 max-w-sm text-sm text-[var(--muted)]">Thanks for reaching out — I&apos;ll get back to you within a couple of days.</p>
        <button type="button" className="btn btn-ghost mt-6" onClick={() => setStatus({ state: "idle" })}>
          Send another
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <fieldset>
        <legend className="label">Select your mission</legend>
        <div className={`grid gap-2 ${compact ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4"}`}>
          {siteConfig.missionTypes.map((m) => (
            <label
              key={m.id}
              className={`relative cursor-pointer rounded-lg border px-3 py-3 text-sm transition ${
                mission === m.id ? "border-pink bg-pink/10 shadow-[0_0_18px_rgba(255,79,145,.3)]" : "border-white/10 bg-black/20 hover:border-white/30"
              }`}
            >
              <input
                type="radio"
                name="missionTypeChoice"
                value={m.id}
                checked={mission === m.id}
                onChange={() => setMission(m.id)}
                className="sr-only"
              />
              <span className="font-hud mr-1 text-[0.6rem] text-pink">{mission === m.id ? "▸" : "·"}</span>
              {m.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <Field label="Your name" id={`${uid}-name`} error={fieldErrors.name}>
          <input id={`${uid}-name`} name="name" required autoComplete="name" className="field" placeholder="Jane Doe" />
        </Field>
        <Field label="Email" id={`${uid}-email`} error={fieldErrors.email}>
          <input id={`${uid}-email`} name="email" type="email" required autoComplete="email" className="field" placeholder="jane@company.com" />
        </Field>
      </div>

      {(mission === "freelance" || mission === "collab") && !compact && (
        <Field label="Budget (optional)" id={`${uid}-budget`}>
          <select id={`${uid}-budget`} name="budget" className="field" defaultValue="">
            <option value="">Prefer not to say</option>
            <option>Under $5k</option>
            <option>$5k – $15k</option>
            <option>$15k – $50k</option>
            <option>$50k+</option>
          </select>
        </Field>
      )}

      <Field label="Mission briefing" id={`${uid}-message`} error={fieldErrors.message}>
        <textarea
          id={`${uid}-message`}
          name="message"
          required
          rows={compact ? 4 : 5}
          className="field resize-y"
          placeholder="Tell me about the project, timeline and team…"
        />
      </Field>

      {/* Honeypot: hidden from humans, irresistible to bots */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <AnimatePresence>
        {status.state === "error" && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-pink" role="alert">
            {status.message}
          </motion.p>
        )}
      </AnimatePresence>

      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={status.state === "sending"}>
        {status.state === "sending" ? "Transmitting…" : "Start conversation ▸"}
      </button>
    </form>
  );
}

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-pink">{error}</p>}
    </div>
  );
}
