import { describe, test, expect } from 'vitest'
import { isNeonSuccess, isNeonError, formatNeonError } from '../src/runtime/utils/neonErrors'
import type { NeonError } from '../src/runtime/utils/neonTypes'

describe('nuxt-neon error handling features test', async () => {
  // valid data object
  const testObject = {
    data1: 'data',
    data2: 1,
  }
  // valid error object
  const testError: NeonError = {
    name: 'NuxtNeonServerError',
    source: 'TestSuite',
    code: 555,
    message: 'Bound to fail',
  }
  // invalid error objects
  const testNotError1 = {
    name: 'NuxtNeonServerError',
    source: 'TestSuite',
    // code and message missing
  }
  const testNotError2 = {
    name: 'NuxtNeonServerError',
    source: 1, // wrong data type
    code: 500,
    message: 'Bound to fail',
  }
  const testNotError3 = {
    name: 'NuxtNeonTestError', // invalid value
    source: 'TestSuite',
    code: 500,
    message: 'Bound to fail',
  }

  test('isNeonSuccess method works', () => {
    expect(isNeonSuccess(testObject)).toBe(true)
    expect(isNeonSuccess(testError)).toBe(false)
    expect(isNeonSuccess(testNotError1)).toBe(true)
    expect(isNeonSuccess(testNotError2)).toBe(true)
    expect(isNeonSuccess(testNotError3)).toBe(true)
  })

  test('isNeonError method works', () => {
    expect(isNeonError(testObject)).toBe(false)
    expect(isNeonError(testError)).toBe(true)
    expect(isNeonError(testNotError1)).toBe(false)
    expect(isNeonError(testNotError2)).toBe(false)
    expect(isNeonError(testNotError3)).toBe(false)
  })

  test('formatNeonError method works', () => {
    expect(formatNeonError(testError)).toBe('NuxtNeonServerError in TestSuite: Bound to fail (status: 555)')
  })
})
