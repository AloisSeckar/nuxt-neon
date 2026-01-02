# Changelog

Overview of the newest features in Nuxt Neon module.

## v0.7.1

`2025-12-14`

- feat: add more debug logging options on server-side ([#40](https://github.com/AloisSeckar/nuxt-neon/issues/40))
- feat: support `IN`, `NOT IN` and `BETWEEN` operators in WHERE clauses ([#43](https://github.com/AloisSeckar/nuxt-neon/issues/43))
- feat: support case-insensitive sort direction in ORDER BY clauses ([#46](https://github.com/AloisSeckar/nuxt-neon/issues/46))
- fix: treat empty WHERE, ORDER BY and HAVING arrays properly ([#44](https://github.com/AloisSeckar/nuxt-neon/issues/44))
- fix: encode angle brackets in client-server communication to prevent false security issues ([#45](https://github.com/AloisSeckar/nuxt-neon/issues/45))
- build: bump Nuxt to `4.2.2` + update other deps (as of `2025-12-14`)

## v0.7.0

`2025-09-20`

- BREAKING: updated to `Nuxt v4`
- BREAKING: changed column definition for WHERE and ORDER BY clauses to align with rest of the API
- feat: new `neonDebugRuntime` to avoid connection status check if not requested
- feat: it is not possible to select `JOIN` type in SELECT
- feat: it is now possible to reference other table columns in WHERE

## v0.6.2

`2025-06-04`

- fix: remove incorrect `Promise` from type definitions
- build: bump Nuxt to `3.17.5` + update other deps

## v0.6.1

`2025-06-01`

- feat: allow debugging faulty SQL queries
- fix: export types definition propely via neon.d.ts

## v0.6.0

`2025-05-20`

- BREAKING CHANGE: switched to options-object pattern for SQL wrappers (all wrapper calls needs to be updated - encapsulate all params in an object and add respective keys)
- feat: TS types for params and return types of SQL wrappers were consolidated and logically re-named
- feat: it is now possible to INSERT more than 1 row at once
- feat: allow GROUP BY and HAVING clauses in SELECT wrapper
- feat: add `NeonColumnObject` to allow columns with aliases
- feat: allow aliases in `NeonTableObject` and `NeonWhereObject`
- fix: respect schema and alias (where possible) in INSERT, UPDATE and DELETE wrappers
- fix: JOIN was made more flexible (join column clauses can be replaced with where clause with certain limitations)
- fix: don't require `alias` property if single `NeonTableObject` is passed
- fix: SQL wrappers return `NeonError` instance instead of transforming it to a string
- fix: logic for (not) displaying warning when using unsafe `raw` was corrected
- build: bump Nuxt to `3.17.4` + update other deps
- test: major re-wamping of tests to be more flexible and cover more scenarios
- refactor: several tweaks for better code readability and maintainability

## v0.5.0

`2025-05-09`

- BREAKING CHANGE: changed `insert` wrapper signature to match `update`
- BREAKING CHANGE: dropped `sslMode` and `rawWarning` config in favor of `neonSSLMode` and `neonRawWarning`
- feat: re-typed SQL wrappers including supporting genercis
- feat: allow to pick DB schema in FROM clauses
- feat: better error handling using custom `NeonError`

## v0.4.3

`2025-05-07`

- feat: auto-quote values of WHERE clauses
- feat: allow single value in COLUMN, WHERE and ORDER BY
- feat: allow server-only NUXT_NEON_DB env variable

## v0.4.2

`2025-05-05`

- fix: update Neon serverless driver calls to match its `v1.0.0`

## v0.4.1

`2025-05-04`

- feat: improved typing for WHERE and ORDER queries
- feat: types should be properly exported
- build: bump Nuxt to `3.17.1` + update other deps

## v0.4.0

`2025-02-23`

- BREAKING CHANGE: syntax for `select`, `insert`, `update`, `delete` SQL wrappers' params changed to improve behavior and security
- feat: new `count` SQL wrapper added
- feat: warning when using unsafe `raw` SQL wrapper added
- feat: `nuxt-neon` module logo created
- feat: configuration keys prefixed with `neon`
- feat: playground app updated to recap module features better
- docs: README.md updated to reflect current changes
- docs: info about "runtime config" added
- test: testing via `nuxt-spec` added, 5 test scenarios created

## v0.3.1

`2025-02-06`

- feat: expose server-side utils (`getNeonClient` and SQL wrappers)
- docs: README.md updated to reflect current changes

## v0.3.0

`2025-02-02`

- BREAKING CHANGE: module was re-designed and direct Neon DB communication was hidden behind Nuxt server-side API routes
- feat: direct access to `neonClient` on server-side was dropped
- feat: runtime config values for Neon DB connection were properly hidden at Nuxt server-side
- feat: new `raw` SQL wrapper was added
- feat: return values from SQL wrappers were made more consistent
- docs: README.md updated to reflect current changes
- build: bump Nuxt to `3.15.4` + update other deps

## v0.2.5

`2024-12-25`

- build: bump Nuxt to `3.15.0` + update other deps
- fix: set internal logging from `info` to `debug`

## v0.2.4

`2024-12-05`

- fix: resolve `sqlstring` with `vite-plugin-commonjs`

## v0.2.3

`2024-12-05`

- fix: handle `sqlstring` CommonJS import for ESM re-use

## v0.2.2

`2024-12-05`

- fix: wrap `sqlstring` CommonJS import for ESM re-use

## v0.2.1

`2024-12-05`

- fix: handle `sqlstring` CommonJS import for ESM re-use

## v0.2.0

`2024-12-05`

- feat: `select`, `insert`, `update` and `delete` SQL wrapper
- build: tech update (2024-12-02)

## v0.1.2

`2024-09-29`

- feat: `sslMode` option added
- feat: `nuxtStatus` health check function added
- feat: `isOk` health check function added

## v0.1.1

`2024-09-28`

- fix: correctly export Neon dependency

## v0.1.0

`2024-09-28`

- basic Nuxt2Neon integration provided
