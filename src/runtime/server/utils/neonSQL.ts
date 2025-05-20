import type { NeonQueryFunction } from '@neondatabase/serverless'
import type { NeonDriverResult } from './getNeonClient'
import { sanitizeSQLString } from './helpers/sanitizeSQL'
import {
  getColumnsClause, getGroupByClause, getHavingClause, getLimitClause,
  getOrderClause, getTableClause, getWhereClause, getTableName, isTableWithAlias,
} from './helpers/neonSQLHelpers'

type NeonDriver = NeonQueryFunction<boolean, boolean>
type NeonDriverResponse = Promise<NeonDriverResult<false, false>>

// separate wrapper instead of forcing users to pass 'count(*)' as column name
export async function count(neon: NeonDriver, query: NeonCountQuery): NeonDriverResponse {
  return await select(neon, { ...query, columns: ['count(*)'] })
}

export async function select(neon: NeonDriver, query: NeonSelectQuery): NeonDriverResponse {
  let sqlString = 'SELECT '

  sqlString += getColumnsClause(query.columns)
  sqlString += getTableClause(query.from)
  sqlString += getWhereClause(query.where)
  sqlString += getGroupByClause(query.group)
  sqlString += getHavingClause(query.having)
  sqlString += getOrderClause(query.order)
  sqlString += getLimitClause(query.limit)

  console.debug(sqlString)

  // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
  return await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
}

export async function insert(neon: NeonDriver, query: NeonInsertQuery): NeonDriverResponse {
  // alias is technically not allowed for insert
  if (isTableWithAlias(query.table)) {
    throw new Error('Table alias is not allowed for INSERT statement')
  }

  // data to be inserted
  const rows = Array.isArray(query.values) ? query.values : [query.values]

  // definition of columns for the insert statement
  const columns = Object.keys(rows[0])
  const sqlColumns = columns.join(', ')

  // definition of values for the insert statement
  const valueTuples = rows.map(row =>
    '(' + columns.map(col => sanitizeSQLString(row[col])).join(', ') + ')',
  ).join(', ')

  const sqlString = `INSERT INTO ${getTableName(query.table)} (${sqlColumns}) VALUES ${valueTuples}`

  // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
  return await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
}

export async function update(neon: NeonDriver, query: NeonUpdateQuery): NeonDriverResponse {
  let sqlString = `UPDATE ${getTableName(query.table)}`

  // alias has a special syntax in update with "AS"
  if (isTableWithAlias(query.table)) {
    const alias = (query.table as NeonTableObject).alias
    sqlString.replace(` ${alias}`, ` AS ${alias}`)
  }

  sqlString += ' SET '
  Object.entries(query.values).forEach(([key, value]) => {
    sqlString += `${key} = ${sanitizeSQLString(value)},`
  })
  sqlString = sqlString.slice(0, -1) // remove last comma

  sqlString += getWhereClause(query.where)

  console.debug(sqlString)

  // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
  return await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
}

export async function del(neon: NeonDriver, query: NeonDeleteQuery): NeonDriverResponse {
  let sqlString = `DELETE FROM ${getTableName(query.table)}`

  sqlString += getWhereClause(query.where)

  console.debug(sqlString)

  // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
  return await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
}
