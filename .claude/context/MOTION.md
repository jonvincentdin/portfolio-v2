# MOTION.md

## Motion Tokens (`lib/motion/tokens.ts`)
```
FAST:      150ms
NORMAL:    300ms
MEDIUM:    500ms
CINEMATIC: 700ms
SLOW:      900ms
```
Paired with a small set of shared easing curves (e.g. a custom
`cubic-bezier` for "mechanical precision" — quick acceleration, controlled
settle — plus a standard `easeInOut` for simple fades). Defined once, imported
everywhere; no component defines its own ad hoc duration/easing.

## Where Each Duration Is Used
- **FAST (150ms):** micro-interactions — button hover/press, link underline,
  icon nudges.
- **NORMAL (300ms):** thumbnail selection state changes, form field states.
- **MEDIUM (500ms):** scroll reveals, section entrances, skill bar reveals.
- **CINEMATIC (700ms):** project showroom transitions (image + metadata as a
  coherent system), page-level route transitions.
- **SLOW (900ms):** rare — large hero reveal choreography only.

## Project Showroom Transition (core interaction, spec §32)
`NEXT`: current project `x: 0 → -80, opacity: 1 → 0`; incoming project
`x: 80 → 0, opacity: 0 → 1`. `PREVIOUS` reverses both offsets. Image, title,
metadata, and spec rows animate as a single choreographed group (staggered
~40–60ms apart), driven by Framer Motion `AnimatePresence` + a `direction`
value in state so enter/exit variants can react to navigation direction.

## Reduced Motion (mandatory, spec §49)
A single `usePrefersReducedMotion()` hook reads
`window.matchMedia('(prefers-reduced-motion: reduce)')`. When true:
- Showroom transitions collapse to opacity-only, no horizontal translation.
- Parallax and page-transition translation are disabled entirely.
- Stagger delays are minimized/removed.
- Hover scale effects are reduced or removed.
This is implemented once, centrally, and consumed by every animated
component — not re-implemented per component.

## Library Usage
Framer Motion for anything with layout/state (page transitions, showroom,
scroll reveals, shared-layout thumbnail highlight). Plain CSS
transitions for simple, stateless hover/press effects (buttons, links) to
keep those interactions cheap.

## Performance Rules
Animate only `transform`, `opacity`, `clip-path`. No animating `width`,
`height`, `top`, `left`, or box-shadow spread. `will-change` used sparingly
and only on elements actively transitioning.
