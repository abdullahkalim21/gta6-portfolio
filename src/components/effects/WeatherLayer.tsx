"use client";

import { useEffect, useRef } from "react";
import { useGame } from "@/components/providers/GameProvider";

/** Full-screen weather overlay: canvas rain or drifting fog. */
export function WeatherLayer() {
  const { weather } = useGame();
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40">
      {weather === "rain" && <Rain />}
      {weather === "fog" && <Fog />}
    </div>
  );
}

function Rain() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current!;
    const ctx = c.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0;
    type Drop = { x: number; y: number; l: number; v: number };
    let drops: Drop[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / 9000);
      drops = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, l: 10 + Math.random() * 18, v: 9 + Math.random() * 10 }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(180, 210, 255, 0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const d of drops) {
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.l * 0.2, d.y + d.l);
        if (!reduced) {
          d.y += d.v;
          d.x -= d.v * 0.2;
          if (d.y > h) {
            d.y = -20;
            d.x = Math.random() * (w + 100);
          }
        }
      }
      ctx.stroke();
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-[#1b2a4a]/15 to-transparent" />
      <canvas ref={canvas} className="absolute inset-0" />
    </>
  );
}

function Fog() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute -inset-x-1/2 h-[45vh] rounded-[50%] blur-3xl"
          style={{
            top: `${20 + i * 25}%`,
            background: "radial-gradient(ellipse at center, rgba(220,210,255,.22), transparent 70%)",
            animation: `drift ${18 + i * 7}s ease-in-out ${i * -5}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}
