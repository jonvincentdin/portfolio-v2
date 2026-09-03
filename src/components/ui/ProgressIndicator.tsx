"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";
import { DURATION, EASE_MECHANICAL } from "@/lib/motion/tokens";
import { TechnicalLabel } from "./TechnicalLabel";

type ProgressIndicatorProps = {
  current: number;
  total: number;
  /** 1 when navigating forward, -1 when navigating back — sets slide direction. */
  direction: 1 | -1;
  className?: string;
};

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * "03 / 08"-style project counter. The current number animates with a
 * directional vertical slide (spec §34) — the total stays static since it
 * doesn't change during navigation. Both digits are positioned absolutely
 * within a fixed-size box so the entering/exiting numbers cross-fade in
 * place rather than shifting surrounding layout.
 */
export function ProgressIndicator({ current, total, direction, className }: ProgressIndicatorProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <TechnicalLabel accent as="div" className={className}>
      <span className="relative inline-block h-[1.4em] w-[2.4ch] align-middle overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.span
            key={current}
            custom={direction}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { y: direction > 0 ? "0.6em" : "-0.6em", opacity: 0 }
            }
            animate={{ y: 0, opacity: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { y: direction > 0 ? "-0.6em" : "0.6em", opacity: 0 }
            }
            transition={{
              duration: prefersReducedMotion ? 0.01 : DURATION.normal,
              ease: EASE_MECHANICAL,
            }}
            className="absolute inset-0 flex items-center"
          >
            {pad(current)}
          </motion.span>
        </AnimatePresence>
      </span>
      {" / "}
      {pad(total)}
    </TechnicalLabel>
  );
}
