import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Placeholder route — established in Milestone 01 so the site's information
 * architecture and navigation are all wired up. Full page build is
 * Milestones 04–05.
 */
export default function ProjectsPage() {
  return (
    <Container className="min-h-[60vh] py-24">
      <SectionHeading kicker="03 / Projects" title="Projects" />
      <p className="mt-6 max-w-xl font-body text-body-md text-foreground-muted">
        This section is scaffolded and routable. Full content and design
        land in Milestones 04–05.
      </p>
    </Container>
  );
}
