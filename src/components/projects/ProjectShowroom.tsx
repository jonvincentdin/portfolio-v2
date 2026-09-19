"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LoadedProject } from "@/lib/content/media";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectNavigation } from "./ProjectNavigation";
import { ProjectThumbnailRail } from "./ProjectThumbnailRail";
import { ProjectViewer } from "./ProjectViewer";

type ProjectShowroomProps = {
  projects: LoadedProject[];
  kicker?: string;
  label?: string;
};

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const SINGLE_MS = 500;

function jumpDuration(steps: number): number {
  return Math.min(1000, 280 + steps * 130);
}

export function ProjectShowroom({ projects, kicker, label }: ProjectShowroomProps) {
  const total = projects.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const indexRef = useRef(0);
  indexRef.current = currentIndex;

  const trackRef = useRef<HTMLDivElement>(null);

  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const dragLastX = useRef(0);

  // ── Track helpers ───────────────────────────────────────────────

  function snapTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = "none";
    track.style.transform = `translateX(-${(index / total) * 100}%)`;
  }

  function slideTo(index: number, durationMs = SINGLE_MS) {
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = `transform ${durationMs}ms ${EASE}`;
    track.style.transform = `translateX(-${(index / total) * 100}%)`;
  }

  // ── Navigation ──────────────────────────────────────────────────

  const goToNext = useCallback(() => {
    const next = (indexRef.current + 1) % total;
    setDirection(1);
    setCurrentIndex(next);
    indexRef.current = next;
    slideTo(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const goToPrevious = useCallback(() => {
    const prev = (indexRef.current - 1 + total) % total;
    setDirection(-1);
    setCurrentIndex(prev);
    indexRef.current = prev;
    slideTo(prev);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const goToIndex = useCallback(
    (targetIndex: number) => {
      const current = indexRef.current;
      if (targetIndex === current) return;
      const delta = targetIndex - current;
      const dir: 1 | -1 = delta > 0 ? 1 : -1;
      const steps = Math.abs(delta);
      setDirection(dir);
      setCurrentIndex(targetIndex);
      indexRef.current = targetIndex;
      slideTo(targetIndex, steps === 1 ? SINGLE_MS : jumpDuration(steps));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [total],
  );

  // ── Drag ────────────────────────────────────────────────────────

  function handlePointerDown(e: React.PointerEvent) {
    if (total <= 1) return;
    const t = e.target as HTMLElement;
    if (t.closest("button, a, [role='button'], input, textarea")) return;
    dragging.current = true;
    dragStartX.current = e.clientX;
    dragLastX.current = e.clientX;
    trackRef.current?.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    dragLastX.current = e.clientX;
    const delta = e.clientX - dragStartX.current;
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = "none";
    track.style.transform = `translateX(calc(-${(indexRef.current / total) * 100}% + ${delta}px))`;
  }

  function handlePointerUp() {
    if (!dragging.current) return;
    dragging.current = false;
    const delta = dragLastX.current - dragStartX.current;
    const track = trackRef.current;
    const threshold = (track?.offsetWidth ?? 300) * 0.15;

    if (delta < -threshold) {
      // Swipe left → next (wraps)
      const next = (indexRef.current + 1) % total;
      setDirection(1);
      setCurrentIndex(next);
      indexRef.current = next;
      slideTo(next);
    } else if (delta > threshold) {
      // Swipe right → previous (wraps)
      const prev = (indexRef.current - 1 + total) % total;
      setDirection(-1);
      setCurrentIndex(prev);
      indexRef.current = prev;
      slideTo(prev);
    } else {
      slideTo(indexRef.current);
    }
  }

  // ── Keyboard ────────────────────────────────────────────────────

  useEffect(() => {
    if (total <= 1) return;
    function onKeyDown(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t?.tagName === "INPUT" || t?.tagName === "TEXTAREA" || t?.isContentEditable) return;
      if (e.key === "ArrowRight") goToNext();
      else if (e.key === "ArrowLeft") goToPrevious();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [total, goToNext, goToPrevious]);

  useEffect(() => {
    snapTo(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Render ──────────────────────────────────────────────────────

  return (
    <div aria-label="Project showroom" className="flex flex-col gap-0">
      {/* Section heading — same pattern as About / Experience */}
      <SectionHeading
        kicker={kicker ?? "03 / Work"}
        title={label ?? "Projects"}
        className="mb-10"
      />

      {/* Overflow-hidden track viewport */}
      <div className="overflow-hidden" style={{ touchAction: "pan-y" }}>
        <div
          ref={trackRef}
          className="flex project-track"
          style={{ width: `${total * 100}%`, willChange: "transform" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {projects.map((project, index) => (
            <div
              key={project.slug}
              style={{ width: `${100 / total}%`, flexShrink: 0 }}
              draggable={false}
            >
              <ProjectViewer
                project={project}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation — fixed row, always same position regardless of content */}
      {total > 1 ? (
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <ProjectNavigation
            onPrevious={goToPrevious}
            onNext={goToNext}
            disabled={false}
          />
        </div>
      ) : null}

      {/* Thumbnail rail */}
      {total > 1 ? (
        <div className="mt-4">
          <ProjectThumbnailRail
            projects={projects}
            activeIndex={currentIndex}
            onSelect={goToIndex}
          />
        </div>
      ) : null}
    </div>
  );
}
