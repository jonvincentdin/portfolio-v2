"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { getProjectMediaUrl, type LoadedProject } from "@/lib/content/media";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { cn } from "@/lib/utils/cn";

type SpotlightTemplateProps = {
  projects: LoadedProject[];
  label: string;
  kicker?: string;
};

/**
 * One dominant hero image on the left (2/3 width) with a vertical thumbnail
 * rail on the right (1/3). Clicking a thumb swaps the main display with a
 * smooth crossfade. On mobile the rail becomes a horizontal strip below.
 */
export function SpotlightTemplate({ projects, label, kicker }: SpotlightTemplateProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = projects[activeIndex];

  return (
    <section>
      {kicker || label ? (
        <div className="mb-8">
          {kicker ? <TechnicalLabel accent>{kicker}</TechnicalLabel> : null}
          <h2 className="mt-2 font-heading text-heading-lg uppercase tracking-tight">{label}</h2>
        </div>
      ) : null}

      <div className="project-spotlight">
        {/* Main hero */}
        <div className="project-spotlight__main">
          <div className="relative aspect-[16/10] overflow-hidden">
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={active.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0"
              >
                <Image
                  src={getProjectMediaUrl(active, active.media.hero)}
                  alt={active.name}
                  fill
                  sizes="(min-width: 1024px) 70vw, 100vw"
                  className="object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="p-6">
            <TechnicalLabel accent>{active.year}</TechnicalLabel>
            <h3 className="mt-2 font-heading text-heading-md uppercase tracking-tight">
              {active.name}
            </h3>
            <p className="mt-2 font-body text-body-md text-foreground-muted">{active.tagline}</p>
            <ArrowLink href={`/projects/${active.slug}`} variant="primary" className="mt-4">
              View case study
            </ArrowLink>
          </div>
        </div>

        {/* Thumbnail rail */}
        {projects.length > 1 ? (
          <div
            className="project-spotlight__rail"
            role="tablist"
            aria-label="Select project"
          >
            {projects.map((project, index) => (
              <button
                key={project.slug}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "project-spotlight__thumb",
                  "group text-left",
                )}
              >
                <Image
                  src={getProjectMediaUrl(project, project.media.thumbnail)}
                  alt={project.name}
                  fill
                  sizes="(min-width: 1024px) 260px, 160px"
                  className="object-cover"
                />
                <span className="sr-only">{project.name}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
