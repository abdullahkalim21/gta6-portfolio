"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig, fullName } from "@/config/site";
import { achievements } from "@/config/achievements";
import { useGame, type TimeOfDay, type Weather } from "@/components/providers/GameProvider";
import { useRadio } from "@/components/providers/RadioProvider";
import { Equalizer } from "@/components/hud/MiniPlayer";
import { MissionArt } from "@/components/ui/MissionArt";
import { ContactForm } from "@/components/contact/ContactForm";
import { formatDate } from "@/lib/format";

export interface PhoneProject {
  slug: string;
  title: string;
  summary: string;
  color: string;
  image?: string | null;
  tech: string[];
}
export interface PhonePost {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  color: string;
  publishedAt: string;
}

type AppId = "contacts" | "gallery" | "social" | "browser" | "email" | "music" | "trophies" | "settings" | "terminal" | "map";

const apps: { id: AppId; label: string; icon: string; bg: string }[] = [
  { id: "contacts", label: "Contacts", icon: "👤", bg: "linear-gradient(135deg,#5cf2b4,#2bb98a)" },
  { id: "gallery", label: "Gallery", icon: "🖼️", bg: "linear-gradient(135deg,#ff9d55,#ff4f91)" },
  { id: "social", label: "Social", icon: "💬", bg: "linear-gradient(135deg,#45c9ff,#3b6cff)" },
  { id: "browser", label: "Browser", icon: "🌐", bg: "linear-gradient(135deg,#b583ff,#6b3bff)" },
  { id: "email", label: "Email", icon: "✉️", bg: "linear-gradient(135deg,#ff4f91,#c2185b)" },
  { id: "music", label: "Music", icon: "🎵", bg: "linear-gradient(135deg,#ffe066,#ff9d55)" },
  { id: "trophies", label: "Trophies", icon: "🏆", bg: "linear-gradient(135deg,#ffe066,#c9a400)" },
  { id: "map", label: "Map", icon: "🗺️", bg: "linear-gradient(135deg,#5cf2b4,#45c9ff)" },
  { id: "terminal", label: "Terminal", icon: ">_", bg: "linear-gradient(135deg,#2a2a3a,#0d0a1c)" },
  { id: "settings", label: "Settings", icon: "⚙️", bg: "linear-gradient(135deg,#8a8aa3,#4b4b63)" },
];

export function Phone({ projects, posts, calendlyUrl }: { projects: PhoneProject[]; posts: PhonePost[]; calendlyUrl: string }) {
  const { phoneOpen, setPhoneOpen, setTerminalOpen, unlocked } = useGame();
  const [app, setApp] = useState<AppId | null>(null);
  const [clock, setClock] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const t = window.setInterval(tick, 30000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (!phoneOpen) return;
    const prev = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !panel.current) return;
      const els = panel.current.querySelectorAll<HTMLElement>("a,button,input,textarea,select,[tabindex]:not([tabindex='-1'])");
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.removeEventListener("keydown", trap);
      prev?.focus?.();
    };
  }, [phoneOpen]);

  const close = () => setPhoneOpen(false);

  const openApp = (id: AppId) => {
    if (id === "terminal") {
      close();
      setTerminalOpen(true);
      return;
    }
    if (id === "map") {
      close();
      router.push("/#map");
      return;
    }
    setApp(id);
  };

  const current = apps.find((a) => a.id === app);
  const newTrophies = unlocked.size;

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setPhoneOpen(true)}
        whileHover={{ scale: 1.08, rotate: -6 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-4 right-4 z-50 grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-gradient-to-br from-[#2a1748] to-[#0d0a1c] text-2xl shadow-[0_0_24px_rgba(255,79,145,.45)]"
        aria-label="Open smartphone"
        aria-haspopup="dialog"
      >
        📱
        {newTrophies > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-pink px-1 text-[0.6rem] font-bold text-white">
            {newTrophies}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {phoneOpen && (
          <motion.div
            className="fixed inset-0 z-[85] flex items-end justify-center bg-black/50 p-3 backdrop-blur-sm sm:items-center sm:justify-end sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              ref={panel}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label="Smartphone"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 120, rotate: 6, opacity: 0 }}
              animate={{ y: 0, rotate: 0, opacity: 1 }}
              exit={{ y: 140, rotate: 4, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="relative flex h-[min(680px,88svh)] w-[min(340px,100%)] flex-col overflow-hidden rounded-[2.6rem] border-[6px] border-[#1d1830] bg-[#0d0a1c] shadow-[0_30px_80px_rgba(0,0,0,.6),0_0_40px_rgba(255,79,145,.25)] outline-none"
            >
              {/* Wallpaper */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,#ffe066_0,#ff9d55_12%,#ff4f91_30%,#2a1250_62%,#0d0a1c_90%)] opacity-90" />
              <div className="absolute inset-0 bg-black/20" />

              {/* Status bar */}
              <div className="relative z-10 flex items-center justify-between px-6 pb-1 pt-3 text-[0.7rem] font-semibold">
                <span>{clock}</span>
                <span className="h-5 w-20 rounded-full bg-black" aria-hidden />
                <span aria-hidden>▂▄▆ 🔋</span>
              </div>

              <div className="relative z-10 flex min-h-0 flex-1 flex-col">
                <AnimatePresence mode="wait" initial={false}>
                  {!current ? (
                    <motion.div
                      key="home"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-1 flex-col px-5 pt-6"
                    >
                      <p className="font-display text-5xl leading-none drop-shadow">{clock}</p>
                      <p className="font-hud mt-1 text-[0.6rem] text-white/80">{siteConfig.cityName}</p>
                      <ul className="mt-8 grid grid-cols-4 gap-x-3 gap-y-5">
                        {apps.map((a) => (
                          <li key={a.id}>
                            <button type="button" onClick={() => openApp(a.id)} className="group flex w-full flex-col items-center gap-1.5">
                              <span
                                className="grid h-14 w-14 place-items-center rounded-2xl text-2xl shadow-lg transition group-hover:scale-110 group-focus-visible:scale-110"
                                style={{ background: a.bg }}
                                aria-hidden
                              >
                                {a.id === "terminal" ? <span className="font-mono text-base font-bold text-mint">&gt;_</span> : a.icon}
                              </span>
                              <span className="text-[0.65rem] font-medium drop-shadow">{a.label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={current.id}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      className="flex min-h-0 flex-1 flex-col bg-[#120d26]/95"
                    >
                      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                        <button type="button" onClick={() => setApp(null)} className="text-sm text-ocean" aria-label="Back to home screen">
                          ‹ Home
                        </button>
                        <p className="flex-1 text-center text-sm font-semibold">{current.label}</p>
                        <span className="w-12" />
                      </div>
                      <div className="min-h-0 flex-1 overflow-y-auto p-4">
                        {app === "contacts" && <ContactsApp calendlyUrl={calendlyUrl} />}
                        {app === "gallery" && <GalleryApp projects={projects} onNavigate={close} />}
                        {app === "social" && <SocialApp />}
                        {app === "browser" && <BrowserApp posts={posts} onNavigate={close} />}
                        {app === "email" && <ContactForm compact />}
                        {app === "music" && <MusicApp />}
                        {app === "trophies" && <TrophiesApp />}
                        {app === "settings" && <SettingsApp />}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Home bar */}
              <button
                type="button"
                onClick={() => (app ? setApp(null) : close())}
                className="relative z-10 mx-auto my-2 h-1.5 w-28 rounded-full bg-white/70"
                aria-label={app ? "Go to home screen" : "Close phone"}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ContactsApp({ calendlyUrl }: { calendlyUrl: string }) {
  const { player } = siteConfig;
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-pink to-orange font-display text-3xl">
          {player.firstName[0]}
          {player.lastName[0]}
        </div>
        <p className="mt-3 text-lg font-semibold">{fullName}</p>
        <p className="text-xs text-[var(--muted)]">{player.role}</p>
      </div>
      <ul className="divide-y divide-white/10 rounded-xl bg-white/5">
        <ContactRow label="email" value={player.email} href={`mailto:${player.email}`} />
        {player.phone && <ContactRow label="mobile" value={player.phone} href={`tel:${player.phone}`} />}
        <ContactRow label="resume" value="Download PDF" href={player.resumeUrl} download />
        {calendlyUrl && <ContactRow label="calendar" value="Book a call" href={calendlyUrl} external />}
        <ContactRow label="location" value={player.location} />
      </ul>
    </div>
  );
}

function ContactRow({ label, value, href, external, download }: { label: string; value: string; href?: string; external?: boolean; download?: boolean }) {
  const inner = (
    <>
      <span className="block text-[0.65rem] text-[var(--muted)]">{label}</span>
      <span className={`block truncate text-sm ${href ? "text-ocean" : ""}`}>{value}</span>
    </>
  );
  return (
    <li className="px-4 py-2.5">
      {href ? (
        <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} download={download || undefined}>
          {inner}
        </a>
      ) : (
        inner
      )}
    </li>
  );
}

function GalleryApp({ projects, onNavigate }: { projects: PhoneProject[]; onNavigate: () => void }) {
  return (
    <ul className="grid grid-cols-2 gap-2">
      {projects.map((p) => (
        <li key={p.slug}>
          <Link href={`/projects/${p.slug}`} onClick={onNavigate} className="block overflow-hidden rounded-lg">
            <div className="aspect-square">
              <MissionArt title={p.title} color={p.color} image={p.image} />
            </div>
            <p className="mt-1 truncate text-xs">{p.title}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function SocialApp() {
  return (
    <ul className="space-y-2">
      {siteConfig.socials.map((s) => (
        <li key={s.label}>
          <a href={s.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl bg-white/5 p-3 transition hover:bg-white/10">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-ocean to-violet font-bold">{s.label[0]}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{s.label}</span>
              <span className="block truncate text-xs text-[var(--muted)]">{s.handle}</span>
            </span>
            <span className="text-xs text-ocean">Follow ↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function BrowserApp({ posts, onNavigate }: { posts: PhonePost[]; onNavigate: () => void }) {
  return (
    <div>
      <div className="mb-3 rounded-full bg-white/10 px-4 py-2 text-xs text-[var(--muted)]">🔒 news.{siteConfig.brand.toLowerCase()}</div>
      <ul className="space-y-2">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} onClick={onNavigate} className="block rounded-xl bg-white/5 p-3 transition hover:bg-white/10">
              <span className="font-hud text-[0.55rem]" style={{ color: p.color }}>
                {p.tag} · {formatDate(p.publishedAt)}
              </span>
              <span className="mt-1 block text-sm font-semibold leading-snug">{p.title}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/blog" onClick={onNavigate} className="mt-3 block text-center text-xs text-ocean">
        All stories ›
      </Link>
    </div>
  );
}

function MusicApp() {
  const { stations, index, playing, play, pause, next, prev, volume, setVolume, station } = useRadio();
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-br from-pink/40 to-violet/30 p-5 text-center">
        <p className="font-hud text-[0.6rem] text-white/70">{playing ? "NOW PLAYING" : "PAUSED"}</p>
        <p className="font-display mt-1 text-3xl">{station.name}</p>
        <p className="text-xs text-white/70">{station.genre}</p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <button type="button" onClick={prev} aria-label="Previous station" className="text-xl">
            ⏮
          </button>
          <button
            type="button"
            onClick={() => (playing ? pause() : play())}
            aria-label={playing ? "Pause" : "Play"}
            className="grid h-14 w-14 place-items-center rounded-full bg-white text-xl text-[#0d0a1c]"
          >
            {playing ? "❚❚" : "▶"}
          </button>
          <button type="button" onClick={next} aria-label="Next station" className="text-xl">
            ⏭
          </button>
        </div>
        <label className="mt-4 flex items-center gap-2 text-xs">
          🔈
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 accent-pink"
            aria-label="Volume"
          />
          🔊
        </label>
      </div>
      <ul className="space-y-1.5">
        {stations.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => play(i)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                i === index ? "bg-pink/20 text-white" : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <span>
                <span className="block font-semibold">{s.name}</span>
                <span className="block text-xs text-[var(--muted)]">{s.genre}</span>
              </span>
              {i === index && <Equalizer playing={playing} />}
            </button>
          </li>
        ))}
      </ul>
      <p className="text-center text-[0.65rem] text-[var(--muted)]">All music is generated live in your browser.</p>
    </div>
  );
}

function TrophiesApp() {
  const { unlocked } = useGame();
  return (
    <div>
      <p className="mb-3 text-center text-xs text-[var(--muted)]">
        {unlocked.size} of {achievements.length} unlocked
      </p>
      <ul className="space-y-2">
        {achievements.map((a) => {
          const on = unlocked.has(a.id);
          return (
            <li key={a.id} className={`flex items-center gap-3 rounded-xl p-3 ${on ? "bg-gold/10" : "bg-white/5"}`}>
              <span className="text-2xl" style={{ filter: on ? "none" : "grayscale(1) opacity(.3)" }} aria-hidden>
                {a.icon}
              </span>
              <span>
                <span className={`block text-sm font-semibold ${on ? "text-gold" : "text-[var(--muted)]"}`}>{on ? a.title : "Locked"}</span>
                <span className="block text-xs text-[var(--muted)]">{on ? a.description : "???"}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SettingsApp() {
  const { time, setTime, weather, setWeather, cursorEnabled, setCursorEnabled, resetProgress } = useGame();
  return (
    <div className="space-y-5 text-sm">
      <Segment<TimeOfDay>
        label="Time of day"
        value={time}
        onChange={setTime}
        options={[
          ["day", "☀️ Day"],
          ["sunset", "🌅 Sunset"],
          ["night", "🌙 Night"],
        ]}
      />
      <Segment<Weather>
        label="Weather"
        value={weather}
        onChange={setWeather}
        options={[
          ["clear", "✨ Clear"],
          ["rain", "🌧️ Rain"],
          ["fog", "🌫️ Fog"],
        ]}
      />
      <label className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
        Custom cursor
        <input type="checkbox" checked={cursorEnabled} onChange={(e) => setCursorEnabled(e.target.checked)} className="h-5 w-5 accent-pink" />
      </label>
      <button type="button" onClick={resetProgress} className="w-full rounded-xl bg-pink/15 px-4 py-3 text-pink">
        Reset achievements
      </button>
    </div>
  );
}

function Segment<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: [T, string][] }) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs text-[var(--muted)]">{label}</legend>
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-white/5 p-1">
        {options.map(([v, l]) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            aria-pressed={value === v}
            className={`rounded-lg px-2 py-2 text-xs transition ${value === v ? "bg-pink text-white" : "hover:bg-white/10"}`}
          >
            {l}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
