import { describe, expect, test } from 'vitest'
import { decodeWhereType, encodeWhereType } from '../src/runtime/utils/neonUtils'

describe('`encodeWhereType` utility unit test suite', async () => {
  test('WHERE undefined', () => {
    const whereClause = encodeWhereType(undefined)
    expect(whereClause).toBe(undefined)
  })

  test('WHERE as raw string', () => {
    const whereClause = encodeWhereType('a > 20 AND a < 30 AND b >= 10 OR b <= 20')
    expect(whereClause).toBe('a GT 20 AND a LT 30 AND b GTE 10 OR b LTE 20')
  })

  test('WHERE as single clause object', () => {
    const whereClause1 = encodeWhereType({ column: 'a', condition: '>', value: '10' })
    expect(whereClause1).toEqual({ column: 'a', condition: 'GT', value: '10' })
    const whereClause2 = encodeWhereType({ column: 'a', condition: '<', value: '10' })
    expect(whereClause2).toEqual({ column: 'a', condition: 'LT', value: '10' })
    const whereClause3 = encodeWhereType({ column: 'a', condition: '>=', value: '10' })
    expect(whereClause3).toEqual({ column: 'a', condition: 'GTE', value: '10' })
    const whereClause4 = encodeWhereType({ column: 'a', condition: '<=', value: '10' })
    expect(whereClause4).toEqual({ column: 'a', condition: 'LTE', value: '10' })
  })

  test('WHERE as multiple clause object', () => {
    const whereClauses = encodeWhereType([
      { column: 'a', condition: '>', value: '10' },
      { column: 'a', condition: '<', value: '20' },
      { column: 'b', condition: '>=', value: '10' },
      { column: 'b', condition: '<=', value: '20' },
      { column: 'c', condition: '=', value: '30' }, // do not alter this
    ])
    expect(whereClauses).toEqual([
      { column: 'a', condition: 'GT', value: '10' },
      { column: 'a', condition: 'LT', value: '20' },
      { column: 'b', condition: 'GTE', value: '10' },
      { column: 'b', condition: 'LTE', value: '20' },
      { column: 'c', condition: '=', value: '30' },
    ])
  })
})

describe('`decodeWhereType` utility unit test suite', async () => {
  test('WHERE undefined', () => {
    const whereClause = decodeWhereType(undefined)
    expect(whereClause).toBe(undefined)
  })

  test('WHERE as raw string', () => {
    const whereClause = decodeWhereType('a GT 20 AND a LT 30 AND b GTE 10 OR b LTE 20')
    expect(whereClause).toBe('a > 20 AND a < 30 AND b >= 10 OR b <= 20')
  })

  test('WHERE as single clause object', () => {
    const whereClause1 = decodeWhereType({ column: 'a', condition: 'GT', value: '10' })
    expect(whereClause1).toEqual({ column: 'a', condition: '>', value: '10' })
    const whereClause2 = decodeWhereType({ column: 'a', condition: 'LT', value: '10' })
    expect(whereClause2).toEqual({ column: 'a', condition: '<', value: '10' })
    const whereClause3 = decodeWhereType({ column: 'a', condition: 'GTE', value: '10' })
    expect(whereClause3).toEqual({ column: 'a', condition: '>=', value: '10' })
    const whereClause4 = decodeWhereType({ column: 'a', condition: 'LTE', value: '10' })
    expect(whereClause4).toEqual({ column: 'a', condition: '<=', value: '10' })
  })

  test('WHERE as multiple clause object', () => {
    const whereClauses = decodeWhereType([
      { column: 'a', condition: 'GT', value: '10' },
      { column: 'a', condition: 'LT', value: '20' },
      { column: 'b', condition: 'GTE', value: '10' },
      { column: 'b', condition: 'LTE', value: '20' },
      { column: 'c', condition: '=', value: '30' }, // do not alter this
    ])
    expect(whereClauses).toEqual([
      { column: 'a', condition: '>', value: '10' },
      { column: 'a', condition: '<', value: '20' },
      { column: 'b', condition: '>=', value: '10' },
      { column: 'b', condition: '<=', value: '20' },
      { column: 'c', condition: '=', value: '30' },
    ])
  })
})
