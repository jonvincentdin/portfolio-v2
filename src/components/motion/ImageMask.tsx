"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";
import { getMotionTransition } from "@/lib/motion/tokens";

type ImageMaskProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Clip-path "wipe" reveal for hero-level imagery (spec §30's suggested
 * hero technique — "image mask reveal"). Deliberately used only for the
 * site's two true hero-image moments (Home's Featured Project image, the
 * case study's hero image) rather than every image on the site — see
 * ARCHITECTURE.md/DECISIONS.md for why gallery/feature/showroom images
 * don't get this same treatment.
 *
 * Two nested elements, not one: the OUTER plain div is what the
 * `IntersectionObserver` watches, and the INNER `motion.div` carries the
 * animated `clip-path`. Observing the same element that the clip-path is
 * applied to doesn't work — verified with a real browser during Milestone
 * 12: a target clipped down to `inset(0 0 0 100%)` has zero effective
 * visible area, and `IntersectionObserver` correctly reports zero
 * intersection for it regardless of its position in the viewport, since
 * clip-path (like `overflow: hidden` and `visibility: hidden`) is one of
 * the properties browsers account for when computing the *visible*
 * intersecting area, not just raw layout geometry. Splitting the observed
 * element from the clipped one avoids this self-defeating combination.
 * See DECISIONS.md D-027.
 */
export function ImageMask({ children, className }: ImageMaskProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isVisible, setIsVisible] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <div ref={ref} className={className}>
      <motion.div
        className="h-full w-full"
        initial={false}
        animate={{ clipPath: isVisible ? "inset(0 0 0 0%)" : "inset(0 0 0 100%)" }}
        transition={getMotionTransition("cinematic", prefersReducedMotion)}
      >
        {children}
      </motion.div>
    </div>
  );
}
