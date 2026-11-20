"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig, fullName } from "@/config/site";
import { useGame } from "@/components/providers/GameProvider";

const SEEN_KEY = "vice:intro-seen";

/**
 * Game-style loading screen shown once per browser session on the homepage.
 * Always skippable; disabled for no-JS visitors and remembered via sessionStorage.
 */
export function LoadingScreen() {
  const { unlock } = useGame();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [tip, setTip] = useState(siteConfig.loadingTips[0]);

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    setVisible(false);
    unlock("welcome");
  }, [unlock]);

  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(SEEN_KEY);
    } catch {}
    if (seen) {
      setVisible(false);
      return;
    }
    setTip(siteConfig.loadingTips[Math.floor(Math.random() * siteConfig.loadingTips.length)]);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setProgress(100);
      return;
    }
    const start = performance.now();
    const duration = 2400;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Lock scroll + allow Enter/Space to start
  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (progress >= 100 && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [visible, progress, finish]);

  const ready = progress >= 100;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="intro-screen fixed inset-0 z-[90] flex flex-col overflow-hidden bg-night"
          role="dialog"
          aria-modal="true"
          aria-label="Loading screen"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {/* Poster art */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,79,145,.45),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(69,201,255,.35),transparent_55%),linear-gradient(160deg,#2a1250,#0d0a1c_70%)]" />
            <motion.div
              className="absolute -right-[10%] top-[8%] h-[70vmin] w-[70vmin] rounded-full bg-gradient-to-b from-gold via-orange to-pink opacity-80 sun-stripes"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 0.8 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
            />
            <div className="scanlines absolute inset-0 opacity-60" />
          </div>

          <div className="relative z-10 flex items-center justify-between p-5 sm:p-8">
            <p className="font-hud text-xs text-[var(--muted)]">{siteConfig.brand} · THE DEVELOPER EXPERIENCE</p>
            <button type="button" onClick={finish} className="btn btn-ghost !px-4 !py-2">
              Skip intro ⏭
            </button>
          </div>

          <div className="relative z-10 flex flex-1 flex-col justify-center px-5 sm:px-12">
            <motion.p
              className="font-hud text-sm text-ocean"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              NOW ENTERING
            </motion.p>
            <motion.h1
              className="font-display text-[18vw] leading-[0.85] sm:text-[12vw]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
            >
              <span className="text-sunset">{siteConfig.cityName.split(" ")[0]}</span>
              <br />
              <span className="text-white/90">{siteConfig.cityName.split(" ").slice(1).join(" ") || "CITY"}</span>
            </motion.h1>
            <motion.p
              className="mt-4 font-hud text-xs text-[var(--muted)] sm:text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              STARRING {fullName.toUpperCase()}
            </motion.p>
          </div>

          <div className="relative z-10 p-5 sm:p-8">
            <p className="mb-4 max-w-xl text-sm text-[var(--muted)]">{tip}</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div
                  className="h-1.5 overflow-hidden rounded-full bg-white/10"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Loading"
                >
                  <div className="h-full bg-gradient-to-r from-pink via-orange to-gold" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-2 font-hud text-[0.65rem] text-[var(--muted)]">{ready ? "CITY LOADED" : `LOADING ${progress}%`}</p>
              </div>
              <button
                type="button"
                onClick={finish}
                disabled={!ready}
                className="btn btn-primary min-w-56 disabled:pointer-events-none disabled:opacity-30"
                autoFocus
              >
                {ready ? "Enter the city ▸" : "Loading…"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
