import { describe, test, expect } from 'vitest'
import { getUpdateSQL } from '../../src/runtime/server/utils/helpers/buildSQL'

describe('Unit tests for `getUpdateSQL` SQL builder', async () => {
  test('Should produce UPDATE query into table as string', () => {
    const sql = getUpdateSQL({
      table: 'playing_with_neon',
      values: { id: '1' },
    })
    expect(sql).toEqual({ query: 'UPDATE "playing_with_neon" SET "id" = $1', params: ['1'] })
  })

  test('Should produce UPDATE query into table as object', () => {
    const sql = getUpdateSQL({
      table: { table: 'playing_with_neon' },
      values: { id: '1' },
    })
    expect(sql).toEqual({ query: 'UPDATE "playing_with_neon" SET "id" = $1', params: ['1'] })
  })

  test('Should produce UPDATE query into table as object with schema', () => {
    const sql = getUpdateSQL({
      table: { schema: 'neon2', table: 'playing_with_neon' },
      values: { id: '1' },
    })
    expect(sql).toEqual({ query: 'UPDATE "neon2"."playing_with_neon" SET "id" = $1', params: ['1'] })
  })

  test('Should produce UPDATE query into table as object with alias', () => {
    const sql = getUpdateSQL({
      table: { schema: 'neon2', table: 'playing_with_neon', alias: 'p' },
      values: { id: '1' },
    })
    expect(sql).toEqual({ query: 'UPDATE "neon2"."playing_with_neon" AS "p" SET "id" = $1', params: ['1'] })
  })

  test('Should produce UPDATE query with multiple values', () => {
    const sql = getUpdateSQL({
      table: 'playing_with_neon',
      values: { id: '1', name: 'test' },
    })
    expect(sql).toEqual({ query: 'UPDATE "playing_with_neon" SET "id" = $1, "name" = $2', params: ['1', 'test'] })
  })

  test('Should produce UPDATE query with single WHERE condition', () => {
    const sql = getUpdateSQL({
      table: 'playing_with_neon',
      values: { id: '2' },
      where: { column: 'id', operator: '=', value: '1' },
    })
    expect(sql).toEqual({ query: 'UPDATE "playing_with_neon" SET "id" = $1 WHERE "id" = $2', params: ['2', '1'] })
  })

  test('Should produce UPDATE query with array of WHERE condition', () => {
    const sql = getUpdateSQL({
      table: 'playing_with_neon',
      values: { id: '2' },
      where: [
        { column: 'id', operator: '=', value: '1' },
        { column: 'value', operator: '>', value: '0.5', relation: 'AND' },
      ],
    })
    expect(sql).toEqual({ query: 'UPDATE "playing_with_neon" SET "id" = $1 WHERE "id" = $2 AND "value" > $3', params: ['2', '1', '0.5'] })
  })

  test('Should produce UPDATE query and ignore empty WHERE condition', () => {
    const sql = getUpdateSQL({
      table: 'playing_with_neon',
      values: { id: '1' },
      where: [],
    })
    expect(sql).toEqual({ query: 'UPDATE "playing_with_neon" SET "id" = $1', params: ['1'] })
  })
})
