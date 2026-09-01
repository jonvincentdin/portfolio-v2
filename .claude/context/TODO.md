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

## Milestone 02 — Content Engine (not started)
- [ ] Zod schemas for all seven content types
- [ ] Loaders (projects, experience, education, certifications, achievements,
      services, skills) with discovery + sort + validation
- [ ] Example JSON for each content type
- [ ] Verify a newly-added project folder is auto-detected with no code changes

## Remaining milestones (03–14)
Tracked at a section level in this file as each becomes active; full detail
lives in the master spec §79. Not expanded here yet to avoid premature detail
before Milestone 00 is approved.
