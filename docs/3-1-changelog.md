# Changelog

Overview of the newest features in Nuxt Neon module.

## v0.8.1

`2026-01-03`

- fix: patched fatal error in working with auto-imports preventing module to start ([#73](https://github.com/AloisSeckar/nuxt-neon/issues/73))

## v0.8.0

`2026-01-02`

> [!TIP]
> **Version 8** is a major overhaul with number of breaking changes mostly focused on improved security, better TS support and codebase architecture. All those **78 commits** since last release feel like the project was completely re-written. But it was necessary and for the better, hopefully.

Please refer to the new [documentation site](https://nuxt-neon.netlify.app/) for detailed info about current API and usage. When in doubt, feel free to open issue with questions.

- BREAKING CHANGE: instance of `neon` driver is now obtained from `useNeonDriver()` composable-like instead of `getNeonClient()` function ([#56](https://github.com/AloisSeckar/nuxt-neon/issues/56))
- BREAKING CHANGE: server-side functions are now obtained from `useNeonServer()` composable-like instead of direct imports from `/server/utils/neonSQL.ts` ([#56](https://github.com/AloisSeckar/nuxt-neon/issues/56))
- BREAKING CHANGE: client-side functions are now obtained from `useNeonClient()` composable instead of `useNeon()` ([#56](https://github.com/AloisSeckar/nuxt-neon/issues/56))
- BREAKING CHANGE: client-side SQL wrappers and API endpoints are disabled by default until explicitly enabled via `neonEnableEndpoints` module option ([#51](https://github.com/AloisSeckar/nuxt-neon/issues/51))
- BREAKING CHANGE: `raw` SQL wrapper is disabled by default until explicitly enabled via `neonEnableRawEndpoint` module option ([#51](https://github.com/AloisSeckar/nuxt-neon/issues/51))
- BREAKING CHANGE: even when `raw` wrapper is allowed, raw SQL queries must be white-listed via `neonAllowedQueries` module option ([#58](https://github.com/AloisSeckar/nuxt-neon/issues/58))
- BREAKING CHANGE: in `WHERE` clauses, `condition` was renamed to `operator` and `operator` to `relation` for better clarity ([#47](https://github.com/AloisSeckar/nuxt-neon/issues/47))
- BREAKING CHANGE: `WHERE`, `GROUP BY` and `HAVING` cannot be provided with plain strings to prevent SQL injections ([#59](https://github.com/AloisSeckar/nuxt-neon/issues/59))
- BREAKING CHANGE: instance of `neon` driver was made optional in server-side functions ([#68](https://github.com/AloisSeckar/nuxt-neon/issues/68))
- BREAKING CHANGE: disallow configuring DB connection via module options (`.env` must be used)
- BREAKING CHANGE: dropped now obsolete `neonRawWarning` module option
- BREAKING CHANGE: `neonStatus` health check doesn't accept options anymore and its behavior is now based on module options (check docs for details)
- feat: tables can be (dis)allowed for querying via `neonAllowedTables` module option ([#52](https://github.com/AloisSeckar/nuxt-neon/issues/52))
- feat: `raw` SQL wrappers were made available on server-side (still must be enabled via configuration) ([#53](https://github.com/AloisSeckar/nuxt-neon/issues/53)) 
- feat: `isOk` and `neonStatus` health checks were made available on server-side ([#54](https://github.com/AloisSeckar/nuxt-neon/issues/54))
- feat: SQL sanitization was improved to prevent more SQL injections ([#8](https://github.com/AloisSeckar/nuxt-neon/issues/8))
- feat: added more runtime checks to reject SQL injection attempts ([#60](https://github.com/AloisSeckar/nuxt-neon/issues/60))
- feat: added more runtime checks to reject invalid payloads ([#63](https://github.com/AloisSeckar/nuxt-neon/issues/63))
- fix: make client-side and server-side SQL wrappers behavior more consistent ([#70](https://github.com/AloisSeckar/nuxt-neon/issues/70))
- fix: correct error handling in server-side SQL wrappers ([#69](https://github.com/AloisSeckar/nuxt-neon/issues/69))
- fix: respect `neonDB` and `public.neonDB` module option correctly ([#66](https://github.com/AloisSeckar/nuxt-neon/issues/66))
- fix: server-side `select` and `raw` can use generic type hint for return type ([#42](https://github.com/AloisSeckar/nuxt-neon/issues/42))
- fix: allow `*` in `SELECT` ([#65](https://github.com/AloisSeckar/nuxt-neon/issues/65))
- fix: treat values for `BETWEEN` operator properly ([#49](https://github.com/AloisSeckar/nuxt-neon/issues/49))
- fix: treat values for `HAVING` clause properly ([#64](https://github.com/AloisSeckar/nuxt-neon/issues/64))
- fix: sanitize `count(col)` in `SELECT` properly
- fix: ignore empty `GROUP BY` clause array
- fix: sanitize column names in `INSERT` and `UPDATE` statements properly
- fix: treat table alias in `UPDATE` statements properly
- refactor: couple of TS tweaks to support better type inference
- refactor: codebase updated to follow Nuxt v4 structure better
- docs: new Vitepress-based [documentation site](https://nuxt-neon.netlify.app/) created ([#52](https://github.com/AloisSeckar/nuxt-neon/issues/52)) and filled ([#57](https://github.com/AloisSeckar/nuxt-neon/issues/57))
- test: consolidate test apps into one for speed-up ([#48](https://github.com/AloisSeckar/nuxt-neon/issues/48))
- test: fix flakiness via correct data initialization ([#39](https://github.com/AloisSeckar/nuxt-neon/issues/39))
- test: added numerous unit tests for SQL builder functions ([#38](https://github.com/AloisSeckar/nuxt-neon/issues/38))
- build: bump `nuxt-spec` to `0.1.16`
- build: output should be minified now (roughly 20% smaller bundle size)

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
- fix: export types definition properly via neon.d.ts

## v0.6.0

`2025-05-20`

- BREAKING CHANGE: switched to options-object pattern for SQL wrappers (all wrapper calls need to be updated - encapsulate all params in an object and add respective keys)
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
- feat: re-typed SQL wrappers including supporting generics
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
