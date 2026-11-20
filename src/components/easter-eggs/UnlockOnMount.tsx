"use client";

import { useEffect } from "react";
import type { AchievementId } from "@/config/achievements";
import { useGame } from "@/components/providers/GameProvider";

/** Drop into any page to unlock an achievement when it's viewed. */
export function UnlockOnMount({ id }: { id: AchievementId }) {
  const { unlock } = useGame();
  useEffect(() => {
    unlock(id);
  }, [id, unlock]);
  return null;
}
