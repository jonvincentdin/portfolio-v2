# ARCHITECTURE.md

## Confirmed Stack Versions (as of Milestone 01)
Next.js 16 (App Router, Turbopack build), React 19, TypeScript 5 (strict),
Tailwind CSS v4 (CSS-first config via `@theme inline` in `globals.css` — no
`tailwind.config.ts`). `npx next typegen` regenerates the route param types
(`LayoutProps`, etc.) without running a full build — useful for type-checking
in environments without network access for font fetching (see PROGRESS.md).

## High-Level Architecture
Next.js App Router project, server-first by default. Content lives as JSON +
media files under `content/`, is discovered at build/dev time by filesystem
readers in `lib/content/`, validated with Zod schemas in `lib/schemas/`, and
exposed to pages/components as typed data. Interactive pieces (the showroom,
mobile nav, contact form, gesture handling) are isolated client components;
everything else renders on the server.

```
content (filesystem, source of truth)
   │  fs.readdir / fs.readFile
   ▼
lib/content/*.ts  (loaders: discover, parse, sort)
   │  Zod .parse()
   ▼
lib/schemas/*.ts  (validation + inferred TS types)
   │
   ▼
app/**/page.tsx (server components — fetch loaders directly, no client fetch)
   │
   ▼
components/** (server components by default; "use client" only where needed)
```

## Project Discovery (core mechanism)
`lib/content/projects.ts` exports `getAllProjects()` / `getProjectBySlug(slug)`:
1. `fs.readdirSync('content/projects')` → list of folder names (e.g. `001-memora`).
2. For each folder, read `project.json`, parse with `ProjectSchema.safeParse`.
3. On validation failure: throw a developer-facing error naming the folder and
   the failing field (never fail silently, never crash the whole site in prod
   — see error-handling note below).
4. Resolve media paths relative to the project folder; verify referenced files
   exist (`hero`, `thumbnail`, gallery entries, `files[].path`); missing files
   raise a clear error identifying `project.json → field → path`.
5. Sort by `order` (fallback to numeric folder prefix, fallback to `year` desc).
6. Cache within a single request/build via Next's fetch/data cache semantics
   (or a simple module-level memoization in dev).

This same discover → validate → sort pattern is reused for experience,
education, certifications, achievements, services, and skills loaders — one
loader module per content type, one schema per content type, all following an
identical shape so the pattern stays predictable.

**Error handling policy:** in development, invalid content throws immediately
and loudly (fast feedback while authoring JSON). In production builds, the
same validation runs at build time (Next.js static generation), so a bad
`project.json` fails the build rather than shipping broken data — this is
correct for a mostly-static personal portfolio.

## Server/Client Boundaries
**Server components (default):** route `page.tsx` files, `ProjectSpecs`,
`ProjectFeature`, `ProjectGallery`, `ProjectFiles`, `SkillDashboard`,
`ExperienceTimeline`, `SectionHeading`, `AngularPanel`, `Footer`.

**Client components ("use client"):** `ProjectShowroom` / `ProjectViewer`
(state: current index, direction, drag/swipe), `ProjectThumbnailRail`
(scroll + selection sync), `MobileNavigation`, `PageTransition`, `Reveal`
(uses `IntersectionObserver` / `useInView`), `ContactForm` (state + submission),
`MotionImage` (hover/parallax), download-button state machine (idle → preparing
→ building → ready).

Rule of thumb applied throughout: state and gesture/animation logic live in
the smallest possible client boundary; data fetching and static layout stay
server-side and are passed down as props.

## Routing
See ROUTES.md for the full table. Dynamic project case studies use
`app/projects/[slug]/page.tsx` with `generateStaticParams()` sourced from the
same `getAllProjects()` loader, so new project folders are automatically
statically generated with zero route changes.

## ZIP Download System
`GET /api/projects/[slug]/download`:
1. Validate `slug` against the known set from `getAllProjects()` (reject
   anything not in that set — this is also the path-traversal defense, since
   the filesystem path is never built from raw user input, only from a
   pre-validated slug → folder-name lookup).
2. Resolve the absolute project directory once, from the trusted lookup.
3. Recursively walk the directory (`fs.readdir` with `withFileTypes`,
   recursing into subfolders) and stream each entry into an `archiver` ZIP
   stream, preserving the relative folder structure under a top-level
   `<project-folder-name>/` entry.
4. Pipe the archiver stream directly to the `Response` (Node stream →
   `ReadableStream` adapter) rather than buffering the whole ZIP in memory —
   required for larger projects with video/design-file attachments.
5. Set `Content-Type: application/zip` and
   `Content-Disposition: attachment; filename="<folder-name>.zip"`.

Individual file downloads (`ProjectFiles` UI) serve directly from the
validated project directory using the same slug-lookup pattern — never a raw
path from the client.

File size for the `ProjectFiles` list is derived with `fs.statSync(...).size`
at read time and formatted (KB/MB) rather than hand-maintained in JSON.

## Validation & Types
Every content shape has one Zod schema in `lib/schemas/`, and the TypeScript
type is inferred (`z.infer<typeof ProjectSchema>`) rather than hand-duplicated.
Schemas are the single source of truth for both runtime validation and
compile-time types.

## Data Loading vs. Runtime Storage (see PROJECT.md, spec §64)
`content/` is committed to the Git repository and is the correct model for
projects I add myself during development. If a future admin UI needs to let
me (or anyone) upload projects at runtime against a deployed instance, that
requires persistent object storage (e.g. S3/R2/Blob storage) plus a database
or index — a deployed serverless function cannot durably write back into the
Git repository. This limitation will be documented in `docs/ADDING_CONTENT.md`
when that milestone is reached; no runtime upload system is being proposed
in the current milestone plan.

## Technical Risks & Mitigations
| Risk | Mitigation |
|---|---|
| Large/animated showroom causes jank on lower-end devices | Animate only `transform`/`opacity`/`clip-path`; `will-change` sparingly; test with CPU throttling in Milestone 05/13 |
| ZIP streaming memory pressure on large projects | Stream via `archiver` + Node stream piping, never buffer full ZIP |
| Path traversal via project slug or file path | Slug validated against a closed set from the loader; file paths resolved only from validated project directories, never from raw request input |
| Content drift (JSON references a file that doesn't exist) | Build-time validation throws a developer-facing error naming folder + field + path |
| Next/Image with a fully dynamic, filesystem-discovered image set | Use `next/image` with `unoptimized` fallback only if remote/loader constraints require it; otherwise local `content/` images work natively with static import-free `src` paths at build time |
| Reduced-motion regressions as motion complexity grows | Centralize all durations/easings in `lib/motion` tokens and gate complex variants behind a single `usePrefersReducedMotion()` hook, audited in Milestone 12 |
| Scope creep across 15 milestones | Strict "read context → implement only current milestone → update context → stop" workflow (spec §80) |
