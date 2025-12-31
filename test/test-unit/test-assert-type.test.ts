import { describe, test, expect } from 'vitest'
import {
  assertNeonWhereOperator, assertNeonWhereRelation,
  assertNeonJoinType, assertNeonSortDirection,
} from '../../src/runtime/server/utils/helpers/assertSQL'
import {
  NEON_WHERE_OPERATORS, NEON_WHERE_RELATIONS,
  NEON_JOIN_TYPES, NEON_SORT_DIRECTIONS,
} from '../../src/runtime/shared/types/neon-constants'

const ERROR_MSG = 'rejected as potential SQL injection'

describe('Unit tests for `assertNeonWhereOperator` and `assertNeonWhereRelation`', async () => {
  test('Should allow valid WHERE operators', () => {
    NEON_WHERE_OPERATORS.forEach((operator) => {
      expect(assertNeonWhereOperator(operator)).toBe(undefined)
    })
  })

  test('Should reject any other invalid WHERE operator attempts', () => {
    expect(() => assertNeonWhereOperator('OTHER')).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertNeonWhereOperator('OR 1=1')).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertNeonWhereOperator('> 5 OR 1=')).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertNeonWhereOperator('; DROP DATABASE')).toThrowError(new RegExp(ERROR_MSG))
  })

  test('Should allow valid WHERE relations', () => {
    NEON_WHERE_RELATIONS.forEach((relation) => {
      expect(assertNeonWhereRelation(relation)).toBe(undefined)
    })
  })

  test('Should reject any other invalid WHERE relation attempts', () => {
    expect(() => assertNeonWhereRelation('OTHER')).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertNeonWhereRelation('OR 1=1')).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertNeonWhereRelation('> 5 OR 1=')).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertNeonWhereRelation('; DROP DATABASE')).toThrowError(new RegExp(ERROR_MSG))
  })

  test('Should allow valid JOIN types', () => {
    NEON_JOIN_TYPES.forEach((type) => {
      expect(assertNeonJoinType(type)).toBe(undefined)
    })
  })

  test('Should reject any other invalid JOIN type attempts', () => {
    expect(() => assertNeonJoinType('OTHER')).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertNeonJoinType('OR 1=1')).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertNeonJoinType('> 5 OR 1=')).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertNeonJoinType('; DROP DATABASE')).toThrowError(new RegExp(ERROR_MSG))
  })

  test('Should allow valid SORT directions', () => {
    NEON_SORT_DIRECTIONS.forEach((direction) => {
      expect(assertNeonSortDirection(direction)).toBe(undefined)
    })
  })

  test('Should reject any other invalid SORT direction attempts', () => {
    expect(() => assertNeonSortDirection('OTHER')).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertNeonSortDirection('OR 1=1')).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertNeonSortDirection('> 5 OR 1=')).toThrowError(new RegExp(ERROR_MSG))
    expect(() => assertNeonSortDirection('; DROP DATABASE')).toThrowError(new RegExp(ERROR_MSG))
  })

  test('Should allow undefined/empty values without throwing errors', () => {
    expect(assertNeonWhereOperator(undefined)).toBe(undefined)
    expect(assertNeonWhereOperator('')).toBe(undefined)
    expect(assertNeonWhereRelation(undefined)).toBe(undefined)
    expect(assertNeonWhereRelation('')).toBe(undefined)
    expect(assertNeonJoinType(undefined)).toBe(undefined)
    expect(assertNeonJoinType('')).toBe(undefined)
    expect(assertNeonSortDirection(undefined)).toBe(undefined)
    expect(assertNeonSortDirection('')).toBe(undefined)
  })
})
