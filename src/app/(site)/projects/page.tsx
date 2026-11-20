import type { Metadata } from "next";
import { getProjects } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MissionBrowser } from "@/components/missions/MissionBrowser";

export const revalidate = 60;
export const metadata: Metadata = { title: "Missions", description: "Every project, presented as a mission." };

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6">
      <SectionHeader kicker="🏢 BUSINESS BAY" title="All" accent="missions" description="Filter by status or tech stack. Click a mission for the full case study." />
      <MissionBrowser projects={projects} />
    </section>
  );
}
