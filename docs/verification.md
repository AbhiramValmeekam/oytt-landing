# OYTT verification

Verified on 21 November 2026 against the production static build served locally at `http://127.0.0.1:4322` using Chrome, Node 24 and Astro 7.4.13.

| Page | Device | Performance | Accessibility | Best practices | SEO | CLS |
|---|---|---:|---:|---:|---:|---:|
| Landing | Mobile | 100 | 100 | 100 | 100 | 0 |
| Landing | Desktop | 100 | 100 | 100 | 100 | 0 |
| Support | Mobile | 100 | 100 | 100 | 100 | 0 |
| Support | Desktop | 100 | 100 | 100 | 100 | 0 |
| Privacy | Mobile | 100 | 100 | 100 | 100 | 0 |
| Privacy | Desktop | 100 | 100 | 100 | 100 | 0 |

- Production build: seven page routes plus sitemap, robots, fonts and assets.
- Unit tests: 10 passed; six timer-model tests plus release validation for the ready flag, unresolved operator fields, incomplete postal PINs and the approved omission of an officer name.
- Release configuration check: passed with operator OYTT and postal PIN 500010, Kompally. The public copy contains no bracket placeholders or holding notices.
- `/privacy`, `/terms`, `/delete-account`, `/support` and `/children` return full static content without login or JavaScript. All five documents are indexable and included in the sitemap.
- Every route, including home and 404, has the five footer destinations in the supplied order. Every visible email address links to `mailto:oytt.official@gmail.com`.
- Canonical links use the clean public URLs, including `/` for home, and each document marks its current footer destination correctly.
- Browser checks: 14 route/theme combinations, each at 360, 390, 640, 641, 650, 768, 800, 801, 1024 and 1440 pixels. No horizontal page overflow.
- Axe checks: zero WCAG-tagged violations; no JavaScript runtime errors.
- Keyboard console, all widget controls, todo completion, theme persistence, blocked localStorage, native support accordions and real 404 passed. Native FAQ interaction also works with JavaScript disabled.
- 200% text enlargement: home and all five documents passed at 360, 641 and 1440 pixels. All nine support answers were expanded for accessibility, viewport and enlarged-text checks.
- No third-party browsing requests or cookies. Only the theme preference enters localStorage.
- Visual inspection: document headings, line length, date typography, dark theme and the narrow-screen footer checked against generated screenshots. Browser inspection confirmed Plus Jakarta Sans text/headings, JetBrains Mono date labels and the `#FF5A1F` accent.
- Independent read-only review: no Critical or Important findings. Its FAQ coverage note was addressed by scanning and resizing the expanded answers. Additional output inspection caught the static-build canonical suffix; the public-route regression check failed before the correction and passed afterward.

Lighthouse HTML/JSON, accessibility results and screenshots are generated in ignored `reports/`; use the README commands to reproduce them. Mobile LCP measured 0.9 seconds and desktop LCP 0.2 seconds for the three audited routes, with CLS 0. Only the 404 intentionally carries noindex. These results describe the local build; the hosted URLs need deployment before submission to Google Play.

The Vercel routing failure was reproduced against `https://oytt-landing.vercel.app`: `/terms` and the other clean page paths returned 404 while `/terms.html` and `/privacy.html` returned their full documents. The browser audit also failed on `/support` with HTTP 404. `vercel.json` now enables the clean URL mapping explicitly, and the site's canonical/sitemap origin is the actual Vercel domain. The same browser audit can run against the deployment using `OYTT_BASE_URL`; local preview alone does not validate the hosting provider's URL rules.
