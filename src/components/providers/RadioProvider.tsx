"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { siteConfig, type RadioStation } from "@/config/site";
import type { SynthRadio } from "@/lib/radio-engine";
import { useGame } from "./GameProvider";

interface RadioState {
  stations: RadioStation[];
  station: RadioStation;
  index: number;
  playing: boolean;
  volume: number;
  toggle: () => void;
  play: (index?: number) => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  setVolume: (v: number) => void;
}

const RadioContext = createContext<RadioState | null>(null);

export function useRadio() {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error("useRadio must be used inside <RadioProvider>");
  return ctx;
}

export function RadioProvider({ children }: { children: React.ReactNode }) {
  const stations = siteConfig.radio;
  const { unlock, notify } = useGame();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.6);
  const synth = useRef<SynthRadio | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);

  const stopAll = useCallback(() => {
    synth.current?.stop();
    audio.current?.pause();
  }, []);

  const start = useCallback(
    async (i: number) => {
      const s = stations[i];
      stopAll();
      try {
        if (s.type === "synth") {
          if (!synth.current) {
            const { SynthRadio } = await import("@/lib/radio-engine");
            synth.current = new SynthRadio();
          }
          synth.current.setVolume(volume);
          await synth.current.play(s.preset);
        } else {
          if (!audio.current) {
            audio.current = new Audio();
            audio.current.loop = true;
          }
          audio.current.src = s.src;
          audio.current.volume = volume;
          await audio.current.play();
        }
        setPlaying(true);
        unlock("dj");
      } catch (err) {
        console.warn("[radio] could not start", err);
        setPlaying(false);
        notify("RADIO OFFLINE", "Could not start audio on this device.", "📻");
      }
    },
    [stations, stopAll, volume, unlock, notify],
  );

  const play = useCallback(
    (i?: number) => {
      const target = i ?? index;
      setIndex(target);
      void start(target);
    },
    [index, start],
  );

  const pause = useCallback(() => {
    stopAll();
    setPlaying(false);
  }, [stopAll]);

  const toggle = useCallback(() => (playing ? pause() : play()), [playing, pause, play]);

  const step = useCallback(
    (dir: 1 | -1) => {
      const target = (index + dir + stations.length) % stations.length;
      setIndex(target);
      if (playing) void start(target);
    },
    [index, playing, start, stations.length],
  );

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    synth.current?.setVolume(v);
    if (audio.current) audio.current.volume = v;
  }, []);

  useEffect(
    () => () => {
      synth.current?.dispose();
      audio.current?.pause();
    },
    [],
  );

  const value = useMemo<RadioState>(
    () => ({
      stations,
      station: stations[index],
      index,
      playing,
      volume,
      toggle,
      play,
      pause,
      next: () => step(1),
      prev: () => step(-1),
      setVolume,
    }),
    [stations, index, playing, volume, toggle, play, pause, step, setVolume],
  );

  return <RadioContext.Provider value={value}>{children}</RadioContext.Provider>;
}
