import type { NeonQueryFunction } from '@neondatabase/serverless'
import type { NeonTableQuery, NeonWhereQuery } from '../../utils/neonTypes'
import { sanitizeSQLArray, sanitizeSQLString } from './sanitizeSQL'

export async function select(neon: NeonQueryFunction<boolean, boolean>, columns: string[], from: string | NeonTableQuery[], where?: string | NeonWhereQuery[], order?: string, limit?: number) {
  let sqlString = 'SELECT '
  sqlString += columns.join(', ')

  sqlString += getTableClause(from)

  sqlString += getWhereClause(where)

  if (order) {
    sqlString += ` ORDER BY ${order}`
  }

  if (limit) {
    sqlString += ` LIMIT ${limit}`
  }

  console.debug(sqlString)

  return await neon(sqlString)
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

  return await neon(sqlString)
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

  return await neon(sqlString)
}

export async function del(neon: NeonQueryFunction<boolean, boolean>, table: string, where?: string | NeonWhereQuery[]) {
  let sqlString = `DELETE FROM ${table}`

  sqlString += getWhereClause(where)

  console.debug(sqlString)

  return await neon(sqlString)
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
        tables += ` JOIN ${t.table} ${t.alias} ON ${t.idColumn1} = ${t.idColumn2}`
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
          conditions += ` ${w.operator} ${w.column} ${w.relation} ${w.value}`
        }
        else {
          conditions = `${w.column} ${w.relation} ${w.value}`
        }
      })
      sqlString += conditions
    }
  }
  return sqlString
}
