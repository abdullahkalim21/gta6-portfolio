"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { useGame, type TimeOfDay, type Weather } from "@/components/providers/GameProvider";

const links = [
  { href: "/#map", label: "Map" },
  { href: "/#about", label: "Character" },
  { href: "/#skills", label: "Skills" },
  { href: "/projects", label: "Missions" },
  { href: "/#experience", label: "Story" },
  { href: "/blog", label: "News" },
];

const timeCycle: TimeOfDay[] = ["sunset", "night", "day"];
const timeIcon: Record<TimeOfDay, string> = { sunset: "🌅", night: "🌙", day: "☀️" };
const weatherCycle: Weather[] = ["clear", "rain", "fog"];
const weatherIcon: Record<Weather, string> = { clear: "✨", rain: "🌧️", fog: "🌫️" };

export function Navbar() {
  const { time, setTime, weather, setWeather, setPhoneOpen, setTerminalOpen } = useGame();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nextTime = timeCycle[(timeCycle.indexOf(time) + 1) % timeCycle.length];
  const nextWeather = weatherCycle[(weatherCycle.indexOf(weather) + 1) % weatherCycle.length];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-white/10 bg-[var(--surface-strong)] backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6" aria-label="Main">
        <Link href="/" className="group flex items-center gap-2" aria-label={`${siteConfig.brand} home`}>
          <span className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-pink to-orange font-display text-lg text-white shadow-[0_0_18px_rgba(255,79,145,.6)]">
            V
          </span>
          <span className="font-display text-xl tracking-wide">
            {siteConfig.brand.split(".")[0]}
            <span className="text-pink">.</span>
            {siteConfig.brand.split(".")[1] ?? ""}
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="font-hud rounded-md px-3 py-2 text-[0.7rem] text-[var(--muted)] transition hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <IconButton label={`Change time of day (now ${time}, next ${nextTime})`} onClick={() => setTime(nextTime)}>
            {timeIcon[time]}
          </IconButton>
          <IconButton label={`Change weather (now ${weather}, next ${nextWeather})`} onClick={() => setWeather(nextWeather)}>
            {weatherIcon[weather]}
          </IconButton>
          <IconButton label="Open developer terminal (shortcut: backtick)" onClick={() => setTerminalOpen(true)} className="hidden sm:grid">
            <span className="font-mono text-sm">&gt;_</span>
          </IconButton>
          <IconButton label="Open smartphone" onClick={() => setPhoneOpen(true)} className="hidden sm:grid">
            📱
          </IconButton>
          <Link href="/#contact" className="btn btn-primary ml-1 hidden !px-4 !py-2 sm:inline-flex">
            Hire me
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-md border border-white/10 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-0.5 w-5 bg-current transition ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-white/10 bg-[var(--surface-strong)] backdrop-blur-xl lg:hidden"
          >
            <ul className="mx-auto grid max-w-7xl gap-1 px-4 py-4">
              {[...links, { href: "/#contact", label: "Hire me" }].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-display block rounded-md px-3 py-2 text-2xl hover:bg-white/5"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 flex gap-2 px-3">
                <button type="button" className="btn btn-ghost flex-1 !px-3" onClick={() => { setOpen(false); setPhoneOpen(true); }}>
                  📱 Phone
                </button>
                <button type="button" className="btn btn-ghost flex-1 !px-3" onClick={() => { setOpen(false); setTerminalOpen(true); }}>
                  &gt;_ Terminal
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function IconButton({
  label,
  onClick,
  children,
  className = "",
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-white/5 text-base transition hover:border-ocean/60 hover:bg-ocean/10 hover:shadow-[0_0_16px_rgba(69,201,255,.35)] ${className}`}
    >
      {children}
    </button>
  );
}
