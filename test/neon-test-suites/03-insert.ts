import { describe, test } from 'vitest'
import { getActionResult } from './neon-test-utils'

describe('nuxt-neon INSERT test suite', () => {
  // various test cases defined in /test/neon-test-app/pages/*.vue

  test('INSERT - single', async ({ expect }) => {
    const insertHTML = await getActionResult('TestInsertSingle', 'insert')
    expect(insertHTML).toContain('OK')
  }, 10000) // first test in suite always needs longer timeout

  test('INSERT - multiple', async ({ expect }) => {
    const insertHTML = await getActionResult('TestInsertMultiple', 'insert')
    expect(insertHTML).toContain('OK')
  })

  test('INSERT - with schema', async ({ expect }) => {
    const insertHTML = await getActionResult('TestInsertSchema', 'insert')
    expect(insertHTML).toContain('OK')
  })
})
