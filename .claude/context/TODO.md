# TODO.md

## Visual Experience Upgrade — Milestone 02: Central Motion System (complete)
- [x] Central motion preset vocabulary and shared easing/duration tokens
- [x] Framer Motion route/showroom/reveal transition helpers
- [x] CSS motion utility classes for lightweight hover, press, and field states
- [x] Reduced-motion fallback shared by CSS and Framer Motion paths

## Visual Experience Upgrade — Milestone 03: Routing, Transitions & Scroll Restoration (complete)
- [x] New route entries reset to the top after commit
- [x] Hash anchors and sticky-header offset remain supported
- [x] Back/forward navigation preserves native browser scroll restoration
- [x] Route transition shortened and centralized at 400ms
- [ ] Live browser interaction verification pending browser availability

## Visual Experience Upgrade — Milestone 04: Global Scroll Experience (complete)
- [x] Passive synchronized scroll progress indicator
- [x] RAF-throttled updates with no scroll hijacking
- [x] Desktop route label and simplified mobile presentation
- [x] Editor/owner distraction reduction

## Visual Experience Continuation — Milestones 11–15 (complete)
- [x] M11 shared tactile button/link states, focus feedback, press feedback,
      and disabled-safe motion
- [x] M12 project media pointer lighting, restrained depth response, and
      reduced-motion/coarse-pointer fallback
- [x] M13 current-role progression cue on the existing experience timeline
- [x] M14 selectable education progression with keyboard/touch semantics and
      mobile vertical transformation
- [x] M15 expandable skill clusters and featured technology chips without
      fabricated proficiency percentages
- [x] M16 controlled certification/achievement highlights, optional image
      response, metadata reveal, polished selection states, and CMS-safe
      rendering

## Database CMS Extension (implemented)
- [x] Prisma relational model and binary asset storage
- [x] Seed existing JSON/files into PostgreSQL
- [x] Database-backed public loaders, media, project downloads, and metadata
- [x] Structured editor forms for portfolio text, collections, projects, and
      project uploads
- [x] Database-backed contact submissions and documentation
- [x] Configure a real `DATABASE_URL` and initialize the deployment database

## Media Library Extension (complete)
- [x] Reusable `MediaAsset` records and project-specific link rows
- [x] Owner media library management and project library picker
- [x] Existing-asset migration command and documentation
- [x] Apply schema/backfill to the deployment database and verify linked
      image/file delivery end to end

## Milestone 15 — Owner Editor / CMS (complete)
- [x] Owner OTP/session flow and owner-only editor/profile APIs
- [x] Runtime snapshot persistence, Zod validation, visibility/downloadable
      behavior, and profile upload validation
- [x] Responsive ten-section editor with preview, save, logout, dirty guard,
      and updated public runtime content integration
- [x] Updated README, `docs/ADDING_CONTENT.md`, and affected context docs

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

## Milestone 08 — Skills (complete)
- [x] Automotive telemetry-inspired skills display from
      `getAllSkillCategories()` — no generic pills
- [x] No fabricated percentages; `level` only rendered when explicitly
      supplied (discrete 5-segment bar keyed to the real enum rank — D-018)
- [x] Appended to the existing `/about` page (not a new route)
- [x] Excellent desktop/mobile (responsive grid, `AngularPanel` telemetry
      panels)
- [x] `tsc --noEmit`, `eslint`, `next build` clean
- [x] Verified via running production server: real leveled skill (correct
      segment count), real unleveled skill (no bar at all), empty-state
      (heading correctly hidden)
- [x] Update PROGRESS.md / ROUTES.md / COMPONENTS.md / DECISIONS.md
- [x] **Await explicit approval: "Proceed to Milestone 09."**

## Milestone 09 — Experience (complete)
- [x] `/experience`: Experience, Education, Certifications, Achievements —
      one coherent timeline/specification page
- [x] Sourced from `getAllExperience()`, `getAllEducation()`,
      `getAllCertifications()`, `getAllAchievements()`
- [x] Coherent timeline/specification design, dynamic content —
      scroll-linked growing line for Experience (D-019), stacked lists for
      Education, `AngularPanel` grids for Certifications/Achievements
- [x] Every section (heading included) hidden entirely when empty
- [x] `tsc --noEmit`, `eslint`, `next build` clean; confirmed no Node
      built-ins leaked into client chunks
- [x] Verified via running production server: correct sort order and date
      formatting, correct SSR initial state for the scroll-linked line,
      all-empty edge case
- [x] Update PROGRESS.md / ROUTES.md / COMPONENTS.md / DECISIONS.md
- [x] **Await explicit approval: "Proceed to Milestone 10."**

## Milestone 10 — Contact (complete)
- [x] Form: name, email, subject, message
- [x] Email, GitHub, LinkedIn, social links
- [x] Validation (shared Zod schema, client pre-check + server re-check)
- [x] Idle / sending / success / error states
- [x] Polished motion (staggered mount-reveal, matching Home/About/Experience)
- [x] `tsc --noEmit`, `eslint`, `next build` clean; confirmed no Node
      built-ins leaked into client chunks
- [x] Verified via running production server: real POST requests (valid,
      invalid, malformed), label/input accessibility association, correct
      social-links filtering
- [x] Documented a real (not sandbox-only) limitation: no email provider is
      wired up yet — D-020
- [x] Update PROGRESS.md / ROUTES.md / COMPONENTS.md / DECISIONS.md
- [x] **Await explicit approval: "Proceed to Milestone 11."**

## Milestone 11 — Responsive Polish (complete)
- [x] Audit 375 / 430 / 768 / 1024 / 1280 / 1440 / 1920 (real headless
      browser, 42 breakpoint × page combinations, zero overflow confirmed)
- [x] Fix: overflow (D-022), image proportions (D-023), mobile menu (D-024
      — the milestone's most significant finding), unwanted page scroll
      (D-025), single-word heading overflow (`break-words` sitewide)
- [x] Re-verified keyboard/click/swipe/menu interactions with real browser
      input, closing out gaps flagged since Milestones 04/05/09
- [x] `tsc --noEmit`, `eslint`, `next build` clean
- [x] Update RESPONSIVE.md with findings and methodology
- [x] Update context, then stop before Milestone 12
- [x] **Await explicit approval: "Proceed to Milestone 12."**

## Milestone 12 — Motion + Microinteractions (complete)
- [x] Audit all motion: navigation, project transitions, buttons, image
      masks, page transitions, section reveals, project controls, file
      download interactions
- [x] Built the two real gaps found: `PageTransition`+`template.tsx` (page
      transitions, spec §31) and `ImageMask` (image mask reveal, spec §30)
- [x] Added `active:` press states to every button-style control (spec §36)
- [x] Found and fixed 3 real bugs via real-browser testing: page
      transitions leaving pages permanently invisible (D-026), ImageMask
      never revealing (D-027), press-state CSS silently not compiling
      (D-028)
- [x] Deliberately scoped out unnecessary additions (no `MotionImage`
      component, no intrinsic `AngularPanel` animation, no press-scale on
      text nav links) — documented as D-029
- [x] `tsc --noEmit`, `eslint`, `next build` clean; confirmed no Node
      built-ins leaked into client chunks
- [x] Re-ran the full Milestone 11 responsive audit (5 breakpoints × 6
      pages + mobile menu + no-autoscroll checks): 0 overflow, no
      regressions
- [x] Update PROGRESS.md / MOTION.md / COMPONENTS.md / ROUTES.md /
      DECISIONS.md
- [x] **Await explicit approval: "Proceed to Milestone 13."**

## Milestone 13 — Performance + Accessibility (complete)
- [x] Audit: semantic HTML, ARIA, keyboard navigation, focus, contrast
      (computed real ratios, found/fixed 2 real gaps: --border-strong for
      form inputs, skip-link focus target)
- [x] Audit: images, loading, SEO, metadata, OpenGraph, sitemap, robots
      (all built/fixed: sitemap.ts, robots.ts, per-page OG/Twitter overrides,
      opengraph-image.tsx runtime fix)
- [x] Ran an automated `axe-core` scan across all 6 pages; found and fixed
      3 real violations (contrast, heading order, duplicate landmarks);
      re-ran to confirm zero violations remain
- [x] Gave the mobile menu full dialog semantics (focus trap, Escape,
      focus management) — verified with real keyboard input
- [x] `tsc --noEmit`, `eslint`, `next build` clean; re-ran Milestone 11's
      overflow audit to confirm no regressions
- [x] Update PROGRESS.md / ARCHITECTURE.md / ROUTES.md / DESIGN_SYSTEM.md /
      COMPONENTS.md / DECISIONS.md
- [x] **Await explicit approval: "Proceed to Milestone 14."**

## Milestone 14 — Final Design QA (complete)
- [x] Full visual audit: "does this look like a custom premium automotive
      experience, or a developer template?"
- [x] Inspect typography, spacing, navigation, project showcase, skills,
      timeline, buttons, downloads, mobile, visual rhythm, and animations
- [x] Polish only — no new features
- [x] Update context; this is the final public-site milestone in the original
      spec

## Visual Experience Continuation — Milestones 05–10
- [x] Cursor engine and Cursor Designer integrated with Site Experience.
- [x] Central optional audio engine and interaction sound hooks integrated.
- [x] Shared media library supports validated audio replacement assets.
- [x] Existing Home hero extended with lightweight pointer lighting and
      telemetry treatment; mobile and reduced-motion fallbacks preserved.
- [x] Draft preview follows the active editor tab, including Site Experience.
- [ ] In-app browser screenshot/click verification when a browser surface is
      available.
