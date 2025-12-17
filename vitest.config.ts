import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadVitestConfig } from 'nuxt-spec/config'

const rootDir = resolve(fileURLToPath(new URL('.', import.meta.url)), 'test/neon-test-app')

// Used by @nuxt/test-utils/runtime/global-setup
process.env.NUXT_TEST_OPTIONS = JSON.stringify({
  // path to neon-test-app
  rootDir,
  // don't create a Playwright browser in globalSetup
  browser: false,
})

export default loadVitestConfig({
  test: {
    // run test files strictly one after another
    fileParallelism: false,

    // Keep a single worker process so the Playwright browser can be reused
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },

    // start the Nuxt app (and browser) only once
    globalSetup: ['./node_modules/@nuxt/test-utils/dist/runtime/global-setup.mjs'],

    // creates/closes Playwright browser only once
    setupFiles: ['./test/e2e.setup.ts'],
  },
})
