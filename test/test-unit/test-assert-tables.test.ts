import { describe, test, expect } from 'vitest'
import { assertAllowedTable } from '../../src/runtime/server/utils/helpers/assertSQL'

const ERROR_MSG = 'rejected as not allowed'

const T_SIMPLE = { table: 'custom' }
const T_ALIAS = { table: 'custom', alias: 'c' }
const T_SCHEMA = { table: 'custom', schema: 'schema' }
const T_SCHEMA_ALIAS = { table: 'custom', schema: 'schema', alias: 'c' }
const T_SYSTEM = { table: 'pg_database' }
const T_SYSTEM_SCHEMA = { table: 'pg_database', schema: 'schema' }
const T_INFO = { table: 'sql_features', schema: 'information_schema' }
const T_MULTIPLE = [
  { table: 'custom1' },
  { table: 'custom2' },
  { table: 'custom3' },
  { table: 'custom4' },
]

describe('Unit tests for `assertAllowedTable` guard', async () => {
  test('Should reject anything if nothing is allowed', () => {
    expect(() => assertAllowedTable('custom', [])).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertAllowedTable('pg_database', [])).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertAllowedTable(T_SIMPLE, [])).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertAllowedTable(T_ALIAS, [])).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertAllowedTable(T_SCHEMA, [])).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertAllowedTable(T_SCHEMA_ALIAS, [])).toThrowError(new RegExp(ERROR_MSG))
  })

  test('Should allow anything if NEON_ALL is allowed', () => {
    expect(assertAllowedTable('custom', ['NEON_ALL'])).toBe(undefined)
    expect(assertAllowedTable('schema.custom', ['NEON_ALL'])).toBe(undefined)
    expect(assertAllowedTable('pg_database', ['NEON_ALL'])).toBe(undefined)
    expect(assertAllowedTable('schema.pg_database', ['NEON_ALL'])).toBe(undefined)
    expect(assertAllowedTable('information_schema.sql_features', ['NEON_ALL'])).toBe(undefined)
    expect(assertAllowedTable(T_SIMPLE, ['NEON_ALL'])).toBe(undefined)
    expect(assertAllowedTable(T_ALIAS, ['NEON_ALL'])).toBe(undefined)
    expect(assertAllowedTable(T_SCHEMA, ['NEON_ALL'])).toBe(undefined)
    expect(assertAllowedTable(T_SCHEMA_ALIAS, ['NEON_ALL'])).toBe(undefined)
  })

  test('Should allow user table if NEON_PUBLIC is allowed', () => {
    expect(assertAllowedTable('custom', ['NEON_PUBLIC'])).toBe(undefined)
    expect(assertAllowedTable(T_SIMPLE, ['NEON_ALL'])).toBe(undefined)
    expect(assertAllowedTable(T_ALIAS, ['NEON_ALL'])).toBe(undefined)
    expect(assertAllowedTable(T_SCHEMA, ['NEON_ALL'])).toBe(undefined)
    expect(assertAllowedTable(T_SCHEMA_ALIAS, ['NEON_ALL'])).toBe(undefined)
  })

  test('Should reject system table if only NEON_PUBLIC is allowed', () => {
    expect(() => assertAllowedTable('pg_database', ['NEON_PUBLIC'])).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertAllowedTable('information_schema.sql_features', ['NEON_PUBLIC'])).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertAllowedTable(T_SYSTEM, ['NEON_PUBLIC'])).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertAllowedTable(T_INFO, ['NEON_PUBLIC'])).toThrowError(new RegExp(ERROR_MSG))
  })

  test('Should allow explicitly allowed user tables', () => {
    expect(assertAllowedTable('custom', ['custom'])).toBe(undefined)
    expect(assertAllowedTable('custom', ['NEON_ALL', 'custom'])).toBe(undefined)
    expect(assertAllowedTable('custom', ['NEON_PUBLIC', 'custom'])).toBe(undefined)
    expect(assertAllowedTable(T_SIMPLE, ['custom'])).toBe(undefined)
    expect(assertAllowedTable(T_ALIAS, ['custom'])).toBe(undefined)
  })

  test('Should reject table with schema prefix if not set correctly', () => {
    expect(() => assertAllowedTable('schema.custom', ['custom'])).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertAllowedTable(T_SCHEMA, ['custom'])).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertAllowedTable(T_SCHEMA_ALIAS, ['custom'])).toThrowError(new RegExp(ERROR_MSG))
  })

  test('Should allow table with schema prefix if set correctly', () => {
    expect(assertAllowedTable('schema.custom', ['schema.custom'])).toBe(undefined)
    expect(assertAllowedTable(T_SCHEMA, ['schema.custom'])).toBe(undefined)
    expect(assertAllowedTable(T_SCHEMA_ALIAS, ['schema.custom'])).toBe(undefined)
  })

  test('Should allow explicitly allowed system table', () => {
    expect(assertAllowedTable('pg_database', ['pg_database'])).toBe(undefined)
    expect(assertAllowedTable('pg_database', ['NEON_PUBLIC', 'pg_database'])).toBe(undefined)
    expect(assertAllowedTable('pg_database', ['NEON_ALL', 'pg_database'])).toBe(undefined)
    expect(assertAllowedTable(T_SYSTEM, ['pg_database'])).toBe(undefined)
  })

  test('Should allow explicitly allowed system table with schema', () => {
    expect(assertAllowedTable('schema.pg_database', ['schema.pg_database'])).toBe(undefined)
    expect(assertAllowedTable('schema.pg_database', ['NEON_PUBLIC', 'schema.pg_database'])).toBe(undefined)
    expect(assertAllowedTable('schema.pg_database', ['NEON_ALL', 'schema.pg_database'])).toBe(undefined)
    expect(assertAllowedTable(T_SYSTEM_SCHEMA, ['schema.pg_database'])).toBe(undefined)
    expect(assertAllowedTable(T_SYSTEM_SCHEMA, ['NEON_PUBLIC', 'schema.pg_database'])).toBe(undefined)
    expect(assertAllowedTable(T_SYSTEM_SCHEMA, ['NEON_ALL', 'schema.pg_database'])).toBe(undefined)
    expect(assertAllowedTable('information_schema.sql_features', ['information_schema.sql_features'])).toBe(undefined)
    expect(assertAllowedTable('information_schema.sql_features', ['NEON_PUBLIC', 'information_schema.sql_features'])).toBe(undefined)
    expect(assertAllowedTable('information_schema.sql_features', ['NEON_ALL', 'information_schema.sql_features'])).toBe(undefined)
    expect(assertAllowedTable(T_INFO, ['information_schema.sql_features'])).toBe(undefined)
    expect(assertAllowedTable(T_INFO, ['NEON_PUBLIC', 'information_schema.sql_features'])).toBe(undefined)
    expect(assertAllowedTable(T_INFO, ['NEON_ALL', 'information_schema.sql_features'])).toBe(undefined)
  })

  test('Should reject not allowed user tables', () => {
    expect(() => assertAllowedTable('custom1', ['custom'])).toThrowError(new RegExp(ERROR_MSG))
  })

  test('Should reject system table masked with prefix', () => {
    expect(() => assertAllowedTable('schema.pg_database', ['NEON_PUBLIC'])).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertAllowedTable(T_SYSTEM_SCHEMA, ['NEON_PUBLIC'])).toThrowError(new RegExp(ERROR_MSG))
  })

  test('Should allow multiple allowed tables', () => {
    expect(assertAllowedTable(T_MULTIPLE, ['NEON_ALL'])).toBe(undefined)
    expect(assertAllowedTable(T_MULTIPLE, ['NEON_PUBLIC'])).toBe(undefined)
    expect(assertAllowedTable(T_MULTIPLE, ['custom1', 'custom2', 'custom3', 'custom4'])).toBe(undefined)
  })

  test('Should reject not allowed among multiple tables', () => {
    expect(() => assertAllowedTable(T_MULTIPLE, ['custom'])).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertAllowedTable(T_MULTIPLE, ['custom1', 'custom2', 'custom3'])).toThrowError(new RegExp(ERROR_MSG))
  })
})
