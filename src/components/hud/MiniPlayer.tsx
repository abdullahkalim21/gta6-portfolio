"use client";

import { useRadio } from "@/components/providers/RadioProvider";

/** Floating radio player, bottom-left. */
export function MiniPlayer() {
  const { station, playing, toggle, next, prev } = useRadio();

  return (
    <div className="glass fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 shadow-xl">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pause ${station.name}` : `Play radio ${station.name}`}
        className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-pink to-orange text-white shadow-[0_0_16px_rgba(255,79,145,.6)]"
      >
        {playing ? (
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><rect x="1" y="1" width="3.5" height="10" fill="currentColor" /><rect x="7.5" y="1" width="3.5" height="10" fill="currentColor" /></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><path d="M2 1l9 5-9 5z" fill="currentColor" /></svg>
        )}
      </button>
      <div className="hidden min-w-0 sm:block">
        <p className="font-hud text-[0.6rem] text-ocean">{playing ? "● ON AIR" : "RADIO"}</p>
        <p className="max-w-[9rem] truncate text-xs font-semibold">{station.name}</p>
      </div>
      <Equalizer playing={playing} />
      <div className="flex">
        <button type="button" onClick={prev} aria-label="Previous station" className="grid h-7 w-7 place-items-center rounded-full text-xs text-[var(--muted)] hover:text-white">
          ◀
        </button>
        <button type="button" onClick={next} aria-label="Next station" className="grid h-7 w-7 place-items-center rounded-full text-xs text-[var(--muted)] hover:text-white">
          ▶
        </button>
      </div>
    </div>
  );
}

export function Equalizer({ playing }: { playing: boolean }) {
  return (
    <span className="flex h-4 items-end gap-[2px]" aria-hidden>
      <style>{`@keyframes eq{0%,100%{height:20%}50%{height:100%}}`}</style>
      {[0.9, 0.6, 1.1, 0.75].map((d, i) => (
        <span
          key={i}
          className="w-[3px] rounded-sm bg-pink"
          style={{ height: playing ? undefined : "20%", animation: playing ? `eq ${d}s ease-in-out ${i * 0.12}s infinite` : "none" }}
        />
      ))}
    </span>
  );
}
