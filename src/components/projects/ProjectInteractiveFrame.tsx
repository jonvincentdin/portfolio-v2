"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils/cn";

type ProjectInteractiveFrameProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * A restrained pointer-light and depth response for project media. The
 * interaction is written to CSS variables so pointer movement does not cause
 * React renders, and it becomes a static frame on touch or reduced-motion
 * devices.
 */
export function ProjectInteractiveFrame({ children, className }: ProjectInteractiveFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const frame = frameRef.current;
    if (!frame || event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = frame.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    frame.style.setProperty("--project-light-x", `${Math.round(x * 100)}%`);
    frame.style.setProperty("--project-light-y", `${Math.round(y * 100)}%`);
    frame.style.setProperty("--project-tilt-x", `${((0.5 - y) * 2.4).toFixed(2)}deg`);
    frame.style.setProperty("--project-tilt-y", `${((x - 0.5) * 2.4).toFixed(2)}deg`);
  }

  function resetPointer() {
    const frame = frameRef.current;
    if (!frame) return;
    frame.style.setProperty("--project-light-x", "50%");
    frame.style.setProperty("--project-light-y", "50%");
    frame.style.setProperty("--project-tilt-x", "0deg");
    frame.style.setProperty("--project-tilt-y", "0deg");
  }

  return (
    <div
      ref={frameRef}
      className={cn("project-interactive", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      data-cursor="media"
    >
      <div className="project-interactive__content">{children}</div>
      <span className="project-interactive__light" aria-hidden="true" />
    </div>
  );
}
