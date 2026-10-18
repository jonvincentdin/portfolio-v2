# Portfolio completion — M1 navigation and hierarchy

Implementation/checks: 2026-10-18. Delivery: 2026-10-19 (Asia/Singapore).
Starting commit: `91dd969` (Milestone 0).

**Status: implementation delivered; browser acceptance checks pending.** The
user authorized M1 with “Proceed to M1” despite the recorded M0 environment
limits. M2 has not started. Commit and push milestone deliveries before the
handoff, per the user's standing instruction.

## Changes

- Primary navigation keeps Projects highlighted on its case-study routes.
  Exact routes use `aria-current="page"`; descendants use `location`.
- Projects and Experience each own a single page `h1`, independent of CMS layout
  templates. Showroom project names are subordinate headings.
- About, Experience, and case studies have native section links and a sticky
  section rail. It highlights the section reached while scrolling and moves
  only its own horizontal rail to keep the active link visible. Targets are
  focusable and have clearance for the site header and section rail.
- Case-study sections and links are derived from actual nonempty content. The
  return-to-projects link and valid live/source/additional links precede the
  hero image. Prose anchor targets render immediately rather than waiting for
  an entrance reveal; gallery/image and feature motion remains available.
- Home actions precede metadata; identity/actions precede the portrait visually
  on mobile. Desktop copy is constrained beside the portrait. Experience has
  a direct hero link alongside existing public social links.
- Inactive showroom slides are `inert` and hidden from assistive technology.
  Arrow keys apply within the focused showroom only; focus moves to the showroom
  before a focused slide becomes inactive. A current project/name count is
  announced. Thumbnail buttons expose names and pressed state, with isolated
  animation groups for multiple showroom instances.
- The mobile dialog includes its own close button in the focus loop, scrolls
  at short viewport heights, and closes when crossing to desktop. Initial mount
  no longer steals focus. Trigger and primary links have 44px minimum heights.
- Empty/hidden-only Projects and Experience configurations show visitor-facing
  copy and a useful onward link. Empty configured sections are omitted. A root
  loading boundary provides textual route feedback without additional animation.

The owner-name link still leads to `/owner`. Existing content schemas, CMS
snapshot persistence, media ownership, visibility, project URLs, and downloads
are unchanged. No M2 scroll scene, M3 visual redesign, or M4 editor redesign was
introduced. The swipe threshold and reduced-motion drag findings remain M2 work.

## Verification

- `npx.cmd tsc --noEmit --incremental false`: passed.
- ESLint on every modified TypeScript/TSX file plus both new components: passed,
  zero warnings/errors. The prior ProjectShowroom render-time ref assignment
  error was removed while fixing its navigation state.
- `DATABASE_URL=' '` (process-only) with `npm.cmd run build`: passed with network
  access for the existing Google Fonts. `.env` was not changed.
- Production server (`next start --port 3333`, seed fallback): `/`, `/about`,
  `/projects`, `/experience`, `/contact`, all three seed case studies, and
  `/owner` returned successful HTML with exactly one `h1` each.
- Every fragment link in those responses has a matching target. All three case
  studies mark Projects as the current location and expose a return link.
  The three-project showroom renders exactly two inert slides and a selected
  thumbnail button.
- Unauthenticated `/editor` sends the framework's streamed redirect to `/owner`
  and contains no editor content. The initial HTTP assertion expected the old
  non-streaming redirect; inspection confirmed the new loading boundary's
  redirect metadata, and the corrected production check passed.
- Unknown project request renders the not-found/noindex response.
- `git diff --check`: passed. No automated test files or dependencies added.

These checks use the checked-in seed content. M0's database quota failure was not
resolved by M1, and database-backed editor save/preview was not exercised.
Full-repository lint was not rerun: M0 recorded unrelated errors and extensive
bundled PDF worker warnings; the scoped M1 check does not certify those files.

## Outstanding browser acceptance

Browser inventory again returned no available apps or browsers. There are no
M1 screenshots and no claim of live interaction or visual acceptance.

- Desktop 1440px, tablet 768px, mobile 375/390px: first viewport, hero/image
  spacing, section rail, all page links and mobile dialog.
- Keyboard: skip link, dialog Tab/Shift+Tab/Escape/close focus, showroom
  arrows/thumbnail buttons, visible focus after selection, anchor target focus.
- Direct fragments, refresh, back/forward, section highlighting during natural
  scroll, and active-link visibility within the horizontal rail.
- Touch and 200%/400% zoom: reachable menu/rail controls, readable content,
  no unintended horizontal page overflow.
- Reduced motion and slow-route loading feedback; empty/hidden-section data
  scenarios in an isolated test environment.

Finish these checks when a supported browser is available. Stop here; M2 needs
the explicit instruction **“Proceed to M2”**.
