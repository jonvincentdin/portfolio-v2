# PROGRESS.md

## Current Milestone
MILESTONE 07 — ABOUT + SERVICES (complete, awaiting approval to proceed)

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
- [x] `/projects/[slug]` fully built with `generateStaticParams()`,
      conditionally-rendered case study sections, alternating Features,
      Specifications, Gallery, Links, and Project Files
- [x] ZIP download endpoint (`/api/projects/[slug]/download`, `archiver`
      v8's `ZipArchive` — D-015) and individual file download endpoint
      (`/api/projects/[slug]/files/[...path]`, whitelisted against
      `files[]` — D-016)
- [x] `tsc --noEmit`, `eslint`, `next build` clean; verified against a
      running production server with real downloads (`unzip -l` inspection
      of the actual ZIP contents)

### Milestone 07 — About + Services
- [x] `src/lib/about.ts` — new `ABOUT_CONTENT` constant (headline,
      philosophy paragraphs, engineering principles), same pattern as
      `lib/site.ts`/`lib/social.ts` (D-011), now documented as D-017
- [x] `EngineeringPrinciples` component: numbered list (title +
      description per principle), stacked with dividers rather than a card
      grid, staggered `Reveal` entrance
- [x] `ServicesList` component: services from `getAllServices()` rendered
      as full-width numbered rows — title, description, and capabilities as
      a single dot-separated technical readout (e.g. "Frontend Architecture
      · Backend APIs · Database Design") — explicitly not equal-sized
      feature cards, per spec §11's own instruction
- [x] About page rebuilt: headline + philosophy prose (mount-reveal, same
      staggered pattern as Home's hero), Engineering Principles section,
      Services section
- [x] **Caught and fixed a real empty-state inconsistency during
      verification, not just at code-review time:** with zero services, the
      "Services" heading and intro sentence were still rendering even
      though `ServicesList` itself correctly returned `null` — inconsistent
      with every other empty-state section on the site (Links, Project
      Files, gallery, etc.), which hide the whole section including its
      heading. Fixed by wrapping the entire Services block in the same
      `services.length > 0` check, then re-verified both states.
- [x] Skills intentionally NOT added to this page yet — TODO.md's
      Milestone 07 checklist scopes this milestone to Biography/Philosophy/
      Services only; Skills is Milestone 08's own milestone in the spec and
      will be appended to this same page without restructuring it
- [x] `tsc --noEmit`, `eslint`, `next build` clean
- [x] Verified against a running production server with real requests:
      - Normal state: headline, all 4 principles, both services (with
        correctly dot-joined capabilities), and the "Focused on..." intro
        line all present in the rendered HTML
      - Empty-services state (content temporarily emptied, then restored):
        confirmed the bug above, fixed it, then re-verified the whole
        Services block (heading included) is correctly absent

## In Progress
- Nothing — Milestone 07 deliverables are complete; awaiting approval.

## Next
- Wait for explicit instruction: "Proceed to Milestone 08."
- Milestone 08 builds Skills: unique automotive telemetry-inspired display
  from `getAllSkillCategories()`, explicitly not generic pills, with no
  fabricated percentages (only the `level` enum when an author actually
  supplies it). Appended to the existing `/about` page.

## Known Issues / Open Questions
- **Sandbox-only:** `next build`/`next start` require temporarily stubbing
  `next/font/google` (unchanged since Milestone 01 — not a code defect).
- **Sandbox-only:** Real click/keyboard/touch interaction testing via a
  headless browser still isn't possible in this container (unchanged since
  Milestone 04). Milestone 07's new surface is entirely server-rendered
  prose/lists with no client interactivity of its own (only the pre-existing
  `Reveal` component, whose scroll-trigger logic was already verified in
  Milestone 03), so this gap matters less here than for the showroom
  milestones.
- Exact accent-color default (racing yellow) remains a placeholder pending
  user preference — unchanged from Milestone 01.
- `zod` v4's issue type uses `PropertyKey[]` for `path` — accounted for in
  `fs-utils.ts`.
- Certification/achievement `date` sorting is a plain string comparison —
  correct for ISO-like values, best-effort for free text.
- `archiver`'s `error` event handler logs and continues rather than
  surfacing a failed download specially — worth a closer look during
  Milestone 13's performance/robustness pass if it becomes a real concern.
- `ABOUT_CONTENT`'s philosophy/principles copy is generic, editable
  placeholder text (same spirit as `SITE_IDENTITY`'s "Your Name") — not
  fabricated specific biographical claims, but intended to be personalized
  before the site is actually published.
