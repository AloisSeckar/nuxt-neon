import { describe, test, expect } from 'vitest'
import { getSelectSQL } from '../../src/runtime/server/utils/helpers/buildSQL'

describe('Unit tests for `getSelectSQL` SQL builder', async () => {
  test('Should produce SELECT query with explicit column from string', () => {
    const sql = getSelectSQL({
      columns: 'id',
      from: 'playing_with_neon',
    })
    expect(sql).toBe('SELECT "id" FROM "playing_with_neon"')
  })

  test('Should produce SELECT query with explicit columns from array', () => {
    const sql = getSelectSQL({
      columns: ['id', 'name'],
      from: 'playing_with_neon',
    })
    expect(sql).toBe('SELECT "id", "name" FROM "playing_with_neon"')
  })

  test('Should produce SELECT query with explicit column from object', () => {
    const sql = getSelectSQL({
      columns: { name: 'id' },
      from: 'playing_with_neon',
    })
    expect(sql).toBe('SELECT "id" FROM "playing_with_neon"')
  })

  test('Should produce SELECT query with explicit columns from object array', () => {
    const sql = getSelectSQL({
      columns: [{ name: 'id' }, { name: 'name' }],
      from: 'playing_with_neon',
    })
    expect(sql).toBe('SELECT "id", "name" FROM "playing_with_neon"')
  })

  test('Should produce basic COUNT query', () => {
    const sql = getSelectSQL({
      columns: 'count(*)',
      from: 'playing_with_neon',
    })
    expect(sql).toBe('SELECT count(*) FROM "playing_with_neon"')
  })

  test('Should produce COUNT query with explicit column', () => {
    const sql = getSelectSQL({
      columns: 'count(id)',
      from: 'playing_with_neon',
    })
    expect(sql).toBe('SELECT count("id") FROM "playing_with_neon"')
  })

  test('Should produce * SELECT query', () => {
    const sql = getSelectSQL({
      columns: '*',
      from: 'playing_with_neon',
    })
    expect(sql).toBe('SELECT * FROM "playing_with_neon"')
  })

  test('Should produce SELECT from table object', () => {
    const sql = getSelectSQL({
      columns: 'id',
      from: { table: 'playing_with_neon' },
    })
    expect(sql).toBe('SELECT "id" FROM "playing_with_neon"')
  })

  test('Should produce SELECT from table object array', () => {
    const sql = getSelectSQL({
      columns: 'id',
      from: [{ table: 'playing_with_neon' }],
    })
    expect(sql).toBe('SELECT "id" FROM "playing_with_neon"')
  })

  test('Should produce SELECT from multiple tables', () => {
    const sql = getSelectSQL({
      columns: 'id',
      from: [{ table: 'playing_with_neon' }, { table: 'playing_with_neon_2' }],
    })
    expect(sql).toBe('SELECT "id" FROM "playing_with_neon", "playing_with_neon_2"')
  })

  test('Should produce SELECT from aliased table', () => {
    const sql = getSelectSQL({
      columns: 'p.id',
      from: { table: 'playing_with_neon', alias: 'p' },
    })
    expect(sql).toBe('SELECT "p"."id" FROM "playing_with_neon" "p"')
  })

  test('Should produce SELECT from aliased table with schema', () => {
    const sql = getSelectSQL({
      columns: 'p.id',
      from: { table: 'playing_with_neon', alias: 'p', schema: 'neon2' },
    })
    expect(sql).toBe('SELECT "p"."id" FROM "neon2"."playing_with_neon" "p"')
  })

  test('Should produce single WHERE clause', () => {
    const sql = getSelectSQL({
      columns: 'id',
      from: 'playing_with_neon',
      where: { column: 'id', operator: '=', value: '1', relation: 'AND' }, // relation should be ignored here
    })
    expect(sql).toBe('SELECT "id" FROM "playing_with_neon" WHERE "id" = \'1\'')
  })

  test('Should produce multiple WHERE clause', () => {
    const sql = getSelectSQL({
      columns: 'id',
      from: 'playing_with_neon',
      where: [
        { column: 'id', operator: '>', value: '1' },
        { column: 'id', operator: '<', value: '3', relation: 'AND' },
      ],
    })
    expect(sql).toBe('SELECT "id" FROM "playing_with_neon" WHERE "id" > \'1\' AND "id" < \'3\'')
  })

  test('Should replace GT(E)/LT(E) correctly', () => {
    const sql = getSelectSQL({
      columns: 'id',
      from: 'playing_with_neon',
      where: [
        { column: 'id', operator: 'GT', value: '1' },
        { column: 'id', operator: 'GTE', value: '1', relation: 'AND' },
        { column: 'id', operator: 'LT', value: '3', relation: 'AND' },
        { column: 'id', operator: 'LTE', value: '3', relation: 'AND' },
      ],
    })
    expect(sql).toBe('SELECT "id" FROM "playing_with_neon" WHERE "id" > \'1\' AND "id" >= \'1\' AND "id" < \'3\' AND "id" <= \'3\'')
  })

  test('Should treat IN operator correctly', () => {
    const sql = getSelectSQL({
      columns: 'id',
      from: 'playing_with_neon',
      where: { column: 'id', operator: 'IN', value: '1,2,3' },
    })
    expect(sql).toBe('SELECT "id" FROM "playing_with_neon" WHERE "id" IN (\'1\', \'2\', \'3\')')
  })

  test('Should treat BETWEEN operator correctly', () => {
    const sql = getSelectSQL({
      columns: 'id',
      from: 'playing_with_neon',
      where: { column: 'id', operator: 'BETWEEN', value: '1,3' },
    })
    expect(sql).toBe('SELECT "id" FROM "playing_with_neon" WHERE "id" BETWEEN \'1\' AND \'3\'')
  })

  test('Should produce aliased WHERE clause', () => {
    const sql = getSelectSQL({
      columns: { name: 'id', alias: 'p' },
      from: { table: 'playing_with_neon', alias: 'p' },
      where: { column: { name: 'id', alias: 'p' }, operator: '=', value: '1' },
    })
    expect(sql).toBe('SELECT "p"."id" FROM "playing_with_neon" "p" WHERE "p"."id" = \'1\'')
  })

  test('Should produce aliased WHERE clause comparing two tables', () => {
    const sql = getSelectSQL({
      columns: { name: 'id', alias: 'p' },
      from: [
        { table: 'playing_with_neon', alias: 'p' },
        { table: 'playing_with_neon_2', alias: 'p2' },
      ],
      where: { column: { name: 'id', alias: 'p' }, operator: '=', value: { name: 'id', alias: 'p2' } },
    })
    expect(sql).toBe('SELECT "p"."id" FROM "playing_with_neon" "p", "playing_with_neon_2" "p2" WHERE "p"."id" = "p2"."id"')
  })

  test('Should produce SELECT query with ORDER BY clause', () => {
    const sql = getSelectSQL({
      columns: 'id',
      from: 'playing_with_neon',
      order: { column: 'id' },
    })
    expect(sql).toBe('SELECT "id" FROM "playing_with_neon" ORDER BY "id" ASC') // ASC will be addeed, if nothing specified
  })

  test('Should produce SELECT query with aliased ORDER BY clause', () => {
    const sql = getSelectSQL({
      columns: { name: 'id', alias: 'p' },
      from: { table: 'playing_with_neon', alias: 'p' },
      order: { column: { name: 'id', alias: 'p' } },
    })
    expect(sql).toBe('SELECT "p"."id" FROM "playing_with_neon" "p" ORDER BY "p"."id" ASC')
  })

  test('Should produce SELECT query with multiple ORDER BY clauses', () => {
    const sql = getSelectSQL({
      columns: 'id',
      from: 'playing_with_neon',
      order: [{ column: 'id' }, { column: 'name', direction: 'DESC' }],
    })
    expect(sql).toBe('SELECT "id" FROM "playing_with_neon" ORDER BY "id" ASC, "name" DESC')
  })

  test('Should produce SELECT query with GROUP BY clause', () => {
    const sql = getSelectSQL({
      columns: 'id',
      from: 'playing_with_neon',
      group: { name: 'id' },
    })
    expect(sql).toBe('SELECT "id" FROM "playing_with_neon" GROUP BY "id"')
  })

  test('Should produce SELECT query with GROUP BY clause with count', () => {
    const sql = getSelectSQL({
      columns: ['id', 'count(id)'],
      from: 'playing_with_neon',
      group: { name: 'id' },
    })
    expect(sql).toBe('SELECT "id", count("id") FROM "playing_with_neon" GROUP BY "id"')
  })

  test('Should produce SELECT query with GROUP BY and HAVING clause', () => {
    const sql = getSelectSQL({
      columns: ['id', 'value'],
      from: 'playing_with_neon',
      group: [{ name: 'id' }, { name: 'value' }],
      having: { column: 'value', operator: '>', value: '0.5' },
    })
    expect(sql).toBe('SELECT "id", "value" FROM "playing_with_neon" GROUP BY "id", "value" HAVING "value" > \'0.5\'')
  })

  test('Should produce SELECT query with LIMIT clause', () => {
    const sql = getSelectSQL({
      columns: 'id',
      from: 'playing_with_neon',
      limit: 5,
    })
    expect(sql).toBe('SELECT "id" FROM "playing_with_neon" LIMIT 5')
  })

  test('Should ignore empty clause arrays', () => {
    const sql = getSelectSQL({
      columns: 'id',
      from: 'playing_with_neon',
      where: [],
      order: [],
      group: [],
      having: [],
    })
    expect(sql).toBe('SELECT "id" FROM "playing_with_neon"')
  })
})
