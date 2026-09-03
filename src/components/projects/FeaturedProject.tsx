import Image from "next/image";
import { AngularPanel } from "@/components/ui/AngularPanel";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { getProjectMediaUrl, type LoadedProject } from "@/lib/content";

type FeaturedProjectProps = {
  project: LoadedProject;
};

/**
 * Home page's "featured build" section (spec §9). Not a reuse of the
 * (not-yet-built) showroom's ProjectSpecs — this is a simpler, Home-specific
 * composition. When ProjectSpecs lands in Milestone 04, revisit whether this
 * should delegate to it instead of duplicating the metadata row.
 */
export function FeaturedProject({ project }: FeaturedProjectProps) {
  const headingId = "featured-project-heading";

  return (
    <section aria-labelledby={headingId}>
      <SectionHeading kicker="Featured Build" title={project.name} headingId={headingId} />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
        <AngularPanel className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={getProjectMediaUrl(project, project.media.hero)}
            alt={`${project.name} — ${project.tagline}`}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
            priority
          />
        </AngularPanel>

        <div>
          <TechnicalLabel accent as="div" className="mb-3">
            Project {project.id}
          </TechnicalLabel>
          <p className="font-body text-body-lg text-foreground-muted">{project.tagline}</p>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-6 sm:grid-cols-3">
            <div>
              <dt className="mb-1">
                <TechnicalLabel>Year</TechnicalLabel>
              </dt>
              <dd className="font-body text-body-md">{project.year}</dd>
            </div>
            <div>
              <dt className="mb-1">
                <TechnicalLabel>Role</TechnicalLabel>
              </dt>
              <dd className="font-body text-body-md">{project.role.join(", ")}</dd>
            </div>
            <div>
              <dt className="mb-1">
                <TechnicalLabel>Status</TechnicalLabel>
              </dt>
              <dd className="font-body text-body-md">{project.status}</dd>
            </div>
            <div className="col-span-2 sm:col-span-3">
              <dt className="mb-1">
                <TechnicalLabel>Technologies</TechnicalLabel>
              </dt>
              <dd className="font-body text-body-md">{project.technologies.join(" / ")}</dd>
            </div>
          </dl>

          <ArrowLink href={`/projects/${project.slug}`} variant="primary" className="mt-8">
            View Project
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
