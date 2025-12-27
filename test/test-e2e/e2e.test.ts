import { fileURLToPath } from 'node:url'
import { setup } from '@nuxt/test-utils/e2e'

// only setup nuxt-test-app ONCE
await setup({
  rootDir: fileURLToPath(new URL('../neon-test-app', import.meta.url)),
  // Playwright browser is not required for now
  browser: false,
})

// import and run E2E test suites AFTER the test app is ready
await import('../neon-test-suites/01-basic')
await import('../neon-test-suites/02-select')
await import('../neon-test-suites/03-insert')
await import('../neon-test-suites/04-update')
await import('../neon-test-suites/05-delete')
await import('../neon-test-suites/06-raw')
