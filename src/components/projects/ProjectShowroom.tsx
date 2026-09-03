"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { LoadedProject } from "@/lib/content/media";
import { ProjectNavigation } from "./ProjectNavigation";
import { ProjectThumbnailRail } from "./ProjectThumbnailRail";
import { ProjectViewer } from "./ProjectViewer";

type ProjectShowroomProps = {
  projects: LoadedProject[];
};

/**
 * Top-level showroom state/controller (spec §1, §12–§13). Owns the current
 * index and a `direction` value (1 = forward, -1 = back) that drives the
 * directional slide animation in ProjectViewer and ProgressIndicator (spec
 * §32, §34). Wires up mouse (buttons), keyboard (left/right arrow),
 * touch/swipe (drag on the card itself, spec's Milestone 05 requirement),
 * and thumbnail-click navigation. Navigation wraps around (last → first,
 * first → last) for a continuous browsing feel — see DECISIONS.md D-013.
 */
export function ProjectShowroom({ projects }: ProjectShowroomProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const total = projects.length;

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((i) => (i + 1) % total);
  }, [total]);

  const goToPrevious = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const goToIndex = useCallback(
    (index: number) => {
      setDirection(index >= currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex],
  );

  useEffect(() => {
    if (total <= 1) return;

    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTypingContext =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (isTypingContext) return;

      if (event.key === "ArrowRight") {
        goToNext();
      } else if (event.key === "ArrowLeft") {
        goToPrevious();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [total, goToNext, goToPrevious]);

  const currentProject = projects[currentIndex];

  return (
    <div aria-label="Project showroom">
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <ProjectViewer
          key={currentProject.slug}
          project={currentProject}
          index={currentIndex}
          total={total}
          direction={direction}
          swipeEnabled={total > 1}
          onSwipeNext={goToNext}
          onSwipePrevious={goToPrevious}
          navigation={
            <ProjectNavigation onPrevious={goToPrevious} onNext={goToNext} disabled={total <= 1} />
          }
        />
      </AnimatePresence>

      <div className="mt-14 border-t border-border pt-8">
        <ProjectThumbnailRail projects={projects} activeIndex={currentIndex} onSelect={goToIndex} />
      </div>
    </div>
  );
}
