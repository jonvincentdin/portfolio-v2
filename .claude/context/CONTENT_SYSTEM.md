# CONTENT_SYSTEM.md

> **Status:** Implemented in Milestone 02. Schemas live in `src/lib/schemas/`,
> loaders in `src/lib/content/`, example content in `content/`. Nothing here
> is wired into a page/route yet — that starts in Milestone 03 (Home) and
> Milestone 04 (Projects showroom).

## Content Directories
```
content/
├── projects/       (folders: NNN-slug/, each with project.json + media + files/)
├── experience/      (files: NNN-company.json)
├── education/        (files: NNN-institution.json)
├── certifications/    (files: NNN-title.json)
├── achievements/       (files: NNN-title.json)
├── services/            (files: NN-service.json)
└── skills/                (files: category.json, e.g. frontend.json)
```
Each directory is read by exactly one loader in `lib/content/`, validated by
exactly one schema in `lib/schemas/`, and drives exactly one section of UI.
Adding a new JSON file (or, for projects, a new folder) is the entire
authoring workflow — no component or route edits.

## Schemas (Zod, TypeScript types inferred)

### Project (`lib/schemas/project.ts`)
Fields: `id, slug, name, shortName, tagline, description, year, featured,
order, status, category[], role[], technologies[], links.{live,github},
media.{hero,thumbnail,gallery[]}, caseStudy.{overview,problem,objective,
solution,challenges,results,lessons}, features[].{title,description,image},
files[].{name,path,type,description}`.
All media/file paths are relative to the project folder and existence-checked
at load time.

### Experience (`lib/schemas/experience.ts`)
`id, company, position, startDate, endDate, current, location, description,
responsibilities[], technologies[]`. Sorted by `startDate` desc, `current`
entries first.

### Education
`institution, program, startYear, endYear, description, achievements[]`.

### Certification
`title, issuer, date, credentialId, credentialUrl, image` (image optional).

### Achievement
`title, organization, date, description, image` (image optional).

### Service
`id, title, description, capabilities[]`.

### Skill category
`category, skills[].{name, level, featured}`. `level` is one of `Learning |
Familiar | Intermediate | Advanced | Primary` and is only ever rendered when
explicitly present — no synthesized percentages, ever.

## Discovery & Validation Flow
Identical pattern per content type:
`readdir/readFile → JSON.parse → Schema.safeParse → sort → return typed data`.
A `safeParse` failure produces a developer-facing error naming the file and
the offending field — not a silent skip and not a generic crash.

Implementation notes (Milestone 02):
- `src/lib/content/fs-utils.ts` holds the shared plumbing: `listDirectories`,
  `listJsonFiles`, `readJsonFile`, `parseOrThrow`, `assertFileExists`,
  `getFileSizeBytes`/`formatFileSize`, and a generic
  `loadJsonCollection(dirName, schema)` used by every single-file content
  type (experience, education, certifications, achievements, services,
  skills). Projects use their own loader (`projects.ts`) since a project is
  a folder, not a single file.
- Two error types: `ContentValidationError` (schema violations — can report
  several failing fields from one file in a single error) and
  `ContentFileError` (malformed JSON, or a referenced file that doesn't
  exist on disk).
- Every loader module-level-caches its result (`let cache: T[] | null`) so
  repeated calls within the same process don't re-read the filesystem.
- Verified directly (script written, run, and removed — not shipped):
  auto-discovery of a new project folder with zero code changes; clear
  errors for a missing media reference, multiple simultaneous schema
  violations, a duplicate slug across two folders, and malformed JSON.

## Project Files & ZIP System
> **Status:** Fully implemented in Milestone 06. See ARCHITECTURE.md's "ZIP
> Download System" section for the endpoint details.

`files[]` entries in `project.json` are optional pointers into the
project's own `files/` subfolder and are rendered by `ProjectFiles` as an
automotive-spec-styled list with derived file size
(`getProjectFileSizeBytes()`/`formatFileSize()`) and a per-file download via
`/api/projects/[slug]/files/[...path]` — whitelisted against `files[]`
specifically, not just path-validated (DECISIONS.md D-016). A separate
"Download Project" action (`DownloadProjectButton` → `/api/projects/[slug]/
download`) streams a ZIP of the entire project folder — not just the listed
files — via `archiver`'s `ZipArchive` class (DECISIONS.md D-015), verified
end-to-end with real downloads and `unzip -l` folder-structure inspection.

## Example Content (Milestone 02)
`content/` currently has three example projects, exercising different parts
of the schema:
- `001-memora` — full-featured: gallery, features, and a `files/` folder
  with a sample PDF and TXT (used to verify file-size derivation).
- `002-curriculumaxxer` — lean: no gallery, no features, no files, no
  `links` object at all — verifies every optional field correctly defaults
  (empty arrays, empty-string links, empty case-study fields).
- `003-example-project` — the folder used to prove auto-discovery: added
  after the loaders were written, with no code changes required to pick it
  up.

Plus one representative example each for experience (two entries, to verify
current-first + date-descending sort), education, certifications,
achievements, and two entries each for services and skills (to verify
sorting and multi-entry rendering later).

All placeholder media (`hero.webp`, `thumbnail.webp`, gallery/screenshot
images, the sample PDF) were generated locally with ImageMagick — not
sourced from the web — specifically so the loader's file-existence checks
have real files to validate against.

## Empty-State Rules (spec §74)
- No certifications → section is omitted entirely, not shown empty.
- No `links.github` → GitHub button hidden.
- No `links.live` → live-site button hidden.
- No `media.gallery` → gallery omitted.
- No `files[]` → "Project Files" section omitted.
This is enforced in the loaders/components, not left to ad hoc `if` checks
scattered across the UI — each section component takes an already-filtered
prop and simply doesn't render when empty.
