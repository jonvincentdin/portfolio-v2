# PROGRESS.md

## Current Milestone
MILESTONE 11 — RESPONSIVE POLISH (complete, awaiting approval to proceed)

## Completed
### Milestones 00–10
All prior milestones (Discovery, Foundation, Content Engine, Home, Project
Showroom Foundation + Motion, Project Case Study + Files, About + Services,
Skills, Experience, Contact) are complete. See DECISIONS.md (D-001 through
D-020) and each milestone's git history for full detail. Summary: the full
public site is built — Home, Projects showroom with case studies and ZIP
downloads, About/Services/Skills, Experience/Education/Certifications/
Achievements, and Contact — all sourced from the filesystem content engine,
with a working (if not-yet-email-connected) contact form.

### Milestone 11 — Responsive Polish
- [x] **A real headless browser became usable this milestone** (Chromium
      via Playwright, already present in this sandbox though a full
      `playwright install` had failed in earlier milestones due to network
      restrictions on the browser *download* specifically — a binary was
      already present and directly usable). This is a meaningful capability
      change from every prior milestone, which relied on code review plus
      `curl`-based HTML inspection. Documented as D-021.
- [x] Audited all 7 breakpoints (375/430/768/1024/1280/1440/1920) × 6
      representative pages (Home, About, Projects showroom, a project case
      study, Experience, Contact) — 42 combinations — for horizontal
      overflow via `document.documentElement.scrollWidth` vs `clientWidth`,
      with full-page screenshots for visual review
- [x] **Found and fixed 4 real bugs**, none of which were visible via code
      review or `curl`-based HTML inspection alone:
      1. `SpecificationRow`/`SkillItem` used `flex-shrink: 0` on
         potentially-long joined-text values (technologies list, skill
         level+bar), forcing horizontal overflow at 375px when that text
         didn't fit. Fixed by removing `shrink-0` and allowing wrap
         (D-022).
      2. The showroom's project image used a fixed aspect ratio instead of
         matching its metadata column's height, leaving a large empty gap
         above the Previous/Next controls at 1024–1280px. Fixed by
         stretching the image to fill its grid row-span on `lg+` (D-023).
      3. **The mobile menu was not actually full-screen or opaque** —
         `<header>`'s `backdrop-blur-sm` made it the CSS containing block
         for the menu's `position: fixed`, confining the "full-screen"
         overlay to the header's own ~64px height and letting its nav
         links overflow, uncovered, into the page beneath. Both the
         overlay and the page share the same background color, which is
         exactly why this was invisible to every prior HTML-only check —
         it only manifests visually. Fixed by rendering the overlay via
         `createPortal` into `document.body` (D-024). This is the most
         significant finding of the milestone: it affected the primary
         mobile navigation pattern across the entire site, for every
         visitor, since Milestone 01.
      4. The project showroom's thumbnail rail called `scrollIntoView` on
         its very first mount (not just on real selection changes), and
         since the rail starts below the fold on most viewports, this
         silently auto-scrolled the entire page ~360px downward on every
         load of `/projects` with zero user interaction. Fixed by skipping
         the first run and scrolling the rail's own container directly
         instead of the page (D-025).
      5. (Found alongside the above, same audit pass) A single unbroken
         word ("EXPERIENCE") at `text-display-xl` size cannot wrap at a
         space and overflowed 375px — other pages' headlines happened to
         have multiple words and never exposed this. Fixed defensively
         with `break-words` on every large heading sitewide (all five page
         `<h1>`s, `SectionHeading`, and `ProjectViewer`'s project-name
         heading), not just the one that broke.
- [x] **Re-verified interaction gaps flagged as "known issues" in
      Milestones 04, 05, and 09 — all confirmed genuinely working**, closing
      them out rather than leaving them open indefinitely:
      - Keyboard navigation (arrow keys) on the showroom: confirmed working
        with a real keypress
      - Thumbnail click navigation: confirmed working, `aria-selected`
        updates correctly
      - Touch/swipe drag gesture on the showroom card: confirmed working
        with a synthesized real drag
      - Mobile menu open/click-link/auto-close-on-navigate: confirmed
        working end-to-end (after the D-024 fix)
      (Two of these initially appeared broken in hasty first attempts
      because the test script's wait time after `networkidle` was too
      short for hydration to complete in this environment — re-tested with
      a longer wait and confirmed correct; documented in RESPONSIVE.md so
      this hydration-timing characteristic doesn't get mistaken for a site
      bug in future testing.)
- [x] Identified and ruled out two screenshot-tooling artifacts (Playwright
      full-page screenshots duplicating `position: sticky` elements; scroll-
      triggered `Reveal` sections appearing blank without a scroll-through
      pass) — documented in RESPONSIVE.md so they aren't mistaken for real
      bugs by anyone reviewing the audit process later.
- [x] `tsc --noEmit`, `eslint`, `next build` clean after all fixes (one
      lint exception added with justification: the `isMounted` client-mount
      pattern required for SSR-safe portals is a standard, unavoidable
      `useState`-in-effect pattern)
- [x] Re-ran the full 42-combination overflow audit after all fixes: 0
      overflows (same as before the fixes were applied to confirm the
      audit script itself was working — i.e., the bugs were real and are
      now genuinely resolved, not just no-longer-detected)
- [x] Update PROGRESS.md / RESPONSIVE.md / COMPONENTS.md / DECISIONS.md

## In Progress
- Nothing — Milestone 11 deliverables are complete; awaiting approval.

## Next
- Wait for explicit instruction: "Proceed to Milestone 12."
- Milestone 12 audits and polishes motion across the whole site (navigation,
  project transitions, buttons, image masks, page transitions, section
  reveals, project controls, file download interactions), removing any
  unnecessary animation. With real browser access now available, this
  milestone can also be verified by actually watching the animations run,
  not just reading the Framer Motion variant code.

## Known Issues / Open Questions
- **Sandbox-only:** `next build`/`next start` require temporarily stubbing
  `next/font/google` (unchanged since Milestone 01 — not a code defect).
- **No longer an issue as of this milestone:** real click/keyboard/touch
  interaction testing, previously flagged as impossible in this sandbox in
  Milestones 04, 05, and 09 — a real headless browser was available all
  along; only the browser *installation* step had been blocked by network
  restrictions. Future milestones should default to using it.
- **Real limitation, not sandbox-only:** `/api/contact` does not deliver
  actual email — no provider credentials exist in this environment (D-020).
- Exact accent-color default (racing yellow) remains a placeholder pending
  user preference — unchanged from Milestone 01.
- `zod` v4's issue type uses `PropertyKey[]` for `path` — accounted for in
  `fs-utils.ts`.
- Certification/achievement `date` sorting is a plain string comparison —
  correct for ISO-like values, best-effort for free text.
- `archiver`'s `error` event handler logs and continues rather than
  surfacing a failed download specially — worth a closer look during
  Milestone 13's performance/robustness pass if it becomes a real concern.
- `ABOUT_CONTENT`'s philosophy/principles copy, `SITE_IDENTITY`'s
  `contactEmail`, and the example experience/education/certification/
  achievement content are all generic, editable placeholder text/data —
  intended to be personalized before the site is actually published.
- This milestone's audit covered a representative page set (one project
  case study, not all three) and did not separately re-audit the mobile
  editor/admin surfaces (none exist yet — that's the separate, gated
  Milestone 15 appendix). A future full-site pass (Milestone 13/14) could
  spot-check the remaining two case studies for good measure, though they
  share the same components and layout as the one audited here.
