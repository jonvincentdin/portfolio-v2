# CONTENT_SYSTEM.md

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

## Project Files & ZIP System
Covered in depth in ARCHITECTURE.md. Summary: `files[]` entries in
`project.json` are optional pointers into the project's own `files/`
subfolder and are rendered as an automotive-spec-styled list with derived
file size and a per-file download; a separate "DOWNLOAD PROJECT" action
streams a ZIP of the entire project folder (not just the listed files).

## Empty-State Rules (spec §74)
- No certifications → section is omitted entirely, not shown empty.
- No `links.github` → GitHub button hidden.
- No `links.live` → live-site button hidden.
- No `media.gallery` → gallery omitted.
- No `files[]` → "Project Files" section omitted.
This is enforced in the loaders/components, not left to ad hoc `if` checks
scattered across the UI — each section component takes an already-filtered
prop and simply doesn't render when empty.
