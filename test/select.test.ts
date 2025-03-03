import { fileURLToPath } from 'node:url'
import { describe, test, expect } from 'vitest'
import { setup, createPage, url } from '@nuxt/test-utils/e2e'

describe('nuxt-neon SELECT test suite', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/select', import.meta.url)),
  })

  // playing_with_neon p1 JOIN playing_with_neon_2 p2 ON p1.id = p2.id
  test('Simple JOIN performed correctly', async () => {
    // render in browser
    const page = await createPage()
    await page.goto(url('/'), { waitUntil: 'hydration' })

    // check test query results

    const dataDiv1 = page.locator('#data-1')
    const dataHtml1 = await dataDiv1.innerHTML()
    expect(dataHtml1).toContain('id')
    expect(dataHtml1).toContain('"name": "c4ca4238a0"')
    expect(dataHtml1).toContain('"value_bool": false')
    const idsIn1 = (dataHtml1.match(/"id"/g) || []).length
    expect(idsIn1).toBe(10)

    const dataDiv2 = page.locator('#data-2')
    const dataHtml2 = await dataDiv2.innerHTML()
    expect(dataHtml2).toContain('"id": 4')
    expect(dataHtml2).toContain('"name": "a87ff679a2"')
    expect(dataHtml2).toContain('"value": 0.60015804')
    expect(dataHtml2).toContain('"value_bool": true')
    const idsIn2 = (dataHtml2.match(/"id"/g) || []).length
    expect(idsIn2).toBe(1)

    const dataDiv3 = page.locator('#data-3')
    const dataHtml3 = await dataDiv3.innerHTML()
    expect(dataHtml3).toContain('"name": "c4ca4238a0"')
    expect(dataHtml3).toContain('"name": "a87ff679a2"')
    const idsIn3 = (dataHtml3.match(/"id"/g) || []).length
    expect(idsIn3).toBe(9)

    const dataDiv4 = page.locator('#data-4')
    const dataHtml4 = await dataDiv4.innerHTML()
    expect(dataHtml4).toContain('"name": "c4ca4238a0"')
    expect(dataHtml4).toContain('"bool_value": "Text value for true"')
    const idsIn4 = (dataHtml4.match(/"id"/g) || []).length
    expect(idsIn4).toBe(3)
  })
})
