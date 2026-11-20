"use client";

import { useEffect, useRef } from "react";
import type { MapLocationId } from "@/config/site";
import { useGame } from "@/components/providers/GameProvider";

/** Marks a map location as visited when its section scrolls into view. */
export function useVisitOnView<T extends HTMLElement>(id: MapLocationId) {
  const ref = useRef<T>(null);
  const { visit } = useGame();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visit(id);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id, visit]);
  return ref;
}
