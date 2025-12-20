import { describe, test } from 'vitest'
import { createPage, url } from '@nuxt/test-utils/e2e'

async function getUpdateResult(pageName: string) {
  // render in browser
  const page = await createPage()
  await page.goto(url(`/${pageName}`), { waitUntil: 'hydration' })
  // click the "update" button, wait for response and collect the result
  await page.click('#update-button')
  await page.waitForResponse(response =>
    response.url().includes('/api/_neon/update') && response.ok(),
  )
  const updateData = page.locator('#update-result')
  const updateHTML = await updateData.innerHTML()

  return updateHTML
}

describe('nuxt-neon update test suite', () => {
  // various test cases defined in /test/neon-test-app/pages/*.vue

  test('UPDATE - with schema and alias', async ({ expect }) => {
    const updateHTML = await getUpdateResult('TestUpdateSchemaAlias')
    expect(updateHTML).toContain('OK')
  }, 10000) // first test in suite always needs longer timeout
})
