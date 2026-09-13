# MOTION.md

## Editor Motion (database CMS)
The owner editor uses no continuous or decorative animation. Preview, save,
upload, and error states communicate through labels/status text while existing
hover/press transitions and reduced-motion behavior remain inherited.

> **Status:** The showroom's motion layer (Milestone 05) and the sitewide
> micro-interaction/page-transition/image-mask layer (Milestone 12) are both
> implemented. `framer-motion` is used for everything with state/layout
> (directional card transitions, animated counter, thumbnail active-
> indicator, page transitions, image mask reveals); plain CSS transitions
> remain for stateless hover/press effects (buttons, links).

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

## Page Transitions (spec §31)
**Implemented (Milestone 12):** the outgoing page fades and slides left
(`opacity: 1→0, x: 0→-30`), the incoming page fades in from the right
(`opacity: 0→1, x: 30→0`), both over `DURATION.cinematic` (700ms) —
MOTION.md flagged this exact bucket for page-level route transitions back
in Milestone 05, before the component existed.

**Split across two files, not one** — `src/components/motion/
PageTransition.tsx` (a persistent `AnimatePresence` wrapper rendered once
in `app/layout.tsx`) and `src/app/template.tsx` (the actual `motion.div`
with the enter/exit variants). This split exists because of a real bug
found via real-browser testing: a single component using
`<motion.div key={usePathname()}>` inside the layout let the exit animation
play, but the incoming page then rendered stuck permanently invisible —
`usePathname()` and Next's routed `children` update in the same render
pass, so `AnimatePresence` never saw a genuine mount/unmount, just a
silent content swap inside an already-mounted instance (which Framer
Motion doesn't replay `initial → animate` for). `app/template.tsx` is
Next.js's own documented mechanism for guaranteeing a fresh component
instance per navigation — see DECISIONS.md D-026 for the full diagnosis.
Verified after the fix by sampling opacity/x at seven timepoints across a
real click: a clean animated curve that settles at `opacity: 1,
transform: none` and stays there.

## Image Mask Reveal (spec §30)
**Implemented (Milestone 12):** `src/components/motion/ImageMask.tsx` — a
clip-path "wipe" reveal (`inset(0 0 0 100%)` → `inset(0 0 0 0%)`) over
`DURATION.cinematic`. Used deliberately only for the site's two true
hero-image moments — Home's Featured Project image and the case study's
hero image — not applied to gallery thumbnails, feature images, or the
showroom's own image (which already has its own directional card
transition; layering a second competing reveal on it would be redundant
motion, not "quality over quantity," spec §28).

Two real bugs were found and fixed building this, both only visible via
real-browser testing:
1. Framer Motion's `whileInView` prop never fired in this project's exact
   version — switched to the same manually-managed `IntersectionObserver`
   pattern already proven reliable in `Reveal`.
2. Even after that fix, the reveal still didn't trigger — because the
   component was observing the SAME element that carried the animated
   `clip-path`. A target clipped down to zero visible area has zero
   `IntersectionObserver` intersection by definition (clip-path, like
   `overflow: hidden`, is accounted for when browsers compute the actual
   visible intersecting area, not just raw layout geometry). Fixed by
   observing a separate, unclipped wrapper `<div>` and animating the
   `clip-path` on a nested `motion.div` instead. See DECISIONS.md D-027.

## Press States (spec §36)
**Implemented (Milestone 12):** every button-style control (`ArrowLink`,
`ProjectNavigation`'s prev/next, `DownloadProjectButton`, the Contact
form's submit button, the mobile menu hamburger) now has an `active:`
press state — a small scale reduction, no bounce, matching spec exactly.
Individual project-file download links get a subtler `active:opacity-70`
instead, since they're inline text links, not buttons.

**A real, silent build issue was found here too:** the original
`active:scale-[0.98]` (Tailwind arbitrary bracket value) produced no CSS
rule at all in this project's exact Tailwind v4 version — confirmed by
grepping the compiled CSS output directly, not by visual inspection (which
was itself initially misleading: checking `getComputedStyle(el).transform`
always read `"none"`, but Tailwind v4's scale utilities set the native CSS
`scale` property, not `transform`, so that check was looking at the wrong
property regardless of whether the class had compiled). Fixed by switching
to a named Tailwind scale step (`active:scale-95`), which compiles
correctly; verified via `getComputedStyle(el).scale` reading `"0.95"`
during a real mouse-down. See DECISIONS.md D-028.

Deliberately NOT applied to purely textual navigation links (`NavLink`,
the header logo) — spec §36's press example is framed around button-style
controls, and a scale-down press on inline nav text would look
inconsistent with its existing underline-only hover treatment. See
DECISIONS.md D-029 for this and other Milestone 12 scope decisions.

## Performance Rules
Animate only `transform`, `opacity`, `clip-path`. No animating `width`,
`height`, `top`, `left`, or box-shadow spread. `will-change` used sparingly
and only on elements actively transitioning. As of Milestone 12,
Tailwind v4's `scale-*` utilities set the native CSS `scale` property
rather than `transform: scale(...)` — both are compositor-friendly
properties, so this doesn't change the performance characteristics, just
which computed-style property to check when verifying a scale effect is
actually applied (see D-028).

## Final Design QA (Milestone 14)
The visual audit deliberately added no new motion. The technical canvas grid,
Home calibration frame, panel registration mark, and typography wrapping are
static hierarchy cues; the existing showroom, page-transition, mask, reveal,
download, and press-state motion remains the complete motion vocabulary. This
keeps the site premium through restraint and preserves the reduced-motion
behavior already verified in Milestones 12 and 13.
