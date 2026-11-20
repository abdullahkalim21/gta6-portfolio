"use client";

import { useEffect, useRef, useState } from "react";
import { useGame } from "@/components/providers/GameProvider";

/** Neon crosshair cursor. Only on mouse/trackpad devices and when not disabled in phone settings. */
export function CustomCursor() {
  const { cursorEnabled } = useGame();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const on = cursorEnabled && fine && !reduced;
    setActive(on);
    document.documentElement.classList.toggle("has-custom-cursor", on);
    if (!on) return;

    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const target = e.target as HTMLElement | null;
      const interactive = !!target?.closest("a, button, [role='button'], input, textarea, select, label");
      ring.current?.classList.toggle("cursor-hover", interactive);
    };
    const down = () => ring.current?.classList.add("cursor-down");
    const up = () => ring.current?.classList.remove("cursor-down");
    const loop = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [cursorEnabled]);

  if (!active) return null;

  return (
    <>
      <style>{`
        .vice-cursor-ring{transition:width .2s,height .2s,margin .2s,border-color .2s,background .2s}
        .vice-cursor-ring.cursor-hover{width:46px;height:46px;margin:-23px 0 0 -23px;border-color:var(--color-ocean);background:rgba(69,201,255,.08)}
        .vice-cursor-ring.cursor-down{width:22px;height:22px;margin:-11px 0 0 -11px}
      `}</style>
      <div
        ref={ring}
        aria-hidden
        className="vice-cursor-ring pointer-events-none fixed left-0 top-0 z-[999] -ml-4 -mt-4 h-8 w-8 rounded-full border-2 border-pink shadow-[0_0_14px_rgba(255,79,145,.7)]"
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[999] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_#fff]"
      />
    </>
  );
}
