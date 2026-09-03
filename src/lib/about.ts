/**
 * About page editorial content — headline, philosophy, and engineering
 * principles. Plain constant, not a JSON content type, for the same reason
 * as site.ts (DECISIONS.md D-011): this is personal/editorial copy, not one
 * of the seven filesystem-discovered content types in CONTENT_SYSTEM.md.
 */
export const ABOUT_CONTENT = {
  headline: "Built for problem solving.",
  philosophy: [
    "I care about the parts of engineering that don't show up in a screenshot — how a codebase reads six months later, whether an interface degrades gracefully, whether the architecture makes the next feature easier or harder to build.",
    "My approach treats motion, typography, and system design as part of the same problem rather than separate disciplines. A good interface should feel considered at every scale, from a single button's hover state to how the whole application handles failure.",
  ],
  principles: [
    {
      title: "Clarity Over Cleverness",
      description:
        "Code and interfaces should be understandable at a glance, not impressive at the expense of maintainability.",
    },
    {
      title: "Architecture First",
      description:
        "Data flow and component boundaries get decided before implementation details, not discovered halfway through.",
    },
    {
      title: "Motion With Purpose",
      description:
        "Animation should communicate state and hierarchy — decoration that doesn't serve the interaction gets cut.",
    },
    {
      title: "Accessible By Default",
      description:
        "Keyboard navigation, semantic markup, and contrast aren't a pass at the end — they're part of the first draft.",
    },
  ],
} as const;
