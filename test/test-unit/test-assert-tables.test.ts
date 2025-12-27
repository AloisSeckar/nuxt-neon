import { describe, test, expect } from 'vitest'
import { assertAllowedTable } from '../../src/runtime/server/utils/helpers/assertSQL'

const ERROR_MSG = 'rejected as not allowed'

describe('Unit tests for `assertAllowedTable` guard', async () => {
  test('Should reject anything if nothing is allowed', () => {
    expect(() => assertAllowedTable('custom', [])).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertAllowedTable('pg_database', [])).toThrowError(new RegExp(ERROR_MSG))
  })

  test('Should allow anything if NEON_ALL is allowed', () => {
    expect(assertAllowedTable('custom', ['NEON_ALL'])).toBe(undefined)
    expect(assertAllowedTable('schema.custom', ['NEON_ALL'])).toBe(undefined)
    expect(assertAllowedTable('pg_database', ['NEON_ALL'])).toBe(undefined)
    expect(assertAllowedTable('schema.pg_database', ['NEON_ALL'])).toBe(undefined)
    expect(assertAllowedTable('information_schema.sql_features', ['NEON_ALL'])).toBe(undefined)
  })

  test('Should allow user table if NEON_PUBLIC is allowed', () => {
    expect(assertAllowedTable('custom', ['NEON_PUBLIC'])).toBe(undefined)
  })

  test('Should reject system table if only NEON_PUBLIC is allowed', () => {
    expect(() => assertAllowedTable('pg_database', ['NEON_PUBLIC'])).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertAllowedTable('information_schema.sql_features', ['NEON_PUBLIC'])).toThrowError(new RegExp(ERROR_MSG))
  })

  test('Should allow explicitly allowed user tables', () => {
    expect(assertAllowedTable('custom', ['custom'])).toBe(undefined)
    expect(assertAllowedTable('custom', ['NEON_ALL', 'custom'])).toBe(undefined)
    expect(assertAllowedTable('custom', ['NEON_PUBLIC', 'custom'])).toBe(undefined)
  })

  test('Should reject table with schema prefix if not set correctly', () => {
    expect(() => assertAllowedTable('schema.custom', ['custom'])).toThrowError(new RegExp(ERROR_MSG))
  })

  test('Should allow table with schema prefix if set correctly', () => {
    expect(assertAllowedTable('schema.custom', ['schema.custom'])).toBe(undefined)
  })

  test('Should allow explicitly allowed system table', () => {
    expect(assertAllowedTable('pg_database', ['pg_database'])).toBe(undefined)
    expect(assertAllowedTable('pg_database', ['NEON_PUBLIC', 'pg_database'])).toBe(undefined)
    expect(assertAllowedTable('pg_database', ['NEON_ALL', 'pg_database'])).toBe(undefined)
  })

  test('Should allow explicitly allowed system table with prefix', () => {
    expect(assertAllowedTable('schema.pg_database', ['schema.pg_database'])).toBe(undefined)
    expect(assertAllowedTable('schema.pg_database', ['NEON_PUBLIC', 'schema.pg_database'])).toBe(undefined)
    expect(assertAllowedTable('schema.pg_database', ['NEON_ALL', 'schema.pg_database'])).toBe(undefined)
    expect(assertAllowedTable('information_schema.sql_features', ['information_schema.sql_features'])).toBe(undefined)
    expect(assertAllowedTable('information_schema.sql_features', ['NEON_PUBLIC', 'information_schema.sql_features'])).toBe(undefined)
    expect(assertAllowedTable('information_schema.sql_features', ['NEON_ALL', 'information_schema.sql_features'])).toBe(undefined)
  })

  test('Should reject not allowed user tables', () => {
    expect(() => assertAllowedTable('custom1', ['custom'])).toThrowError(new RegExp(ERROR_MSG))
  })

  test('Should reject system table masked with prefix', () => {
    expect(() => assertAllowedTable('schema.pg_database', ['NEON_PUBLIC'])).toThrowError(new RegExp(ERROR_MSG))
  })
})
