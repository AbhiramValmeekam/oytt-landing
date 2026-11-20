# OYTT website

## Before publishing

- [ ] Write and review `/privacy`, `/terms`, `/delete-account` and `/children`. **Legal copy was deferred at your request.** These routes are holding pages with `noindex` and are excluded from the sitemap. They are not ready to submit to Google Play.
- [ ] Add `[FILL]` legal owner/business name and city/country.
- [ ] Confirm `[FILL]` Google's actual encrypted backup-retention window; do not assume 60 days.
- [ ] Choose `[DECIDE]` governing law and court jurisdiction.
- [ ] Implement and verify the chosen **16+ with country-specific consent requirements** policy in the app and Play Console. This age choice alone does not resolve all country-specific obligations.
- [ ] Verify the in-app deletion flow, email request process, immediate cloud deletion and 30-day request completion described in the master brief.
- [ ] Replace or approve the **provisional orange folded mark**. The original OYTT logo was not provided. Regenerate the favicons and OG image after replacing `public/favicon.svg`.
- [ ] Confirm the Google Play listing is published and the app claims match the release.
- [ ] Choose `[DECIDE]` a custom domain, if wanted. The configured default is `https://oytt-8435e.web.app`.
- [ ] Set `legalReady: true` in `src/config/site.mjs` only after completing and reviewing all legal routes, and remove their holding-page `noindex` metadata. This flag enables their sitemap entries; it does not write policies.

## Run locally

Node.js 22.12+ (tested with Node 24) and npm are required.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4321`. All content is statically generated. There is no backend, database, tracking, analytics, contact form or cookie. Fonts and Google's official, unmodified Play badge are served locally. The site sends no third-party network requests during browsing. Your selected theme is stored as `oytt-theme` in localStorage. Demo times and to-dos stay in memory and reset on reload.

## Build and check

```sh
npm run test
npm run build
npm run preview
```

With the built preview running in a second terminal:

```sh
npm run test:browser
npm run audit:lighthouse
```

Browser checks cover all routes in light and dark, ten widths from 360 to 1440 including breakpoint boundaries, axe accessibility, keyboard controls, timer task switching, widgets, todos, theme persistence, blocked storage, no cookies, no external requests, support accordions, real 404 handling and 200% text enlargement. Lighthouse audits the landing and support pages on mobile and desktop and exits unsuccessfully if any category scores below 95. Legal holding pages and the 404 intentionally carry `noindex`; they are excluded from SEO scoring. Reports and screenshots are written to ignored `reports/`.

Measured landing and support scores: **100 performance / 100 accessibility / 100 best practices / 100 SEO**, on both mobile and desktop, with CLS 0. See [verification notes](docs/verification.md).

Scripts use an installed Chrome/Edge on Windows, or Chrome/Chromium on Linux. Set `OYTT_CHROME_PATH` to override the browser path. If no browser is installed, run `npx playwright install chromium` for browser tests. Lighthouse needs Chrome. Set `OYTT_BASE_URL` to override the preview URL.

## Assets

The console, widgets, receipt and folded logo are built from HTML/CSS/SVG. No image-generation service is used. The OG image is a screenshot of the actual console on white, 1200×630. Favicon PNGs are generated from the SVG with Sharp.

```sh
# Start the built preview first.
npm run assets
npm run build
```

Google Play badge source: https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png. Preserve it unchanged, including its clear space. Roboto, Plus Jakarta Sans, JetBrains Mono and Courier Prime are self-hosted via Fontsource under their included open-font licences. Interface icons are Tabler Icons (MIT).

## Firebase Hosting

Configuration is included for existing project `oytt-8435e`; `dist` is the hosting directory. No SPA catch-all rewrite is used: real static routes and a custom 404 are preserved. Hashed Astro assets have immutable cache headers.

```sh
npm install -g firebase-tools
firebase login
# Only if you need to recreate the provided configuration:
firebase init hosting
# Select existing project oytt-8435e, public directory dist.
# Answer No to single-page app and do not overwrite the built index.
npm run check:release
npm run build
firebase deploy --only hosting --project oytt-8435e
```

`check:release` currently fails intentionally because the legal pages are deferred. No deployment has been performed. Inspect the existing Firebase site before publishing: the command replaces its currently hosted site.

For a custom domain, update `site.origin`, `astro.config.mjs`, `public/robots.txt` and `public/site.webmanifest`, configure Firebase's domain, and rebuild.

## Google Play Console URLs after launch

| Field | Value |
|---|---|
| Privacy policy | https://oytt-8435e.web.app/privacy |
| Account deletion | https://oytt-8435e.web.app/delete-account |
| Website | https://oytt-8435e.web.app/ |
| Support email | oytt.official@gmail.com |

The two legal URLs above become suitable only after their full pages are written and reviewed.

## Source map

- `src/pages/`: seven routes plus the sitemap.
- `src/components/`: console, widgets, receipt, badge, icons, legal holding page.
- `src/layouts/Layout.astro`: shared header/footer, SEO and theme handling.
- `src/lib/console.mjs`: timestamp-based timer model; only one active task.
- `src/scripts/demo.js`: keyboard and button interactions, live widget state.
- `src/styles/`: exact brand tokens, responsive layouts, focus and print styles.
- `scripts/`: browser checks, asset generation, Lighthouse and release checklist.
- `docs/superpowers/`: design and implementation plan.

All sample receipt durations, coin balances and to-dos are labelled as examples. Coming-soon features carry no release dates. App sign-in, rewards, sync and receipt sharing are descriptions of the Android app, not website services.
