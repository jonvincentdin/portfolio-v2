# Adding Content

The source-controlled baseline lives under `content/`. Each collection uses
one JSON file per item, while projects use a numbered folder containing
`project.json` and its referenced media/files. Zod validates the shape and the
loaders verify referenced files exist. This baseline is also the seed source
for the runtime database.

The owner editor is available at `/editor` after OTP verification from
`/owner`. It saves structured fields to PostgreSQL rather than editing JSON.
Projects can be created with hero/thumbnail uploads, and existing projects can
receive gallery images, replacement media, downloadable files, and file
descriptions. `visible: false` hides an entry publicly. For projects,
`downloadable: false` hides the file list and makes both download endpoints
return 404. Additional project links use
`{ "label": "...", "url": "https://..." }`.

The editor's Media Library stores each uploaded binary once. In a project's
Asset Manager, drop files into the upload area or choose an existing library
asset. The application generates the project path and file reference. The same
library asset may be linked to multiple projects; each project keeps its own
display slot and downloadable classification. The owner never needs to create
folders or edit JSON.

Project media and file paths remain relative to their project record, but are
managed internally. The editor checks references against database assets before
saving; uploads are validated by size, MIME type, and image signatures before
being stored as binary data. Content fields are plain text or validated
structured data; HTML, CSS, and scripts are not supported.

## Database setup

The database model is in `prisma/schema.prisma` and uses PostgreSQL. Set a
pooled or direct `DATABASE_URL`, then run:

```bash
npm run db:generate
npm run db:setup
```

`db:setup` applies the schema with Prisma and seeds all checked-in content,
including project binaries. Re-running the seed replaces current database
content with the repository baseline, so use it only for first setup or an
intentional reset. Normal owner edits use `/api/editor/content` and remain in
the database. Project ZIP and individual-file downloads read database bytes
when configured, so runtime uploads survive deployment restarts.

If the database already contains the earlier project-asset model, apply the
non-destructive schema change and backfill those binaries into the library:

```bash
npm run db:push
npm run db:migrate-media
```

This preserves existing project rows and turns their binaries into reusable
library records. Do not run `db:seed` over a production database unless you
intend to reset it to the repository baseline.

## Local owner setup

Create environment values appropriate for the deployment:

```text
OWNER_EMAIL=owner@example.com
AUTH_SECRET=replace-with-a-long-random-secret
RESEND_API_KEY=re_...
AUTH_FROM_EMAIL=Portfolio <noreply@example.com>
```

Without a mail provider, local development may use `AUTH_DEV_MODE=true`. Read
the server terminal for the one-time code; do not enable that mode in
production. Auth rate-limit/session state remains in the gitignored `.data/`
directory; use durable storage for that state when running multiple instances.
