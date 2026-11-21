# OYTT Legal and Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace OYTT's holding pages and older support copy with the user's five final public documents and shared footer.

**Architecture:** Reuse the existing Astro static routes and shared site layout. Add a document layout and stylesheet, and centralize the confirmed operator and PIN in site configuration. The user supplied OYTT and 500010 and explicitly omitted the officer's name.

**Tech Stack:** Astro 7, native CSS, self-hosted Fontsource fonts, Playwright and axe.

**Spec:** `docs/superpowers/specs/2026-11-21-oytt-legal-support-design.md` and the user's full final text.

## Global Constraints

- Exact routes: `/privacy`, `/terms`, `/delete-account`, `/support`, `/children`.
- Effective date: 21 November 2026; package: `com.oytt.logger`.
- Every visible email is a mailto link to `oytt.official@gmail.com`.
- Flat black/white, small `#FF5A1F` accents, Plus Jakarta Sans text, JetBrains Mono labels; no gradients, glass, or blur.
- Footer on every route: `© 2026 OYTT · On Your Time Too · Kompally, Hyderabad, India`; Privacy · Terms · Support · Delete Account · Children's Privacy; email.
- All content is public and statically available with JavaScript disabled.
- Confirmed operator: OYTT; postal PIN: 500010, Kompally. Omit the officer's name as explicitly requested.

## Review Focus

- Direct Google Play requests and JavaScript-disabled browsers must receive the full document and working navigation.
- Narrow screens and 200% text must preserve readable content without horizontal scrolling.
- Every email occurrence must open the same recipient, including FAQs and footers.
- Draft identity fields must prevent the release gate from reporting readiness.
- The supplied 13+/under-18 policy must supersede the older project age configuration.

### Task 1: Public documents and shared footer

**Files:** Modify `src/pages/{privacy,terms,delete-account,support,children}.astro`, `src/layouts/Layout.astro`, `src/styles/global.css`, `src/config/site.mjs`, and `scripts/audit.mjs`. Create `src/layouts/LegalLayout.astro` and `src/styles/legal.css`. Remove the unused `src/components/LegalHolding.astro`.

**Interfaces:** Consumes the existing `Layout` and `site.email`. Produces `LegalLayout({title, description, heading, effectiveDate?})`, configuration fields `site.operatorName` and `site.postalCode`, and the five static documents.

- [x] Update stale browser assertions to reject holding content and require working public documents, footer links, and email links. The baseline preview failed on the old footer order before reaching the holding-page check.
- [x] Implement the shared document layout, supplied copy, exact footer, and styling. Use native support accordions with the supplied Q/A text.
- [x] Run `npm test`, `npm run build`, and `npm run test:browser` against the built preview. Expect all existing behavior and updated document checks to pass.

### Task 2: Release readiness and final verification

**Files:** Modify `scripts/check-release.mjs`, `scripts/lighthouse.mjs`, `package.json`, `README.md`, and `docs/verification.md`. Add `src/lib/release.mjs` and `tests/release.test.mjs`.

**Interfaces:** Consumes Task 1's identity fields and static routes. Produces `releaseIssues(config): string[]`, release validation, and a record of actual checks.

- [x] Strengthen the release script to reject empty/bracket operator fields and incomplete PINs even if `site.legalReady` is enabled. Verify invalid fixtures are rejected and the confirmed configuration passes.
- [x] Apply OYTT and PIN 500010, omit the officer's name as requested, and enable the legal-ready flag after completing the documents.
- [x] Run JavaScript-disabled direct-route checks, email/footer checks, text enlargement, accessibility, and representative mobile/desktop Lighthouse audits. Expect no login redirects or layout failures.
- [x] Update the launch documentation to describe the final documents, 13+ policy, any outstanding factual input, and measured verification.
- [x] Obtain one read-only independent review, fix substantive findings, and leave the verified local changes available for the user.

## Execution record

The supplied final text authorizes implementation directly. Work proceeds in the existing clean checkout on `codex/oytt-legal-support`; no additional design approval is needed. No deployment or shared-branch mutation is requested.

Task 1 completed: seven-route static build, 10 passing unit tests and 14 clean route/theme browser checks. Task 2 includes validated OYTT/500010 configuration, independent review, expanded-FAQ checks and clean canonical URL verification. The preferred review model was unavailable through the configured provider; the review completed on the configured `gpt-6.1-sol` model using the same EchoRegent route. The generated `.html` canonical suffix was reproduced by the browser check, corrected in the shared layout, and verified after rebuilding. No required product work or factual input remains pending.
