import { LoadingScreen } from "@/components/intro/LoadingScreen";
import { Hero } from "@/components/hero/Hero";
import { CityMap } from "@/components/city-map/CityMap";
import { CharacterSection } from "@/components/sections/CharacterSection";
import { SkillTree } from "@/components/skill-tree/SkillTree";
import { MissionsSection } from "@/components/missions/MissionsSection";
import { StorySection } from "@/components/sections/StorySection";
import { BeachClubSection } from "@/components/sections/BeachClubSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { HireSection } from "@/components/contact/HireSection";
import { getPosts, getProjects, getSkills } from "@/lib/data";
import { env } from "@/lib/env";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { pageMetadata, personJsonLd, websiteJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const revalidate = 60;

export const metadata: Metadata = {
  ...pageMetadata({ description: siteConfig.seo.description, path: "/", type: "profile" }),
  title: { absolute: siteConfig.seo.title },
};

export default async function HomePage() {
  const [projects, skills, posts] = await Promise.all([getProjects(), getSkills(), getPosts()]);

  return (
    <>
      <JsonLd data={[personJsonLd(), websiteJsonLd()]} />
      <LoadingScreen />
      <Hero />
      <CityMap />
      <CharacterSection />
      <SkillTree skills={skills} />
      <MissionsSection projects={projects} />
      <StorySection />
      <BeachClubSection />
      <NewsSection posts={posts} />
      <HireSection calendlyUrl={env.calendlyUrl} />
    </>
  );
}
