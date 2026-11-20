"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { mapLocations, siteConfig, type MapLocationId } from "@/config/site";
import { useGame } from "@/components/providers/GameProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";

const PLAYER = { x: 440, y: 320 };
const W = 1000;
const H = 620;

const LAND =
  "M120 40 L880 40 C905 120 865 185 822 232 C788 272 805 332 772 384 C742 432 692 474 642 522 C598 562 522 592 470 582 C418 572 382 522 332 482 C272 440 198 430 160 382 C120 332 140 262 110 202 C90 152 100 92 120 40 Z";

function routePath(to: { x: number; y: number }) {
  const mx = (PLAYER.x + to.x) / 2 + (to.y - PLAYER.y) * 0.25;
  const my = (PLAYER.y + to.y) / 2 - (to.x - PLAYER.x) * 0.25;
  return `M${PLAYER.x} ${PLAYER.y} Q${mx} ${my} ${to.x} ${to.y}`;
}

export function CityMap() {
  const { visited, visit } = useGame();
  const [active, setActive] = useState<MapLocationId | null>(null);
  const current = mapLocations.find((l) => l.id === active);

  const go = (id: MapLocationId) => {
    visit(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="map" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6" aria-label="City map">
      <SectionHeader
        kicker={`🗺️ EXPLORE ${siteConfig.cityName}`}
        title="The city"
        accent="map"
        description="Every district is a part of my story. Pick a destination and fast-travel there — or just keep scrolling."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="glass neon-border relative overflow-hidden rounded-2xl">
          <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="group" aria-label={`Interactive map of ${siteConfig.cityName}`}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke="rgba(69,201,255,.08)" strokeWidth="1" />
              </pattern>
              <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2b1d52" />
                <stop offset="100%" stopColor="#1d1540" />
              </linearGradient>
              <filter id="neon" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect width={W} height={H} fill="#0f1a36" />
            <rect width={W} height={H} fill="url(#grid)" />

            {/* Land */}
            <path d={LAND} fill="url(#land)" stroke="#45c9ff" strokeOpacity="0.5" strokeWidth="2" />
            {[
              [395, 560, 26, 12],
              [338, 586, 20, 9],
              [282, 600, 16, 7],
              [230, 608, 12, 6],
              [905, 300, 30, 50],
            ].map(([cx, cy, rx, ry], i) => (
              <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#land)" stroke="#45c9ff" strokeOpacity="0.45" strokeWidth="1.5" />
            ))}

            {/* Lake + park */}
            <ellipse cx="300" cy="260" rx="55" ry="30" fill="#0f1a36" stroke="#45c9ff" strokeOpacity="0.3" />
            <ellipse cx="600" cy="330" rx="45" ry="28" fill="#1f3a2f" opacity="0.6" />

            {/* Roads */}
            <g stroke="rgba(245,233,226,.14)" strokeWidth="6" fill="none" strokeLinecap="round">
              <path d="M150 120 C 400 140, 600 110, 860 100" />
              <path d="M470 60 C 460 200, 480 380, 470 570" />
              <path d="M180 360 C 350 340, 600 380, 770 380" />
              <path d="M250 180 C 330 250, 380 330, 330 470" />
              <path d="M640 190 C 700 300, 720 360, 735 420" />
              <path d="M330 480 Q 380 560 230 608" strokeDasharray="2 10" />
            </g>
            <g stroke="#ff9d55" strokeOpacity="0.35" strokeWidth="2" fill="none">
              <path d="M150 120 C 400 140, 600 110, 860 100" />
              <path d="M180 360 C 350 340, 600 380, 770 380" />
            </g>

            {/* District blocks */}
            <g fill="rgba(255,255,255,.05)">
              {Array.from({ length: 40 }).map((_, i) => {
                const x = 200 + ((i * 97) % 560);
                const y = 90 + ((i * 53) % 380);
                return <rect key={i} x={x} y={y} width={14 + (i % 4) * 6} height={10 + (i % 3) * 6} rx="2" />;
              })}
            </g>

            {/* GPS route */}
            <AnimatePresence>
              {current && (
                <motion.path
                  key={current.id}
                  d={routePath(current)}
                  fill="none"
                  stroke={current.color}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="10 10"
                  filter="url(#neon)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </AnimatePresence>

            {/* Player blip */}
            <g transform={`translate(${PLAYER.x} ${PLAYER.y})`}>
              <circle r="10" fill="#fff" opacity="0.25" style={{ transformOrigin: "center", transformBox: "fill-box", animation: "pulse-ring 2s ease-out infinite" }} />
              <path d="M0 -11 L8 9 L0 4 L-8 9 Z" fill="#fff" filter="url(#neon)" />
            </g>

            {/* Locations */}
            {mapLocations.map((l) => {
              const isVisited = visited.has(l.id);
              return (
                <g
                  key={l.id}
                  transform={`translate(${l.x} ${l.y})`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${l.name}: ${l.label}${isVisited ? " (visited)" : ""}`}
                  className="cursor-pointer outline-none"
                  onMouseEnter={() => setActive(l.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(l.id)}
                  onBlur={() => setActive(null)}
                  onClick={() => go(l.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      go(l.id);
                    }
                  }}
                >
                  <circle r="16" fill={l.color} opacity="0.3" style={{ transformOrigin: "center", transformBox: "fill-box", animation: "pulse-ring 2.4s ease-out infinite" }} />
                  <circle r={active === l.id ? 24 : 20} fill="#0d0a1c" stroke={l.color} strokeWidth="3" filter="url(#neon)" style={{ transition: "r .2s" }} />
                  <text textAnchor="middle" dominantBaseline="central" fontSize="18">
                    {l.icon}
                  </text>
                  {isVisited && <circle cx="16" cy="-16" r="7" fill="#5cf2b4" stroke="#0d0a1c" strokeWidth="2" />}
                  <text
                    y="40"
                    textAnchor="middle"
                    fill="#f5e9e2"
                    fontSize="13"
                    fontFamily="var(--font-mono)"
                    letterSpacing="2"
                    style={{ paintOrder: "stroke", stroke: "#0d0a1c", strokeWidth: 4 }}
                  >
                    {l.name}
                  </text>
                </g>
              );
            })}

            {/* Compass */}
            <g transform="translate(940 560)" opacity="0.7">
              <circle r="24" fill="none" stroke="#f5e9e2" strokeOpacity="0.3" />
              <path d="M0 -18 L5 0 L0 18 L-5 0 Z" fill="#ff4f91" />
              <text y="-30" textAnchor="middle" fill="#f5e9e2" fontSize="11" fontFamily="var(--font-mono)">N</text>
            </g>
          </svg>

          <div className="font-hud pointer-events-none absolute left-3 top-3 rounded-md bg-black/40 px-2 py-1 text-[0.6rem] text-[var(--muted)]">
            ▲ YOU ARE HERE
          </div>

          <AnimatePresence>
            {current && (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass pointer-events-none absolute hidden rounded-lg px-3 py-2 sm:block"
                style={{
                  left: `${(current.x / W) * 100}%`,
                  top: `${(current.y / H) * 100}%`,
                  transform: "translate(-50%, calc(-100% - 34px))",
                }}
              >
                <p className="font-hud text-[0.6rem]" style={{ color: current.color }}>
                  {current.name}
                </p>
                <p className="whitespace-nowrap text-sm font-semibold">{current.label}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="glass rounded-2xl p-5" aria-label="Destinations">
          <div className="flex items-baseline justify-between">
            <p className="font-hud text-xs text-[var(--muted)]">Destinations</p>
            <p className="font-hud text-xs text-mint">
              {visited.size}/{mapLocations.length} found
            </p>
          </div>
          <ul className="mt-4 space-y-2">
            {mapLocations.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => go(l.id)}
                  onMouseEnter={() => setActive(l.id)}
                  onMouseLeave={() => setActive(null)}
                  className="group flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition hover:border-white/10 hover:bg-white/5"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-md text-lg" style={{ background: `${l.color}22` }} aria-hidden>
                    {l.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-hud block text-[0.62rem]" style={{ color: l.color }}>
                      {l.name}
                    </span>
                    <span className="block truncate text-sm">{l.label}</span>
                  </span>
                  <span className="text-xs text-mint" aria-hidden>
                    {visited.has(l.id) ? "✓" : ""}
                  </span>
                  <span className="sr-only">{visited.has(l.id) ? "visited" : "not visited"}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
