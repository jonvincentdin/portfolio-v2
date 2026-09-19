"use client";

import Image from "next/image";
import Link from "next/link";
import { getProjectMediaUrl, type LoadedProject } from "@/lib/content/media";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";

type FilmStripTemplateProps = {
  projects: LoadedProject[];
  label: string;
  kicker?: string;
};

/**
 * Horizontal contact-sheet / film-strip row of equal square frames.
 * Each cell has sprocket-hole-style notches rendered via CSS pseudo-elements
 * and a hover-reveal overlay with the project name. Scrolls natively.
 */
export function FilmStripTemplate({ projects, label, kicker }: FilmStripTemplateProps) {
  return (
    <section>
      {kicker || label ? (
        <div className="mb-6">
          {kicker ? <TechnicalLabel accent>{kicker}</TechnicalLabel> : null}
          <h2 className="mt-2 font-heading text-heading-lg uppercase tracking-tight">{label}</h2>
        </div>
      ) : null}

      <div className="project-film-strip" role="list">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            role="listitem"
            className="project-film-strip__cell group"
            aria-label={project.name}
          >
            <div className="project-film-strip__frame">
              <Image
                src={getProjectMediaUrl(project, project.media.thumbnail)}
                alt={project.name}
                fill
                sizes="220px"
                className="object-cover"
              />
              <div className="project-film-strip__overlay">
                <div>
                  <p className="font-technical text-technical-label uppercase tracking-[0.1em] text-accent">
                    {project.year}
                  </p>
                  <p className="mt-0.5 font-heading text-[0.9rem] uppercase leading-tight text-white">
                    {project.name}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

