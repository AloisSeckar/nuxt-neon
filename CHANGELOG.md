# Changelog

## v0.4.1 (2025-05-04)
- feat: improved typing for WHERE and ORDER queries
- feat: types should be properly exported
- build: bump Nuxt to `3.17.1` + update other deps

## v0.4.0 (2025-02-23)
- BREAKING CHANGE: syntax for `select`, `insert`, `update`, `delete` SQL wrappers' params changed to improve behavior and security
- feat: new `count` SQL wrapper added
- feat: warning when using unsafe `raw` SQL wrapper added
- feat: `nuxt-neon` module logo created
- feat: configuration keys prefixed with `neon`
- feat: playground app updated to recap module features better
- docs: README.md updated to reflect current changes
- docs: info about "runtime config" added
- test: testing via `nuxt-spec` added, 5 test scenarios created

## v0.3.1 (2025-02-06)
- feat: expose server-side utils (`getNeonClient` and SQL wrappers)
- docs: README.md updated to reflect current changes

## v0.3.0 (2025-02-02)
- BREAKING CHANGE: module was re-designed and direct Neon DB communication was hidden behind Nuxt server-side API routes
- feat: direct access to `neonClient` on server-side was dropped
- feat: runtime config values for Neon DB connection were properly hidden at Nuxt server-side
- feat: new `raw` SQL wrapper was added
- feat: return values from SQL wrappers were made more consistent
- docs: README.md updated to reflect current changes
- build: bump Nuxt to `3.15.4` + update other deps

## v0.2.5 (2024-12-25)
- build: bump Nuxt to `3.15.0` + update other deps
- fix: set internal logging from `info` to `debug`

## v0.2.4 (2024-12-05)
- fix: resolve `sqlstring` with `vite-plugin-commonjs`

## v0.2.3 (2024-12-05)
- fix: handle `sqlstring` CommonJS import for ESM re-use

## v0.2.2 (2024-12-05)
- fix: wrap `sqlstring` CommonJS import for ESM re-use

## v0.2.1 (2024-12-05)
- fix: handle `sqlstring` CommonJS import for ESM re-use

## v0.2.0 (2024-12-05)
- feat: `select`, `insert`, `update` and `delete` SQL wrapper
- build: tech update (2024-12-02)

## v0.1.2 (2024-09-29)
- feat: `sslMode` option added
- feat: `nuxtStatus` health check function added
- feat: `isOk` health check function added

## v0.1.1 (2024-09-28)
- fix: correctly export Neon dependency

## v0.1.0 (2024-09-28)
- basic Nuxt2Neon integration provided
