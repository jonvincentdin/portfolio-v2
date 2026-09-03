"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { LayoutGroup, motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";
import { DURATION, EASE_MECHANICAL } from "@/lib/motion/tokens";
import { getProjectMediaUrl, type LoadedProject } from "@/lib/content/media";

type ProjectThumbnailRailProps = {
  projects: LoadedProject[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

/**
 * Gran Turismo–inspired horizontal project selector (spec §13). The active
 * thumbnail scales up and brightens, a shared accent underline (Framer
 * Motion `layoutId`) glides smoothly from the previous active thumbnail to
 * the new one (spec §33 "active indicator moves"), and the rail
 * auto-scrolls the active thumbnail into view when selection changes via
 * keyboard or swipe rather than a direct click.
 */
export function ProjectThumbnailRail({ projects, activeIndex, onSelect }: ProjectThumbnailRailProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    itemRefs.current[activeIndex]?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex, prefersReducedMotion]);

  if (projects.length <= 1) return null;

  return (
    <LayoutGroup id="project-thumbnail-rail">
      <div
        role="tablist"
        aria-label="Select a project"
        className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:thin] snap-x snap-mandatory"
      >
        {projects.map((project, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={project.slug}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? "true" : undefined}
              onClick={() => onSelect(index)}
              className="group relative shrink-0 snap-start pb-3 text-left"
            >
              <span
                className={cn(
                  "relative block h-16 w-24 origin-bottom overflow-hidden border transition-[opacity,border-color,transform] duration-300 sm:h-20 sm:w-32",
                  isActive
                    ? "scale-105 border-accent opacity-100"
                    : "border-border opacity-60 group-hover:opacity-90",
                )}
              >
                <Image
                  src={getProjectMediaUrl(project, project.media.thumbnail)}
                  alt=""
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </span>
              <span
                className={cn(
                  "mt-2 block font-technical text-technical-label uppercase tracking-[0.1em]",
                  isActive ? "text-accent" : "text-foreground-muted",
                )}
              >
                Project {project.id}
              </span>

              {isActive ? (
                <motion.span
                  layoutId="thumbnail-active-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                  transition={{
                    duration: prefersReducedMotion ? 0.01 : DURATION.normal,
                    ease: EASE_MECHANICAL,
                  }}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
