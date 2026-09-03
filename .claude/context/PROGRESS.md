# PROGRESS.md

## Current Milestone
MILESTONE 06 — PROJECT CASE STUDY + FILES (complete, awaiting approval to proceed)

## Completed
### Milestone 00 — Discovery
- [x] Studied full specification
- [x] Proposed architecture, routes, component hierarchy, content
      architecture, visual direction, motion strategy, responsive strategy
- [x] Created `.claude/context/` documentation structure

### Milestone 01 — Foundation
- [x] Scaffolded Next.js 16 (App Router) + TypeScript (strict) + Tailwind v4
- [x] Fonts, design tokens, root layout, SiteHeader/Footer shell,
      SectionHeading/TechnicalLabel/AngularPanel/Container, placeholder routes
- [x] `tsc --noEmit`, `eslint`, and `next build` all verified clean

### Milestone 02 — Content Engine
- [x] Zod schemas + filesystem loaders for all seven content types
- [x] Example content authored under `content/`, including three example
      projects exercising full/lean/auto-discovery cases
- [x] Verified: auto-discovery, missing-file errors, multi-field schema
      errors, duplicate-slug errors, malformed-JSON errors, file-size
      derivation — all via a temporary script (written, run, deleted)
- [x] `tsc --noEmit`, `eslint`, `next build` clean

### Milestone 03 — Home
- [x] Resolved the content-media serving gap: `/content-media/[...path]`
      route handler and `getProjectMediaUrl()` helper
- [x] New shared primitives: `StatusIndicator`, `ArrowLink`, `Reveal`
- [x] Centralized site identity (`lib/site.ts`) and social links
      (`lib/social.ts`)
- [x] `FeaturedProject` component sourced from `getFeaturedProjects()`
- [x] Home page rebuilt with staggered page-load reveal
- [x] `tsc --noEmit`, `eslint`, `next build` clean; verified against a
      running production server with `curl`

### Milestone 04 — Project Showroom Foundation
- [x] `/projects` fully wired: loader → client `ProjectShowroom`, explicit
      empty-state and single-project handling
- [x] `ProjectShowroom`, `ProjectViewer`, `ProjectNavigation`,
      `ProjectThumbnailRail`, `ProjectSpecs`/`SpecificationRow`,
      `ProgressIndicator` built (functionality only, no animation)
- [x] Found and fixed a real Turbopack build bug (D-012): `getProjectMediaUrl`
      isolated into a Node-free module so client components can safely
      import it
- [x] `tsc --noEmit`, `eslint`, `next build` clean; verified against a
      running production server across normal/empty/single-project states

### Milestone 05 — Project Showroom Motion
- [x] Installed `framer-motion` (first real use case, per D-008/D-014)
- [x] Directional card transitions (spec §32), animated counter (spec §34),
      thumbnail active-indicator motion (spec §33), touch/swipe via drag on
      the card itself, all gated by a new central `usePrefersReducedMotion`
      hook
- [x] `tsc --noEmit`, `eslint`, `next build` clean; confirmed no `node:fs`
      leaked into client chunks; verified swipe-threshold and
      reduced-motion branch logic in isolation via small Node scripts

### Milestone 06 — Project Case Study + Files
- [x] `/projects/[slug]` fully built with `generateStaticParams()` sourced
      from `getAllProjects()` — new project folders get a case study page
      automatically, zero route changes
- [x] Header (project number, name, tagline, year/role/status metadata),
      giant hero image
- [x] Case study prose sections (Overview, Problem, Objective, Solution,
      Challenges, Results, Lessons) via new `CaseStudySection` component —
      each rendered only when the corresponding `caseStudy` field is
      actually non-empty. Fields the schema doesn't have (spec's separate
      "Design Process"/"Architecture" split) are not fabricated — same
      "only render what the data model actually has" discipline as every
      prior milestone.
- [x] Features section: new `ProjectFeature` component, alternating
      left/right layout, gracefully handles a feature with no image
      (verified: text spans full width, no broken image slot)
- [x] Specifications: reused the existing `ProjectSpecs` component
- [x] Screenshots: new `ProjectGallery` component, sourced from
      `media.gallery`, simple CSS hover scale (no new `MotionImage`
      component built — not required by this milestone's explicit scope,
      noted in COMPONENTS.md as a candidate if a second real usage arises)
- [x] Links section (Live/GitHub via `ArrowLink`) — hidden per-button when
      empty, and the whole section hidden when both are empty
- [x] Project Files: new `ProjectFiles` component — individual file list
      (name, type, derived size via `getProjectFileSizeBytes()`/
      `formatFileSize()`, download link) omitted entirely when `files[]` is
      empty; new `DownloadProjectButton` client component implements the
      idle → preparing → building → ready state machine (spec §46) and
      always renders regardless of `files[]`, since it downloads the whole
      folder
- [x] Added a "View Case Study" link from the showroom (`ProjectViewer`) to
      the new case study pages — spec §12 lists this as part of the
      showroom screen, and it wasn't meaningful to add until the case study
      page existed
- [x] **ZIP download endpoint** (`/api/projects/[slug]/download`):
      installed `archiver`; discovered during implementation that v8 ships
      a class-based API (`ZipArchive`), not the classic factory function
      D-004 had assumed — fixed and documented as D-015. Streams via
      `Readable.toWeb`, never buffers the full archive, slug-validated
      against `getAllProjects()`'s closed set (the path-traversal defense).
- [x] **Individual file download endpoint**
      (`/api/projects/[slug]/files/[...path]`): whitelisted against the
      project's own `files[].path` entries specifically — stricter than
      generic path-traversal prevention, since it also blocks downloading
      real-but-undeclared files like `hero.webp` (D-016)
- [x] `tsc --noEmit`, `eslint` clean (fixed an `archiver` type-import issue
      along the way — `import * as archiver` doesn't match v8's named-export
      class API; switched to `import { ZipArchive, type ArchiverError }`)
- [x] `next build` clean, including the zero-projects edge case
      (`generateStaticParams()` correctly returns `[]`, no crash) and the
      full 3-project case (all three case study pages statically generated)
- [x] Confirmed no `node:fs`/`node:stream`/`node:path` leaked into client
      chunks despite the new server-only route handlers
- [x] Verified against a running production server with real requests, not
      just markup inspection:
      - Both case study pages (full-featured Memora, lean CurriculumAxxer)
        render correctly; unknown slug → 404
      - Memora: all 7 case study sections present, both features render
        correctly (with and without an image), gallery present, Links
        section correctly absent (both URLs empty in the content), Project
        Files list shows real derived sizes ("39 KB", "85 B")
      - CurriculumAxxer: only Overview renders (the one non-empty
        `caseStudy` field); every other optional section correctly absent;
        "Download Project" still renders despite `files[]` being empty
      - Individual file download: real PDF bytes returned, correct
        `Content-Disposition` filename
      - Individual file whitelist: requesting `hero.webp` through the files
        route → 404 (real file, but not a declared downloadable)
      - Path traversal attempt on the files route → 404
      - Unknown slug on both API routes → 404
      - ZIP download: `unzip -l` on the real downloaded archive confirmed
        correct folder structure (`001-memora/files/...`,
        `001-memora/screenshots/...`, etc.) under a top-level folder entry,
        for both a project with a `files/` subfolder (Memora) and one
        without (CurriculumAxxer)

## In Progress
- Nothing — Milestone 06 deliverables are complete; awaiting approval.

## Next
- Wait for explicit instruction: "Proceed to Milestone 07."
- Milestone 07 builds About + Services: biography, philosophy,
  specialization, and the Services section (from `getAllServices()|`),
  using editorial composition rather than generic equal-sized feature cards.

## Known Issues / Open Questions
- **Sandbox-only:** `next build`/`next start` require temporarily stubbing
  `next/font/google` (unchanged since Milestone 01 — not a code defect).
- **Sandbox-only:** Real click/keyboard/touch interaction testing via a
  headless browser still isn't possible in this container (unchanged since
  Milestone 04). For Milestone 06 this mattered less than for 04/05, since
  most of the new surface (case study page content, download endpoints) is
  server-rendered/API-driven and was verified with real `curl` requests
  rather than needing simulated clicks — the one exception is
  `DownloadProjectButton`'s client-side state machine (idle → preparing →
  building → ready), which was verified by code review only, not by
  actually clicking it in a browser.
- Exact accent-color default (racing yellow) remains a placeholder pending
  user preference — unchanged from Milestone 01.
- `zod` v4's issue type uses `PropertyKey[]` for `path` — accounted for in
  `fs-utils.ts`.
- Certification/achievement `date` sorting is a plain string comparison —
  correct for ISO-like values, best-effort for free text.
- `archiver`'s `error` event handler logs and continues rather than
  surfacing a failed download to the client in any special way — acceptable
  for now (a failed stream just produces a truncated/broken ZIP in the
  browser), but worth a closer look during Milestone 13's performance/
  robustness pass if it becomes a real concern.
