# Portfolio completion — M0 evidence-led audit

Date: 2026-10-18 (Asia/Singapore). Baseline: `7bd3cf5` plus the existing dirty working tree.

**Status: partial; live visual and interaction audit blocked. M1 has not started.**

Historical status above records the M0 handoff. The user subsequently authorized
M1; see [M1 delivery and verification](PORTFOLIO_M1_NAVIGATION.md). M0's remaining
browser/database evidence is still open.

This is the new completion sequence M0–M5, not the historical build or Visual
Experience Upgrade numbering. The entry context and all 15 linked documents were
reviewed. Historical checkmarks are not evidence that the current UI passes.

## Scope and preservation

M0 produces evidence, priorities, and a bounded implementation plan. It changes
Markdown only. No runtime implementation, CMS save, upload, seed, schema push,
migration, authentication bypass, or content reset was performed.

Initial `git status --short` contained 15 modified tracked files: package files,
Prisma schema, media API, Experience/Projects/layout/CSS, editor shell/preview,
credential components, ProjectViewer, and the site-experience schema. Untracked
work included the completion context/index, contact-subject migration, `public/`,
experience section editor/renderers/templates/file viewer, and PDF thumbnail.
All were preserved. Findings refer to this working tree, not just HEAD.

## Runtime evidence and limits

1. Started the existing `npm.cmd run dev` server at localhost:3333.
2. Configured-database requests to `/`, `/about`, `/projects`, `/experience`,
   `/contact`, `/owner`, and `/editor` all returned HTTP 500. Restricted execution
   initially reported database connectivity failure and Google Font fallback
   warnings. A network-enabled retry reached the database and returned:
   `ERROR: Your account or project has exceeded the quota. Upgrade your plan to increase limits.`
   This is an environment/account blocker; no production outage is inferred.
3. Restarted with a **process-only** whitespace `DATABASE_URL` to activate the
   existing `databaseConfigured` false/seed fallback. `.env` was not edited.
   All seven routes plus `/projects/memora`, `/projects/curriculumaxxer`, and
   `/projects/example-project` returned successful HTML responses. The `/editor`
   request followed the authentication redirect and rendered `Private access.`;
   it did not expose the editor.
4. Seed HTML contains `Your Name` on Home, three project `h1` elements on Projects,
   no `h1` on Experience, and no active primary link on all three case studies.
   These are seed-mode observations, not the current database content.
5. Browser inventory returned no apps or browsers. Attempting the in-app browser
   returned `Browser is not available: iab`. **No screenshots were captured and
   no live UI review was possible.** HTTP/source review does not verify layout,
   hydration, focus, gesture behavior, animation, image crops, or perceived speed.

## User tasks and prioritized findings

Evidence labels: **HTTP** = current local response; **source** = implementation
inspection; **risk** = predicted impact requiring browser reproduction.
P0 blocks the audit; P1 affects core tasks; P2 is refinement or needs visual evidence.

| ID / priority | Task and specific finding | Evidence / ownership | Recommended scope |
|---|---|---|---|
| A01 / P0 | Open the real portfolio or owner editor: configured DB requests fail with the quota error above. | HTTP; `src/lib/content/database.ts:32`, `src/app/layout.tsx` | Restore database availability before closing M0. Do not silently substitute seed data in production or upgrade a paid plan automatically. |
| A02 / P1 | Know where I am: Projects ceases to be active on `/projects/[slug]`. | HTTP + source; `src/components/layout/NavLink.tsx:27` uses exact equality. | M1: recognize project descendants while keeping Home exact. |
| A03 / P1 | Scan the page outline: Projects has one `h1` per mounted slide; Experience's page title is an `h2`. | HTTP + source; `ProjectViewer.tsx:72`, `SectionHeading.tsx`, `app/experience/page.tsx`. | M1: one stable page title, subordinate project/section headings; support configurable templates. |
| A04 / P1 | Read a case study and return: no explicit showroom return link, breadcrumb, or in-page section index; live/source links appear after the story/gallery. | Source; `src/app/projects/[slug]/page.tsx:83–186`, `CaseStudySection.tsx`. | M1: return link, content-derived section anchors, prominent valid project actions. Preserve URLs and optional-section omission. |
| A05 / P1 | Browse using keyboard: every slide stays mounted with links; inactive wrappers have no `inert`, hidden state, or focus exclusion. Arrow handling is on `window`. | Source/risk; `ProjectShowroom.tsx:141–190`. Offscreen focus and multiple showroom interference need real reproduction. | M1 baseline access fix if reproduced; preserve prev/next and direct case-study access. |
| A06 / P1 | Swipe to the next project: threshold is 15% of the entire track, whose width is project count × viewport. Three projects require about 45% of the stage width; eight require 120%. | Source arithmetic; `ProjectShowroom.tsx:116,172`. No real swipe executed. | M2: viewport-relative gesture threshold and pointer-cancel review; verify one, three, and many projects. |
| A07 / P1 | Browse with reduced motion: global CSS shortens transitions, but pointer movement directly translates the track without checking reduced motion. The old docs describe a different Framer Motion implementation. | Source/risk; `ProjectShowroom.tsx:101`, `globals.css:104`. | M2: static selectable presentation; do not claim motion support is absent globally. |
| A08 / P1 | Preview layout changes: `EditorPreview` accepts `project-sections` and `experience-sections`, but renders no body branch for either. Project preview summarizes text instead of the actual hero/gallery layout. | Source; `src/components/editor/EditorPreview.tsx`. Authenticated UI not inspected. | M4: render draft data through shared public presentations; accurate preview scope. |
| A09 / P1 | Make a quick edit and save: 15 peer editor sections mix content, layouts, media, and cursor/audio controls. Save/status/preview are in a nonsticky header; only desktop section navigation is sticky. | Source; `EditorShell.tsx:44,327–416`. Scroll burden is a risk, not screenshot evidence. | M4: task-based entry, advanced disclosure, persistent save/status; retain every existing power feature. |
| A10 / P2 | Understand the owner and act quickly: mobile profile comes before identity and CTAs; desktop absolute profile occupies 34% while heading is not explicitly constrained to a left column. | Source/risk; `src/app/page.tsx`. No overlap or below-fold defect claimed without viewport capture. | M1: verify first viewport; M3: tune spacing/crops only from screenshots. |
| A11 / P2 | Recover from missing content/loading: zero-project copy tells visitors to add a filesystem folder; all-hidden layout sections can leave Projects with no content. No route `loading.tsx`/`error.tsx` files found. | Source; `app/projects/page.tsx:35–57`, `ProjectSectionRenderer.tsx`. Empty/loading states not exercised by mutating data. | M1: understandable empty/navigation feedback; M5: verify failures without exposing private diagnostics. |
| A12 / P2 | Return Home through the identity: the name links to `/owner`. | Source; `SiteHeader.tsx:19`. This was an explicit original owner-access decision, not an accidental broken link. | Preserve owner access; assess clearer Home affordance in M1 without silently changing this workflow. |

The current showroom responds to click/drag selection, not natural document
scroll. Global `ScrollProgress` indicates page percentage and route number; it
does not identify the current case-study section. These are M1/M2 extension
points, not reasons to replace the CMS or add another content model.

## Research and design recommendations

Reviewed 2026-10-18. Recommendations below are design proposals, not verified
improvements to this portfolio.

- [Porsche 911 model overview](https://www.porsche.com/international/models/911/)
  provides a model-family hierarchy as inspiration for project identity and
  specifications. Read as a web reference; no interactive configurator or visual
  screenshot review was performed. Do not copy branding or introduce stock cars.
- [WebKit's scroll-driven animation guide](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/)
  describes scroll/view timelines. Prototype one short journey with existing
  imagery; feature-detect CSS support or use the existing scoped motion tools.
  Ordinary scrolling, direct links, and explicit selection remain available.
- [W3C animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
  supports disabling nonessential interaction animation (AAA criterion). The
  project's reduced-motion requirement independently makes a static alternative
  mandatory. Do not confuse this with a claim of overall WCAG conformance.
- [W3C reflow guidance](https://www.w3.org/WAI/WCAG21/Understanding/reflow)
  informs the 320 CSS-pixel/zoom check. Verify reflow and reachable controls,
  not just named device sizes.
- [GOV.UK task list guidance](https://design-system.service.gov.uk/components/task-list/)
  recommends simplifying tasks first and using a task list when users need to
  choose order or work across sessions. Apply that principle to Quick Edit;
  avoid making a large checklist another required step.
- Installed Next.js 16.3.4 guide reviewed:
  `node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md`.
  It documents Link navigation, sticky-header offsets, loading boundaries and
  pending feedback. Re-read relevant installed guides before later code work.

## Milestone plan and acceptance boundaries

| Milestone | Deliverable | Required verification before completion |
|---|---|---|
| M0 — current, partial | This evidence register, task map, priorities, research, and plan; complete visual baseline when available. | Live database pages and authorized editor; screenshots and interaction matrix below. |
| M1 — proposed first implementation | Active route state, one clear page heading, case-study return/section navigation, meaningful hero actions, empty/navigation feedback; address reproduced offscreen focus issue. | Desktop/mobile links, direct hashes, refresh/back/forward, current state, menu focus/Escape, skip link, 200%/400% zoom; unchanged owner entry. |
| M2 — not started | One representative scroll-controlled showroom scene, existing records/media, labeled checkpoints, skip/browse and prev/next; short unpinned mobile and static reduced-motion fallback. | Natural wheel/touch scrolling, keyboard, resizing/history, gesture thresholds, no inaccessible projects, measured performance; no large 3D dependency by default. |
| M3 — not started | Screenshot-led typography, spacing, crop and visual-rhythm refinement across showroom and case studies. | Before/after captures; contrast and narrow/long-content checks; preserve automotive typography, angular geometry, one accent. |
| M4 — not started | Quick Edit, optional advanced controls, honest persistent save status and representative preview. | Authenticated edit/preview/save/reload, project creation and media reuse in an approved test data environment; errors/dirty state; existing snapshot/API/Prisma contracts. |
| M5 — not started | End-to-end QA and documentation reconciliation. | Routes, content/visibility/downloads, responsive/a11y/motion/performance, final screenshots and explicit residual tradeoffs. |

Stop at every milestone. M1 requires the user's exact **“Proceed to M1”**;
the same rule applies to M2 and later. No later work is authorized by this plan.

## Remaining M0 visual/interaction evidence

All items below are **not run**, not passes. Attach screenshots with route,
viewport, content mode, and state when a browser becomes available.

- Desktop 1440×900, tablet 768×1024, mobile 390×844 and 375×812: Home first
  viewport, About, Projects (first/next), representative full and lean case
  studies, Experience, Contact, owner screen, authenticated editor/preview.
- Scroll through reveals before full-page capture; also capture viewports to
  avoid mistaking sticky-header/full-page capture artifacts for UI defects.
- Keyboard: skip link, mobile menu cycle/Escape/focus restoration, all showroom
  links including inactive slides, thumbnail/current state, section links.
- Touch: ordinary vertical scroll, swipe/prev/next, menu, media/PDF overlays.
- Reduced motion: page entry, showroom drag/selection, scroll scene fallback.
- Zoom/reflow: 200% and 400%, 320 CSS-pixel equivalent; readable controls and
  content without accidental horizontal page overflow.
- Loading/empty/error: slow route, unavailable media, empty project list,
  all-hidden sections, missing optional case-study fields, failed editor save.
  Use isolated test data; do not alter real CMS records merely to stage a test.

## Checks performed

- Git status before work and after runtime inspection: existing work preserved.
- Database-mode seven-route HTTP check: failed as documented; network retry
  identified quota failure.
- Seed-mode ten-request HTML check: successful; `/editor` ended on owner auth.
- `npx.cmd tsc --noEmit --incremental false`: passed.
- `npm.cmd run lint`: failed, 8 errors and 1,581 warnings in the pre-existing
  working tree. Output includes extensive bundled `public/pdf.worker.min.mjs`
  diagnostics, a `react-hooks/refs` error at `ProjectShowroom.tsx:29`, and a
  `react/jsx-no-comment-textnodes` error at `DossierTemplate.tsx:117`.
  These are baseline issues, not introduced or fixed by this Markdown milestone.
- Scoped `git diff --check` for the edited progress documents: passed.
- No automated tests added; no production build or browser QA pass claimed.

Next action: restore database availability and attach a supported browser, then
finish M0 evidence. A visual redesign cannot honestly be accepted from this
source/HTTP audit alone.
