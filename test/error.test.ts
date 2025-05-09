import { describe, test, expect } from 'vitest'
import { isNeonSuccess, isNeonError, formatNeonError } from '../src/runtime/utils/neonErrors'

describe('nuxt-neon error handling features test', async () => {
  // valid data object
  const testObject = {
    data1: 'data',
    data2: 1,
  }
  // valid error object
  const testError: NeonError = {
    source: 'TestSuite',
    message: 'Bound to fail',
  }
  // invalid error objects
  const testNotError1 = {
    source: 'TestSuite',
    // message missing
  }
  const testNotError2 = {
    source: 1, // wrong data type
    message: 'Bound to fail',
  }

  test('isNeonSuccess method works', () => {
    expect(isNeonSuccess(testObject)).toBe(true)
    expect(isNeonSuccess(testError)).toBe(false)
    expect(isNeonSuccess(testNotError1)).toBe(true)
    expect(isNeonSuccess(testNotError2)).toBe(true)
  })

  test('isNeonError method works', () => {
    expect(isNeonError(testObject)).toBe(false)
    expect(isNeonError(testError)).toBe(true)
    expect(isNeonError(testNotError1)).toBe(false)
    expect(isNeonError(testNotError2)).toBe(false)
  })

  test('formatNeonError method works', () => {
    expect(formatNeonError(testError)).toBe('Error in TestSuite: Bound to fail')
  })
})
