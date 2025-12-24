import type { NeonQueryFunction } from '@neondatabase/serverless'
import type {
  NeonCountQuery, NeonSelectQuery, NeonInsertQuery, NeonUpdateQuery,
  NeonDeleteQuery, NeonTableObject, NeonStatusType, NeonError,
} from '../../utils/neonTypes'
import type { NeonDriverResult } from './getNeonClient'
import { formatNeonError, getForbiddenError } from './neonErrors'
import {
  getColumnsClause, getGroupByClause, getHavingClause, getLimitClause,
  getOrderClause, getTableClause, getWhereClause, getTableName, isTableWithAlias,
} from './helpers/neonSQLHelpers'
import { debugSQLIfAllowed } from './helpers/debugSQL'
import { sanitizeSQLString } from './helpers/sanitizeSQL'
import { useRuntimeConfig } from '#imports'

type NeonDriver = NeonQueryFunction<boolean, boolean>
type NeonDriverResponse = Promise<NeonDriverResult<false, false>>

// separate wrapper instead of forcing users to pass 'count(*)' as column name
export async function count(neon: NeonDriver, query: NeonCountQuery): NeonDriverResponse {
  if (useRuntimeConfig().public.neonDebugRuntime === true) {
    console.debug('Neon `count` server-side wrapper invoked')
  }

  return await select(neon, { ...query, columns: ['count(*)'] })
}

export async function select<T>(neon: NeonDriver, query: NeonSelectQuery): Promise<Array<T>> {
  if (useRuntimeConfig().public.neonDebugRuntime === true) {
    console.debug('Neon `select` server-side wrapper invoked')
  }

  let sqlString = 'SELECT '

  sqlString += getColumnsClause(query.columns)
  sqlString += getTableClause(query.from)
  sqlString += getWhereClause(query.where)
  sqlString += getGroupByClause(query.group)
  sqlString += getHavingClause(query.having)
  sqlString += getOrderClause(query.order)
  sqlString += getLimitClause(query.limit)

  await debugSQLIfAllowed(sqlString)

  // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
  const results = await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
  return results as Array<T>
}

export async function insert(neon: NeonDriver, query: NeonInsertQuery): NeonDriverResponse {
  if (useRuntimeConfig().public.neonDebugRuntime === true) {
    console.debug('Neon `insert` server-side wrapper invoked')
  }

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

  await debugSQLIfAllowed(sqlString)

  // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
  return await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
}

export async function update(neon: NeonDriver, query: NeonUpdateQuery): NeonDriverResponse {
  if (useRuntimeConfig().public.neonDebugRuntime === true) {
    console.debug('Neon `update` server-side wrapper invoked')
  }

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

  await debugSQLIfAllowed(sqlString)

  // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
  return await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
}

export async function del(neon: NeonDriver, query: NeonDeleteQuery): NeonDriverResponse {
  if (useRuntimeConfig().public.neonDebugRuntime === true) {
    console.debug('Neon `delete` server-side wrapper invoked')
  }

  let sqlString = `DELETE FROM ${getTableName(query.table)}`

  sqlString += getWhereClause(query.where)

  await debugSQLIfAllowed(sqlString)

  // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
  return await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
}

export async function raw<T>(neon: NeonDriver, sqlString: string): Promise<Array<T>> {
  if (useRuntimeConfig().public.neonDebugRuntime === true) {
    console.debug('Neon `raw` server-side wrapper invoked')
  }

  // raw endpoint is disabled by default
  // simple health check is allowed though
  if (sqlString !== 'SELECT 1=1 as status') {
    const rawEndpoint = useRuntimeConfig().public.neonExposeRawEndpoint === true
    if (!rawEndpoint) {
      throw getForbiddenError('/api/_neon/raw', true)
    }
  }
  await debugSQLIfAllowed(sqlString)

  // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
  const results = await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
  return results as Array<T>
}

// health check probes

export async function neonStatus(neon: NeonDriver, anonymous: boolean = true, debug: boolean = false): Promise<NeonStatusType> {
  if (useRuntimeConfig().public.neonDebugRuntime === true) {
    console.debug('Neon `neonStatus` server-side health check invoked')
  }

  let error = ''
  try {
    const ret = await raw(neon, 'SELECT 1=1 as status')
    if (!Array.isArray(ret)) {
      error = formatNeonError(ret as NeonError)
    }
  }
  catch (err) {
    error = (err as Error).message
  }

  return {
    database: anonymous ? '' : useRuntimeConfig().public.neonDB,
    status: error ? 'ERR' : 'OK',
    debugInfo: debug ? error : '',
  }
}

export async function isOk(neon: NeonDriver): Promise<boolean> {
  if (useRuntimeConfig().public.neonDebugRuntime === true) {
    console.debug('Neon `isOk` server-side health check invoked')
  }

  return (await neonStatus(neon)).status === 'OK'
}
