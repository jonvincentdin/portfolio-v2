# MOTION.md

> **Status:** The showroom's motion layer (this doc's core subject) was
> implemented in Milestone 05. `framer-motion` is installed and used for
> everything with state/layout (directional card transitions, animated
> counter, thumbnail active-indicator); plain CSS transitions remain for
> stateless hover/press effects (buttons, links, thumbnail hover/scale).

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

**Implemented (Milestone 05):** `ProjectShowroom` owns `direction: 1 | -1`
alongside `currentIndex`; `AnimatePresence mode="popLayout" initial={false}`
wraps a single `motion.div` (`ProjectViewer`) keyed by `project.slug`. The
card-level `cardVariants` produce exactly the x/opacity values above (using
`DURATION.cinematic` + `EASE_MECHANICAL`); its children (counter, name block,
image, description, specs, controls) are each wrapped in a `motion.div`
sharing `itemVariants`, staggered via `staggerChildren: 0.06` /
`delayChildren: 0.05` on the parent's `center` variant — the "choreographed
group with ~40–60ms stagger" from the spec. `AnimatePresence`'s
`initial={false}` intentionally suppresses the enter animation for the very
first project shown on page load (verified: server-rendered HTML shows
`opacity:1;transform:none` on first paint, not the enter-state offset).

Touch/swipe (this milestone's other requirement) reuses the same
`motion.div`: `drag="x"` with `dragConstraints={{ left: 0, right: 0 }}` and
`onDragEnd` checking `info.offset.x`/`info.velocity.x` against thresholds
(±80px offset or ±500px/s velocity) to call the same `goToNext`/
`goToPrevious` handlers as the buttons and keyboard. Disabled entirely
(`drag={false}`) when there's only one project. See DECISIONS.md D-014.

## Thumbnail Rail Motion (spec §33)
**Implemented (Milestone 05):** the active thumbnail scales up
(`scale-105`) and brightens via a plain CSS transition (`duration-300`,
matching the MEDIUM token); a thin accent underline uses Framer Motion's
`layoutId` (`thumbnail-active-indicator`) inside a `LayoutGroup`, so it
glides smoothly from the previously active thumbnail to the newly active
one rather than just appearing/disappearing. The rail also auto-scrolls the
active thumbnail into view (`scrollIntoView({ behavior: "smooth", inline:
"center" })`) when selection changes via keyboard or swipe, not just direct
clicks.

## Counter Transition (spec §34)
**Implemented (Milestone 05):** `ProgressIndicator` wraps the current number
in `AnimatePresence`, keyed by its value; the entering/exiting digits are
absolutely positioned within a fixed-size box so they cross-slide vertically
in place (`y: ±0.6em`) rather than shifting surrounding layout, with
direction (up vs. down) matching the showroom's forward/back direction.

## Reduced Motion (mandatory, spec §49)
A single `usePrefersReducedMotion()` hook reads
`window.matchMedia('(prefers-reduced-motion: reduce)')`. When true:
- Showroom transitions collapse to opacity-only, no horizontal translation.
- Parallax and page-transition translation are disabled entirely.
- Stagger delays are minimized/removed.
- Hover scale effects are reduced or removed.
This is implemented once, centrally, and consumed by every animated
component — not re-implemented per component.

**Implemented (Milestone 05):** `src/lib/motion/usePrefersReducedMotion.ts`
— SSR-safe (lazy `useState` initializer guards `typeof window`), subscribes
to the media query's `change` event. Consumed directly by `ProjectViewer`
(collapses `cardVariants`/`itemVariants` to opacity-only with ~0ms durations
and disables `drag`), `ProgressIndicator` (skips the vertical slide, opacity
only), and `ProjectThumbnailRail` (uses `"auto"` instead of `"smooth"` for
the scroll-into-view). Verified in isolation: a small Node script confirmed
the reduced-motion branch produces variant objects with no `x` key at all
(not just a zeroed one), matching "no horizontal translation" exactly. Note
this hook is for Framer Motion's JS-driven animations specifically — plain
CSS transitions/animations elsewhere are already handled by the blanket
`@media (prefers-reduced-motion: reduce)` rule in `globals.css` (added
Milestone 01), so most of the site needed no additional reduced-motion work.

## Library Usage
Framer Motion for anything with layout/state (page transitions, showroom,
scroll reveals, shared-layout thumbnail highlight). Plain CSS
transitions for simple, stateless hover/press effects (buttons, links) to
keep those interactions cheap.

## Performance Rules
Animate only `transform`, `opacity`, `clip-path`. No animating `width`,
`height`, `top`, `left`, or box-shadow spread. `will-change` used sparingly
and only on elements actively transitioning.
