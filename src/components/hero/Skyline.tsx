/**
 * Procedural neon skyline: synthwave sun, skyscrapers with lit windows,
 * swaying palms and a reflective bay. Colors come from CSS variables so the
 * whole scene re-tints with the time of day.
 */

// Deterministic pseudo-random so server + client render the same city.
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

const rand = rng(42);
const buildings = (() => {
  const out: { x: number; w: number; h: number; layer: 0 | 1; windows: { x: number; y: number }[]; antenna: boolean }[] = [];
  for (const layer of [0, 1] as const) {
    let x = -20;
    while (x < 1620) {
      const w = 40 + rand() * (layer === 0 ? 70 : 90);
      const center = 1 - Math.abs(x - 800) / 900; // taller downtown
      const h = (layer === 0 ? 140 : 70) + rand() * (layer === 0 ? 220 : 170) * Math.max(0.35, center);
      const windows: { x: number; y: number }[] = [];
      if (layer === 1) {
        for (let wy = 12; wy < h - 10; wy += 14) {
          for (let wx = 8; wx < w - 8; wx += 12) if (rand() > 0.62) windows.push({ x: wx, y: wy });
        }
      }
      out.push({ x, w, h, layer, windows, antenna: rand() > 0.75 });
      x += w + (layer === 0 ? 4 : 10) + rand() * 14;
    }
  }
  return out;
})();

const stars = Array.from({ length: 70 }, () => ({ x: rand() * 1600, y: rand() * 330, r: rand() * 1.4 + 0.3, d: rand() * 4 }));

const GROUND = 620;

function Palm({ x, scale, flip = false, delay = 0 }: { x: number; scale: number; flip?: boolean; delay?: number }) {
  return (
    <g transform={`translate(${x} ${GROUND + 40}) scale(${flip ? -scale : scale} ${scale})`}>
      <g style={{ transformOrigin: "0px 0px", animation: `sway 6s ease-in-out ${delay}s infinite` }}>
        <path d="M0 0 C 6 -60, 4 -130, 22 -210" stroke="#120a22" strokeWidth="9" fill="none" strokeLinecap="round" />
        <g transform="translate(22 -210)" fill="#120a22">
          <path d="M0 0 C -30 -18, -70 -10, -95 20 C -60 0, -30 -2, 0 4 Z" />
          <path d="M0 0 C -20 -35, -55 -50, -85 -40 C -50 -30, -25 -18, 0 2 Z" />
          <path d="M0 0 C 10 -40, 40 -60, 75 -55 C 45 -40, 22 -22, 2 2 Z" />
          <path d="M0 0 C 35 -20, 75 -12, 100 18 C 65 2, 35 0, 2 4 Z" />
          <path d="M0 2 C 25 10, 50 35, 55 70 C 35 40, 18 22, 0 6 Z" />
          <path d="M0 2 C -22 12, -42 40, -44 72 C -28 42, -14 24, 0 6 Z" />
        </g>
      </g>
    </g>
  );
}

export function Skyline({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--sky-1)" />
          <stop offset="55%" stopColor="var(--sky-2)" />
          <stop offset="100%" stopColor="var(--sky-3)" />
        </linearGradient>
        <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--sun-1)" />
          <stop offset="100%" stopColor="var(--sun-2)" />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--water-1)" />
          <stop offset="100%" stopColor="var(--water-2)" />
        </linearGradient>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="var(--sun-2)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--sun-2)" stopOpacity="0" />
        </radialGradient>
        <mask id="sunStripes">
          <rect x="0" y="0" width="1600" height="900" fill="#fff" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x="0" y={455 + i * 26} width="1600" height={4 + i * 2.2} fill="#000" />
          ))}
        </mask>
      </defs>

      <rect width="1600" height="900" fill="url(#sky)" style={{ transition: "all 1s" }} />

      <g style={{ opacity: "var(--stars-opacity)", transition: "opacity 1s" }}>
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" style={{ animation: `twinkle 3s ease-in-out ${s.d}s infinite` }} />
        ))}
      </g>

      <circle cx="800" cy="470" r="330" fill="url(#glow)" />
      <circle cx="800" cy="470" r="200" fill="url(#sun)" mask="url(#sunStripes)" />

      {/* Back skyline */}
      <g fill="var(--city-2)" opacity="0.85">
        {buildings
          .filter((b) => b.layer === 0)
          .map((b, i) => (
            <rect key={i} x={b.x} y={GROUND - b.h} width={b.w} height={b.h} />
          ))}
      </g>

      {/* Front skyline with windows */}
      {buildings
        .filter((b) => b.layer === 1)
        .map((b, i) => (
          <g key={i} transform={`translate(${b.x} ${GROUND - b.h})`}>
            <rect width={b.w} height={b.h + 2} fill="var(--city)" />
            {b.antenna && <rect x={b.w / 2 - 1} y={-28} width="2" height="28" fill="var(--city)" />}
            {b.antenna && <circle cx={b.w / 2} cy={-30} r="2.5" fill="#ff4f91" style={{ animation: "flicker 3s linear infinite" }} />}
            {b.windows.map((w, j) => (
              <rect key={j} x={w.x} y={w.y} width="5" height="7" fill="var(--window)" opacity={0.55 + ((i + j) % 3) * 0.15} />
            ))}
          </g>
        ))}

      {/* Neon strip along the waterfront */}
      <rect x="0" y={GROUND} width="1600" height="3" fill="#ff4f91" opacity="0.9" />
      <rect x="0" y={GROUND} width="1600" height="3" fill="#ff4f91" opacity="0.6" filter="blur(4px)" />

      {/* Water + reflections */}
      <rect x="0" y={GROUND + 3} width="1600" height="300" fill="url(#water)" />
      <g opacity="0.35">
        {Array.from({ length: 16 }).map((_, i) => (
          <rect
            key={i}
            x={800 - (150 - i * 8)}
            y={GROUND + 14 + i * 11}
            width={(150 - i * 8) * 2}
            height="3"
            rx="1.5"
            fill="var(--sun-2)"
            style={{ animation: `twinkle ${2 + (i % 3)}s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </g>

      {/* Foreground shore */}
      <path d="M0 640 C 120 630, 260 650, 420 700 C 500 730, 520 900, 520 900 L0 900 Z" fill="#0e0820" />
      <path d="M1600 640 C 1480 632, 1340 652, 1200 700 C 1110 735, 1090 900, 1090 900 L1600 900 Z" fill="#0e0820" />

      <Palm x={120} scale={1.15} delay={0} />
      <Palm x={250} scale={0.85} flip delay={-1.5} />
      <Palm x={1380} scale={1.05} flip delay={-0.7} />
      <Palm x={1500} scale={0.8} delay={-2.2} />
    </svg>
  );
}
