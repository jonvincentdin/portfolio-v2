"use client";

import Image from "next/image";
import Link from "next/link";
import { getProjectMediaUrl, type LoadedProject } from "@/lib/content/media";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { ArrowLink } from "@/components/ui/ArrowLink";

type TimelineTemplateProps = {
  projects: LoadedProject[];
  label: string;
  kicker?: string;
};

/**
 * Vertical timeline layout. Year appears on the left with an accent dot
 * anchored to a connecting vertical rule. Project card (image + meta) sits
 * on the right. Adapts to a left-border strip on mobile.
 */
export function TimelineTemplate({ projects, label, kicker }: TimelineTemplateProps) {
  return (
    <section>
      {kicker || label ? (
        <div className="mb-12">
          {kicker ? <TechnicalLabel accent>{kicker}</TechnicalLabel> : null}
          <h2 className="mt-2 font-heading text-heading-lg uppercase tracking-tight">{label}</h2>
        </div>
      ) : null}

      <div className="project-timeline">
        {projects.map((project) => (
          <div key={project.slug} className="project-timeline__item">
            {/* Year column */}
            <div className="project-timeline__year">
              <span className="font-technical text-technical-label uppercase tracking-[0.1em] text-accent">
                {project.year}
              </span>
            </div>

            {/* Card column */}
            <div className="project-timeline__card group">
              <div className="relative aspect-[16/7] overflow-hidden">
                <Image
                  src={getProjectMediaUrl(project, project.media.hero)}
                  alt={project.name}
                  fill
                  sizes="(min-width: 1024px) 70vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="font-heading text-heading-md uppercase tracking-tight">
                    {project.name}
                  </h3>
                  {project.category ? (
                    <TechnicalLabel>{project.category}</TechnicalLabel>
                  ) : null}
                </div>
                <p className="mt-2 font-body text-body-md text-foreground-muted">
                  {project.tagline}
                </p>
                <div className="mt-4">
                  <ArrowLink href={`/projects/${project.slug}`} variant="secondary">
                    View case study
                  </ArrowLink>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

