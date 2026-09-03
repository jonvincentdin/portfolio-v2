import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectShowroom } from "@/components/projects/ProjectShowroom";
import { getAllProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
};

/**
 * Projects showroom (spec §12–§13). Milestone 04: loader integration,
 * current-project state, image/info display, previous/next, counter, and a
 * basic thumbnail selector — functionality first. Directional transition
 * motion and touch gestures land in Milestone 05.
 */
export default function ProjectsPage() {
  const projects = getAllProjects();

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
    <Container size="wide" className="py-16 sm:py-24">
      <ProjectShowroom projects={projects} />
    </Container>
  );
}
