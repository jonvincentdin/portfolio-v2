# RESPONSIVE.md

## Audited Breakpoints
`375 · 430 · 768 · 1024 · 1280 · 1440 · 1920`

## Milestone 11 Audit — Findings and Fixes

**Methodology:** A real headless browser (Chromium via Playwright — see
DECISIONS.md D-021) was used to check all 7 breakpoints × 6 representative
pages (Home, About, Projects showroom, a project case study, Experience,
Contact) for horizontal overflow (`document.documentElement.scrollWidth` vs
`clientWidth`), with full-page screenshots captured for visual review after
scrolling all the way through each page (so scroll-triggered `Reveal`
animations settle before capture). Real clicks, keyboard presses, and a
synthesized drag gesture were also used to verify interactive behavior —
the first time this project could test actual browser interaction rather
than relying on code review and server-rendered HTML alone.

**Screenshot-tooling artifacts identified and ruled out** (not real bugs,
noted here so they aren't mistaken for site defects if re-investigated):
- Playwright's `full_page` screenshots duplicate `position: sticky`
  elements (the header appeared to render a second time mid-page); the DOM
  always contained exactly one `<header>`. This is a documented
  Chromium/Playwright full-page-capture quirk, not a rendering bug.
- A screenshot taken without first scrolling through the page shows
  below-the-fold `Reveal`-wrapped sections as blank gaps, because their
  `IntersectionObserver` hasn't fired yet — not a missing-content bug, just
  a reminder that the audit script needs a real scroll-through pass (which
  it does) rather than a single static capture.
- Interaction tests that ran immediately after `networkidle` (only a few
  hundred ms of wait) sometimes failed to register clicks/keypresses/drags,
  which briefly looked like broken interactivity. A longer wait
  (~2s) after `networkidle` before the first interaction consistently
  resolved this — a hydration-timing characteristic of this sandbox/build,
  not a functional bug. Keyboard navigation, thumbnail clicks, and the
  drag/swipe gesture (Milestones 04/05) were all reconfirmed working
  correctly with properly-timed tests.

**Real bugs found and fixed:**
1. **`SpecificationRow`/`SkillItem` horizontal overflow at 375px** — `flex-
   shrink: 0` on long joined-text values (technologies list, skill level +
   bar) forced them to their max-content width regardless of available
   space. Fixed by removing `shrink-0` and allowing wrap. See DECISIONS.md
   D-022.
2. **Showroom image/left-column height mismatch on desktop** — the image
   panel used a fixed aspect ratio instead of matching the metadata
   column's height, leaving a large empty gap above the Previous/Next
   controls at 1024–1280px. Fixed by stretching the image to fill its grid
   row-span on `lg+`. See DECISIONS.md D-023.
3. **Mobile menu was not actually full-screen or opaque** — `<header>`'s
   `backdrop-blur-sm` made it the containing block for the menu's
   `position: fixed`, confining the "full-screen" overlay to the header's
   own ~64px height and letting its content overflow, uncovered, into the
   page beneath. This was invisible to every prior `curl`-based check and
   only surfaced through an actual click. Fixed with a `createPortal` into
   `document.body`. See DECISIONS.md D-024. This was the most significant
   finding of the milestone — it affected the primary mobile navigation
   pattern for the entire site.
4. **Page auto-scrolled ~360px on every load of `/projects`** — the
   thumbnail rail's `scrollIntoView` effect ran on initial mount as well as
   on real selection changes, and since the rail starts below the fold, it
   pulled the whole page down on load with no user interaction. Fixed by
   skipping the first run and scrolling the rail's own container directly
   instead of the page. See DECISIONS.md D-025.

All four fixes were verified with the same real-browser methodology that
found them (not just code review): re-running the full 42-combination
overflow audit (0 overflows both before confirming the bugs and after
fixing them), and re-clicking/re-loading the specific interactions that
were broken.

## Project Showroom Layout by Breakpoint
- **Desktop (1024+):** three-zone layout — metadata/spec column, dominant
  central image (now stretching to match the metadata column's height —
  see D-023), prev/next controls positioned directly beneath the image;
  thumbnail rail as a horizontal strip beneath.
- **Tablet (768–1023):** single-column stacked flow (below `lg`), image
  remains dominant; thumbnail rail remains horizontal.
- **Mobile (375–430):** deliberate stack order — project number → project
  name → image → summary → specifications → prev/next controls. Thumbnail
  rail becomes a horizontally scrollable strip with snap points, not a grid.

## General Rules
- Typography scale steps down at each breakpoint rather than relying on
  `clamp()` alone for headline sizes, to keep line lengths controlled.
- Large headings (`text-display-xl`/`text-display-lg`/`heading-lg`) use
  `break-words` defensively: a single unbroken word (e.g. "Experience") at
  those sizes cannot wrap at a space and will overflow a narrow viewport
  otherwise — found as a real bug on the Experience page during the
  Milestone 11 audit and fixed sitewide on every large heading, not just
  that one page.
- Rows that pair a label with a potentially-long joined-text value (spec
  tables, skill levels) must not use `flex-shrink: 0` on the value — see
  D-022.
- Navigation: desktop inline nav → mobile full-screen menu (not a generic
  slide-in drawer), per spec §7. The mobile menu overlay is rendered via a
  portal specifically because it must escape the header's `backdrop-blur`
  containing block — see D-024. Any future fixed-position overlay nested
  inside a blurred/transformed/filtered ancestor needs the same treatment.
- Angular geometry (clipped panels, diagonal separators) simplifies at small
  sizes where it would otherwise interfere with tap targets or readability.
- All interactive elements maintain a minimum ~44px touch target on mobile.
- Images use responsive `sizes`/`srcset` via `next/image` so the showroom's
  dominant image is never over-fetched on small viewports.
- Effects that scroll an element into view (e.g. the thumbnail rail's
  active-selection sync) must not run on initial mount, and should prefer
  scrolling their own container directly over `element.scrollIntoView()` to
  avoid unintended page-level scroll — see D-025.
