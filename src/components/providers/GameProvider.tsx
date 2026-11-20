"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { achievements, type AchievementId } from "@/config/achievements";
import { mapLocations, type MapLocationId } from "@/config/site";

export type TimeOfDay = "sunset" | "night" | "day";
export type Weather = "clear" | "rain" | "fog";

interface Toast {
  id: number;
  title: string;
  description?: string;
  icon?: string;
  kind: "achievement" | "info" | "cheat";
}

interface GameState {
  time: TimeOfDay;
  weather: Weather;
  wanted: number;
  unlocked: Set<AchievementId>;
  visited: Set<MapLocationId>;
  phoneOpen: boolean;
  terminalOpen: boolean;
  cursorEnabled: boolean;
  setTime: (t: TimeOfDay) => void;
  setWeather: (w: Weather) => void;
  unlock: (id: AchievementId) => void;
  notify: (title: string, description?: string, icon?: string, kind?: Toast["kind"]) => void;
  visit: (id: MapLocationId) => void;
  addWanted: (n?: number) => void;
  clearWanted: () => void;
  setPhoneOpen: (open: boolean) => void;
  setTerminalOpen: (open: boolean) => void;
  setCursorEnabled: (on: boolean) => void;
  resetProgress: () => void;
}

const GameContext = createContext<GameState | null>(null);

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside <GameProvider>");
  return ctx;
}

const STORAGE_KEY = "vice:save";
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

interface SaveFile {
  time?: TimeOfDay;
  weather?: Weather;
  unlocked?: AchievementId[];
  visited?: MapLocationId[];
  cursor?: boolean;
}

function readSave(): SaveFile {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as SaveFile;
  } catch {
    return {};
  }
}

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [time, setTimeState] = useState<TimeOfDay>("sunset");
  const [weather, setWeatherState] = useState<Weather>("clear");
  const [wanted, setWanted] = useState(0);
  const [unlocked, setUnlocked] = useState<Set<AchievementId>>(new Set());
  const [visited, setVisited] = useState<Set<MapLocationId>>(new Set());
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [cursorEnabled, setCursorEnabledState] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loaded, setLoaded] = useState(false);
  const unlockedRef = useRef(unlocked);
  unlockedRef.current = unlocked;
  const toastId = useRef(0);

  // Load save file
  useEffect(() => {
    const save = readSave();
    if (save.time) setTimeState(save.time);
    if (save.weather) setWeatherState(save.weather);
    if (save.unlocked) setUnlocked(new Set(save.unlocked));
    if (save.visited) setVisited(new Set(save.visited));
    if (typeof save.cursor === "boolean") setCursorEnabledState(save.cursor);
    setLoaded(true);
  }, []);

  // Persist save file
  useEffect(() => {
    if (!loaded) return;
    const save: SaveFile = { time, weather, unlocked: [...unlocked], visited: [...visited], cursor: cursorEnabled };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
    } catch {
      /* storage may be unavailable (private mode) */
    }
  }, [loaded, time, weather, unlocked, visited, cursorEnabled]);

  // Apply time of day to <html>
  useEffect(() => {
    document.documentElement.dataset.time = time;
  }, [time]);

  const notify = useCallback<GameState["notify"]>((title, description, icon, kind = "info") => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-2), { id, title, description, icon, kind }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const unlock = useCallback(
    (id: AchievementId) => {
      if (unlockedRef.current.has(id)) return;
      const a = achievements.find((x) => x.id === id);
      if (!a) return;
      const next = new Set(unlockedRef.current);
      next.add(id);
      unlockedRef.current = next;
      setUnlocked(next);
      notify("ACHIEVEMENT UNLOCKED", a.title, a.icon, "achievement");
    },
    [notify],
  );

  const setTime = useCallback(
    (t: TimeOfDay) => {
      setTimeState(t);
      if (t === "night") unlock("night-owl");
    },
    [unlock],
  );

  const setWeather = useCallback(
    (w: Weather) => {
      setWeatherState(w);
      if (w === "rain") unlock("storm-chaser");
    },
    [unlock],
  );

  const visit = useCallback((id: MapLocationId) => {
    setVisited((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    if (loaded && visited.size === mapLocations.length) unlock("explorer");
  }, [loaded, visited, unlock]);

  const addWanted = useCallback((n = 1) => setWanted((w) => Math.min(5, w + n)), []);

  const wasMaxWanted = useRef(false);
  useEffect(() => {
    if (wanted === 5 && !wasMaxWanted.current) {
      unlock("most-wanted");
      notify("YOU'RE WANTED", "...by every recruiter in the city.", "🚨", "cheat");
    }
    wasMaxWanted.current = wanted === 5;
  }, [wanted, notify, unlock]);

  const clearWanted = useCallback(() => setWanted(0), []);

  // Wanted level slowly cools down
  useEffect(() => {
    if (wanted === 0) return;
    const t = window.setTimeout(() => setWanted((w) => Math.max(0, w - 1)), 15000);
    return () => window.clearTimeout(t);
  }, [wanted]);

  const setCursorEnabled = useCallback((on: boolean) => setCursorEnabledState(on), []);

  const resetProgress = useCallback(() => {
    setUnlocked(new Set());
    unlockedRef.current = new Set();
    setVisited(new Set());
    setWanted(0);
    notify("SAVE FILE DELETED", "Progress reset. Fresh start.", "🗑️");
  }, [notify]);

  // Global keyboard shortcuts: ` terminal, Esc closes overlays, Konami code
  useEffect(() => {
    let seq: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTerminalOpen(false);
        setPhoneOpen(false);
        return;
      }
      if (isTyping(e.target)) return;
      if (e.key === "`" || e.key === "~") {
        e.preventDefault();
        setTerminalOpen((o) => !o);
        return;
      }
      seq = [...seq, e.key.length === 1 ? e.key.toLowerCase() : e.key].slice(-KONAMI.length);
      if (seq.join(",") === KONAMI.join(",")) {
        seq = [];
        setTimeState("night");
        setWeatherState("rain");
        unlock("old-school");
        notify("CHEAT ACTIVATED", "Neon overdrive: night + rain", "🕹️", "cheat");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [notify, unlock]);

  useEffect(() => {
    if (terminalOpen) unlock("hacker");
  }, [terminalOpen, unlock]);
  useEffect(() => {
    if (phoneOpen) unlock("phone-home");
  }, [phoneOpen, unlock]);

  const value = useMemo<GameState>(
    () => ({
      time,
      weather,
      wanted,
      unlocked,
      visited,
      phoneOpen,
      terminalOpen,
      cursorEnabled,
      setTime,
      setWeather,
      unlock,
      notify,
      visit,
      addWanted,
      clearWanted,
      setPhoneOpen,
      setTerminalOpen,
      setCursorEnabled,
      resetProgress,
    }),
    [time, weather, wanted, unlocked, visited, phoneOpen, terminalOpen, cursorEnabled, setTime, setWeather, unlock, notify, visit, addWanted, clearWanted, setCursorEnabled, resetProgress],
  );

  return (
    <GameContext.Provider value={value}>
      {children}
      <ToastStack toasts={toasts} />
    </GameContext.Provider>
  );
}

function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-20 z-[80] flex flex-col items-center gap-3 px-4"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: -24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="glass flex w-full max-w-sm items-center gap-4 rounded-xl px-4 py-3 shadow-2xl"
            style={{
              boxShadow:
                t.kind === "achievement"
                  ? "0 0 30px rgba(255,224,102,.35)"
                  : t.kind === "cheat"
                    ? "0 0 30px rgba(255,79,145,.45)"
                    : "0 0 24px rgba(69,201,255,.3)",
            }}
          >
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-2xl"
              style={{ background: t.kind === "achievement" ? "rgba(255,224,102,.15)" : "rgba(255,255,255,.08)" }}
              aria-hidden
            >
              {t.icon ?? "★"}
            </span>
            <div className="min-w-0">
              <p
                className="font-hud text-[0.65rem]"
                style={{ color: t.kind === "achievement" ? "var(--color-gold)" : t.kind === "cheat" ? "var(--color-pink)" : "var(--color-ocean)" }}
              >
                {t.title}
              </p>
              {t.description && <p className="truncate text-sm font-semibold">{t.description}</p>}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
