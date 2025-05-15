import type { NeonQueryFunction } from '@neondatabase/serverless'
import type { NeonTableQuery, NeonWhereQuery, NeonOrderQuery } from '../../utils/neonTypes'
import type { NeonDriverResult } from './getNeonClient'
import { sanitizeSQLString } from './helpers/sanitizeSQL'
import {
  getColumnsClause, getGroupByClause, getHavingClause,
  getLimitClause, getOrderClause, getTableClause, getWhereClause,
} from './helpers/neonSQLHelpers'

type NeonDriverType = Promise<NeonDriverResult<false, false>>

// separate wrapper instead of forcing users to pass 'count(*)' as column name
export async function count(neon: NeonQueryFunction<boolean, boolean>, from: string | NeonTableQuery | NeonTableQuery[], where?: string | NeonWhereQuery | NeonWhereQuery[]): NeonDriverType {
  return await select(neon, ['count(*)'], from, where, undefined, undefined)
}

export async function select(neon: NeonQueryFunction<boolean, boolean>, columns: string | string[], from: string | NeonTableQuery | NeonTableQuery[], where?: string | NeonWhereQuery | NeonWhereQuery[], order?: string | NeonOrderQuery | NeonOrderQuery[], limit?: number, group?: string | string[], having?: string | NeonWhereQuery | NeonWhereQuery[]): NeonDriverType {
  let sqlString = 'SELECT '

  sqlString += getColumnsClause(columns)
  sqlString += getTableClause(from)
  sqlString += getWhereClause(where)
  sqlString += getGroupByClause(group)
  sqlString += getHavingClause(having)
  sqlString += getOrderClause(order)
  sqlString += getLimitClause(limit)

  console.debug(sqlString)

  // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
  return await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
}

export async function insert(neon: NeonQueryFunction<boolean, boolean>, table: string | NeonTableQuery, values: Record<string, string>): NeonDriverType {
  let sqlString = `INSERT INTO ${table}`

  const sqlColumns = [] as string[]
  const sqlValues = [] as string[]
  for (const [key, value] of Object.entries(values)) {
    sqlColumns.push(key)
    sqlValues.push(sanitizeSQLString(value))
  }

  sqlString += ' ('
  sqlString += sqlColumns.join(', ')
  sqlString += ') '

  sqlString += ' VALUES ('
  sqlString += sqlValues.join(', ')
  sqlString += ')'

  // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
  return await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
}

export async function update(neon: NeonQueryFunction<boolean, boolean>, table: string | NeonTableQuery, values: Record<string, string>, where?: string | NeonWhereQuery | NeonWhereQuery[]): NeonDriverType {
  let sqlString = `UPDATE ${table}`

  sqlString += ' SET '
  Object.entries(values).forEach(([key, value]) => {
    sqlString += `${key} = ${sanitizeSQLString(value)},`
  })
  sqlString = sqlString.slice(0, -1) // remove last comma

  sqlString += getWhereClause(where)

  console.debug(sqlString)

  // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
  return await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
}

export async function del(neon: NeonQueryFunction<boolean, boolean>, table: string | NeonTableQuery, where?: string | NeonWhereQuery | NeonWhereQuery[]): NeonDriverType {
  let sqlString = `DELETE FROM ${table}`

  sqlString += getWhereClause(where)

  console.debug(sqlString)

  // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
  return await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
}
