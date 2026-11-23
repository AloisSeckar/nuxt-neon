# AgentCreed Backlog

<!-- ↓↓↓ agentcreed ↓↓↓ -->

This file is used to collect tasks for the project codebase discovered during development (e.g. refactoring, duplicated or unused code, bugs, missing tests, missing or outdated documentation, changes out of the current task scope). Findings about agent instructions belong in `SUGGESTIONS.md`.

This file holds pending tasks only, as a numbered list. Resolved items are deleted, never marked as done. When resolved items are deleted, the remaining items are renumbered.

<!-- ↑↑↑ agentcreed ↑↑↑ -->

1. `src/module.ts` hardcodes `version: '0.8.3'` in `meta`, duplicating `package.json`. Read the version from `package.json` so the two cannot drift.
2. `.github/workflows/ci.yml` runs `npm run` (lines 26, 42, 45), but `package.json` declares `packageManager: pnpm@11.20.0`. Switch CI to pnpm.
3. `useRuntimeConfig().public.neonDebugRuntime === true` is repeated about 15 times under `src/runtime/server/`. Extract a shared helper for the debug flag (DRY).
