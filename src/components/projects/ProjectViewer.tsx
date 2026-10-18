"use client";

import { useEffect, useId, useRef, useState } from "react";
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

function ProjectDescription({ description }: { description: string }) {
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const descriptionId = useId();
  const [isExpanded, setIsExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const [isMeasured, setIsMeasured] = useState(false);

  useEffect(() => {
    const element = descriptionRef.current;
    if (!element || isExpanded) return;

    const measure = () => {
      setCanExpand(element.scrollHeight > element.clientHeight + 1);
      setIsMeasured(true);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();

    return () => observer.disconnect();
  }, [description, isExpanded]);

  return (
    <div>
      <p
        ref={descriptionRef}
        id={descriptionId}
        className={`max-w-[65ch] whitespace-pre-line font-body text-body-md text-foreground-muted ${!isExpanded ? "line-clamp-4" : ""}`}
      >
        {description}
      </p>
      {isMeasured && canExpand ? (
        <button
          type="button"
          aria-controls={descriptionId}
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((expanded) => !expanded)}
          className="mt-2 min-h-11 font-technical text-technical-label uppercase tracking-[0.08em] text-accent transition-opacity motion-micro hover:opacity-70 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
        >
          {isExpanded ? "Show less" : "Read full description"}
        </button>
      ) : null}
    </div>
  );
}

/**
 * One project slide in the track-based showroom.
 * All motion comes from the parent track's translateX — no AnimatePresence here.
 * Navigation buttons live in ProjectShowroom (fixed row) so they never shift.
 */
export function ProjectViewer({ project, index }: ProjectViewerProps) {
  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.6fr)] lg:items-start lg:gap-x-10">
      <div className="min-w-0 lg:col-start-1 lg:row-start-1">
        <h3 className="font-heading text-heading-md uppercase tracking-tight break-words sm:text-heading-lg">
          {project.name}
        </h3>
        <p className="mt-1 font-body text-body-md text-foreground-muted">{project.tagline}</p>
      </div>
      <div className="min-w-0 lg:col-start-1 lg:row-start-2">
        <div className="max-w-xl">
          <ProjectDescription description={project.description} />
        </div>

        <div className="mt-6">
          <ProjectSpecs project={project} />
          <ArrowLink href={`/projects/${project.slug}`} variant="primary" className="mt-4">
            View Case Study
          </ArrowLink>
        </div>
      </div>

      {/* Hero image keeps its own aspect ratio so the artwork stays readable. */}
      <div className="row-start-2 min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <ProjectInteractiveFrame>
          <AngularPanel className="project-media-frame relative aspect-[16/10] overflow-hidden lg:aspect-[16/9]">
            <Image
              src={getProjectMediaUrl(project, project.media.hero)}
              alt={`${project.name} — ${project.tagline}`}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="pointer-events-none object-contain"
              priority={index === 0}
              draggable={false}
            />
          </AngularPanel>
        </ProjectInteractiveFrame>
      </div>

    </div>
  );
}
