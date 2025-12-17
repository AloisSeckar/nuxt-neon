import { describe, test } from 'vitest'
import { createPage, url } from '@nuxt/test-utils/e2e'

async function getDeleteResult(pageName: string) {
  // render in browser
  const page = await createPage()
  await page.goto(url(`/${pageName}`), { waitUntil: 'hydration' })
  // click the "delete" button, wait for response and collect the result
  await page.click('#delete-button')
  await page.waitForResponse(response =>
    response.url().includes('/api/_neon/delete') && response.ok(),
  )
  const deleteData = page.locator('#delete-result')
  const deleteHTML = await deleteData.innerHTML()

  return deleteHTML
}

describe('nuxt-neon DELETE test suite', () => {
  // various test cases defined in /test/neon-test-app/pages/*.vue

  test('DELETE - cleanup', async ({ expect }) => {
    const deleteHTML = await getDeleteResult('TestCleanup')
    expect(deleteHTML).toContain('OK')
  }, 10000) // first test in suite always needs longer timeout

  test('DELETE - with schema and alias', async ({ expect }) => {
    const deleteHTML = await getDeleteResult('TestDeleteSchemaAlias')
    expect(deleteHTML).toContain('OK')
  }, 10000) // first test in suite always needs longer timeout
})
