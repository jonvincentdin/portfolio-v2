# PROGRESS.md

## Current Milestone
MILESTONE 01 — FOUNDATION (complete, awaiting approval to proceed)

## Completed
### Milestone 00 — Discovery
- [x] Studied full specification
- [x] Proposed architecture, routes, component hierarchy, content
      architecture, visual direction, motion strategy, responsive strategy
- [x] Created `.claude/context/` documentation structure

### Milestone 01 — Foundation
- [x] Scaffolded Next.js 16 (App Router) + TypeScript (strict) + Tailwind v4
      via `create-next-app`, `src/` layout, `@/*` import alias
- [x] Removed default create-next-app placeholder content (demo page, SVGs)
- [x] Fonts wired via `next/font/google`: Space Grotesk (heading), JetBrains
      Mono (technical), Inter (body) — `src/lib/fonts.ts`
- [x] Design tokens in `globals.css` (Tailwind v4 `@theme inline`): color
      tokens, typography scale; spacing intentionally uses Tailwind's
      built-in scale (documented as aligning with the spec's 4px-grid values)
- [x] `prefers-reduced-motion` base rule added at the CSS level (baseline
      safety net ahead of the full motion system in later milestones)
- [x] Motion tokens stubbed at `src/lib/motion/tokens.ts` (durations +
      easing curves only — no Framer Motion usage yet, correctly deferred)
- [x] Root layout (`src/app/layout.tsx`) with metadata, font variables,
      SiteHeader + Footer shell
- [x] Components built: `Container`, `TechnicalLabel`, `SectionHeading`,
      `AngularPanel`, `SiteHeader`, `NavLink`, `MobileNavigation`, `Footer`
- [x] Placeholder routes for all pages in ROUTES.md, including the dynamic
      `/projects/[slug]` stub (async `params`, no data loader yet)
- [x] `npx tsc --noEmit` — clean
- [x] `npx eslint .` — clean (one `react-hooks/set-state-in-effect` issue
      found and fixed by adjusting state during render instead of in a
      `useEffect`, per React's current guidance)
- [x] `next build` verified structurally sound (temporarily stubbed
      `next/font/google` to isolate from a sandbox-only network restriction,
      confirmed all 8 routes compile and prerender, then reverted to the
      real font config — see Known Issues)

## In Progress
- Nothing — Milestone 01 deliverables are complete; awaiting approval.

## Next
- Wait for explicit instruction: "Proceed to Milestone 02."
- Milestone 02 will implement Zod schemas and filesystem loaders for all
  seven content types (projects, experience, education, certifications,
  achievements, services, skills), with example JSON and verification that a
  newly-added project folder is auto-detected with zero code changes. The
  Projects showroom itself is still out of scope until Milestone 04.

## Known Issues / Open Questions
- **Sandbox-only:** `next build` fails in this container specifically
  because `fonts.googleapis.com` isn't in the egress allowlist (confirmed via
  a direct `curl`, HTTP 403). This is not a code defect — `next/font/google`
  self-hosts fonts at build time and works normally with standard internet
  access (local dev machine, CI, or Vercel). No action needed unless the
  target environment also restricts that domain, in which case switch to
  `next/font/local` with vendored font files.
- Exact accent-color default (racing yellow vs. motorsport red vs. electric
  blue) remains the placeholder default (racing yellow) pending user
  preference — trivially changed via the single `--accent` CSS variable.
- `archiver` (or equivalent) as the ZIP library is proposed but not yet
  installed/verified — to be confirmed in Milestone 06.
- Nav item list (`src/lib/navigation.ts`) is a plain constant, not part of
  the dynamic content system — intentional, since site IA/navigation is
  structural rather than filesystem-authored content (see CONTENT_SYSTEM.md).
