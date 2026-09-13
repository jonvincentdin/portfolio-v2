# DESIGN_SYSTEM.md

## Owner Editor (database CMS)
The private editor reuses the dark technical canvas, clipped panels, accent
labels, underlined inputs, and restrained borders. Save is the filled primary
action, Preview is outlined, and Log Out is quiet text. Structured fields and
upload controls use the same technical styling; no unsafe rich-text editor or
second visual language was introduced.

## Color Tokens
```
--background-primary:   #0A0A0A
--background-secondary: #111111
--surface:               #141414
--foreground-primary:   #FFFFFF
--foreground-muted:     #8A8A8A
--border:                #242424   /* decorative dividers/panels only */
--border-strong:         #606060   /* interactive boundaries (form inputs) — 3:1 min contrast */
--accent:                #E8B400   /* racing yellow — default, configurable */
```
Accent is a single CSS variable so the whole system can swap to motorsport red
(`#D62828`), electric blue (`#2E6BFF`), or metallic silver (`#C7CBCF`) by
changing one value. Only one accent is active at a time; it is never used for
large fills, only for thin lines, numerals, active indicators, and small
geometric marks.

`--border` measures only 1.28:1 against `--background-primary` — fine for
ambient dividers, since they're never the sole indicator of an interactive
affordance, but well under WCAG 1.4.11's 3:1 non-text contrast minimum for
UI component boundaries. `--border-strong` (3.15:1) exists specifically for
cases where the border itself communicates "this is a control" — currently
just the Contact form's inputs. Added Milestone 13 after computing actual
contrast ratios rather than assuming; see DECISIONS.md D-030. All text-role
color pairs (`foreground-primary`/`foreground-muted`/`accent` against
`background-primary` and `surface`) were verified to clear WCAG AA's 4.5:1
normal-text minimum — computed directly, not eyeballed.

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

Milestone 14 polish adds two restrained system-level cues: the dark canvas uses
a low-contrast 64px technical grid, and every `AngularPanel` carries a short
accent registration mark along its top edge. The Home hero also uses a quiet
angular calibration frame to make its desktop composition intentional while
the actual content remains the focus. These cues are structural and use the
existing single accent token; they are not decorative gradients or a new
visual subsystem.

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

## Final Design QA Notes (Milestone 14)
- Headings use balanced wrapping and body copy uses pretty wrapping so the
  editorial hierarchy holds when content changes or labels get longer.
- Project-file rows use a wrapping flex layout on narrow screens, preserving
  the specification-list language without allowing a long filename to push a
  download action off-canvas.
- Existing motion remains intentionally sparse: the QA pass refined the
  visual field without adding another animation layer. `prefers-reduced-motion`
  continues to collapse both CSS and Framer Motion effects.
