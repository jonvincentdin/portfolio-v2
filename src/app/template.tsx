"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";
import { getPageTransitionVariants } from "@/lib/motion/tokens";

type TemplateProps = {
  children: React.ReactNode;
};

/**
 * Route-level enter/exit transition (spec §31): the outgoing page fades
 * and slides left, the incoming page fades in from the right, using the
 * centralized 400ms route preset from `lib/motion/tokens.ts`.
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

  const variants = getPageTransitionVariants(prefersReducedMotion);

  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={variants}>
      {children}
    </motion.div>
  );
}
