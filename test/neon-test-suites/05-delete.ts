import { describe, test } from 'vitest'
import { getActionResult } from './neon-test-utils'

describe('nuxt-neon DELETE test suite', () => {
  // various test cases defined in /test/neon-test-app/pages/*.vue

  test('DELETE - cleanup', async ({ expect }) => {
    const deleteHTML = await getActionResult('TestCleanup', 'delete')
    expect(deleteHTML).toContain('OK')
  }, 10000) // first test in suite always needs longer timeout

  test('DELETE - with schema and alias', async ({ expect }) => {
    const deleteHTML = await getActionResult('TestDeleteSchemaAlias', 'delete')
    expect(deleteHTML).toContain('OK')
  }, 10000) // first test in suite always needs longer timeout
})
