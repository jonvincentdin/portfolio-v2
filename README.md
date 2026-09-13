This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Owner Editor

The logo opens the private `/owner` verification flow. Configure `OWNER_EMAIL`,
`AUTH_SECRET`, `RESEND_API_KEY`, and `AUTH_FROM_EMAIL` for production OTP
delivery. For local-only work, set `AUTH_DEV_MODE=true`; the code is logged by
the server and never returned to the browser. Authenticated owners can edit at
`/editor`, preview drafts, save validated content, manage every discovered
portfolio section, create projects with a guided builder, upload/reuse media,
manage project attachments and visitor access, and log out. The editor handles
IDs, slugs, folders, references, ordering, and serialization internally.

Portfolio content, contact submissions, profile media, and project assets are
stored in PostgreSQL through Prisma. Set `DATABASE_URL`, then initialize the
schema and import the repository content with `npm run db:setup`. The database
is required for owner saves and runtime uploads. Without it, the public site
still renders the checked-in `content/` baseline while editor actions explain
that the database must be configured. See [docs/ADDING_CONTENT.md](docs/ADDING_CONTENT.md)
for setup and content guidance.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
