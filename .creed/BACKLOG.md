# AgentCreed Backlog

<!-- ↓↓↓ agentcreed ↓↓↓ -->

This file is used to collect tasks for the project codebase discovered during development (e.g. refactoring, duplicated or unused code, bugs, missing tests, missing or outdated documentation, changes out of the current task scope). Findings about agent instructions belong in `SUGGESTIONS.md`.

This file holds pending tasks only, as a numbered list. Resolved items are deleted, never marked as done. When resolved items are deleted, the remaining items are renumbered.

<!-- ↑↑↑ agentcreed ↑↑↑ -->

1. `pnpm test:types:client` (root `vue-tsc --noEmit`) fails with 42 errors in `src/runtime/server/api/*.ts`. The root `tsconfig.json` excludes `src/runtime/server/**`, but the errors still appear, and the server API files import server-only names (`defineEventHandler`, `useNeonServer`, ...) from `#imports`, which the client context does not export. Exclude server files from the client check or split the client check config.
