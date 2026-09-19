"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
 * touch/swipe (drag on the card itself), and thumbnail-click navigation.
 *
 * Sequential scrolling: when a far thumbnail is clicked (|delta| > 1), the
 * showroom steps through every intermediate project one by one so the viewer
 * sees the full "scroll". Step interval scales with jump size — bigger jumps
 * play faster so it always feels snappy. A new navigation while stepping
 * cancels the current sequence and starts fresh.
 */
export function ProjectShowroom({ projects }: ProjectShowroomProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const total = projects.length;

  // Queue of pending indices for the sequential scroll effect.
  // Each timeout ID is stored so we can cancel on override.
  const sequenceTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function cancelSequence() {
    for (const id of sequenceTimers.current) clearTimeout(id);
    sequenceTimers.current = [];
  }

  const goToNext = useCallback(() => {
    cancelSequence();
    setDirection(1);
    setCurrentIndex((i) => (i + 1) % total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const goToPrevious = useCallback(() => {
    cancelSequence();
    setDirection(-1);
    setCurrentIndex((i) => (i - 1 + total) % total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const goToIndex = useCallback(
    (targetIndex: number) => {
      cancelSequence();

      setCurrentIndex((currentIndexSnapshot) => {
        const delta = targetIndex - currentIndexSnapshot;
        if (delta === 0) return currentIndexSnapshot;

        const dir: 1 | -1 = delta > 0 ? 1 : -1;
        const steps = Math.abs(delta);

        // Build the ordered list of indices to step through.
        const path: number[] = [];
        for (let step = 1; step <= steps; step++) {
          path.push((currentIndexSnapshot + dir * step + total) % total);
        }

        // Shorter interval for bigger jumps so it never feels sluggish.
        // 1 step = 0ms delay (instant, same as before), 2 steps = 200ms each,
        // 3+ steps = max(90, 260 - steps * 24) ms each.
        const intervalMs =
          steps <= 1 ? 0 : steps === 2 ? 200 : Math.max(90, 260 - steps * 24);

        // Schedule each step, applying direction state immediately each time.
        path.forEach((idx, i) => {
          const id = setTimeout(() => {
            setDirection(dir);
            setCurrentIndex(idx);
          }, i * intervalMs);
          sequenceTimers.current.push(id);
        });

        // Return current value unchanged — state updates from the timeouts
        return currentIndexSnapshot;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [total],
  );

  // Cancel all pending steps on unmount.
  useEffect(() => () => cancelSequence(), []);

  useEffect(() => {
    if (total <= 1) return;

    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTypingContext =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
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
