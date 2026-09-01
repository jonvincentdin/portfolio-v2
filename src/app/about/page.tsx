import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Placeholder route — established in Milestone 01 so the site's information
 * architecture and navigation are all wired up. Full page build is
 * Milestone 07.
 */
export default function AboutPage() {
  return (
    <Container className="min-h-[60vh] py-24">
      <SectionHeading kicker="02 / About" title="About" />
      <p className="mt-6 max-w-xl font-body text-body-md text-foreground-muted">
        This section is scaffolded and routable. Full content and design
        land in Milestone 07.
      </p>
    </Container>
  );
}
