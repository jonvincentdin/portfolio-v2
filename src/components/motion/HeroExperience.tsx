"use client";

import { useEffect, useRef } from "react";

type HeroExperienceProps = {
  children: React.ReactNode;
};

/**
 * A restrained, pointer-driven studio light for the opening composition.
 * It is intentionally CSS-only after the pointer coordinates are updated so
 * the hero remains useful when WebGL, sound, or richer motion is unavailable.
 */
export function HeroExperience({ children }: HeroExperienceProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const point = useRef({ x: 50, y: 42 });

  useEffect(() => {
    const stage = stageRef.current;
    const pointerQuery = window.matchMedia("(pointer: fine)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!stage || !pointerQuery.matches || reducedMotionQuery.matches) return;

    const render = () => {
      frame.current = null;
      stage.style.setProperty("--hero-light-x", `${point.current.x}%`);
      stage.style.setProperty("--hero-light-y", `${point.current.y}%`);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = stage.getBoundingClientRect();
      point.current = {
        x: Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100)),
        y: Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100)),
      };
      if (frame.current === null) frame.current = window.requestAnimationFrame(render);
    };

    const reset = () => {
      point.current = { x: 50, y: 42 };
      if (frame.current === null) frame.current = window.requestAnimationFrame(render);
    };

    stage.addEventListener("pointermove", handlePointerMove, { passive: true });
    stage.addEventListener("pointerleave", reset, { passive: true });
    return () => {
      stage.removeEventListener("pointermove", handlePointerMove);
      stage.removeEventListener("pointerleave", reset);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div ref={stageRef} className="hero-stage">
      <div className="hero-stage__telemetry" aria-hidden="true" />
      {children}
    </div>
  );
}
