"use client";

import Image from "next/image";
import Link from "next/link";
import { getProjectMediaUrl, type LoadedProject } from "@/lib/content/media";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";

type GridTemplateProps = {
  projects: LoadedProject[];
  label: string;
  kicker?: string;
};

/**
 * Responsive CSS auto-fill grid of project cards. Each card shows a 4:3
 * thumbnail with a scale-on-hover effect and a body with project name,
 * tagline, year, and category. Accent border glow on hover.
 */
export function GridTemplate({ projects, label, kicker }: GridTemplateProps) {
  return (
    <section>
      {kicker || label ? (
        <div className="mb-8">
          {kicker ? <TechnicalLabel accent>{kicker}</TechnicalLabel> : null}
          <h2 className="mt-2 font-heading text-heading-lg uppercase tracking-tight">{label}</h2>
        </div>
      ) : null}

      <div className="project-grid">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="project-grid__card group"
          >
            <div className="project-grid__image">
              <Image
                src={getProjectMediaUrl(project, project.media.thumbnail)}
                alt={project.name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="project-grid__body">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-heading text-heading-md uppercase tracking-tight">
                  {project.name}
                </h3>
                <span className="font-technical text-technical-label text-foreground-muted">
                  {project.year}
                </span>
              </div>
              <p className="mt-1 font-body text-body-md text-foreground-muted line-clamp-2">
                {project.tagline}
              </p>
              {project.category ? (
                <div className="mt-3">
                  <TechnicalLabel>{project.category}</TechnicalLabel>
                </div>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

