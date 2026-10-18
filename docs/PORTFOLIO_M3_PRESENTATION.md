# M3 - Visual system and content presentation

2026-10-19. Implementation delivered; browser visual acceptance pending.
Authorized by “Proceed to M3”. M4 has not started.

## Evidence-led scope

Git initially contained only the user's package.json dev-port change, preserved
and excluded from this commit. Reviewed the completion brief, linked context from
the earlier milestones, current design system, affected components and installed
Next.js image guide. Browser inventory again returned no apps/browsers.

Source findings: showroom mobile order classes had no flex/grid parent; project
images used object-cover despite arbitrary screenshot aspect ratios; build-sheet
values were uppercase technical text with dotted leaders; prose lost paragraph
breaks and had metadata-sized headings; case-study metadata squeezed three columns
on mobile; M2 rounded framing conflicted with the angular visual system.

## Changes

- Actual showroom grid: name/tagline, image, then summary/specs on mobile; metadata
  beside a dominant image on desktop. Summary uses existing body-size typography.
- Complete screenshots in quiet reserved frames across showroom, case-study hero,
  features and gallery. Removed gallery hover cropping. Gallery now offers numbered
  captions and full-size image links using the existing media endpoint.
- Shared build-sheet definition lists: technical labels, normal-case body values,
  wrapping long content and quieter dividers in place of dotted leaders.
- Responsive case-study title, stacked mobile metadata, editorial section headings,
  65ch prose measure, preserved authored paragraph breaks and consistent section gaps.
- Angular M2 framing and removal of repeated accent registration marks on screenshot
  frames only. Existing accent, color tokens, CMS, media ownership and motion remain.

## Verification

- Scoped ESLint passed for all eight changed TSX files.
- Production build passed, including TypeScript and route generation.
- Seed-mode production HTTP: /, /projects, all three case studies, /about,
  /experience, /contact and /owner returned 200 and exactly one h1 each.
- Case studies include uncropped-image classes and semantic specification markup;
  Memora renders its Overview h2 and both full-size gallery links resolve to images.
- Muted-text token contrast calculated at 5.73:1, 5.47:1 and 5.34:1 against primary,
  secondary and surface backgrounds respectively. Existing tokens were retained.
- Whitespace validation: git diff --check. No automated test files added.

Checks used the process-only seed fallback; .env and saved content were untouched.
The previously identified database quota failure remains outside this delivery.
Source/HTTP checks do not certify visual quality: screenshots, actual crop/layout
appearance, zoom, responsive widths, keyboard/touch and motion acceptance remain
pending because the browser surface is unavailable. No visual or performance score
is claimed. Existing repository-wide lint failures are not represented as fixed.

## Next

Review desktop/mobile screenshots when a browser is available, then proceed to M4's
simple editor workflow only with explicit “Proceed to M4”. Commit and push M3 before
handoff, preserving the unrelated package.json change.
