import type { NeonQueryFunction } from '@neondatabase/serverless'
import type { NeonTableQuery, NeonWhereQuery, NeonOrderQuery } from '../../utils/neonTypes'
import { sanitizeSQLArray, sanitizeSQLString } from './sanitizeSQL'

// separate wrapper instead of forcing users to pass 'count(*)' as column name
export async function count(neon: NeonQueryFunction<boolean, boolean>, from: string | NeonTableQuery[], where?: string | NeonWhereQuery[]) {
  return await select(neon, ['count(*)'], from, where, undefined, undefined)
}

export async function select(neon: NeonQueryFunction<boolean, boolean>, columns: string[], from: string | NeonTableQuery[], where?: string | NeonWhereQuery[], order?: string | NeonOrderQuery[], limit?: number) {
  let sqlString = 'SELECT '
  sqlString += columns.join(', ')

  sqlString += getTableClause(from)

  sqlString += getWhereClause(where)

  sqlString += getOrderClause(order)

  if (limit) {
    sqlString += ` LIMIT ${limit}`
  }

  console.debug(sqlString)

  return await neon.query(sqlString)
}

export async function insert(neon: NeonQueryFunction<boolean, boolean>, table: string, values: string[], columns?: string[]) {
  let sqlString = `INSERT INTO ${table}`

  if (columns) {
    sqlString += ' ('
    sqlString += columns.join(', ')
    sqlString += ') '
  }

  sqlString += ' VALUES ('
  sqlString += sanitizeSQLArray(values).join(', ')
  sqlString += ')'

  console.debug(sqlString)

  return await neon.query(sqlString)
}

export async function update(neon: NeonQueryFunction<boolean, boolean>, table: string, values: Record<string, string>, where?: string | NeonWhereQuery[]) {
  let sqlString = `UPDATE ${table}`

  sqlString += ' SET '
  Object.entries(values).forEach(([key, value]) => {
    sqlString += `${key} = ${sanitizeSQLString(value)},`
  })
  sqlString = sqlString.slice(0, -1) // remove last comma

  sqlString += getWhereClause(where)

  console.debug(sqlString)

  return await neon.query(sqlString)
}

export async function del(neon: NeonQueryFunction<boolean, boolean>, table: string, where?: string | NeonWhereQuery[]) {
  let sqlString = `DELETE FROM ${table}`

  sqlString += getWhereClause(where)

  console.debug(sqlString)

  return await neon.query(sqlString)
}

function getTableClause(from: string | NeonTableQuery[]): string {
  let sqlString = ' FROM '
  if (typeof from === 'string') {
    sqlString += from
  }
  else {
    let tables = ''
    from.forEach((t) => {
      if (tables) {
        tables += ` JOIN ${t.table} ${t.alias} ON ${t.joinColumn1} = ${t.joinColumn2}`
      }
      else {
        tables = `${t.table} ${t.alias}`
      }
    })
    sqlString += tables
  }
  return sqlString
}

function getWhereClause(where?: string | NeonWhereQuery[]): string {
  let sqlString = ''
  if (where) {
    sqlString += ' WHERE '
    if (typeof where === 'string') {
      sqlString += where
    }
    else {
      let conditions = ''
      where.forEach((w) => {
        if (conditions) {
          conditions += ` ${w.operator} ${w.column} ${w.condition} ${escapeIfNeeded(w.value)}`
        }
        else {
          conditions = `${w.column} ${w.condition} ${escapeIfNeeded(w.value)}`
        }
      })
      sqlString += conditions
    }
  }
  return sqlString
}

function getOrderClause(order?: string | NeonOrderQuery[]): string {
  let sqlString = ''
  if (order) {
    sqlString = ' ORDER BY '
    if (typeof order === 'string') {
      sqlString += order
    }
    else {
      let ordering = ''
      order.forEach((o) => {
        if (ordering) {
          ordering += `, ${o.column} ${o.direction || 'ASC'}`
        }
        else {
          ordering = `${o.column} ${o.direction || 'ASC'}`
        }
      })
      sqlString += ordering
    }
  }
  return sqlString
}

function escapeIfNeeded(value: string): string {
  if (!value.startsWith('\'')) {
    value = '\'' + value
  }
  if (!value.endsWith('\'')) {
    value = value + '\''
  }
  return value
}
