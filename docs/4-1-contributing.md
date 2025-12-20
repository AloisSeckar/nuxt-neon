# Contributing Guide

Contributions welcome! Let's make this module better together.

 Contact https://github.com/AloisSeckar for more info.

 The module is being developed using `pnpm` package manager.

 Neon DB instance is required - then you have to setup `.env` files with connection info.

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  pnpm install
  
  # Generate type stubs
  pnpm dev:prepare
  
  # Develop with the playground
  pnpm dev
  
  # Build the playground
  pnpm dev:build
  
  # Run ESLint
  pnpm lint

  # Prepare test environment
  pnpm exec playwright-core install
  
  # Run Vitest
  pnpm test
  pnpm test:watch
  ```

</details>

# Running Tests

We are using [Nuxt Spec](https://github.com/AloisSeckar/nuxt-spec) package that provides a Vitest-based layer for testing Nuxt modules and applications united under single dependency. The stack includes:

- [vitest](https://www.npmjs.com/package/vitest) **v4** as the fundamental testing framework
- [@vitest/browser](https://www.npmjs.com/package/@vitest/browser) as the experimental browser runner
- [happy-dom](https://www.npmjs.com/package/happy-dom) as the headless browser runtime
- [playwright-core](https://www.npmjs.com/package/playwright-core) as the headless browser testing framework
- [@vue/test-utils](https://www.npmjs.com/package/@vue/test-utils) for testing Vue stuff
- [@nuxt/test-utils](https://www.npmjs.com/package/@nuxt/test-utils) for testing Nuxt stuff

Tests are divided into two suites:
- Simple isolated unit tests in `test/test-unit` folder
- Advanced E2E tests in `test/test-e2e` folder

Because we generally want `unit` test to run (and fail if necessary) before `e2e` tests, the ordering is enforced via separate scripts in `package.json`:

```json [package.json]
{
  "scripts": {
    "test:unit": "vitest run test/test-unit",
    "test:e2e": "vitest run test/test-e2e",
    "test": "pnpm test:unit && pnpm test:e2e",
  }
}
```
