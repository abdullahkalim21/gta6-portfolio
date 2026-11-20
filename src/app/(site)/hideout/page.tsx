import type { Metadata } from "next";
import Link from "next/link";
import { UnlockOnMount } from "@/components/easter-eggs/UnlockOnMount";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Hideout", robots: { index: false, follow: false } };

const secrets = [
  ["Konami code", "↑ ↑ ↓ ↓ ← → ← → B A anywhere on the site"],
  ["Terminal", "Press ` (backtick). Try `sudo hire-me`."],
  ["Wanted level", "Click the HUD stars — or the big name in the hero."],
  ["Weather", "Make it rain from the navbar or `weather rain`."],
  ["Explorer", "Visit every district on the map."],
];

export default function HideoutPage() {
  return (
    <section className="relative mx-auto flex min-h-[80vh] max-w-3xl flex-col justify-center px-4 pb-24 pt-32 sm:px-6">
      <UnlockOnMount id="secret-spot" />
      <p className="font-hud text-xs text-mint">🔑 SECRET LOCATION DISCOVERED</p>
      <h1 className="font-display mt-3 text-6xl leading-none sm:text-8xl">
        The <span className="text-sunset">hideout</span>
      </h1>
      <p className="mt-4 text-lg text-[var(--muted)]">
        You found the developer&apos;s hideout. Not many visitors make it this far into {siteConfig.cityName}. Here&apos;s the
        cheat sheet — keep it between us.
      </p>
      <ul className="glass mt-10 divide-y divide-white/10 rounded-2xl">
        {secrets.map(([title, text]) => (
          <li key={title} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-hud text-xs text-pink">{title}</span>
            <span className="text-sm text-[var(--muted)]">{text}</span>
          </li>
        ))}
      </ul>
      <Link href="/" className="btn btn-ghost mt-10 self-start">
        ‹ Back to the city
      </Link>
    </section>
  );
}
