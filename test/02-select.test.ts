import { fileURLToPath } from 'node:url'
import { describe, test } from 'vitest'
import { setup, createPage, url } from '@nuxt/test-utils/e2e'

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

describe('nuxt-neon SELECT test suite', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/select', import.meta.url)),
  })

  // various test cases defined in /test/fixtures/select/pages/*.vue

  test('SELECT - simple JOIN', async ({ expect }) => {
    const dataHtml = await getDataHtml('TestSelectJoin')
    expect(dataHtml).toContain('id')
    expect(dataHtml).toContain('"name": "c4ca4238a0"')
    expect(dataHtml).toContain('"value_bool": false')
    expect(countIds(dataHtml)).toBe(10)
  })

  test('SELECT - JOIN + WHERE w1 AND w2', async ({ expect }) => {
    const dataHtml = await getDataHtml('TestSelectJoinWhereAnd')
    expect(dataHtml).toContain('"id": 4')
    expect(dataHtml).toContain('"name": "a87ff679a2"')
    expect(dataHtml).toContain('"value": 0.60015804')
    expect(dataHtml).toContain('"value_bool": true')
    expect(countIds(dataHtml)).toBe(1)
  })

  test('SELECT - JOIN + WHERE w1 OR w2', async ({ expect }) => {
    const dataHtml = await getDataHtml('TestSelectJoinWhereOr')
    expect(dataHtml).toContain('"name": "c4ca4238a0"')
    expect(dataHtml).toContain('"name": "a87ff679a2"')
    expect(countIds(dataHtml)).toBe(9)
  })

  test('SELECT - JOIN three tables', async ({ expect }) => {
    const dataHtml = await getDataHtml('TestSelectJoin3')
    expect(dataHtml).toContain('"name": "c4ca4238a0"')
    expect(dataHtml).toContain('"bool_value": "Text value for true"')
    expect(countIds(dataHtml)).toBe(3)
  })

  test('SELECT - auto-escaping values in WHERE', async ({ expect }) => {
    const dataHtml = await getDataHtml('TestSelectAutoEscaping')
    expect(dataHtml).toContain('"name": "c4ca4238a0"')
    expect(dataHtml).toContain('"name": "a87ff679a2"')
    expect(countIds(dataHtml)).toBe(2)
  })

  test('SELECT - single values', async ({ expect }) => {
    const dataHtml = await getDataHtml('TestSelectSingleValues')
    expect(dataHtml).toContain('"id": 6')
    expect(dataHtml).toContain('"id": 9')
    expect(countIds(dataHtml)).toBe(5)
  })

  test('SELECT - specify DB schema', async ({ expect }) => {
    const dataHtml = await getDataHtml('TestSelectDBSchema')
    expect(dataHtml).toContain('"name": "neon2-1"')
    expect(dataHtml).toContain('"value": 0.74727505')
    expect(countIds(dataHtml)).toBe(5)
  })

  test('SELECT - JOIN tables using WHERE clauses', async ({ expect }) => {
    const dataHtml = await getDataHtml('TestSelectJoinViaWhere')
    expect(dataHtml).toContain('"name": "neon2-1"')
    expect(dataHtml).toContain('"value_int": -2')
    expect(dataHtml).toContain('"bool_value": "Text value for true"')
    expect(countIds(dataHtml)).toBe(3)
  })

  test('SELECT - single table with an alias', async ({ expect }) => {
    const dataHtml = await getDataHtml('TestSelectSingleAlias')
    expect(dataHtml).toContain('"name": "c4ca4238a0"')
    expect(dataHtml).toContain('"value": 0.9541963')
    expect(countIds(dataHtml)).toBe(10)
  })
})
