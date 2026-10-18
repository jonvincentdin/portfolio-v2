import type { Metadata } from "next";
import { ArrowLink } from "@/components/ui/ArrowLink";
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
    (section) => section.visible !== false && (!section.projectSlugs?.length || projects.some((project) => section.projectSlugs?.includes(project.slug))),
  );

  if (projects.length === 0 || sections.length === 0) {
    return (
      <Container className="min-h-[60vh] py-24">
        <SectionHeading as="h1" kicker="03 / Projects" title="Projects" />
        <p className="mt-6 max-w-xl font-body text-body-md text-foreground-muted">
          Project details are being prepared. Get in touch to discuss my work.
        </p>
        <ArrowLink href="/contact" className="mt-6">Contact me</ArrowLink>
      </Container>
    );
  }

  return (
    <div>
      <Container className="pt-16 sm:pt-24">
        <SectionHeading as="h1" kicker="03 / Work" title="Projects" />
        <p className="mt-4 max-w-2xl text-foreground-muted">Explore each build, then open its case study for the story, specifications, and results.</p>
      </Container>
      {sections.map((section) => (
        <Container
          key={section.id}
          size={section.template === "showroom" ? "wide" : "default"}
          className="py-16 sm:py-24"
        >
          <ProjectSectionRenderer section={section} allProjects={projects} />
        </Container>
      ))}
    </div>
  );
}
