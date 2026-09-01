# DESIGN_SYSTEM.md

## Color Tokens
```
--background-primary:   #0A0A0A
--background-secondary: #111111
--surface:               #141414
--foreground-primary:   #FFFFFF
--foreground-muted:     #8A8A8A
--border:                #242424
--accent:                #E8B400   /* racing yellow — default, configurable */
```
Accent is a single CSS variable so the whole system can swap to motorsport red
(`#D62828`), electric blue (`#2E6BFF`), or metallic silver (`#C7CBCF`) by
changing one value. Only one accent is active at a time; it is never used for
large fills, only for thin lines, numerals, active indicators, and small
geometric marks.

## Typography
- **Headings:** Space Grotesk — geometric, technical, strong at large sizes.
- **Technical / metadata labels:** JetBrains Mono — for STACK / STATUS / spec
  rows / project counters, always uppercase with tracked letter-spacing.
- **Body:** Inter — for readable paragraph copy (bio, case study prose).

Scale (Tailwind-style tokens): `display-xl`, `display-lg`, `heading-lg`,
`heading-md`, `body-lg`, `body-md`, `caption`, `technical-label`. Technical
labels always render uppercase with `letter-spacing: 0.08–0.12em`.

## Spacing Scale
`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128` (px), exposed as Tailwind
spacing tokens so all components pull from the same rhythm.

## Geometry Language
Angular, not rounded. Panels use clipped corners (`clip-path: polygon(...)`),
thin 1px borders (`--border`), and diagonal separators rather than shadows or
large border-radius. Used structurally — to frame the showroom image, to mark
active states, to divide spec sections — never as pure ornament.

## Buttons & Interaction States
- Default: text + thin underline/arrow, no filled pill buttons as the primary
  pattern (a filled accent button is reserved for the single strongest CTA
  per page, e.g. "SEND MESSAGE").
- Hover: line expands, arrow translates ~4–6px, no bounce.
- Press: scale to ~0.98, no bounce, ~100ms.
- Disabled/loading states use label text changes (e.g. "PREPARING ARCHIVE...")
  rather than spinners where possible, consistent with the technical-readout
  feel.

## Responsive Principles
Breakpoints audited explicitly: 375 / 430 / 768 / 1024 / 1280 / 1440 / 1920.
Desktop favors a three-zone showroom layout (metadata | image | controls);
mobile is redesigned stack order (number → name → image → summary → specs →
controls), not a naive reflow. Full detail in RESPONSIVE.md.

## What This Design System Explicitly Avoids
Glassmorphism/blur-heavy panels, randomly-hued gradients, oversized
rounded-corner cards, neon glow, cyberpunk color clashes, Bootstrap-style
default component shapes, and multi-accent-color pages.
