import { describe, test } from 'vitest'
import { countIds, getDataHtml } from './neon-test-utils'

describe('nuxt-neon SELECT test suite', () => {
  // various test cases defined in /test/neon-test-app/pages/*.vue

  test('SELECT - wildcard (all columns)', async ({ expect }) => {
    const dataHtml = await getDataHtml('TestSelectWildcard')
    expect(countIds(dataHtml)).toBe(10)
  })

  test('SELECT - simple JOIN', async ({ expect }) => {
    const dataHtml = await getDataHtml('TestSelectJoin')
    expect(dataHtml).toContain('id')
    expect(dataHtml).toContain('"name": "c4ca4238a0"')
    expect(dataHtml).toContain('"value_bool": false')
    expect(countIds(dataHtml)).toBe(10)
  }, 10000) // first test in suite always needs longer timeout

  test('SELECT - LEFT JOIN', async ({ expect }) => {
    const dataHtml = await getDataHtml('TestSelectLeftJoin')
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

  test('SELECT - IN and BETWEEN', async ({ expect }) => {
    const dataHtml = await getDataHtml('TestSelectInBetween')
    expect(dataHtml).toContain('"id": 3')
    expect(dataHtml).toContain('"id": 5')
    expect(dataHtml).toContain('"id": 7')
    expect(countIds(dataHtml)).toBe(3)
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

  test('SELECT - ORDER BY', async ({ expect }) => {
    const dataHtml = await getDataHtml('TestSelectOrder')

    const v1 = dataHtml.indexOf('c4ca4238a0') // id = 1
    const v2 = dataHtml.indexOf('d3d9446802') // id = 10
    const v3 = dataHtml.indexOf('e4da3b7fbb') // id = 5

    // items must be present
    expect(v1).toBeGreaterThan(-1)
    expect(v2).toBeGreaterThan(-1)
    expect(v3).toBeGreaterThan(-1)
    // and in correct order
    expect(v1).toBeGreaterThan(v2)
    expect(v1).toBeGreaterThan(v3)
    expect(v3).toBeGreaterThan(v2)
  })

  test('SELECT - GROUP BY + HAVING', async ({ expect }) => {
    const dataHtml = await getDataHtml('TestSelectGroupByHaving')
    expect(dataHtml).toContain('"value": 0.99077183')
    expect(dataHtml).toContain('"count": "1"')
    expect(countIds(dataHtml)).toBe(3)
  })

  test('SELECT - HAVING with BETWEEN', async ({ expect }) => {
    const dataHtml = await getDataHtml('TestSelectHavingBetween')
    expect(dataHtml).toContain('"name": "a87ff679a2"')
    expect(dataHtml).toContain('"name": "eccbc87e4b"')
    expect(countIds(dataHtml)).toBe(2)
  })

  test('SELECT - empty WHERE and ORDER BY', async ({ expect }) => {
    const dataHtml = await getDataHtml('TestSelectWithEmptyConditions')
    expect(dataHtml).toContain('"id": 1')
    expect(dataHtml).toContain('"id": 10')
    expect(countIds(dataHtml)).toBe(10)
  })

  test('SELECT - detect SQL injection in WHERE value', async ({ expect }) => {
    // NOTE: error in console is expected here - server-side throws error if injection attempt is detected
    const dataHtml = await getDataHtml('TestSelectInjection1')
    expect(dataHtml).toContain('rejected as potential SQL injection')
    expect(countIds(dataHtml)).toBe(0)
  })

  test('SELECT - detect SQL injection in WHERE operator', async ({ expect }) => {
    // NOTE: error in console is expected here - server-side throws error if injection attempt is detected
    const dataHtml = await getDataHtml('TestSelectInjection2')
    expect(dataHtml).toContain('rejected as potential SQL injection')
    expect(countIds(dataHtml)).toBe(0)
  })

  test('SELECT - detect pg_* table access attempt', async ({ expect }) => {
    // NOTE: error in console is expected here - server-side throws error if trying to read system table without permission
    const dataHtml = await getDataHtml('TestSelectISystemTable')
    expect(dataHtml).toContain('rejected as not allowed')
    expect(countIds(dataHtml)).toBe(0)
  })
})
