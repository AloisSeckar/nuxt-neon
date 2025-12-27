import { describe, test } from 'vitest'
import { getActionResult } from './neon-test-utils'

describe('nuxt-neon update test suite', () => {
  // various test cases defined in /test/neon-test-app/pages/*.vue

  test('UPDATE - with schema and alias', async ({ expect }) => {
    const updateHTML = await getActionResult('TestUpdateSchemaAlias', 'update')
    expect(updateHTML).toContain('OK')
  }, 10000) // first test in suite always needs longer timeout
})
