import { fileURLToPath } from 'node:url'
import { describe, test } from 'vitest'
import { setup, createPage, url } from '@nuxt/test-utils/e2e'

describe('nuxt-neon DELETE test suite', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/delete', import.meta.url)),
  })

  // SO FAR, this only servers as a cleanup test
  // to remove all newly inserted/updated records from the test table

  test('DELETE - cleanup', async ({ expect }) => {
    const page = await createPage()
    await page.goto(url(`/`), { waitUntil: 'hydration' })
    await page.click('#delete-button')
    await page.waitForResponse(response =>
      response.url().includes('/api/_neon/delete') && response.ok(),
    )
    const deleteData = page.locator('#delete-result')
    const deleteHTML = await deleteData.innerHTML()
    expect(deleteHTML).toContain('OK')
  }, 10000) // first test in suite always needs longer timeout
})
