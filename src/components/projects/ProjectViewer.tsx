"use client";

import Image from "next/image";
import { AngularPanel } from "@/components/ui/AngularPanel";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { getProjectMediaUrl, type LoadedProject } from "@/lib/content/media";
import { ProjectSpecs } from "./ProjectSpecs";
import { ProjectInteractiveFrame } from "./ProjectInteractiveFrame";

type ProjectViewerProps = {
  project: LoadedProject;
  index: number;
};

/**
 * One project slide in the track-based showroom.
 * All motion comes from the parent track's translateX — no AnimatePresence here.
 * Navigation buttons live in ProjectShowroom (fixed row) so they never shift.
 */
export function ProjectViewer({ project, index }: ProjectViewerProps) {
  return (
    <div className="select-none lg:grid lg:grid-cols-[340px_1fr] lg:gap-x-10">

      <div className="mt-2 lg:mt-0 lg:[grid-column:1] lg:[grid-row:2]">
        <h1 className="font-heading text-heading-lg uppercase tracking-tight break-words">
          {project.name}
        </h1>
        <p className="mt-1 font-body text-body-md text-foreground-muted">{project.tagline}</p>
      </div>

      {/* Hero image — spans multiple rows on desktop */}
      <div className="mt-4 lg:mt-0 lg:[grid-column:2] lg:[grid-row:1/5]">
        <ProjectInteractiveFrame>
          <AngularPanel className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[380px]">
            <Image
              src={getProjectMediaUrl(project, project.media.hero)}
              alt={`${project.name} — ${project.tagline}`}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="pointer-events-none object-cover"
              priority={index === 0}
              draggable={false}
            />
          </AngularPanel>
        </ProjectInteractiveFrame>
      </div>

      {/* Description */}
      <p className="mt-3 max-w-xl font-body text-body-sm text-foreground-muted lg:mt-3 lg:[grid-column:1] lg:[grid-row:3]">
        {project.description}
      </p>

      {/* Specs + CTA */}
      <div className="mt-4 lg:mt-3 lg:[grid-column:1] lg:[grid-row:4]">
        <ProjectSpecs project={project} />
        <ArrowLink href={`/projects/${project.slug}`} variant="primary" className="mt-4">
          View Case Study
        </ArrowLink>
      </div>
    </div>
  );
}
