import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectSectionRenderer } from "@/components/projects/ProjectSectionRenderer";
import { getAllProjects } from "@/lib/content";
import { getSiteExperience } from "@/lib/content/editor";
import { DEFAULT_PROJECT_SECTIONS } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A showroom of full-stack development projects — browse specs, tech stack, and case studies.",
  openGraph: {
    title: "Projects",
    description: "A showroom of full-stack development projects.",
  },
};

/**
 * Projects page — renders one section per entry in `siteExperience.projectSections`.
 * Each section has its own layout template (showroom, carousel, grid, timeline,
 * spotlight, or film-strip) and can show a subset of projects by slug.
 * Sections are configured in the /editor under "Projects layout".
 */
export default async function ProjectsPage() {
  const [projects, siteExperience] = await Promise.all([
    getAllProjects(),
    getSiteExperience(),
  ]);

  const sections = (siteExperience.projectSections ?? DEFAULT_PROJECT_SECTIONS).filter(
    (section) => section.visible !== false,
  );

  if (projects.length === 0) {
    return (
      <Container className="min-h-[60vh] py-24">
        <SectionHeading kicker="03 / Projects" title="Projects" />
        <p className="mt-6 max-w-xl font-body text-body-md text-foreground-muted">
          No projects have been added yet. Add a folder under
          content/projects/ to populate this section.
        </p>
      </Container>
    );
  }

  return (
    <div className="divide-y divide-border">
      {sections.map((section) => (
        <Container key={section.id} size="wide" className="py-16 sm:py-24">
          <ProjectSectionRenderer section={section} allProjects={projects} />
        </Container>
      ))}
    </div>
  );
}
