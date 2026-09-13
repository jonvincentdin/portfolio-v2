"use client";

import { useEffect, useRef } from "react";

export function CursorGridGlow() {
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
      current.current.x += (target.current.x - current.current.x) * 0.14;
      current.current.y += (target.current.y - current.current.y) * 0.14;
      element.style.setProperty("--cursor-x", `${current.current.x}px`);
      element.style.setProperty("--cursor-y", `${current.current.y}px`);
      frame.current = window.requestAnimationFrame(render);
    };

    const move = (event: PointerEvent) => {
      target.current = { x: event.clientX, y: event.clientY };
      glowRef.current?.style.setProperty("--cursor-glow-opacity", "1");
    };
    const leave = () => glowRef.current?.style.setProperty("--cursor-glow-opacity", "0");

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    frame.current = window.requestAnimationFrame(render);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  return <div ref={glowRef} aria-hidden="true" className="cursor-grid-glow" />;
}
