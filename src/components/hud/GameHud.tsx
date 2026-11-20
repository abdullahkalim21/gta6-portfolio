"use client";

import { motion } from "framer-motion";
import { siteConfig, fullName } from "@/config/site";
import { useGame } from "@/components/providers/GameProvider";

/** The game-style HUD in the hero corner. */
export function GameHud() {
  const { wanted, addWanted, unlocked } = useGame();
  const { hud, player } = siteConfig;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="glass w-full max-w-[19rem] rounded-xl p-4 text-left shadow-2xl"
      aria-label="Player status"
    >
      <div className="flex items-center justify-between">
        <p className="font-display text-xl">{siteConfig.brand}</p>
        <p className="font-hud flex items-center gap-1.5 text-[0.6rem] text-mint">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
          </span>
          ONLINE
        </p>
      </div>

      <button
        type="button"
        onClick={() => addWanted(1)}
        className="mt-2 flex gap-0.5 text-lg"
        aria-label={`Wanted level ${wanted} of 5. Click to raise it.`}
        title="Wanted level"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={i}
            animate={i < wanted ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.6, repeat: i < wanted ? Infinity : 0, delay: i * 0.08 }}
            style={{ color: i < wanted ? "var(--color-gold)" : "rgba(255,255,255,.18)", textShadow: i < wanted ? "0 0 10px rgba(255,224,102,.8)" : "none" }}
          >
            ★
          </motion.span>
        ))}
      </button>

      <dl className="mt-3 space-y-2.5 font-hud text-[0.65rem]">
        <Row label="Player" value={fullName.toUpperCase()} />
        <div className="grid grid-cols-2 gap-2">
          <Row label="Level" value={String(hud.level)} />
          <Row label="Cash" value={hud.cash} valueClass="text-mint" />
        </div>
        <div>
          <div className="flex justify-between">
            <dt className="text-[var(--muted)]">Coding XP</dt>
            <dd className="text-ocean">{hud.xp}%</dd>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-ocean to-pink"
              initial={{ width: 0 }}
              animate={{ width: `${hud.xp}%` }}
              transition={{ delay: 1, duration: 1.4, ease: "easeOut" }}
            />
          </div>
        </div>
        <Row label="Current mission" value={hud.currentMission} valueClass="text-orange" block />
        <div className="flex items-center justify-between border-t border-white/10 pt-2">
          <span className="text-[var(--muted)]">{player.available ? "● Available for hire" : "○ Busy on a mission"}</span>
          <span className="text-gold">🏆 {unlocked.size}</span>
        </div>
      </dl>
    </motion.aside>
  );
}

function Row({ label, value, valueClass = "text-white", block = false }: { label: string; value: string; valueClass?: string; block?: boolean }) {
  return (
    <div className={block ? "" : "flex justify-between gap-2"}>
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd className={`${valueClass} ${block ? "mt-0.5 text-[0.7rem]" : "truncate"}`}>{value}</dd>
    </div>
  );
}
