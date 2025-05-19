import { fileURLToPath } from 'node:url'
import { describe, test } from 'vitest'
import { setup, createPage, url } from '@nuxt/test-utils/e2e'

async function getInsertResult(pageName: string) {
  // render in browser
  const page = await createPage()
  await page.goto(url(`/${pageName}`), { waitUntil: 'hydration' })
  // click the "insert" button, wait for response and collect the result
  await page.click('#insert-button')
  await page.waitForResponse(response =>
    response.url().includes('/api/_neon/insert') && response.ok(),
  )
  const insertData = page.locator('#insert-result')
  const insertHTML = await insertData.innerHTML()

  return insertHTML
}

describe('nuxt-neon INSERT test suite', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/insert', import.meta.url)),
  })

  // various test cases defined in /test/fixtures/insert/pages/*.vue

  test('INSERT - single', async ({ expect }) => {
    const insertHTML = await getInsertResult('TestInsertSingle')
    expect(insertHTML).toContain('OK')
  }, 10000) // first test in suite always needs longer timeout

  test('INSERT - multiple', async ({ expect }) => {
    const insertHTML = await getInsertResult('TestInsertMultiple')
    expect(insertHTML).toContain('OK')
  })

  test('INSERT - with schema', async ({ expect }) => {
    const insertHTML = await getInsertResult('TestInsertSchema')
    expect(insertHTML).toContain('OK')
  })
})
