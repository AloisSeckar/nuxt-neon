import { describe, test, expect } from 'vitest'
import { getDeleteSQL } from '../../src/runtime/server/utils/helpers/buildSQL'

describe('Unit tests for `getDeleteSQL` SQL builder', async () => {
  test('Should produce DELETE query from table as string', () => {
    const sql = getDeleteSQL({
      table: 'playing_with_neon',
    })
    expect(sql).toBe('DELETE FROM "playing_with_neon"')
  })

  test('Should produce DELETE query from table as object', () => {
    const sql = getDeleteSQL({
      table: { table: 'playing_with_neon' },
    })
    expect(sql).toBe('DELETE FROM "playing_with_neon"')
  })

  test('Should produce DELETE query from table as object with schema', () => {
    const sql = getDeleteSQL({
      table: { schema: 'neon2', table: 'playing_with_neon' },
    })
    expect(sql).toBe('DELETE FROM "neon2"."playing_with_neon"')
  })

  test('Should produce DELETE query from table as object with schema and alias', () => {
    const sql = getDeleteSQL({
      table: { schema: 'neon2', table: 'playing_with_neon', alias: 'p' },
    })
    expect(sql).toBe('DELETE FROM "neon2"."playing_with_neon" "p"')
  })

  test('Should produce DELETE query with single WHERE condition', () => {
    const sql = getDeleteSQL({
      table: 'playing_with_neon',
      where: { column: 'id', operator: '=', value: '1' },
    })
    expect(sql).toBe('DELETE FROM "playing_with_neon" WHERE "id" = \'1\'')
  })

  test('Should produce DELETE query with array of WHERE condition', () => {
    const sql = getDeleteSQL({
      table: 'playing_with_neon',
      where: [
        { column: 'id', operator: '=', value: '1' },
        { column: 'value', operator: '>', value: '0.5', relation: 'AND' },
      ],
    })
    expect(sql).toBe('DELETE FROM "playing_with_neon" WHERE "id" = \'1\' AND "value" > \'0.5\'')
  })

  test('Should produce DELETE query and ignore empty WHERE condition', () => {
    const sql = getDeleteSQL({
      table: 'playing_with_neon',
      where: [],
    })
    expect(sql).toBe('DELETE FROM "playing_with_neon"')
  })
})
