import { fileURLToPath } from 'node:url'
import { describe, test } from 'vitest'
import { setup, createPage, url } from '@nuxt/test-utils/e2e'

const getPage = async (pageName: string) => {
  // render in browser
  const page = await createPage()
  await page.goto(url(`/${pageName}`), { waitUntil: 'hydration' })
  return page
}

describe('nuxt-neon SELECT test suite', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/select', import.meta.url)),
  })

  // various test queries defined in /test/fixtures/select/components/*.vue
  test('SELECT TEST 1 performed correctly', async ({ expect }) => {
    const page = await getPage('TestData1')
    const dataDiv1 = page.locator('#data-1')
    const dataHtml1 = await dataDiv1.innerHTML()
    expect(dataHtml1).toContain('id')
    expect(dataHtml1).toContain('"name": "c4ca4238a0"')
    expect(dataHtml1).toContain('"value_bool": false')
    const idsIn1 = (dataHtml1.match(/"id"/g) || []).length
    expect(idsIn1).toBe(10)
  })

  test('SELECT TEST 2 performed correctly', async ({ expect }) => {
    const page = await getPage('TestData2')
    const dataDiv2 = page.locator('#data-2')
    const dataHtml2 = await dataDiv2.innerHTML()
    expect(dataHtml2).toContain('"id": 4')
    expect(dataHtml2).toContain('"name": "a87ff679a2"')
    expect(dataHtml2).toContain('"value": 0.60015804')
    expect(dataHtml2).toContain('"value_bool": true')
    const idsIn2 = (dataHtml2.match(/"id"/g) || []).length
    expect(idsIn2).toBe(1)
  })

  test('SELECT TEST 3 performed correctly', async ({ expect }) => {
    const page = await getPage('TestData3')
    const dataDiv3 = page.locator('#data-3')
    const dataHtml3 = await dataDiv3.innerHTML()
    expect(dataHtml3).toContain('"name": "c4ca4238a0"')
    expect(dataHtml3).toContain('"name": "a87ff679a2"')
    const idsIn3 = (dataHtml3.match(/"id"/g) || []).length
    expect(idsIn3).toBe(9)
  })

  test('SELECT TEST 4 performed correctly', async ({ expect }) => {
    const page = await getPage('TestData4')
    const dataDiv4 = page.locator('#data-4')
    const dataHtml4 = await dataDiv4.innerHTML()
    expect(dataHtml4).toContain('"name": "c4ca4238a0"')
    expect(dataHtml4).toContain('"bool_value": "Text value for true"')
    const idsIn4 = (dataHtml4.match(/"id"/g) || []).length
    expect(idsIn4).toBe(3)
  })

  test('SELECT TEST 5 performed correctly', async ({ expect }) => {
    const page = await getPage('TestData5')
    const dataDiv5 = page.locator('#data-5')
    const dataHtml5 = await dataDiv5.innerHTML()
    expect(dataHtml5).toContain('"name": "c4ca4238a0"')
    expect(dataHtml5).toContain('"name": "a87ff679a2"')
    const idsIn5 = (dataHtml5.match(/"id"/g) || []).length
    expect(idsIn5).toBe(2)
  })

  test('SELECT TEST 6 performed correctly', async ({ expect }) => {
    const page = await getPage('TestData6')
    const dataDiv6 = page.locator('#data-6')
    const dataHtml6 = await dataDiv6.innerHTML()
    expect(dataHtml6).toContain('"id": 6')
    expect(dataHtml6).toContain('"id": 9')
    const idsIn6 = (dataHtml6.match(/"id"/g) || []).length
    expect(idsIn6).toBe(5)
  })

  test('SELECT TEST 7 performed correctly', async ({ expect }) => {
    const page = await getPage('TestData7')
    const dataDiv7 = page.locator('#data-7')
    const dataHtml7 = await dataDiv7.innerHTML()
    expect(dataHtml7).toContain('"name": "neon2-1"')
    expect(dataHtml7).toContain('"value": 0.74727505')
    const idsIn7 = (dataHtml7.match(/"id"/g) || []).length
    expect(idsIn7).toBe(5)
  })

  test('SELECT TEST 8 performed correctly', async ({ expect }) => {
    const page = await getPage('TestData8')
    const dataDiv8 = page.locator('#data-8')
    const dataHtml8 = await dataDiv8.innerHTML()
    expect(dataHtml8).toContain('"name": "neon2-1"')
    expect(dataHtml8).toContain('"value_int": -2')
    expect(dataHtml8).toContain('"bool_value": "Text value for true"')
    const idsIn8 = (dataHtml8.match(/"id"/g) || []).length
    expect(idsIn8).toBe(3)
  })

  test('SELECT TEST 9 performed correctly', async ({ expect }) => {
    const page = await getPage('TestData9')
    const dataDiv9 = page.locator('#data-9')
    const dataHtml9 = await dataDiv9.innerHTML()
    expect(dataHtml9).toContain('"name": "c4ca4238a0"')
    expect(dataHtml9).toContain('"value": 0.9541963')
    const idsIn9 = (dataHtml9.match(/"id"/g) || []).length
    expect(idsIn9).toBe(10)
  })
})
