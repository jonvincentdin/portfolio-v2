/**
 * Motion tokens — see .claude/context/MOTION.md
 *
 * Single source of truth for animation durations and easing. Every animated
 * component (Milestone 05+) imports from here rather than defining ad hoc
 * durations/easings inline.
 */

export const DURATION = {
  fast: 0.15,
  normal: 0.3,
  medium: 0.5,
  cinematic: 0.7,
  slow: 0.9,
} as const;

export const DURATION_MS = {
  fast: 150,
  normal: 300,
  medium: 500,
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
