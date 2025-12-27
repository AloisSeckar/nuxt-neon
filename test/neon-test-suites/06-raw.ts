import { describe, test } from 'vitest'
import { createPage, url } from '@nuxt/test-utils/e2e'

async function getDataHtml(pageName: string) {
  // render in browser
  const page = await createPage()
  await page.goto(url(`/${pageName}`), { waitUntil: 'hydration' })
  // pick div with data and return the inner html
  const dataDiv = page.locator('#data')
  return await dataDiv.innerHTML()
}

function countIds(html: string) {
  return (html.match(/"id"/g) || []).length
}

describe('nuxt-neon SELECT test suite', () => {
  // various test cases defined in /test/neon-test-app/pages/*.vue

  test('SELECT - exectue allowed raw query', async ({ expect }) => {
    const dataHtml = await getDataHtml('TestRawValid')
    expect(dataHtml).toContain('"id": 5')
    expect(countIds(dataHtml)).toBe(1)
  })

  test('SELECT - detect disallowed raw query', async ({ expect }) => {
    // NOTE: error in console is expected here - server-side throws error if calling raw query that is not white-listed
    const dataHtml = await getDataHtml('TestRawInvalid')
    expect(dataHtml).toContain('rejected as not allowed')
    expect(countIds(dataHtml)).toBe(0)
  })
})
