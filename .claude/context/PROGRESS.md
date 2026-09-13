# PROGRESS.md

## Media Library Extension (complete)
- [x] Global `MediaAsset` model with reusable metadata and binary storage.
- [x] Project links retain project-relative paths while referencing library IDs.
- [x] Library upload/list/delete API and owner editor Library section.
- [x] Project Asset Manager can upload once or link an existing library asset.
- [x] Safe migration command for existing project binaries.
- [x] Ran schema push and the media backfill against the configured deployment
      database; 14 existing project binaries were migrated and all 14 project
      links now reference reusable library records.
- [x] Verified database-backed project, linked-image, individual-file, and ZIP
      download delivery with live HTTP smoke tests; TypeScript, lint, and build
      also pass.

## Milestone 15 — Owner Editor / CMS (complete)
- [x] Secure OTP verification, rate limits, one-time expiry, HTTP-only
      sessions, logout, and owner-only APIs.
- [x] PostgreSQL-backed validated content, visibility/downloadable
      controls, safe project references, and profile-image storage.
- [x] Responsive `/editor` sections 01 Home through 10 Contact, draft
      preview, Save/Log Out, dirty-state protection, and documentation.
- [x] `npx tsc --noEmit` and `npm run lint` pass.

M15 operational notes: configure `RESEND_API_KEY` and `AUTH_FROM_EMAIL` for
production OTP delivery, or explicitly use `AUTH_DEV_MODE=true` locally.
Database CMS note: `DATABASE_URL` is configured for the deployment database,
which has been schema-synced, seeded, and backfilled for the media library.

## Database CMS Extension (implemented)
- [x] Prisma PostgreSQL model for settings, collections, projects, binary
      project assets, profile media, and contact submissions.
- [x] Seed command imports the existing `content/` baseline and project files.
- [x] Public loaders, media, file downloads, ZIP downloads, and metadata read
      database content when configured while retaining a source fallback.
- [x] Structured owner forms create/edit projects and upload project assets;
      validated snapshot saves persist relational fields in a transaction.
- [x] README, adding-content guide, and affected context documentation updated.
- [x] `npx tsc --noEmit`, `npm run lint`, and `npm run build` pass.
- [ ] Set `DATABASE_URL` and run `npm run db:setup` in the deployment
      environment.

## Current Milestone
MEDIA LIBRARY EXTENSION — COMPLETE; reusable uploads, project links, and
database-backed delivery are verified.

## Historical milestone status
MILESTONE 15 — OWNER EDITOR / CMS (complete); MEDIA LIBRARY EXTENSION
(complete)

## Completed
### Milestones 00–12
All prior milestones (Discovery through Motion + Microinteractions) are
complete. The full public site is built, responsive across all 7 audited
breakpoints, and has a complete motion layer (showroom transitions, page
transitions, image mask reveals, press states). See DECISIONS.md (D-001
through D-029) for full history. Milestones 11 and 12 both relied on real
headless-browser testing to find and fix bugs invisible to code review —
most notably a broken mobile menu (D-024) and page transitions that left
every page permanently invisible after one navigation (D-026).

### Milestone 13 — Performance + Accessibility
- [x] **Contrast:** computed actual WCAG contrast ratios for every color
      pair (not estimated) — all text-role pairs (`foreground-primary`/
      `foreground-muted`/`accent` against `background-primary`/`surface`)
      clear the 4.5:1 AA minimum. Found `--border` at only 1.28:1 (fine for
      decorative dividers, too low for a UI-component boundary per WCAG
      1.4.11); added a second `--border-strong` token (3.15:1) for the
      Contact form's input boundaries specifically (D-030).
- [x] **Focus:** removed the Contact form's `outline-none`-with-only-a-
      color-change focus indicator; found and fixed a real bug where the
      skip link scrolled to `<main>` but never actually moved keyboard
      focus there (missing `tabIndex={-1}` on the target) — verified with
      a real Tab press before (`document.activeElement.id` was `"BODY"`)
      and after (`"main-content"`) the fix (D-031).
- [x] **SEO/metadata:** added `src/app/sitemap.ts` (dynamic, sourced from
      `getAllProjects()`) and `src/app/robots.ts`; added explicit
      `openGraph`/`twitter` overrides to every page's metadata (Next.js
      merges these as whole objects from the parent layout otherwise,
      so every page was silently inheriting the homepage's social-share
      title/description); the case study page's OG image now uses the
      project's real hero image (D-032).
- [x] **`opengraph-image.tsx`** (a `next/og` `ImageResponse` generator)
      had a deprecated `runtime = "edge"` export — removed, resolving a
      build warning; verified the generated image (a real 1200×630 PNG)
      renders correctly on-brand.
- [x] **Automated accessibility audit:** ran `axe-core` (industry-standard,
      installed temporarily via `npm install --no-save`, never committed
      to `package.json`) against all 6 representative pages through a real
      headless browser, checking the full `wcag2a`/`wcag2aa`/
      `best-practice` rule sets (D-033). Found 3 real, distinct violations
      not on any pre-planned fix list:
      1. **Color contrast** — nav link index numbers used
         `text-foreground-muted/60` (measures 2.73:1, well under 4.5:1)
         despite the full-opacity color passing comfortably; fixed by
         removing the opacity reduction.
      2. **Heading order** — About, Experience, and the case study page
         each had at least one `<h1>` → `<h3>` jump with no `<h2>` between;
         fixed by giving `TechnicalLabel` an `as="h2"` option and applying
         it to the relevant section-title labels (Engineering Principles,
         Services, Development Systems, Work History, Education,
         Certifications, Achievements, Features) — deliberately not to
         every label, only ones that actually precede `<h3>` content
         (D-034).
      3. **Duplicate landmark** — the desktop and mobile `<nav>` elements
         had no distinguishing `aria-label`, and the mobile menu remained
         in the accessibility tree even while visually closed; fixed with
         distinct labels ("Primary"/"Mobile") and `aria-hidden={!isOpen}`.
      Re-ran the identical scan after all three fixes: **zero violations
      across all 6 pages.**
- [x] **Mobile menu given full dialog semantics** (a substantial piece of
      this milestone's work): `role="dialog"`, `aria-modal="true"`, a real
      focus trap (Tab/Shift+Tab cycle only within the menu's links),
      Escape-to-close, and focus returned to the hamburger button on
      close. Verified with real keyboard input, not code review: opening
      moves focus to "Home" (first link); 6 Tab presses (more than the 5
      real links) wrap back around within the menu rather than escaping
      into the page behind it; Escape closes and returns focus to "Open
      menu" (D-035).
- [x] Verified every page has exactly one `<h1>` (already correct, no
      fix needed — confirmed by direct inspection across all 6 pages).
- [x] `tsc --noEmit`, `eslint`, `next build` clean throughout; confirmed no
      `node:fs`/`node:stream`/`node:path` leaked into client chunks despite
      the mobile-menu focus-management changes
- [x] Re-ran Milestone 11's overflow audit (3 breakpoints × 6 pages) after
      all Milestone 13 changes: zero regressions
- [x] `axe-core` was briefly, mistakenly deleted from `node_modules` after
      use (assuming it was purely a testing tool I'd installed) — this
      broke `eslint` immediately, revealing it's actually a real transitive
      dependency of `eslint-plugin-jsx-a11y` (part of this project's own
      `eslint-config-next` setup). Caught immediately via the broken lint
      run, not silently left broken; fixed with a plain `npm install` to
      restore it correctly.
- [x] Update PROGRESS.md / ARCHITECTURE.md / ROUTES.md / DESIGN_SYSTEM.md /
      COMPONENTS.md / DECISIONS.md

### Milestone 14 — Final Design QA
- [x] Audited the complete visual system against the master prompt: typography,
      spacing, navigation, showroom, project files, skills, timeline, contact,
      responsive structure, visual rhythm, and existing motion boundaries.
- [x] Preserved the established automotive identity while polishing the areas
      that read most like a generic portfolio: added a restrained 64px
      technical grid to the dark canvas, added a deliberate angular calibration
      frame to the desktop Home hero's open side, and gave AngularPanel a small
      accent registration mark for consistent hierarchy.
- [x] Improved editorial typography with balanced headings and pretty body
      wrapping, and made long project-file rows wrap safely on narrow screens.
- [x] Kept the scope to visual polish: no new routes, features, content types,
      schemas, or behavior were introduced; existing reduced-motion and
      accessibility rules remain in place.
- [x] `npm run lint`, `npx tsc --noEmit`, `git diff --check`, and `npm run build`
      pass. The production build required network access because the existing
      `next/font/google` setup fetches its configured fonts at build time.
- [x] Production smoke-tested every public route, all three project case
      studies, sitemap, robots, generated OG image, contact validation, media
      extension/traversal guards, file whitelist behavior, and unknown-project
      rejection.
- [x] Updated the affected context documentation and verified the master
      prompt is present at `automotive_gran_turismo_portfolio_claude_prompt_v2.md`.

## In Progress
- Nothing — the original specification's final public-site milestone is complete.

## Next
- No further milestone is defined after the owner-editor/CMS and media-library
  scope.

## Known Issues / Open Questions
- **Environment-dependent:** a restricted/offline environment cannot complete
  `next build` while `next/font/google` is configured to fetch fonts; the build
  passes when network access is available. This is unchanged application
  architecture, not a design-QA failure.
- **Environment-dependent:** the in-app browser surface was unavailable during
  this pass (no browser instances were exposed), so screenshot and real click/
  keyboard visual verification could not be performed. The audit used source
  inspection, rendered HTML/CSS from the local server, and production smoke
  requests instead; no screenshot-based claims are being made.
- **Real limitation, not sandbox-only:** `/api/contact` does not deliver
  actual email — no provider credentials exist in this environment (D-020).
- `SITE_IDENTITY.siteUrl` (`https://yourname.dev`) is a placeholder used by
  `metadataBase`, `sitemap.ts`, and `robots.ts` — needs to be the real
  deployed domain before the site goes live, or the sitemap/OG tags will
  point at the wrong host.
- Exact accent-color default (racing yellow) remains a placeholder pending
  user preference — unchanged from Milestone 01.
- `zod` v4's issue type uses `PropertyKey[]` for `path` — accounted for in
  `fs-utils.ts`.
- Certification/achievement `date` sorting is a plain string comparison —
  correct for ISO-like values, best-effort for free text.
- `archiver`'s `error` event handler logs and continues rather than
  surfacing a failed download specially — a reasonable, minor residual gap
  at this point given everything else audited this milestone.
- `ABOUT_CONTENT`'s philosophy/principles copy, `SITE_IDENTITY`'s
  `contactEmail`/`siteUrl`, and the example experience/education/
  certification/achievement content are all generic, editable placeholder
  text/data — intended to be personalized before the site is actually
  published.
- This milestone's `axe-core` scan covered 6 representative pages (one
  project case study, not all three) — the other two case studies share
  identical components/markup, so this is a reasonable sample, not
  exhaustive coverage of every possible content permutation.
