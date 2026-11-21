# OYTT legal and support pages

The user's final text replaces the earlier deferred legal copy and 16+ age policy. Implement `/privacy`, `/terms`, `/delete-account`, `/support`, and `/children` in the existing Astro static website. Preserve every supplied statement, list, FAQ, effective date (21 November 2026), app name, and package (`com.oytt.logger`). Turn route references into working local links and every visible email address into a mailto link to `oytt.official@gmail.com`.

Use the existing self-hosted Plus Jakarta Sans for all document text and headings, with JetBrains Mono for date labels. Reading direction: a flat, minimal black/white document layout with small `#FF5A1F` accents, comfortable line length, ordinary numbered sections, accessible focus, and responsive spacing. Design dials: variance 3, motion 1, density 4. No gradients, glass, blur, imagery, or additional marketing copy are needed for these document pages. Keep the existing site's theme support and navigation.

Replace the shared footer on all routes (including home and 404) with the user's exact copyright line, links in the order Privacy, Terms, Support, Delete Account, Children's Privacy, and the mailto address. Pages must be directly accessible anonymously and with JavaScript disabled.

The user confirmed the operator/business name as OYTT and the postal PIN as 500010, Kompally, and explicitly requested omission of the officer's name. Use those values, keep the operator and PIN together in site configuration, and remove the officer-name line. No bracket placeholders remain in the public documents. Enable the existing legal-ready flag and all document sitemap entries. The release script must reject unresolved operator/address fields if they are introduced later.

The latest 13+ requirement, with parent/guardian consent for users under 18, supersedes the earlier 16+ project configuration. Other Android-app behavior is outside this website change. The user's source text, rather than the older site brief, is the authority for the legal and support wording.

Verification: existing console tests; static build; anonymous direct-route and JavaScript-disabled browsing; all footer destinations; all email links; mobile and desktop in both themes; axe accessibility; and representative Lighthouse audits. Keep the changes available in the existing checkout on a local feature branch for review.
