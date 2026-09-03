# TODO.md

Legend: `[ ]` planned · `[~]` in progress · `[x]` completed

## Milestone 00 — Discovery
- [x] Study specification
- [x] Propose architecture, routes, content architecture, component hierarchy
- [x] Propose visual direction, typography, motion system, responsive strategy
- [x] Identify technical risks and mitigations
- [x] Create `.claude/context/` and all required documentation files
- [ ] **Await explicit approval: "Proceed to Milestone 01."**

## Milestone 01 — Foundation (complete)
- [x] Initialize Next.js + TypeScript + Tailwind
- [x] Install and configure fonts (Space Grotesk, JetBrains Mono, Inter)
- [x] Global CSS + design tokens (colors, typography scale; spacing via
      Tailwind defaults — see DECISIONS.md D-006)
- [x] Root layout + metadata
- [x] Responsive container primitive (`Container`)
- [x] SiteHeader, MobileNavigation, Footer (+ NavLink, added — D-007)
- [x] SectionHeading, TechnicalLabel, AngularPanel
- [x] Placeholder routes for all pages in ROUTES.md
- [x] `tsc --noEmit` and `eslint` clean
- [x] Update PROGRESS.md / COMPONENTS.md / DECISIONS.md
- [x] **Await explicit approval: "Proceed to Milestone 02."**

## Milestone 02 — Content Engine (complete)
- [x] Zod schemas for all seven content types
- [x] Loaders (projects, experience, education, certifications, achievements,
      services, skills) with discovery + sort + validation
- [x] Example JSON for each content type
- [x] Verify a newly-added project folder is auto-detected with no code changes
- [x] Verify invalid content produces clear, developer-facing errors (missing
      file, multi-field schema violation, duplicate slug, malformed JSON)
- [x] `tsc --noEmit`, `eslint`, `next build` clean
- [x] Update PROGRESS.md / CONTENT_SYSTEM.md / ARCHITECTURE.md / DECISIONS.md
- [x] **Await explicit approval: "Proceed to Milestone 03."**

## Milestone 03 — Home (complete)
- [x] Hero (name, role, supporting statement)
- [x] Short introduction
- [x] View Projects / Contact CTAs
- [x] Social links
- [x] Metadata block (location, specialization, status)
- [x] Featured project section, sourced from `getFeaturedProjects()`
- [x] Entrance animation (page load reveal sequence per spec §29)
- [x] Resolved content-media serving gap (route handler + traversal/
      extension guards, verified against a running production server)
- [x] `tsc --noEmit`, `eslint`, `next build` clean
- [x] Update PROGRESS.md / ARCHITECTURE.md / ROUTES.md / COMPONENTS.md /
      DECISIONS.md
- [x] **Await explicit approval: "Proceed to Milestone 04."**

## Milestone 04 — Project Showroom Foundation (complete)
- [x] Project loader integration into `/projects`
- [x] Current-project state (client)
- [x] Large project image, project info
- [x] Previous/Next controls
- [x] Counter ("03/08")
- [x] Basic thumbnail selector
- [x] Empty-state handling (zero projects, single project)
- [x] Found and fixed a real Turbopack build bug (D-012) — Node built-ins
      leaking into the client bundle via a shared data module
- [x] `tsc --noEmit`, `eslint`, `next build` clean
- [x] Verified via running production server + curl across normal/empty/
      single-project content states; wrap-around index math verified in
      isolation; real click/keyboard browser testing not possible in this
      sandbox (see PROGRESS.md Known Issues)
- [x] Update PROGRESS.md / ARCHITECTURE.md / ROUTES.md / COMPONENTS.md /
      DECISIONS.md
- [x] **Await explicit approval: "Proceed to Milestone 05."**

## Milestone 05 — Project Showroom Motion (complete)
- [x] Install `framer-motion` (first real use case — see D-008, D-014)
- [x] Directional next/previous transitions (image + metadata as one
      choreographed group, spec §32)
- [x] Thumbnail rail motion (spec §33)
- [x] Animated counter transition (spec §34)
- [x] Keyboard navigation (unchanged from Milestone 04, still works)
- [x] Touch/swipe gestures (drag on the card, offset/velocity thresholds)
- [x] `prefers-reduced-motion` handling for all showroom motion
      (`usePrefersReducedMotion` hook, consumed by all three components)
- [x] `tsc --noEmit`, `eslint`, `next build` clean; confirmed no `node:fs`
      leaked into client chunks (re-verifying the Milestone 04 D-012 fix)
- [x] Verified via running production server (inline-style inspection) and
      isolated Node scripts for the swipe-threshold and reduced-motion
      branch logic; real browser interaction testing still not possible in
      this sandbox (see PROGRESS.md Known Issues)
- [x] Update PROGRESS.md / ARCHITECTURE.md / MOTION.md / COMPONENTS.md /
      DECISIONS.md
- [x] **Await explicit approval: "Proceed to Milestone 06."**

## Milestone 06 — Project Case Study + Files (complete)
- [x] `/projects/[slug]` full build: hero, overview, problem, objective,
      solution, challenges, results, lessons
- [x] Features section (alternating layout, spec §16)
- [x] Specifications table (reused `ProjectSpecs`/`SpecificationRow`)
- [x] Gallery (from `media.gallery`)
- [x] Project Files list with derived sizes and individual downloads
- [x] Installed `archiver`; built the "Download Entire Project" ZIP endpoint
      (`/api/projects/[slug]/download`), streamed, slug-validated
- [x] Found and fixed an `archiver` v8 API mismatch (D-015) and documented
      an extra file-download whitelist beyond path-traversal checks (D-016)
- [x] `tsc --noEmit`, `eslint`, `next build` clean
- [x] Verified via running production server with real requests: both case
      study pages, both download endpoints (including real ZIP content
      inspection via `unzip -l`), whitelist/traversal/unknown-slug 404s,
      zero-projects `generateStaticParams()` edge case
- [x] Update PROGRESS.md / ARCHITECTURE.md / ROUTES.md / COMPONENTS.md /
      CONTENT_SYSTEM.md / DECISIONS.md
- [x] **Await explicit approval: "Proceed to Milestone 07."**

## Milestone 07 — About + Services (complete)
- [x] Biography / philosophy / specialization (editorial composition, not a
      resume dump) — `lib/about.ts` + `EngineeringPrinciples`
- [x] Services section from `getAllServices()` — not generic equal-sized
      feature cards — `ServicesList`
- [x] Found and fixed a real empty-state inconsistency (Services heading
      rendering with no services present) during verification, not just
      code review
- [x] `tsc --noEmit`, `eslint`, `next build` clean
- [x] Verified via running production server across normal and
      empty-services states
- [x] Update PROGRESS.md / ROUTES.md / COMPONENTS.md / DECISIONS.md
- [x] **Await explicit approval: "Proceed to Milestone 08."**

## Milestone 08 — Skills (not started)
- [ ] Automotive telemetry-inspired skills display from
      `getAllSkillCategories()` — no generic pills
- [ ] No fabricated percentages; `level` only rendered when explicitly
      supplied
- [ ] Appended to the existing `/about` page (not a new route)
- [ ] Excellent desktop/mobile
- [ ] Update context, then stop before Milestone 09

## Remaining milestones (09–14)
Tracked at a section level in this file as each becomes active; full detail
lives in the master spec §79. Not expanded here yet to avoid premature detail.
