import type { NeonQueryFunction } from '@neondatabase/serverless'
import { sanitizeSQLArray, sanitizeSQLString } from './sanitizeSQL'

export async function select(neon: NeonQueryFunction<boolean, boolean>, columns: string[], from: string[], where?: string[], order?: string, limit?: number) {
  let sqlString = 'SELECT '
  sqlString += columns.join(', ')

  sqlString += ' FROM '
  sqlString += from.join(' JOIN ')

  if (where) {
    sqlString += ' WHERE '
    sqlString += where.join(' AND ')
  }

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

export async function update(neon: NeonQueryFunction<boolean, boolean>, table: string, values: Record<string, string>, where?: string[]) {
  let sqlString = `UPDATE ${table}`

  sqlString += ' SET '
  Object.entries(values).forEach(([key, value]) => {
    sqlString += `${key} = ${sanitizeSQLString(value)},`
  })
  sqlString = sqlString.slice(0, -1) // remove last comma

  if (where) {
    sqlString += ' WHERE '
    sqlString += where.join(' AND ')
  }

  console.debug(sqlString)

  return await neon(sqlString)
}

export async function del(neon: NeonQueryFunction<boolean, boolean>, table: string, where?: string[]) {
  let sqlString = `DELETE FROM ${table}`

  if (where) {
    sqlString += ' WHERE '
    sqlString += where.join(' AND ')
  }

  console.debug(sqlString)

  return await neon(sqlString)
}
