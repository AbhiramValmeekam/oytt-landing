# OYTT website

## Before publishing

- [x] Implement `/privacy`, `/terms`, `/delete-account`, `/support` and `/children` using the user's final text dated 21 November 2026. All five are public static pages, indexable, and included in the sitemap.
- [x] Use the user-confirmed operator name **OYTT** and address **Kompally, Hyderabad, Telangana 500010, India**. The officer's name is omitted at the user's request. No public text contains bracket placeholders.
- [x] Include all five destinations and the supplied copyright/address line in every page's footer; make every email address a mailto link.
- [ ] Verify the **13+** requirement and parent/guardian consent for users under 18 in the Android app and Play Console.
- [ ] Confirm the app and service match the supplied privacy, permissions, storage, backup retention and 30-day deletion statements. The website describes the email deletion process; it does not implement Android or Firebase deletion.
- [ ] Replace or approve the **provisional orange folded mark**. The original OYTT logo was not provided. Regenerate the favicons and OG image after replacing `public/favicon.svg`.
- [ ] Confirm the Google Play listing is published and the app claims match the release.
- [ ] Choose a custom domain, if wanted. The configured site is `https://oytt-landing.vercel.app`.
- [x] Set `legalReady: true` in `src/config/site.mjs` after completing the documents. The release check also rejects unresolved operator names and invalid postal PINs.

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

Unit tests cover the timer model and release validation, including unresolved contact fields and the approved omission of an officer name. Browser checks cover all routes in light and dark, ten widths from 360 to 1440 including breakpoint boundaries, axe accessibility, direct access to all five documents with JavaScript disabled, footer destinations, every email link, keyboard controls, timer task switching, widgets, todos, theme persistence, blocked storage, no cookies, no external requests, support accordions, real 404 handling and 200% text enlargement. Lighthouse audits the landing, support and privacy pages on mobile and desktop and exits unsuccessfully if any category scores below 95. Set `OYTT_AUDIT_ROUTE=/delete-account` to audit another page. Only the 404 intentionally carries `noindex`. Reports and screenshots are written to ignored `reports/`.

See [verification notes](docs/verification.md) for the measured scores and results for the current documents.

Scripts use an installed Chrome/Edge on Windows, or Chrome/Chromium on Linux. Set `OYTT_CHROME_PATH` to override the browser path. If no browser is installed, run `npx playwright install chromium` for browser tests. Lighthouse needs Chrome. Set `OYTT_BASE_URL` to override the preview URL.

## Assets

The console, widgets, receipt and folded logo are built from HTML/CSS/SVG. No image-generation service is used. The OG image is a screenshot of the actual console on white, 1200×630. Favicon PNGs are generated from the SVG with Sharp.

```sh
# Start the built preview first.
npm run assets
npm run build
```

Google Play badge source: https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png. Preserve it unchanged, including its clear space. Roboto, Plus Jakarta Sans, JetBrains Mono and Courier Prime are self-hosted via Fontsource under their included open-font licences. Interface icons are Tabler Icons (MIT).

## Vercel Hosting

The production site is `https://oytt-landing.vercel.app`, with automatic deployments from `main`. Use the Astro build command `npm run build` and output directory `dist`.

Astro emits `privacy.html`, `terms.html` and the other page files. `vercel.json` enables clean URLs so `/privacy`, `/terms`, `/delete-account`, `/support` and `/children` resolve to those files, matching the local preview. Unknown paths still return the custom 404 page. Canonicals and the sitemap use the Vercel domain.

After deployment, verify the actual host as well as the local build:

```powershell
$env:OYTT_BASE_URL = 'https://oytt-landing.vercel.app'
npm run test:browser
```

## Firebase Hosting (optional)

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

`check:release` validates the legal-ready flag, operator name and six-digit PIN; it does not replace the build, browser checks or app verification items above. Inspect the existing Firebase site before publishing: the command replaces its currently hosted site.

For another host or a custom domain, update `site.origin`, `astro.config.mjs` and `public/robots.txt`, configure the hosting provider's domain, and rebuild.

## Google Play Console URLs after launch

| Field | Value |
|---|---|
| Privacy policy | https://oytt-landing.vercel.app/privacy |
| Terms of service | https://oytt-landing.vercel.app/terms |
| Account deletion | https://oytt-landing.vercel.app/delete-account |
| Support | https://oytt-landing.vercel.app/support |
| Children's privacy | https://oytt-landing.vercel.app/children |
| Website | https://oytt-landing.vercel.app/ |
| Support email | oytt.official@gmail.com |

Verify the five hosted documents after a successful Vercel deployment before submitting their URLs to Google Play.

## Source map

- `src/pages/`: seven routes plus the sitemap.
- `src/components/`: console, widgets, receipt, badge and icons.
- `src/layouts/`: shared header/footer, SEO, theme handling and document layout.
- `src/lib/`: timestamp-based timer model and release configuration validation.
- `src/scripts/demo.js`: keyboard and button interactions, live widget state.
- `src/styles/`: exact brand tokens, responsive layouts, focus and print styles.
- `scripts/`: browser checks, asset generation, Lighthouse and release checklist.
- `docs/superpowers/`: design and implementation plan.

All sample receipt durations, coin balances and to-dos are labelled as examples. Coming-soon features carry no release dates. App sign-in, rewards, sync and receipt sharing are descriptions of the Android app, not website services.
