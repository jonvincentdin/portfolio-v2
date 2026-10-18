# M2 - Scroll-controlled automotive project journey

Date: 2026-10-19. Status: implementation delivered; browser acceptance pending.
Authorized by the user's explicit “Proceed to M2”. M3 is not started.

## Evidence and scope

Before coding, Git showed only the user's unrelated package.json dev-port change
(3333 to 3001). It remains excluded from this milestone commit. Reviewed the M0/M1
handoff, showroom source, motion tokens and installed Next.js component guide.
The showroom had no document-scroll connection; its swipe threshold multiplied
with project count, and pointer cancellation could select another project.
Browser inventory exposed no apps or browser surfaces, so no live UI inspection
or screenshot claim is made.

## Delivered

- A short desktop project test track in the existing showroom template. Up to
  three project images change framing/scale/opacity with ordinary scroll; a
  light sweep and progress marker reinforce the current named checkpoint.
- Previous/next and named checkpoint buttons, a direct case-study action, and
  “Skip motion / Browse projects”. The complete manual showroom follows with
  direct links to every case study, including with JavaScript disabled.
- Desktop activation requires a fine pointer, at least 1024x850 CSS pixels and
  no reduced-motion preference. Pinning also requires measured content to fit.
  Extra travel is at most 960px. Mobile/short/reduced-motion displays use manual
  selection instead. One-project sections do not create a course.
- Passive scroll/RAF updates; native scrolling is never trapped. Resize and
  pageshow recompute progress. A focused link retains its destination. No mount
  scroll reset, wheel listener, new dependency, 3D asset or duplicate CMS format.
- Swipe threshold now uses visible viewport width, bounded to 40-120px. Cancel
  restores the current slide. Reduced motion disables drag transforms and manual
  slide transitions. Previous/next targets are at least 44px tall. Manual slide
  timing/easing use the shared motion tokens.

## Verification

- Scoped ESLint passed for ProjectJourney, ProjectShowroom and ProjectNavigation.
- `git diff --check` passed.
- Production build passed, including TypeScript and route generation.
- Seed-mode production HTTP checks: /, /projects, /about, /experience, /contact,
  /owner returned 200 and one h1 each. All three seeded case studies returned
  200. Projects HTML contains three journey panels, skip action and browse links.
- No saved CMS data, .env, schema or editor contract was changed. Checks used
  the existing process-only seed fallback because M0 identified a configured
  database quota failure. These results do not certify database-backed content.

## Remaining acceptance and next milestone

The browser environment is unavailable. Desktop/mobile screenshots, actual
keyboard/touch behavior, reduced-motion switching, zoom, back/forward restoration,
long edited metadata and measured frame rate remain unverified. No performance
score or smoothness claim is made. Inspect the prototype visually before tuning
it; particularly check scene fit, checkpoint focus and the transition to browsing.
Baseline repository-wide lint failures remain outside this scoped delivery.

Recommend M3 visual-system/content refinement after reviewing this prototype.
Stop after committing and pushing M2; wait for “Proceed to M3”.
