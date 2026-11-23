# ARCHITECTURE.md

<!-- ↓↓↓ agentcreed ↓↓↓ -->

This file describes the project tech stack, structure and the coding conventions used. Rules for handling this file are defined in [AGENTS.md](./AGENTS.md).

<!-- ↑↑↑ agentcreed ↑↑↑ -->

## Overview

Nuxt Neon (`nuxt-neon`) is a Nuxt v4 module that connects a Nuxt app to a Neon PostgreSQL database through the Neon serverless driver. Database access runs on the Nitro server. Client code calls it through `/api/_neon/*` endpoints.

## Tech Stack

| Category         | Technology                                                  |
| ---------------- | ----------------------------------------------------------- |
| Language         | TypeScript                                                  |
| Framework        | Nuxt 4.5.1, `@nuxt/kit`, built with `@nuxt/module-builder`  |
| Database driver  | `@neondatabase/serverless` 1.1.0 (PostgreSQL)               |
| Validation       | `valibot` dependency                                        |
| Linting          | ESLint 10 with `@nuxt/eslint-config` (stylistic rules on)   |
| Testing          | Vitest via `nuxt-spec`, `vue-tsc` and `tsc` for type checks |
| Documentation    | VitePress (`docs/` workspace)                               |
| Package manager  | pnpm 12 (workspaces `.` and `docs`)                         |
| CI               | GitHub Actions (`.github/workflows/ci.yml`)                 |

## Architecture

```text
src/module.ts                     Nuxt module: options, runtime config, endpoints, auto-imports
src/runtime/
  composables/useNeonClient.ts    Client composable
  plugins/check.ts                Client Nuxt plugin
  server/api/                     /api/_neon/* handlers (status, raw, count, select, insert, update, delete)
  server/plugins/                 Nitro plugins (check, setConfig)
  server/utils/                   Server composables and helpers (driver, errors, config)
  shared/                         Types and utilities used by client and server
  types/neon.d.ts                 Type template exposed to the app
test/
  test-unit/                      Unit tests (Vitest, plain Node environment)
  test-e2e/                       End-to-end test
  neon-test-suites/               Test suites `01-basic` to `07-validation`
  neon-types/                     Type tests
  neon-test-app/                  Nuxt app used by the tests
playground/                       Nuxt app for local development
docs/                             VitePress documentation
data/                             Sample SQL datasets
```

## Key Directories

- `src/module.ts` - module entry point, compiled to `dist/`
- `src/runtime/` - code copied into the consumer app (client, server and shared parts)
- `src/runtime/server/api/` - HTTP endpoints used by the client
- `test/` - unit, e2e and type tests
- `playground/` - local development app
- `docs/` - documentation website

## Entry Points

- Module: `src/module.ts`
- Server endpoints: `src/runtime/server/api/`
- Client composable: `src/runtime/composables/useNeonClient.ts`
- Playground: `playground/`

## Conventions

- Runtime config has a private part (`useRuntimeConfig().neonDB`, etc.) and a public part (`useRuntimeConfig().public.*`). Only the public part may reach the client.
- Pure logic lives in `helpers/*.ts` files without `#imports`, so unit tests can import them. Wrapper files that need Nuxt context import from `#imports`.
- Utilities used by auto-imports are registered in `src/module.ts` with `addImports` and `addServerImports`.
- Code follows the ESLint stylistic config. `} else {` stays on one line.
- SQL endpoints check `isNeonEndpointAllowed()` first. The status endpoint is not gated.

## Quick Commands

| Action       | Command             |
| ------------ | ------------------- |
| Install      | `pnpm install`      |
| Prepare dev  | `pnpm dev:prepare`  |
| Dev          | `pnpm dev`          |
| Lint         | `pnpm lint`         |
| Unit tests   | `pnpm test:unit`    |
| E2E tests    | `pnpm test:e2e`     |
| Type tests   | `pnpm test:types`   |
| Build        | `pnpm prepack`      |
