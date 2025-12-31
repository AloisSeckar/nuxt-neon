import type { NeonQueryFunction } from '@neondatabase/serverless'
import type {
  NeonCountQuery, NeonSelectQuery, NeonInsertQuery, NeonUpdateQuery, NeonDeleteQuery,
  NeonStatusType, NeonError,
} from '../../utils/neonTypes'
import type { NeonDriverResult } from './getNeonClient'
import { formatNeonError, getForbiddenError } from './neonErrors'
import { assertAllowedQuery, assertAllowedTable } from './helpers/assertSQL'
import { getDeleteSQL, getInsertSQL, getSelectSQL, getUpdateSQL } from './helpers/buildSQL'
import { debugSQLIfAllowed } from './helpers/debugSQL'
import { getNeonClient, useRuntimeConfig } from '#imports'

type NeonDriver = NeonQueryFunction<boolean, boolean>
type NeonDriverResponse = Promise<NeonDriverResult<false, false>>

function getDefaultNeonDriver(): NeonDriver {
  return getNeonClient()
}

// separate wrapper instead of forcing users to pass 'count(*)' as column name
export async function count(query: NeonCountQuery, neon: NeonDriver = getDefaultNeonDriver()): NeonDriverResponse {
  if (useRuntimeConfig().public.neonDebugRuntime === true) {
    console.debug('Neon `count` server-side wrapper invoked')
  }

  return await select({ ...query, columns: ['count(*)'] }, neon)
}

export async function select<T>(query: NeonSelectQuery, neon: NeonDriver = getDefaultNeonDriver()): Promise<Array<T>> {
  if (useRuntimeConfig().public.neonDebugRuntime === true) {
    console.debug('Neon `select` server-side wrapper invoked')
  }

  assertAllowedTable(query.from, getAllowedTables())
  const sqlString = getSelectSQL(query)
  await debugSQLIfAllowed(sqlString)

  // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
  const results = await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
  return results as Array<T>
}

export async function insert(query: NeonInsertQuery, neon: NeonDriver = getDefaultNeonDriver()): NeonDriverResponse {
  if (useRuntimeConfig().public.neonDebugRuntime === true) {
    console.debug('Neon `insert` server-side wrapper invoked')
  }

  assertAllowedTable(query.table, getAllowedTables())
  const sqlString = getInsertSQL(query)
  await debugSQLIfAllowed(sqlString)

  // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
  return await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
}

export async function update(query: NeonUpdateQuery, neon: NeonDriver = getDefaultNeonDriver()): NeonDriverResponse {
  if (useRuntimeConfig().public.neonDebugRuntime === true) {
    console.debug('Neon `update` server-side wrapper invoked')
  }

  assertAllowedTable(query.table, getAllowedTables())
  const sqlString = getUpdateSQL(query)
  await debugSQLIfAllowed(sqlString)

  // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
  return await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
}

export async function del(query: NeonDeleteQuery, neon: NeonDriver = getDefaultNeonDriver()): NeonDriverResponse {
  if (useRuntimeConfig().public.neonDebugRuntime === true) {
    console.debug('Neon `delete` server-side wrapper invoked')
  }

  assertAllowedTable(query.table, getAllowedTables())
  const sqlString = getDeleteSQL(query)
  await debugSQLIfAllowed(sqlString)

  // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
  return await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
}

export async function raw<T>(sqlString: string, neon: NeonDriver = getDefaultNeonDriver()): Promise<Array<T>> {
  if (useRuntimeConfig().public.neonDebugRuntime === true) {
    console.debug('Neon `raw` server-side wrapper invoked')
  }

  // raw endpoint is disabled by default
  // simple health check is always allowed
  if (sqlString !== 'SELECT 1=1 as status') {
    const rawEndpoint = useRuntimeConfig().public.neonExposeRawEndpoint === true
    if (!rawEndpoint) {
      throw getForbiddenError('/api/_neon/raw', true)
    }
  }
  await debugSQLIfAllowed(sqlString)

  // only allow white-listed queries
  // simple health check is always allowed
  if (sqlString !== 'SELECT 1=1 as status') {
    const allowedQueries = useRuntimeConfig().neonAllowedQueries?.split(';') || []
    assertAllowedQuery(sqlString, allowedQueries)
  }

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
    const ret = await raw('SELECT 1=1 as status', neon)
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

function getAllowedTables(): string[] {
  return useRuntimeConfig().neonAllowedTables?.split(',') || []
}
