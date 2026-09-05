import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { AngularPanel } from "@/components/ui/AngularPanel";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/motion/Reveal";
import { CaseStudySection } from "@/components/projects/CaseStudySection";
import { ProjectFeature } from "@/components/projects/ProjectFeature";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ProjectSpecs } from "@/components/projects/ProjectSpecs";
import { ProjectFiles } from "@/components/projects/ProjectFiles";
import { getAllProjects, getProjectBySlug } from "@/lib/content/projects";
import { getProjectMediaUrl } from "@/lib/content/media";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Automatically generates a static page for every project the loader
 * discovers — adding a new content/projects/ folder needs zero route
 * changes (spec §17, §72).
 */
export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.name,
    description: project.tagline,
  };
}

/**
 * Project case study (spec §14). Every section below is conditionally
 * rendered based on whether the underlying data is actually present —
 * caseStudy fields our data model doesn't have (e.g. a separate "design
 * process"/"architecture" split) are simply not fabricated; only fields
 * that exist on the schema are shown, and only when non-empty (spec §74).
 */
export default async function ProjectCaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { caseStudy } = project;
  const caseStudySections: { label: string; content: string }[] = [
    { label: "Overview", content: caseStudy.overview },
    { label: "The Problem", content: caseStudy.problem },
    { label: "The Objective", content: caseStudy.objective },
    { label: "The Solution", content: caseStudy.solution },
  ].filter((section) => section.content.trim().length > 0);

  const closingSections: { label: string; content: string }[] = [
    { label: "Challenges", content: caseStudy.challenges },
    { label: "Results", content: caseStudy.results },
    { label: "Lessons", content: caseStudy.lessons },
  ].filter((section) => section.content.trim().length > 0);

  const hasLinks = project.links.live !== "" || project.links.github !== "";

  return (
    <Container className="py-16 sm:py-24">
      <TechnicalLabel accent as="div">
        Project {project.id}
      </TechnicalLabel>
      <h1 className="mt-3 font-heading text-display-lg uppercase tracking-tight break-words sm:text-display-xl">
        {project.name}
      </h1>
      <p className="mt-4 max-w-2xl font-body text-body-lg text-foreground-muted">{project.tagline}</p>

      <dl className="mt-8 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-6">
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
      </dl>

      <AngularPanel className="relative mt-12 aspect-[16/9] overflow-hidden">
        <Image
          src={getProjectMediaUrl(project, project.media.hero)}
          alt={`${project.name} — ${project.tagline}`}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </AngularPanel>

      <div className="mt-16 flex flex-col gap-16">
        {caseStudySections.map((section) => (
          <CaseStudySection key={section.label} label={section.label} content={section.content} />
        ))}

        <Reveal>
          <ProjectSpecs project={project} />
        </Reveal>

        {project.features.length > 0 ? (
          <div>
            <TechnicalLabel accent as="div" className="mb-8">
              Features
            </TechnicalLabel>
            <div className="flex flex-col gap-16">
              {project.features.map((feature, index) => (
                <ProjectFeature key={feature.title} feature={feature} index={index} project={project} />
              ))}
            </div>
          </div>
        ) : null}

        {closingSections.map((section) => (
          <CaseStudySection key={section.label} label={section.label} content={section.content} />
        ))}

        {project.media.gallery.length > 0 ? (
          <Reveal>
            <ProjectGallery project={project} />
          </Reveal>
        ) : null}

        {hasLinks ? (
          <Reveal>
            <div>
              <TechnicalLabel accent as="div" className="mb-6">
                Links
              </TechnicalLabel>
              <div className="flex flex-wrap gap-6">
                {project.links.live !== "" ? (
                  <ArrowLink href={project.links.live} variant="primary" external>
                    View Live
                  </ArrowLink>
                ) : null}
                {project.links.github !== "" ? (
                  <ArrowLink href={project.links.github} variant="secondary" external>
                    Source Code
                  </ArrowLink>
                ) : null}
              </div>
            </div>
          </Reveal>
        ) : null}

        <Reveal>
          <ProjectFiles project={project} />
        </Reveal>
      </div>
    </Container>
  );
}
