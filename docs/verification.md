# OYTT verification

Verified against the production static build served at `http://127.0.0.1:4321` using Chrome, Node 24 and Astro 7.4.13.

| Page | Device | Performance | Accessibility | Best practices | SEO | CLS |
|---|---|---:|---:|---:|---:|---:|
| Landing | Mobile | 100 | 100 | 100 | 100 | 0 |
| Landing | Desktop | 100 | 100 | 100 | 100 | 0 |
| Support | Mobile | 100 | 100 | 100 | 100 | 0 |
| Support | Desktop | 100 | 100 | 100 | 100 | 0 |

- Production build: seven page routes plus sitemap, robots, fonts and assets.
- Unit tests: 6 passed; timestamp accuracy, pause/resume, one active task, retained task time, reset/log isolation, dial wrapping, format boundaries.
- Browser checks: 14 route/theme combinations, each at 360, 390, 640, 641, 650, 768, 800, 801, 1024 and 1440 pixels. No horizontal page overflow.
- Axe checks: zero WCAG-tagged violations; no JavaScript runtime errors.
- Keyboard console, all widget controls, todo completion, theme persistence, blocked localStorage, native support accordions and real 404 passed.
- 200% text enlargement: passed at 360, 641 and 1440 pixels. Reviewer independently confirmed no remaining clipping at 360 and 641.
- No third-party browsing requests or cookies. Only the theme preference enters localStorage.
- Production dependency audit: zero reported vulnerabilities.
- Independent read-only review: no Critical issues; responsive Important issue fixed and independently verified. A minor enlarged-text row alignment issue remains at 641px, with content inside the viewport and operable.

Lighthouse HTML/JSON and screenshots are generated in ignored `reports/`; use the README commands to reproduce them. Four deferred legal holding pages and the 404 are intentionally noindex and are excluded from SEO scoring. No deployment was performed.
