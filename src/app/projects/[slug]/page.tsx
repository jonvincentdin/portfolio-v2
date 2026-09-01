import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";

/**
 * Placeholder dynamic route — establishes /projects/[slug] before the
 * content engine (Milestone 02) and case-study build (Milestone 06) exist.
 * Once the project loader lands, this will call getProjectBySlug(slug) and
 * generateStaticParams() will replace this stub entirely.
 */
export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Container className="min-h-[60vh] py-24">
      <TechnicalLabel accent>Project case study</TechnicalLabel>
      <SectionHeading title={slug} className="mt-3" />
      <p className="mt-6 max-w-xl font-body text-body-md text-foreground-muted">
        Case study content is driven by content/projects/{slug}/project.json
        once the content engine (Milestone 02) and case study build
        (Milestone 06) land.
      </p>
    </Container>
  );
}
