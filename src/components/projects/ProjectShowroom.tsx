"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { DURATION_MS, EASE_MECHANICAL } from "@/lib/motion/tokens";
import { ProjectJourney } from "./ProjectJourney";
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

const EASE = `cubic-bezier(${EASE_MECHANICAL.join(",")})`;
const SINGLE_MS = DURATION_MS.medium;

function jumpDuration(steps: number): number {
  return Math.min(1000, 280 + steps * 130);
}

export function ProjectShowroom({ projects, kicker, label }: ProjectShowroomProps) {
  const total = projects.length;
  const browseId = useId();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const showroomRef = useRef<HTMLDivElement>(null);

  const indexRef = useRef(0);

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

  function slideTo(index: number, durationMs: number = SINGLE_MS) {
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "none" : `transform ${durationMs}ms ${EASE}`;
    track.style.transform = `translateX(-${(index / total) * 100}%)`;
  }

  // ── Navigation ──────────────────────────────────────────────────

  const goToNext = useCallback(() => {
    const next = (indexRef.current + 1) % total;

    setCurrentIndex(next);
    indexRef.current = next;
    slideTo(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const goToPrevious = useCallback(() => {
    const prev = (indexRef.current - 1 + total) % total;

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
      const steps = Math.abs(delta);

      setCurrentIndex(targetIndex);
      indexRef.current = targetIndex;
      slideTo(targetIndex, steps === 1 ? SINGLE_MS : jumpDuration(steps));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [total],
  );

  // ── Drag ────────────────────────────────────────────────────────

  function handlePointerDown(e: React.PointerEvent) {
    if (total <= 1 || !e.isPrimary || e.button !== 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = e.target as HTMLElement;
    if (t.closest("button, a, [role='button'], input, textarea")) return;
    dragging.current = true;
    dragStartX.current = e.clientX;
    dragLastX.current = e.clientX;
    trackRef.current?.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dragging.current = false;
      snapTo(indexRef.current);
      return;
    }
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
    const threshold = Math.max(40, Math.min(120, (viewportRef.current?.clientWidth ?? 300) * 0.15));

    if (delta < -threshold) {
      // Swipe left → next (wraps)
      const next = (indexRef.current + 1) % total;

      setCurrentIndex(next);
      indexRef.current = next;
      slideTo(next);
    } else if (delta > threshold) {
      // Swipe right → previous (wraps)
      const prev = (indexRef.current - 1 + total) % total;

      setCurrentIndex(prev);
      indexRef.current = prev;
      slideTo(prev);
    } else {
      slideTo(indexRef.current);
    }
  }

  // ── Keyboard ────────────────────────────────────────────────────

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (total <= 1 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const target = event.target as HTMLElement;
    if (target.closest(".project-journey")) return;
    if (target.closest("input, textarea, select, [contenteditable='true']")) return;
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    // Keep focus visible when the currently focused slide becomes inert.
    if (trackRef.current?.contains(target)) showroomRef.current?.focus({ preventScroll: true });
    if (event.key === "ArrowRight") goToNext();
    else goToPrevious();
  }

  useEffect(() => {
    snapTo(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Render ──────────────────────────────────────────────────────

  return (
    <div ref={showroomRef} role="region" aria-label={label ? `${label} showroom` : "Project showroom"} tabIndex={0} onKeyDown={handleKeyDown} className="flex flex-col gap-0 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4">
      {/* Section heading — same pattern as About / Experience */}
      <SectionHeading
        kicker={kicker ?? "03 / Work"}
        title={label ?? "Projects"}
        className="mb-10"
      />

      <ProjectJourney projects={projects} browseId={browseId} />
      <div id={browseId} className="section-anchor mb-5" tabIndex={-1}>
        <h3 className="font-heading text-heading-md">Browse all projects</h3>
        <p className="mt-2 text-sm text-foreground-muted">Choose a project below or open its case study directly.</p>
        <ul className="mt-2 flex flex-wrap gap-x-6">
          {projects.map((project) => <li key={project.slug}><Link className="inline-flex min-h-11 items-center text-accent underline" href={`/projects/${project.slug}`}>{project.name}</Link></li>)}
        </ul>
      </div>

      <p aria-live="polite" aria-atomic="true" className="mb-4 font-technical text-technical-label text-foreground-muted">
        Project {currentIndex + 1} of {total}: {projects[currentIndex]?.name}
      </p>
      {/* Overflow-hidden track viewport */}
      <div ref={viewportRef} className="overflow-hidden" style={{ touchAction: "pan-y" }}>
        <div
          ref={trackRef}
          className="flex project-track"
          style={{ width: `${total * 100}%` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { dragging.current = false; snapTo(indexRef.current); }}
        >
          {projects.map((project, index) => (
            <div
              key={project.slug}
              inert={index !== currentIndex}
              aria-hidden={index !== currentIndex}
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
