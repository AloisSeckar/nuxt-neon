import { describe, test } from 'vitest'
import { countIds, getDataHtml } from './neon-test-utils'

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
