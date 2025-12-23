import { describe, expect, test } from 'vitest'
import { decodeWhereType, encodeWhereType } from '../../src/runtime/utils/neonUtils'

describe('`encodeWhereType` utility unit test suite', async () => {
  test('WHERE undefined', () => {
    const whereClause = encodeWhereType(undefined)
    expect(whereClause).toBe(undefined)
  })

  test('WHERE as single clause object', () => {
    const whereClause1 = encodeWhereType({ column: 'a', operator: '>', value: '10' })
    expect(whereClause1).toEqual({ column: 'a', operator: 'GT', value: '10' })
    const whereClause2 = encodeWhereType({ column: 'a', operator: '<', value: '10' })
    expect(whereClause2).toEqual({ column: 'a', operator: 'LT', value: '10' })
    const whereClause3 = encodeWhereType({ column: 'a', operator: '>=', value: '10' })
    expect(whereClause3).toEqual({ column: 'a', operator: 'GTE', value: '10' })
    const whereClause4 = encodeWhereType({ column: 'a', operator: '<=', value: '10' })
    expect(whereClause4).toEqual({ column: 'a', operator: 'LTE', value: '10' })
  })

  test('WHERE as multiple clause object', () => {
    const whereClauses = encodeWhereType([
      { column: 'a', operator: '>', value: '10' },
      { column: 'a', operator: '<', value: '20' },
      { column: 'b', operator: '>=', value: '10' },
      { column: 'b', operator: '<=', value: '20' },
      { column: 'c', operator: '=', value: '30' }, // do not alter this
    ])
    expect(whereClauses).toEqual([
      { column: 'a', operator: 'GT', value: '10' },
      { column: 'a', operator: 'LT', value: '20' },
      { column: 'b', operator: 'GTE', value: '10' },
      { column: 'b', operator: 'LTE', value: '20' },
      { column: 'c', operator: '=', value: '30' },
    ])
  })
})

describe('`decodeWhereType` utility unit test suite', async () => {
  test('WHERE undefined', () => {
    const whereClause = decodeWhereType(undefined)
    expect(whereClause).toBe(undefined)
  })

  test('WHERE as single clause object', () => {
    const whereClause1 = decodeWhereType({ column: 'a', operator: 'GT', value: '10' })
    expect(whereClause1).toEqual({ column: 'a', operator: '>', value: '10' })
    const whereClause2 = decodeWhereType({ column: 'a', operator: 'LT', value: '10' })
    expect(whereClause2).toEqual({ column: 'a', operator: '<', value: '10' })
    const whereClause3 = decodeWhereType({ column: 'a', operator: 'GTE', value: '10' })
    expect(whereClause3).toEqual({ column: 'a', operator: '>=', value: '10' })
    const whereClause4 = decodeWhereType({ column: 'a', operator: 'LTE', value: '10' })
    expect(whereClause4).toEqual({ column: 'a', operator: '<=', value: '10' })
  })

  test('WHERE as multiple clause object', () => {
    const whereClauses = decodeWhereType([
      { column: 'a', operator: 'GT', value: '10' },
      { column: 'a', operator: 'LT', value: '20' },
      { column: 'b', operator: 'GTE', value: '10' },
      { column: 'b', operator: 'LTE', value: '20' },
      { column: 'c', operator: '=', value: '30' }, // do not alter this
    ])
    expect(whereClauses).toEqual([
      { column: 'a', operator: '>', value: '10' },
      { column: 'a', operator: '<', value: '20' },
      { column: 'b', operator: '>=', value: '10' },
      { column: 'b', operator: '<=', value: '20' },
      { column: 'c', operator: '=', value: '30' },
    ])
  })
})
