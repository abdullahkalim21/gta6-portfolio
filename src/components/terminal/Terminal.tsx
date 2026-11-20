"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig, fullName, mapLocations } from "@/config/site";
import { achievements } from "@/config/achievements";
import { useGame, type TimeOfDay, type Weather } from "@/components/providers/GameProvider";
import { useRadio } from "@/components/providers/RadioProvider";
import type { PhoneProject } from "@/components/phone/Phone";

type Line = { kind: "in" | "out" | "err" | "ok"; text: string };

const banner: Line[] = [
  { kind: "ok", text: `${siteConfig.brand} terminal v1.0 — connected to ${siteConfig.cityName}` },
  { kind: "out", text: "Type 'help' to see available commands. Press Esc to close." },
];

export function Terminal({ projects }: { projects: PhoneProject[] }) {
  const game = useGame();
  const radio = useRadio();
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>(banner);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (game.terminalOpen) window.setTimeout(() => inputRef.current?.focus(), 50);
  }, [game.terminalOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const print = (...out: (string | Line)[]) =>
    setLines((l) => [...l, ...out.map((o) => (typeof o === "string" ? ({ kind: "out", text: o } as Line) : o))]);

  const goto = (hash: string) => {
    game.setTerminalOpen(false);
    router.push(`/#${hash}`);
  };

  const commands: Record<string, { desc: string; run: (args: string[]) => void; hidden?: boolean }> = {
    help: {
      desc: "List commands",
      run: () =>
        print(
          ...Object.entries(commands)
            .filter(([, c]) => !c.hidden)
            .map(([name, c]) => `  ${name.padEnd(14)} ${c.desc}`),
        ),
    },
    whoami: { desc: "Who is this developer?", run: () => print(`${fullName} — ${siteConfig.player.role}`, siteConfig.player.intro) },
    about: { desc: "Read the bio", run: () => print(...siteConfig.bio) },
    skills: {
      desc: "Show character stats",
      run: () => print(...siteConfig.stats.map((s) => `  ${s.label.padEnd(24)} [${"=".repeat(Math.round(s.value / 10)).padEnd(10, "-")}] ${s.value}`)),
    },
    projects: {
      desc: "List missions",
      run: () => print(...projects.map((p, i) => `  [${String(i + 1).padStart(2, "0")}] ${p.slug.padEnd(24)} ${p.title}`), "Use 'open <number|slug>' to view one."),
    },
    open: {
      desc: "open <n|slug> — open a mission",
      run: ([arg]) => {
        const p = projects[Number(arg) - 1] ?? projects.find((x) => x.slug === arg);
        if (!p) return print({ kind: "err", text: `Mission not found: ${arg ?? ""}` });
        print({ kind: "ok", text: `Loading mission ${p.title}…` });
        game.setTerminalOpen(false);
        router.push(`/projects/${p.slug}`);
      },
    },
    goto: {
      desc: `goto <place> — fast travel (${mapLocations.map((l) => l.id).join(", ")}, map)`,
      run: ([arg]) => {
        const loc = mapLocations.find((l) => l.id === arg || l.name.toLowerCase().replace(/\s/g, "") === arg);
        if (arg === "map") return goto("map");
        if (!loc) return print({ kind: "err", text: "Unknown destination. Try: " + mapLocations.map((l) => l.id).join(", ") });
        game.visit(loc.id);
        goto(loc.id);
      },
    },
    contact: { desc: "How to reach me", run: () => print(`  email   ${siteConfig.player.email}`, ...siteConfig.socials.map((s) => `  ${s.label.toLowerCase().padEnd(8)}${s.url}`)) },
    hire: { desc: "Start a mission together", run: () => goto("contact") },
    resume: {
      desc: "Download my resume",
      run: () => {
        window.open(siteConfig.player.resumeUrl, "_blank");
        print({ kind: "ok", text: "Opening dossier…" });
      },
    },
    blog: {
      desc: "Read city news",
      run: () => {
        game.setTerminalOpen(false);
        router.push("/blog");
      },
    },
    time: {
      desc: "time <day|sunset|night>",
      run: ([arg]) => {
        if (!["day", "sunset", "night"].includes(arg)) return print({ kind: "err", text: "Usage: time <day|sunset|night>" });
        game.setTime(arg as TimeOfDay);
        print({ kind: "ok", text: `Time set to ${arg}.` });
      },
    },
    weather: {
      desc: "weather <clear|rain|fog>",
      run: ([arg]) => {
        if (!["clear", "rain", "fog"].includes(arg)) return print({ kind: "err", text: "Usage: weather <clear|rain|fog>" });
        game.setWeather(arg as Weather);
        print({ kind: "ok", text: `Weather set to ${arg}.` });
      },
    },
    radio: {
      desc: "radio <on|off|next>",
      run: ([arg]) => {
        if (arg === "off") radio.pause();
        else if (arg === "next") radio.next();
        else radio.play();
        print({ kind: "ok", text: arg === "off" ? "Radio off." : `Tuning in… ${radio.station.name}` });
      },
    },
    achievements: {
      desc: "Show your trophies",
      run: () =>
        print(...achievements.map((a) => `  ${game.unlocked.has(a.id) ? "[✓]" : "[ ]"} ${game.unlocked.has(a.id) ? a.title : "???"}`), `${game.unlocked.size}/${achievements.length} unlocked`),
    },
    phone: {
      desc: "Open the smartphone",
      run: () => {
        game.setTerminalOpen(false);
        game.setPhoneOpen(true);
      },
    },
    ls: {
      desc: "List files",
      run: ([flag]) => print(flag === "-a" || flag === "-la" ? "  .  ..  .hideout/  about.txt  missions/  resume.pdf" : "  about.txt  missions/  resume.pdf"),
    },
    cat: {
      desc: "cat <file>",
      run: ([file]) => {
        if (file === "about.txt") return commands.about.run([]);
        if (file === "resume.pdf") return print("Binary file. Try 'resume' instead.");
        print({ kind: "err", text: `cat: ${file ?? ""}: No such file` });
      },
    },
    cd: {
      desc: "Change directory",
      hidden: true,
      run: ([dir]) => {
        if (dir === ".hideout" || dir === ".hideout/") {
          print({ kind: "ok", text: "Access granted. Entering hideout…" });
          game.setTerminalOpen(false);
          router.push("/hideout");
        } else if (dir === "missions" || dir === "missions/") commands.projects.run([]);
        else print({ kind: "err", text: `cd: ${dir ?? ""}: Permission denied` });
      },
    },
    sudo: {
      desc: "Superuser do",
      hidden: true,
      run: (args) => {
        if (args.join(" ") === "hire-me" || args.join(" ") === "hire me") {
          print({ kind: "ok", text: "Permission granted. Excellent choice." });
          return goto("contact");
        }
        game.addWanted(2);
        print({ kind: "err", text: "Nice try. This incident will be reported. ★★" });
      },
    },
    date: { desc: "Current date", hidden: true, run: () => print(new Date().toString()) },
    echo: { desc: "Echo text", hidden: true, run: (args) => print(args.join(" ")) },
    clear: { desc: "Clear the screen", run: () => setLines([]) },
    exit: { desc: "Close the terminal", run: () => game.setTerminalOpen(false) },
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = input.trim();
    setInput("");
    setCursor(-1);
    if (!raw) return;
    setHistory((h) => [raw, ...h].slice(0, 50));
    setLines((l) => [...l, { kind: "in", text: raw }]);
    const [name, ...args] = raw.split(/\s+/);
    const cmd = commands[name.toLowerCase()];
    if (cmd) cmd.run(args);
    else print({ kind: "err", text: `command not found: ${name}. Type 'help'.` });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(history.length - 1, cursor + 1);
      if (history[next] !== undefined) {
        setCursor(next);
        setInput(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = cursor - 1;
      setCursor(Math.max(-1, next));
      setInput(next >= 0 ? history[next] : "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const match = Object.keys(commands).find((c) => c.startsWith(input) && !commands[c].hidden);
      if (match && input) setInput(match + " ");
    } else if (e.key === "`") {
      e.preventDefault();
      game.setTerminalOpen(false);
    }
  };

  const color: Record<Line["kind"], string> = { in: "text-white", out: "text-[#c8c3e6]", err: "text-pink", ok: "text-mint" };

  return (
    <AnimatePresence>
      {game.terminalOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Developer terminal"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
          className="fixed inset-x-0 top-0 z-[88] h-[min(60vh,520px)] border-b-2 border-pink/60 bg-[#08060f]/95 font-mono text-sm shadow-[0_20px_60px_rgba(0,0,0,.6)] backdrop-blur"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
            <span className="text-xs text-[var(--muted)]">
              guest@{siteConfig.brand.toLowerCase()}:~
            </span>
            <button type="button" onClick={() => game.setTerminalOpen(false)} className="text-xs text-[var(--muted)] hover:text-pink" aria-label="Close terminal">
              [esc] close
            </button>
          </div>
          <div ref={scrollRef} className="h-[calc(100%-5.5rem)] overflow-y-auto px-4 py-3" aria-live="polite">
            {lines.map((l, i) => (
              <pre key={i} className={`whitespace-pre-wrap break-words leading-relaxed ${color[l.kind]}`}>
                {l.kind === "in" ? <><span className="text-ocean">❯</span> {l.text}</> : l.text}
              </pre>
            ))}
          </div>
          <form onSubmit={submit} className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
            <span className="text-ocean" aria-hidden>
              ❯
            </span>
            <label htmlFor="terminal-input" className="sr-only">
              Terminal command
            </label>
            <input
              id="terminal-input"
              autoFocus
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="flex-1 bg-transparent text-white caret-pink outline-none"
              placeholder="type 'help'"
            />
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
