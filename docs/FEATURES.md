# Features and easter eggs

> ⚠️ Spoilers ahead. This page lists every secret.

## Navigation layers

The site works three ways, so nobody gets stuck:

1. **Conventional:** top navbar, footer links and normal scrolling. A **Skip to content** link appears on the first Tab press.
2. **The map:** click a district, or Tab to it and press Enter, to fast-travel to its section. The side list mirrors the map for small screens and screen readers.
3. **The terminal:** `goto skills`, `open 1`, `hire`…

## Game state

`src/components/providers/GameProvider.tsx` holds all game state:

| State | Persisted? | Notes |
|---|---|---|
| Time of day | `localStorage` | Applied before first paint by an inline script, so there's no flash |
| Weather | `localStorage` | |
| Achievements | `localStorage` | Reset from Phone → Settings |
| Visited districts | `localStorage` | Sections are marked visited when they scroll into view, or when clicked on the map |
| Wanted level | memory | Decays one star every 15 seconds |
| Intro seen | `sessionStorage` | Shows again in a new browser session |

Nothing is sent to a server.

## Keyboard shortcuts

| Key | Action |
|---|---|
| `` ` `` or `~` | Toggle the developer terminal |
| `Esc` | Close the phone / terminal |
| `Enter` / `Space` | Start the game from the loading screen |
| `↑ ↑ ↓ ↓ ← → ← → B A` | 🕹️ Cheat code: night + rain, unlocks **Old School** |

## Terminal commands

```
help            whoami          about           skills
projects        open <n|slug>   goto <place>    contact
hire            resume          blog            time <day|sunset|night>
weather <...>   radio <on|off|next>             achievements
phone           ls              cat <file>      clear     exit
```

Hidden: `ls -a`, `cd .hideout`, `sudo hire-me`, `sudo <anything else>` (raises your wanted level), `date`, `echo`.

Arrow keys browse history. Tab autocompletes.

## Achievements

| Trophy | How |
|---|---|
| 🌆 Welcome to the City | Enter from the loading screen |
| 🗺️ Explorer | Visit all six districts |
| 📁 Mission Briefing | Open a project case study |
| 📱 Phone Home | Open the phone |
| 📻 On the Air | Play the radio |
| 💻 Hacker | Open the terminal |
| 🌙 Night Owl | Switch to night |
| 🌧️ Storm Chaser | Make it rain |
| ⭐ Most Wanted | Reach 5 wanted stars: click the HUD stars, click the giant name in the hero, or misuse `sudo` |
| 🕹️ Old School | Konami code |
| 🔑 Off the Map | Find `/hideout` (`ls -a` in the terminal) |
| 📰 Breaking News | Read a blog post |
| 🤝 Mission Accepted | Send a message |

## Procedural radio

`src/lib/radio-engine.ts` is a small Web Audio step sequencer:

- A 25 ms timer schedules 16th-notes about 150 ms ahead on the `AudioContext` clock, so timing stays rock-solid.
- Instruments are built from oscillators and filtered noise: kick, snare, hats, bass, a detuned pad, an arpeggio and a random lead.
- A generated impulse response gives cheap reverb, and a feedback delay adds echo to the arps.
- The engine is lazy-loaded the first time someone presses play.

## Performance notes

- The skyline is a single deterministic SVG (a seeded RNG gives the same city on server and client).
- Rain is one `<canvas>` with a single stroke path per frame.
- Heavy client features (radio engine) are dynamically imported.
- Pages are statically generated with ISR (60 s).
- `prefers-reduced-motion` turns off grain, parallax, rain animation and the custom cursor, and makes transitions instant.

## Accessibility notes

- Map pins are focusable `role="button"` elements with labels; the destination list is real `<button>`s.
- The phone is a modal dialog with a focus trap, and returns focus when it closes.
- Stat bars use `role="meter"` with values.
- Toasts announce through an `aria-live` region.
- The loading screen is hidden for no-JS visitors via `<noscript>` CSS.
