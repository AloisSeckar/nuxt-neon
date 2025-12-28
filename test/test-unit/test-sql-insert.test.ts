import { describe, test, expect } from 'vitest'
import { getInsertSQL } from '../../src/runtime/server/utils/helpers/buildSQL'

describe('Unit tests for `getInsertSQL` SQL builder', async () => {
  test('Should produce INSERT query into table as string', () => {
    const sql = getInsertSQL({
      table: 'playing_with_neon',
      values: { id: '1' },
    })
    expect(sql).toBe('INSERT INTO "playing_with_neon" ("id") VALUES (\'1\')')
  })

  test('Should produce INSERT query into table as object', () => {
    const sql = getInsertSQL({
      table: { table: 'playing_with_neon' },
      values: { id: '1' },
    })
    expect(sql).toBe('INSERT INTO "playing_with_neon" ("id") VALUES (\'1\')')
  })

  test('Should produce INSERT query into table as object with schema', () => {
    const sql = getInsertSQL({
      table: { schema: 'neon2', table: 'playing_with_neon' },
      values: { id: '1' },
    })
    expect(sql).toBe('INSERT INTO "neon2"."playing_with_neon" ("id") VALUES (\'1\')')
  })

  test('Should reject INSERT query into table as object with alias', () => {
    expect(() => getInsertSQL({
      table: { table: 'playing_with_neon', alias: 'p' },
      values: { id: '1' },
    })).toThrowError('Table alias is not allowed for INSERT statement')
  })

  test('Should produce INSERT query with multiple values', () => {
    const sql = getInsertSQL({
      table: 'playing_with_neon',
      values: { id: '1', name: 'test' },
    })
    expect(sql).toBe('INSERT INTO "playing_with_neon" ("id", "name") VALUES (\'1\', \'test\')')
  })

  test('Should produce INSERT query with multiple rows', () => {
    const sql = getInsertSQL({
      table: 'playing_with_neon',
      values: [
        { id: '1', name: 'test1' },
        { id: '2', name: 'test2' },
      ],
    })
    expect(sql).toBe('INSERT INTO "playing_with_neon" ("id", "name") VALUES (\'1\', \'test1\'), (\'2\', \'test2\')')
  })

  /*
  test('Should produce other', () => {
    const sql = getInsertSQL({
      table: 'playing_with_neon',
      values: { name: 'automatic-test', value: '123' },
    })
    expect(sql).toBe('INSERT INTO "playing_with_neon" (\'name\', \'value\') VALUES (\'automatic-test\', \'123\')')
  })
    */
})
