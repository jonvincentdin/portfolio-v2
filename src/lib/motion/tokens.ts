import type { Transition, Variants } from "framer-motion";

/**
 * Motion tokens — see .claude/context/MOTION.md
 *
 * This module is the single source of truth for motion timing, easing,
 * springs, and reusable transition variants. Components should choose a
 * named preset instead of assembling one-off duration/easing objects.
 */

export const DURATION = {
  fast: 0.15,
  normal: 0.3,
  medium: 0.5,
  route: 0.4,
  cinematic: 0.7,
  slow: 0.9,
} as const;

export const DURATION_MS = {
  fast: 150,
  normal: 300,
  medium: 500,
  route: 400,
  cinematic: 700,
  slow: 900,
} as const;

/**
 * "Mechanical precision" curve — quick acceleration, controlled settle.
 * Used for showroom transitions, page transitions, and other
 * state-driven motion that should feel engineered rather than bouncy.
 */
export const EASE_MECHANICAL = [0.22, 1, 0.36, 1] as const;

/** Standard ease for simple opacity fades. */
export const EASE_STANDARD = [0.4, 0, 0.2, 1] as const;

export const REDUCED_MOTION_DURATION = 0.01;

export type MotionPresetName =
  | "micro"
  | "fast"
  | "responsive"
  | "smooth"
  | "cinematic"
  | "sectionReveal"
  | "pageTransition"
  | "hoverLift"
  | "press"
  | "speedIn"
  | "shiftTransition";

/**
 * Named transition vocabulary. The names describe intent, not a particular
 * component, so the same motion language can be reused sitewide.
 */
export const MOTION_TRANSITIONS: Record<MotionPresetName, Transition> = {
  micro: { duration: DURATION.fast, ease: EASE_STANDARD },
  fast: { duration: DURATION.fast, ease: EASE_MECHANICAL },
  responsive: { duration: DURATION.normal, ease: EASE_MECHANICAL },
  smooth: { duration: DURATION.medium, ease: EASE_STANDARD },
  cinematic: { duration: DURATION.cinematic, ease: EASE_MECHANICAL },
  sectionReveal: { duration: DURATION.medium, ease: EASE_MECHANICAL },
  pageTransition: { duration: DURATION.route, ease: EASE_MECHANICAL },
  hoverLift: { duration: DURATION.fast, ease: EASE_MECHANICAL },
  press: { duration: DURATION.fast, ease: EASE_STANDARD },
  speedIn: { duration: DURATION.normal, ease: EASE_MECHANICAL },
  shiftTransition: { duration: DURATION.cinematic, ease: EASE_MECHANICAL },
};

/** Spring presets are available for controls that need interruption-friendly motion. */
export const MOTION_SPRINGS = {
  springSoft: { type: "spring", stiffness: 260, damping: 28, mass: 0.8 },
  springResponsive: { type: "spring", stiffness: 420, damping: 34, mass: 0.7 },
} satisfies Record<string, Transition>;

/** Return a preset with the motion-safe reduced-motion fallback applied. */
export function getMotionTransition(
  preset: MotionPresetName,
  prefersReducedMotion = false,
): Transition {
  return prefersReducedMotion
    ? { duration: REDUCED_MOTION_DURATION }
    : MOTION_TRANSITIONS[preset];
}

/** Shared route transition variants used by Next's template boundary. */
export function getPageTransitionVariants(prefersReducedMotion: boolean): Variants {
  const transition = getMotionTransition("pageTransition", prefersReducedMotion);

  return prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition },
        exit: { opacity: 0, transition },
      }
    : {
        initial: { opacity: 0, x: 24, scale: 0.995, filter: "blur(3px)" },
        animate: { opacity: 1, x: 0, scale: 1, filter: "blur(0px)", transition },
        exit: { opacity: 0, x: -24, scale: 0.995, filter: "blur(3px)", transition },
      };
}

/** Shared section-reveal variants for future Framer Motion section wrappers. */
export function getSectionRevealVariants(prefersReducedMotion: boolean): Variants {
  return {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: getMotionTransition("sectionReveal", prefersReducedMotion),
    },
  };
}
