import type { NeonQueryFunction } from '@neondatabase/serverless'
import type {
  NeonCountQuery, NeonSelectQuery, NeonInsertQuery, NeonUpdateQuery, NeonDeleteQuery,
  NeonStatusType, NeonError, NeonDriverResult,
} from '../../shared/types/neon'
import { assertAllowedQuery, assertAllowedTable } from './helpers/assertSQL'
import { getDeleteSQL, getInsertSQL, getSelectSQL, getUpdateSQL } from './helpers/buildSQL'
import { debugSQLIfAllowed } from './helpers/debugSQL'
import { formatNeonError, getForbiddenError, useRuntimeConfig, useNeonDriver } from '#imports'

type NeonDriver = NeonQueryFunction<boolean, boolean>
type NeonDriverResponse = Promise<NeonDriverResult<false, false>>

function getDefaultNeonDriver(): NeonDriver {
  const { neon } = useNeonDriver()
  return neon
}

function getAllowedTables(): string[] {
  return useRuntimeConfig().neonAllowedTables?.split(',') || []
}

export const useNeonServer = () => {
  if (import.meta.client) {
    throw new Error('useNeonServer can only be used within Nuxt server-side context')
  }

  // separate wrapper instead of forcing users to pass 'count(*)' as column name
  const count = async (query: NeonCountQuery, neon: NeonDriver = getDefaultNeonDriver()): NeonDriverResponse => {
    if (useRuntimeConfig().public.neonDebugRuntime === true) {
      console.debug('Neon `count` server-side wrapper invoked')
    }

    return await select({ ...query, columns: ['count(*)'] }, neon)
  }

  // SELECT wrapper
  const select = async <T>(query: NeonSelectQuery, neon: NeonDriver = getDefaultNeonDriver()): Promise<Array<T>> => {
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

  // INSERT wrapper
  const insert = async (query: NeonInsertQuery, neon: NeonDriver = getDefaultNeonDriver()): NeonDriverResponse => {
    if (useRuntimeConfig().public.neonDebugRuntime === true) {
      console.debug('Neon `insert` server-side wrapper invoked')
    }

    assertAllowedTable(query.table, getAllowedTables())
    const sqlString = getInsertSQL(query)
    await debugSQLIfAllowed(sqlString)

    // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
    return await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
  }

  // UPDATE wrapper
  const update = async (query: NeonUpdateQuery, neon: NeonDriver = getDefaultNeonDriver()): NeonDriverResponse => {
    if (useRuntimeConfig().public.neonDebugRuntime === true) {
      console.debug('Neon `update` server-side wrapper invoked')
    }

    assertAllowedTable(query.table, getAllowedTables())
    const sqlString = getUpdateSQL(query)
    await debugSQLIfAllowed(sqlString)

    // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
    return await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
  }

  // DELETE wrapper
  const del = async (query: NeonDeleteQuery, neon: NeonDriver = getDefaultNeonDriver()): NeonDriverResponse => {
    if (useRuntimeConfig().public.neonDebugRuntime === true) {
      console.debug('Neon `delete` server-side wrapper invoked')
    }

    assertAllowedTable(query.table, getAllowedTables())
    const sqlString = getDeleteSQL(query)
    await debugSQLIfAllowed(sqlString)

    // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
    return await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
  }

  // raw SQL wrapper
  const raw = async <T>(sqlString: string, neon: NeonDriver = getDefaultNeonDriver()): Promise<Array<T>> => {
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

  // health check probe
  const neonStatus = async (neon: NeonDriver, anonymous: boolean = true, debug: boolean = false): Promise<NeonStatusType> => {
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

  // simple true/false health check
  const isOk = async (neon: NeonDriver): Promise<boolean> => {
    if (useRuntimeConfig().public.neonDebugRuntime === true) {
      console.debug('Neon `isOk` server-side health check invoked')
    }

    return (await neonStatus(neon)).status === 'OK'
  }

  return {
    // SQL wrappers
    raw,
    count,
    select,
    insert,
    update,
    del,
    // health check probes
    neonStatus,
    isOk,
  }
}
