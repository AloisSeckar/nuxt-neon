import { describe, test, expect } from 'vitest'
import { assertAllowedQuery } from '../../src/runtime/server/utils/helpers/assertSQL'

const ERROR_MSG = 'rejected as not allowed'

const RAW_QUERY_1 = 'SELECT * FROM custom_table WHERE id = 1'
const RAW_QUERY_2 = 'SELECT * FROM custom_table WHERE id = 2'
const RAW_QUERY_3 = 'SELECT * FROM custom_table WHERE id = 3'

describe('Unit tests for `assertAllowedQuery` guard', async () => {
  test('Should reject query if nothing is allowed', () => {
    expect(() => assertAllowedQuery(RAW_QUERY_1, [])).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertAllowedQuery(RAW_QUERY_2, [])).toThrowError(new RegExp(ERROR_MSG))
  })

  test('Should allow query if NEON_ALL is allowed', () => {
    expect(assertAllowedQuery(RAW_QUERY_1, ['NEON_ALL'])).toBe(undefined)
    expect(assertAllowedQuery(RAW_QUERY_2, ['NEON_ALL'])).toBe(undefined)
    // should spot "NEON_ALL" among other values
    expect(assertAllowedQuery(RAW_QUERY_1, [RAW_QUERY_3, 'NEON_ALL'])).toBe(undefined)
    expect(assertAllowedQuery(RAW_QUERY_2, [RAW_QUERY_3, 'NEON_ALL'])).toBe(undefined)
  })

  test('Should allow explicitly allowed raw query', () => {
    expect(assertAllowedQuery(RAW_QUERY_1, [RAW_QUERY_1])).toBe(undefined)
  })

  test('Should reject not allowed raw query', () => {
    expect(() => assertAllowedQuery(RAW_QUERY_2, [RAW_QUERY_1])).toThrowError(new RegExp(ERROR_MSG))
  })

  test('Should work correctly with multiple allowed queries', () => {
    expect(assertAllowedQuery(RAW_QUERY_1, [RAW_QUERY_1, RAW_QUERY_2])).toBe(undefined)
    expect(assertAllowedQuery(RAW_QUERY_2, [RAW_QUERY_1, RAW_QUERY_2])).toBe(undefined)
    expect(() => assertAllowedQuery(RAW_QUERY_3, [RAW_QUERY_1, RAW_QUERY_2])).toThrowError(new RegExp(ERROR_MSG))
  })
})
