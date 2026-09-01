# RESPONSIVE.md

## Audited Breakpoints
`375 · 430 · 768 · 1024 · 1280 · 1440 · 1920`

## Project Showroom Layout by Breakpoint
- **Desktop (1024+):** three-zone layout — metadata/spec column, dominant
  central image, prev/next controls positioned around the image; thumbnail
  rail as a horizontal strip beneath.
- **Tablet (768–1023):** metadata moves above/below the image (stacked),
  image remains dominant but narrower; thumbnail rail remains horizontal.
- **Mobile (375–430):** deliberate stack order — project number → project
  name → image → summary → specifications → prev/next controls. Thumbnail
  rail becomes a horizontally scrollable strip with snap points, not a grid.

## General Rules
- Typography scale steps down at each breakpoint rather than relying on
  `clamp()` alone for headline sizes, to keep line lengths controlled.
- Navigation: desktop inline nav → mobile full-screen menu (not a generic
  slide-in drawer), per spec §7.
- Angular geometry (clipped panels, diagonal separators) simplifies at small
  sizes where it would otherwise interfere with tap targets or readability.
- All interactive elements maintain a minimum ~44px touch target on mobile.
- Images use responsive `sizes`/`srcset` via `next/image` so the showroom's
  dominant image is never over-fetched on small viewports.

## Milestone 11 Deliverable
A full audit pass across all seven breakpoints checking overflow, typography,
spacing, image proportions, navigation, project controls, and the mobile
menu — findings and fixes will be logged here.
