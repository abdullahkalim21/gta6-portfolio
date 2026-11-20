"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { Skyline } from "./Skyline";
import { GameHud } from "@/components/hud/GameHud";
import { useGame } from "@/components/providers/GameProvider";

export function Hero() {
  const { player } = siteConfig;
  const { addWanted } = useGame();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const skyY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const [shake, setShake] = useState(0);
  // Parallax + fade only on wide screens (on phones the hero is taller than the viewport).
  const [parallax, setParallax] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const update = () => setParallax(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-end overflow-hidden pb-24 pt-24" aria-label="Intro">
      <motion.div className="absolute inset-0" style={parallax ? { y: skyY } : undefined}>
        <Skyline className="h-full w-full" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/30 to-transparent" />
      <div className="absolute inset-0 bg-[var(--bg)]/45 md:hidden" />
      <div className="scanlines absolute inset-0 opacity-30" />

      <div className="absolute right-4 top-20 z-20 hidden sm:right-6 md:block">
        <GameHud />
      </div>

      <motion.div style={parallax ? { y: textY, opacity: fade } : undefined} className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-hud mb-3 text-xs text-ocean sm:text-sm"
        >
          {player.tagline}
        </motion.p>

        <motion.h1
          key={shake}
          initial={shake ? { x: 0 } : { opacity: 0, y: 40 }}
          animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : { opacity: 1, y: 0 }}
          transition={{ duration: shake ? 0.4 : 0.9, ease: "easeOut" }}
          onClick={() => {
            setShake((s) => s + 1);
            addWanted(1);
          }}
          className="font-display select-none text-[22vw] leading-[0.82] drop-shadow-[0_8px_30px_rgba(0,0,0,.45)] sm:text-[15vw] lg:text-[12rem]"
        >
          <span className="block text-sunset">{player.firstName}</span>
          <span className="block text-white">{player.lastName}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-hud mt-5 text-[0.7rem] text-white/90 sm:text-sm"
        >
          {player.role}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="mt-3 max-w-xl text-base text-[var(--muted)] sm:text-lg"
        >
          {player.intro}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <a href="#map" className="btn btn-primary">
            Enter the city ▸
          </a>
          <a href="#missions" className="btn btn-ghost">
            View missions
          </a>
          <a href={player.resumeUrl} className="btn btn-ghost" download>
            Resume ↓
          </a>
        </motion.div>

        <div className="mt-8 md:hidden">
          <GameHud />
        </div>
      </motion.div>

      <a
        href="#map"
        aria-label="Scroll to the map"
        className="font-hud absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.6rem] text-[var(--muted)] md:flex"
      >
        Scroll
        <span className="h-8 w-px animate-pulse bg-gradient-to-b from-pink to-transparent" />
      </a>
    </section>
  );
}
