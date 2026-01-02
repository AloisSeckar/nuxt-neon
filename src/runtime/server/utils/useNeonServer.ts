import type {
  NeonCountQuery, NeonSelectQuery, NeonInsertQuery, NeonUpdateQuery, NeonDeleteQuery,
  NeonCountResponse, NeonDataResponse, NeonEditResponse, NeonStatusResponse,
  NeonDriver, NeonError,
} from '../../shared/types/neon'
import { assertAllowedQuery, assertAllowedTable } from './helpers/assertSQL'
import { getDeleteSQL, getInsertSQL, getSelectSQL, getUpdateSQL } from './helpers/buildSQL'
import { debugSQLIfAllowed } from './helpers/debugSQL'
import { formatNeonError, getForbiddenError, parseNeonError, useRuntimeConfig, useNeonDriver, getGenericError } from '#imports'

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

  // health check probe
  const neonStatus = async (neon: NeonDriver = getDefaultNeonDriver()): Promise<NeonStatusResponse> => {
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
      database: useRuntimeConfig().neonDB,
      status: error ? 'ERR' : 'OK',
      debugInfo: error,
    }
  }

  // simple true/false health check
  const isOk = async (neon: NeonDriver = getDefaultNeonDriver()): Promise<boolean> => {
    if (useRuntimeConfig().public.neonDebugRuntime === true) {
      console.debug('Neon `isOk` server-side health check invoked')
    }

    return (await neonStatus(neon)).status === 'OK'
  }

  // SELECT wrapper
  const select = async <T>(query: NeonSelectQuery, neon: NeonDriver = getDefaultNeonDriver()): Promise<NeonDataResponse<T>> => {
    try {
      if (useRuntimeConfig().public.neonDebugRuntime === true) {
        console.debug('Neon `select` server-side wrapper invoked')
      }

      assertAllowedTable(query.from, getAllowedTables())
      const sqlString = getSelectSQL(query)
      await debugSQLIfAllowed(sqlString)

      // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
      const results = await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
      return results as Array<T>
    } catch (err) {
      return await parseNeonError('useNeonServer().select', err)
    }
  }

  // separate wrapper for COUNT instead of forcing users to pass 'count(*)' as column name in SELECT
  const count = async (query: NeonCountQuery, neon: NeonDriver = getDefaultNeonDriver()): Promise<NeonCountResponse> => {
    try {
      if (useRuntimeConfig().public.neonDebugRuntime === true) {
        console.debug('Neon `count` server-side wrapper invoked')
      }

      // count query result is always returned as [ { count: 'n' } ]
      const countData = await select({ ...query, columns: ['count(*)'] }, neon) as { count: number }[]

      // extract only the number
      // or return -1 if response cannot be parsed
      return countData?.at(0)?.count || -1
    } catch (err) {
      return await parseNeonError('useNeonServer().count', err)
    }
  }

  // INSERT wrapper
  const insert = async (query: NeonInsertQuery, neon: NeonDriver = getDefaultNeonDriver()): Promise<NeonEditResponse> => {
    try {
      if (useRuntimeConfig().public.neonDebugRuntime === true) {
        console.debug('Neon `insert` server-side wrapper invoked')
      }

      assertAllowedTable(query.table, getAllowedTables())
      const sqlString = getInsertSQL(query)
      await debugSQLIfAllowed(sqlString)

      // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
      const ret = await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
      // successful INSERT operation returns []
      if (ret.length === 0) {
        return 'OK'
      } else {
        console.debug(ret)
        // TODO can we extract more detailed error cause from within the driver response?
        return await getGenericError('useNeonServer().insert', 'INSERT operation failed')
      }
    } catch (err) {
      return await parseNeonError('useNeonServer().insert', err)
    }
  }

  // UPDATE wrapper
  const update = async (query: NeonUpdateQuery, neon: NeonDriver = getDefaultNeonDriver()): Promise<NeonEditResponse> => {
    try {
      if (useRuntimeConfig().public.neonDebugRuntime === true) {
        console.debug('Neon `update` server-side wrapper invoked')
      }

      assertAllowedTable(query.table, getAllowedTables())
      const sqlString = getUpdateSQL(query)
      await debugSQLIfAllowed(sqlString)

      // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
      const ret = await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })

      // successful UPDATE operation returns []
      if (ret.length === 0) {
        return 'OK'
      } else {
      // TODO can we extract more detailed error cause from within the driver response?
        return await getGenericError('useNeonServer().update', 'UPDATE operation failed')
      }
    } catch (err) {
      return await parseNeonError('useNeonServer().update', err)
    }
  }

  // DELETE wrapper
  const del = async (query: NeonDeleteQuery, neon: NeonDriver = getDefaultNeonDriver()): Promise<NeonEditResponse> => {
    try {
      if (useRuntimeConfig().public.neonDebugRuntime === true) {
        console.debug('Neon `delete` server-side wrapper invoked')
      }

      assertAllowedTable(query.table, getAllowedTables())
      const sqlString = getDeleteSQL(query)
      await debugSQLIfAllowed(sqlString)

      // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
      const ret = await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })

      // successful DELETE operation returns []
      if (ret.length === 0) {
        return 'OK'
      } else {
        console.debug(ret)
        // TODO can we extract more detailed error cause from within the driver response?
        return await getGenericError('/api/_neon/delete', 'DELETE operation failed')
      }
    } catch (err) {
      return await parseNeonError('useNeonServer().delete', err)
    }
  }

  // raw SQL wrapper
  const raw = async <T>(sqlString: string, neon: NeonDriver = getDefaultNeonDriver()): Promise<NeonDataResponse<T>> => {
    try {
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
    } catch (err) {
      return await parseNeonError('useNeonServer().raw', err)
    }
  }

  return {
    // health check probes
    neonStatus,
    isOk,
    // SQL wrappers
    raw,
    count,
    select,
    insert,
    update,
    del,
  }
}
