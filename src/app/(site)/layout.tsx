import { GameProvider } from "@/components/providers/GameProvider";
import { RadioProvider } from "@/components/providers/RadioProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { WeatherLayer } from "@/components/effects/WeatherLayer";
import { MiniPlayer } from "@/components/hud/MiniPlayer";
import { Phone } from "@/components/phone/Phone";
import { Terminal } from "@/components/terminal/Terminal";
import { getPosts, getProjects } from "@/lib/data";
import { env } from "@/lib/env";

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const phoneProjects = projects.map(({ slug, title, summary, color, image, tech }) => ({ slug, title, summary, color, image, tech }));
  const phonePosts = posts.map(({ slug, title, excerpt, tag, color, publishedAt }) => ({ slug, title, excerpt, tag, color, publishedAt }));

  return (
    <GameProvider>
      <RadioProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-pink focus:px-4 focus:py-2 focus:font-bold focus:text-white"
        >
          Skip to content
        </a>
        <Navbar />
        <WeatherLayer />
        <main id="main">{children}</main>
        <Footer />
        <MiniPlayer />
        <Phone projects={phoneProjects} posts={phonePosts} calendlyUrl={env.calendlyUrl} />
        <Terminal projects={phoneProjects} />
        <CustomCursor />
        <div className="grain" aria-hidden />
      </RadioProvider>
    </GameProvider>
  );
}
