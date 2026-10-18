"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProjectMediaUrl, type LoadedProject } from "@/lib/content/media";

/** A short, progressively enhanced course. The full showroom remains below it. */
export function ProjectJourney({ projects, browseId }: { projects: LoadedProject[]; browseId: string }) {
  const checkpoints = projects.slice(0, 3);
  const courseRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<(index: number) => void>(() => {});
  const [active, setActive] = useState(0);

  useEffect(() => {
    const course = courseRef.current;
    const stage = stageRef.current;
    if (!course || !stage || checkpoints.length < 2) return;
    course.dataset.ready = "true";
    const media = window.matchMedia("(min-width: 1024px) and (min-height: 850px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let selected = -1;
    let distance = 0;
    let enabled = false;
    const panels = Array.from(stage.querySelectorAll<HTMLElement>("[data-journey-panel]"));
    const marker = stage.querySelector<HTMLElement>("[data-journey-marker]");
    const light = stage.querySelector<HTMLElement>("[data-journey-light]");

    const paint = (phase: number) => {
      const next = Math.round(phase);
      panels.forEach((panel, index) => {
        const weight = Math.max(0, 1 - Math.abs(index - phase));
        panel.style.opacity = String(weight);
        panel.style.transform = `translateX(${(index - phase) * 8}%) scale(${0.96 + weight * 0.04})`;
      });
      if (marker) marker.style.transform = `scaleX(${phase / (checkpoints.length - 1)})`;
      if (light) light.style.transform = `translateX(${phase / (checkpoints.length - 1) * 100}%)`;
      if (next !== selected) { selected = next; setActive(next); }
    };
    const update = () => {
      frame = 0;
      // Never change a focused link's destination while someone is reading it.
      if (!enabled || (document.activeElement?.tagName === "A" && stage.contains(document.activeElement))) return;
      const progress = Math.max(0, Math.min(1, (112 - course.getBoundingClientRect().top) / distance));
      paint(progress * (checkpoints.length - 1));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const measure = () => {
      // Disable pinning when zoom or edited content leaves insufficient room.
      enabled = media.matches && stage.offsetHeight > 0 && stage.offsetHeight + 136 <= window.innerHeight;
      distance = enabled ? (checkpoints.length - 1) * Math.min(480, window.innerHeight * 0.5) : 0;
      course.style.paddingBottom = `${distance}px`;
      course.dataset.pinned = String(enabled);
      if (!enabled) paint(0);
      schedule();
    };
    selectRef.current = (index) => {
      paint(index);
      if (!enabled) return;
      // Only explicit checkpoint controls move the document; wheel/touch stay native.
      window.scrollTo({ top: window.scrollY + course.getBoundingClientRect().top - 112 + distance * index / (checkpoints.length - 1), behavior: "instant" });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    media.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("pageshow", schedule);
    stage.addEventListener("focusout", schedule);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      media.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("pageshow", schedule);
      stage.removeEventListener("focusout", schedule);
      selectRef.current = () => {};
    };
  }, [checkpoints.length]);

  if (checkpoints.length < 2) return null;
  return (
    <div ref={courseRef} className="project-journey" data-pinned="false">
      <div ref={stageRef} className="project-journey-stage rounded-lg border border-border bg-background-primary p-6">
        <div className="mb-4 flex items-center justify-between gap-6">
          <p className="font-technical text-technical-label uppercase text-foreground-muted">Project test track · Scroll to explore</p>
          <a className="inline-flex min-h-11 items-center text-accent underline" href={`#${browseId}`}>Skip motion / Browse projects</a>
        </div>
        <div className="relative isolate h-[320px] overflow-hidden rounded-md bg-black">
          {checkpoints.map((project, index) => (
            <div key={project.slug} data-journey-panel className="absolute inset-0" style={{ opacity: index === 0 ? 1 : 0 }} aria-hidden={index !== active}>
              <Image src={getProjectMediaUrl(project, project.media.hero)} alt={`${project.name} preview`} fill sizes="(min-width: 1024px) 85vw, 1px" className="object-contain" />
            </div>
          ))}
          <div data-journey-light aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
        <div className="my-4 h-px overflow-hidden bg-border" aria-hidden="true">
          <div data-journey-marker className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
        </div>
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="font-technical text-technical-label text-foreground-muted">Checkpoint {active + 1} / {checkpoints.length}</p>
            <h3 className="font-heading text-heading-md">{checkpoints[active]?.name}</h3>
            <p className="text-sm text-foreground-muted">{checkpoints[active]?.tagline}</p>
          </div>
          <Link className="inline-flex min-h-11 shrink-0 items-center text-accent underline" href={`/projects/${checkpoints[active]?.slug}`}>View case study</Link>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3" role="group" aria-label="Project journey checkpoints">
          <button type="button" className="min-h-11 px-3 disabled:opacity-40" disabled={active === 0} onClick={() => selectRef.current(active - 1)}>Previous</button>
          {checkpoints.map((project, index) => <button key={project.slug} type="button" aria-pressed={active === index} onClick={() => selectRef.current(index)} className={`min-h-11 border px-3 text-sm ${active === index ? "border-accent text-accent" : "border-border"}`}>{index + 1}. {project.name}</button>)}
          <button type="button" className="min-h-11 px-3 disabled:opacity-40" disabled={active === checkpoints.length - 1} onClick={() => selectRef.current(active + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}
