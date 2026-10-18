import type { Metadata } from "next";
import Link from "next/link";
import { SectionNavigation } from "@/components/layout/SectionNavigation";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { AngularPanel } from "@/components/ui/AngularPanel";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ImageMask } from "@/components/motion/ImageMask";
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
export async function generateStaticParams() {
  return (await getAllProjects()).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.name,
    description: project.tagline,
    openGraph: {
      title: project.name,
      description: project.tagline,
      images: [{ url: getProjectMediaUrl(project, project.media.hero) }],
    },
    twitter: {
      title: project.name,
      description: project.tagline,
    },
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
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { caseStudy } = project;
  const caseStudySections: { id: string; label: string; content: string }[] = [
    { id: "overview", label: "Overview", content: caseStudy.overview },
    { id: "problem", label: "The Problem", content: caseStudy.problem },
    { id: "objective", label: "The Objective", content: caseStudy.objective },
    { id: "solution", label: "The Solution", content: caseStudy.solution },
  ].filter((section) => section.content.trim().length > 0);

  const closingSections: { id: string; label: string; content: string }[] = [
    { id: "challenges", label: "Challenges", content: caseStudy.challenges },
    { id: "results", label: "Results", content: caseStudy.results },
    { id: "lessons", label: "Lessons", content: caseStudy.lessons },
  ].filter((section) => section.content.trim().length > 0);

  const hasLinks = project.links.live !== "" || project.links.github !== "" || project.links.additional.length > 0;

  const sectionLinks = [
    ...caseStudySections.map(({ id, label }) => ({ id, label })),
    { id: "specifications", label: "Specifications" },
    ...(project.features.length ? [{ id: "features", label: "Features" }] : []),
    ...closingSections.map(({ id, label }) => ({ id, label })),
    ...(project.media.gallery.length ? [{ id: "screenshots", label: "Screenshots" }] : []),
    ...(project.downloadable ? [{ id: "files", label: "Files" }] : []),
  ];

  return (
    <Container className="py-16 sm:py-24">
      <Link href="/projects" className="motion-control mb-8 inline-flex min-h-11 items-center font-technical text-technical-label uppercase tracking-[0.1em] text-foreground-muted hover:text-accent">
        Back to projects
      </Link>
      <TechnicalLabel accent as="div">
        Project {project.id}
      </TechnicalLabel>
      <h1 className="mt-3 max-w-[18ch] font-heading text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.05] uppercase tracking-tight break-words">
        {project.name}
      </h1>
      <p className="mt-4 max-w-2xl font-body text-body-lg text-foreground-muted">{project.tagline}</p>

      <dl className="mt-8 grid max-w-2xl grid-cols-1 gap-5 border-t border-border pt-6 sm:grid-cols-[0.6fr_1.4fr_1fr] sm:gap-8">
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

      {hasLinks ? (
        <div className="mt-8">
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
              {project.links.additional.map((link) => (
                <ArrowLink key={link.url} href={link.url} variant="secondary" external>
                  {link.label}
                </ArrowLink>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <SectionNavigation sections={sectionLinks} />

      <AngularPanel className="project-media-frame relative mt-8 aspect-[16/10] overflow-hidden sm:mt-12 sm:aspect-[16/9]">
        <ImageMask className="absolute inset-0">
          <Image
            src={getProjectMediaUrl(project, project.media.hero)}
            alt={`${project.name} — ${project.tagline}`}
            fill
            sizes="(min-width: 1280px) 1152px, 100vw"
            className="object-contain"
            priority
          />
        </ImageMask>
      </AngularPanel>

      <div className="mt-12 flex flex-col gap-12 sm:mt-20 sm:gap-20">
        {caseStudySections.map((section) => (
          <CaseStudySection key={section.id} id={section.id} label={section.label} content={section.content} />
        ))}

        <section id="specifications" tabIndex={-1} className="section-anchor">
          <ProjectSpecs project={project} headingAs="h2" />
        </section>

        {project.features.length > 0 ? (
          <section id="features" tabIndex={-1} className="section-anchor">
            <TechnicalLabel accent as="h2" className="mb-8">
              Features
            </TechnicalLabel>
            <div className="flex flex-col gap-16">
              {project.features.map((feature, index) => (
                <ProjectFeature key={feature.title} feature={feature} index={index} project={project} />
              ))}
            </div>
          </section>
        ) : null}

        {closingSections.map((section) => (
          <CaseStudySection key={section.id} id={section.id} label={section.label} content={section.content} />
        ))}

        {project.media.gallery.length > 0 ? (
          <section id="screenshots" tabIndex={-1} className="section-anchor">
            <ProjectGallery project={project} />
          </section>
        ) : null}

        {project.downloadable ? (
          <section id="files" tabIndex={-1} className="section-anchor">
            <ProjectFiles project={project} />
          </section>
        ) : null}
      </div>
    </Container>
  );
}
