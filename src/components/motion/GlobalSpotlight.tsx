"use client";

import { useEffect, useRef } from "react";

/**
 * A fixed full-screen radial spotlight that follows the cursor on every page.
 * Smoothly interpolated via rAF with a 0.07 lerp factor so it eases behind
 * the cursor rather than jumping. Fades in when the pointer enters the
 * document and fades out on leave. Lives in the root layout so it persists
 * across page transitions.
 */
export function GlobalSpotlight() {
  const glowRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const render = () => {
      const element = glowRef.current;
      if (!element) return;
      current.current.x += (target.current.x - current.current.x) * 0.07;
      current.current.y += (target.current.y - current.current.y) * 0.07;
      element.style.setProperty("--spotlight-x", `${current.current.x}px`);
      element.style.setProperty("--spotlight-y", `${current.current.y}px`);
      frame.current = window.requestAnimationFrame(render);
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      target.current = { x: event.clientX, y: event.clientY };
      glowRef.current?.style.setProperty("--spotlight-opacity", "1");
    };
    const leave = () =>
      glowRef.current?.style.setProperty("--spotlight-opacity", "0");

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    frame.current = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  return <div ref={glowRef} aria-hidden="true" className="global-spotlight" />;
}

