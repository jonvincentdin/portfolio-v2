"use client";

import { motion, type Variants } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";
import { DURATION, EASE_STANDARD } from "@/lib/motion/tokens";

type TemplateProps = {
  children: React.ReactNode;
};

/**
 * Route-level enter/exit transition (spec §31): the outgoing page fades
 * and slides left, the incoming page fades in from the right, using
 * `DURATION.cinematic` (700ms) — MOTION.md flagged this exact duration
 * bucket for page-level route transitions back in Milestone 05.
 *
 * This must be `app/template.tsx`, not a component manually keyed by
 * `usePathname()` inside `layout.tsx`. A `template.tsx` is a documented
 * Next.js App Router convention that creates a genuinely new component
 * instance for its children on every navigation (unlike a layout, which
 * persists) — that real mount/unmount is what `AnimatePresence` (rendered
 * once, in the layout, wrapping this) needs to correctly sequence the exit-
 * then-enter animation. See `PageTransition`'s doc comment and
 * DECISIONS.md D-026 for the bug this replaced.
 */
export default function Template({ children }: TemplateProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const variants: Variants = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.01 } },
        exit: { opacity: 0, transition: { duration: 0.01 } },
      }
    : {
        initial: { opacity: 0, x: 30 },
        animate: {
          opacity: 1,
          x: 0,
          transition: { duration: DURATION.cinematic, ease: EASE_STANDARD },
        },
        exit: {
          opacity: 0,
          x: -30,
          transition: { duration: DURATION.cinematic, ease: EASE_STANDARD },
        },
      };

  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={variants}>
      {children}
    </motion.div>
  );
}
