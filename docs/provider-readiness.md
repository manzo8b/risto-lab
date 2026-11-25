# RISTO-LAB — Provider readiness and release discipline
GitHub is the canonical source, not the permanent hosting decision. Current deployment is static Astro + standalone HTML/JS, GitHub Pages at /risto-lab. Preserve the approved UI and beta safety boundaries.
## Current portable contracts
- Recipe archive, supplier links, cost run, human review report, quality history: versioned JSON. No provider-specific identifiers required by the new quality history core.
- Quality history core is pure; storage adapter implements read/write/clear. Browser localStorage is explicitly opt-in, origin-bound, not a secure multi-user database. Export/import before migration.
- Build: Node 24, npm ci, npm run check, npm test, npm run build, npm run test:e2e. Publish dist only after release gates.
## Known migration blockers (not yet solved)
- astro.config.mjs, scripts/generate-seo.mjs, scripts/audit-static.mjs, scripts/serve-static.mjs and Playwright routes assume /risto-lab and/or GitHub origin. Inventory hardcoded routes, canonical URLs, robots and public HTML before changing base. Do not claim root-domain support until built and tested.
- Matrix document import uses external CDN libraries; pin and review availability, CSP and licensing before production.
- Browser storage is origin-bound; no automatic cross-device migration. Future authenticated backend needs tenant isolation, authorization, encrypted transport, retention, backup/restore, data protection review and audit trail. Never commit real restaurant data or secrets.
## Release gate
Require green typecheck, unit, build, browser/accessibility and Matrix release gate; synthetic fixtures only in CI. Private dataset regression locally. Preserve stable schemas or provide tested migrations. Document known limitations. No merge on failing gates; no provider purchase or deployment without explicit decision. GitHub branch protections are not asserted to be configured.
## Future migration sequence
1. Inventory routes and extract site/base configuration; test current prefix and root-domain build.
2. Generate reproducible dist artifact and verify links, canonical URLs, sitemap, MIME and no private payload.
3. Test static staging on chosen provider; backup/restore browser archives.
4. Introduce backend only when requirements justify it; separate identity/storage from domain logic.
5. Verify rollback and DNS/TLS before switching production.

## Release artifact and migration inventory
After the normal build and QA, run `npm run release:manifest` to create `.local/release-manifest.json` (outside the public artifact). It records the Git commit and sorted relative paths, byte sizes and SHA-256 for every regular file in `dist`. Run `npm run release:verify` against the same artifact before transfer or rollback; it detects changed, missing and extra files, but does not sign the artifact or certify its safety. `npm run audit:portability` produces a non-blocking inventory of GitHub origin, base-path and common CDN references in tracked source files. It is not exhaustive and does not prove root-domain compatibility. CI tests the manifest and generates/verifies it after the build. Local professional exports are excluded from Git by default and blocked by the publication gate if explicitly added.
