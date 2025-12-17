import { afterAll, beforeAll } from 'vitest'
import { createBrowser, recoverContextFromEnv, useTestContext } from '@nuxt/test-utils/e2e'

beforeAll(async () => {
  // The Nuxt server/build context is exposed by the Vitest globalSetup.
  recoverContextFromEnv()

  // Create a single Playwright browser for the whole suite (singleFork).
  // Tests call `createPage()` which will reuse this browser.
  const ctx = useTestContext()
  if (!ctx.browser) {
    await createBrowser()
  }
})

afterAll(async () => {
  const ctx = useTestContext()
  const browser = ctx.browser as unknown as { close?: () => Promise<void> } | undefined
  if (browser?.close) {
    await browser.close()
  }
})
