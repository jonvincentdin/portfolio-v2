# Visual Experience Upgrade — Milestone 01 Audit

**Status:** Complete  
**Date:** 2026-09-13  
**Scope:** Audit only. No public runtime redesign or feature work was introduced.

## Executive summary

The current repository is a server-first Next.js 16 portfolio with a PostgreSQL-backed owner CMS and a checked-in content fallback. Projects, media, project files, profile media, visibility, ordering, and editor drafts already flow through the existing content architecture. The public site has an established technical/automotive visual language and a restrained motion layer.

The visual-upgrade work should extend these systems. It should not add a second project source, second media system, raw JSON editing flow, or a parallel editor configuration format.

## Current architecture

- **Framework:** Next.js 16.3.4 App Router, React 19.2.8, TypeScript strict mode, Tailwind CSS v4.
- **Motion:** Framer Motion 13.2.0 plus CSS transitions; shared duration/easing tokens live in `src/lib/motion/tokens.ts`.
- **Content:** public loaders in `src/lib/content/`, Zod schemas in `src/lib/schemas/`, and database mapping in `src/lib/content/database.ts`.
- **Runtime source:** PostgreSQL when `DATABASE_URL` is configured; checked-in `content/` remains the local/seed fallback.
- **Editor:** `/owner` authentication gates `/editor`; `EditorShell` owns draft state and saves validated `EditorSnapshot` data through the existing owner API.
- **Media:** reusable `MediaAsset` records and project-specific `ProjectAsset` links support library assets, project images, screenshots, and files without manual path registration.
- **Project source of truth:** `getAllProjects()` / `getProjectBySlug()` feed the project showroom, case studies, sitemap, and download routes. There are currently three checked-in example projects.
- **Preview:** `EditorPreview` receives the current editor snapshot and active tab, so the preview is explicitly scoped to the tab currently being edited; project preview follows the selected project folder.

## Routes and navigation

Public routes are `/`, `/about`, `/projects`, `/projects/[slug]`, `/experience`, and `/contact`. Supporting routes cover owner authentication, `/editor`, media delivery, project downloads, contact submissions, sitemap, robots, and the generated OpenGraph image.

Desktop and mobile navigation share the same `NAV_ITEMS` definition. The mobile menu is a portal-rendered dialog with keyboard focus trapping, Escape handling, focus restoration, and distinct navigation labeling. The root layout provides the skip link and keyboard-focusable main landmark.

## Existing visual and interaction systems

### Visual foundation

- Dark technical canvas with a 64px grid.
- Single racing-yellow accent token, angular clipped panels, thin borders, Space Grotesk headings, JetBrains Mono technical labels, and Inter body text.
- Responsive layouts are explicitly audited at 375, 430, 768, 1024, 1280, 1440, and 1920px.
- Light mode is not currently implemented; the existing token system is dark-only.

### Motion inventory

- Home mount reveals and scroll reveals through `Reveal`.
- Route transitions through `PageTransition` plus `app/template.tsx`.
- Featured/case-study image clip-path reveals through `ImageMask`.
- Project showroom directional transitions, staggered metadata, swipe, keyboard navigation, animated counter, and thumbnail active indicator through Framer Motion.
- Experience work-history line is scroll-linked.
- Button press states, CTA arrow movement, hover states, and the existing hover-only long-name marquee are CSS-driven.
- Cursor-following orange grid illumination is implemented by `CursorGridGlow`; it is pointer-only, pointer-events-free, and disabled for reduced motion.
- `prefers-reduced-motion` is handled globally in CSS and in the Framer Motion components through `usePrefersReducedMotion()`.

### Existing deliberate boundaries

- No autoplay sound or audio system exists.
- No custom cursor replacement exists.
- No theme toggle or theme-aware token controller exists.
- No continuous decorative animation is used in the owner editor.
- Education is currently a stacked, readable list rather than a scroll-linked timeline.
- Footer and some static supporting areas use restrained static presentation rather than a dedicated interaction layer.

## CMS and data integrity findings

The CMS is suitable as the integration point for future visual settings:

1. `EditorSnapshotSchema` is the validation boundary.
2. `saveEditorSnapshot()` persists relational data in a Prisma transaction.
3. Visibility and display order are applied by the public loaders, so hidden and reordered projects naturally update the showroom and related routes.
4. Media replacement is represented by database asset rows and existing delivery routes, not hand-maintained paths.
5. Project file access and downloadability are separate from presentation and must remain so.

The current `SiteSettings` schema contains portfolio identity and CTA fields only. It does not yet contain visual-experience settings. Any later settings work should extend this existing model/snapshot/API path rather than create a separate configuration file.

## Accessibility, responsive behavior, and failure handling

- Skip-link focus, heading hierarchy, landmark labeling, contrast, and mobile dialog behavior were previously verified in the repository's accessibility work.
- Keyboard project navigation, touch/swipe showroom navigation, empty-project handling, and long-content wrapping are already represented in the current components and responsive documentation.
- Reduced motion collapses CSS animation and removes significant translation/drag behavior from the Framer Motion showroom.
- WebGL is not currently part of the application, so there is no vehicle renderer or vehicle-specific failure boundary to preserve yet. Future visual enhancements must remain optional and must not become navigation infrastructure.
- Project media and download routes include validation and traversal protections; future visual assets should reuse those boundaries.

## Tooling and verification baseline

The repository has no dedicated `test` script. Existing verification is a combination of TypeScript, ESLint, Prisma validation, production build, route/API smoke checks, and previously documented browser/accessibility audits.

Current checks run for this audit:

- `npx tsc --noEmit` — passed.
- `npm run lint` — passed with four existing `@next/next/no-img-element` warnings in editor-only media previews; zero errors.
- `npx prisma validate` — passed. Prisma reports the existing deprecation warning for `package.json#prisma` ahead of Prisma 7.
- `DATABASE_URL=' '` followed by `npm run build` — passed; all current public, editor, API, media, sitemap, robots, and OpenGraph routes compiled.
- Worktree was clean before the audit changes; no runtime source files were modified for this milestone.

## Recommended implementation order after the audit

1. Preserve the current CMS/content/media contracts while adding any visual settings.
2. Consolidate motion presets around the existing tokens and reduced-motion hook.
3. Add route/scroll and section interaction improvements without changing content ownership.
4. Add theme support only through shared tokens and persisted settings.
5. Add optional audio/cursor enhancements behind explicit, accessible controls.
6. Add or refine education and supporting-section motion after the foundation is verified.
7. Add automated browser regression coverage before introducing larger interactive layers.

## Milestone 01 completion checklist

- [x] Current repository inspected as the source of truth.
- [x] Existing routes, navigation, content loaders, CMS, media system, project system, editor preview, motion, responsive, accessibility, and storage boundaries documented.
- [x] Existing implementation gaps and future integration points identified.
- [x] Current validation baseline recorded.
- [x] No later-milestone redesign or runtime feature work performed.

