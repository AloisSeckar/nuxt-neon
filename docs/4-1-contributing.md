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
