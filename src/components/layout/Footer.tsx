import Link from "next/link";
import { siteConfig, fullName } from "@/config/site";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[var(--surface-strong)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-3xl">
            {siteConfig.brand}
          </p>
          <p className="mt-2 max-w-xs text-sm text-[var(--muted)]">
            The developer experience of {fullName}. Built one mission at a time.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="font-hud mb-3 text-[0.65rem] text-[var(--muted)]">Fast travel</p>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {[
              ["/#about", "Character"],
              ["/#skills", "Skill tree"],
              ["/projects", "Missions"],
              ["/#experience", "Story"],
              ["/blog", "City news"],
              ["/#contact", "Safehouse"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-[var(--muted)] transition hover:text-pink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="font-hud mb-3 text-[0.65rem] text-[var(--muted)]">Contacts</p>
          <ul className="space-y-2 text-sm">
            {siteConfig.socials.map((s) => (
              <li key={s.label}>
                <a href={s.url} target="_blank" rel="noreferrer" className="text-[var(--muted)] transition hover:text-ocean">
                  {s.label} <span className="opacity-50">{s.handle}</span>
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${siteConfig.player.email}`} className="text-[var(--muted)] transition hover:text-ocean">
                {siteConfig.player.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {fullName}. Press <kbd className="rounded border border-white/20 px-1 font-mono">`</kbd> for the terminal.
          </p>
          <p className="opacity-70">Fan-inspired design. Not affiliated with or endorsed by any game studio.</p>
        </div>
      </div>
    </footer>
  );
}
