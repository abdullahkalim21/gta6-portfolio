import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-4 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,79,145,.25),transparent_60%)]" />
      <div className="scanlines absolute inset-0 opacity-40" />
      <div className="relative">
        <p className="font-hud text-xs text-ocean">ERROR 404 · SIGNAL LOST</p>
        <h1 className="font-display mt-3 text-[22vw] leading-none text-neon-pink sm:text-[11rem]">Mission failed</h1>
        <p className="mx-auto mt-4 max-w-md text-[var(--muted)]">
          You drove off the edge of the map. This location doesn&apos;t exist — or it was never built.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Respawn at home
          </Link>
          <Link href="/projects" className="btn btn-ghost">
            Browse missions
          </Link>
        </div>
      </div>
    </main>
  );
}
