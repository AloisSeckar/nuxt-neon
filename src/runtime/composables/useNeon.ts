import type { NeonStatusResult, NeonTableQuery, NeonWhereQuery, NeonOrderQuery } from '../utils/neonTypes'
import { NEON_RAW_WARNING, displayRawWarning } from '../utils/neonWarnings'
import { formatNeonError, handleNeonError, isNeonSuccess } from '../utils/neonErrors'
import { useRuntimeConfig } from '#imports'

export function useNeon() {
  const neonStatus = async (anonymous: boolean = true, debug: boolean = false): Promise<NeonStatusResult> => {
    const dbName = useRuntimeConfig().public.neonDB

    let error = ''
    try {
      const ret = await raw<{ status: boolean }>('SELECT 1=1 as status')
      if (!Array.isArray(ret)) {
        error = formatNeonError(ret as NeonError)
      }
    }
    catch (err) {
      error = (err as Error).message
    }

    return {
      database: anonymous ? '' : dbName,
      status: error ? 'ERR' : 'OK',
      debugInfo: debug ? error : '',
    }
  }

  const isOk = async (): Promise<boolean> => {
    return (await neonStatus()).status === 'OK'
  }

  const raw = async <T> (query: string): Promise<Array<T> | NeonError> => {
    if (displayRawWarning()) {
      console.warn(NEON_RAW_WARNING)
    }
    const ret = await fetchFromNeonBackend<T>('raw', { query })
    if (isNeonSuccess(ret)) {
      return ret as Array<T>
    }
    else {
      return handleNeonError(ret)
    }
  }

  const count = async (from: string | NeonTableQuery | NeonTableQuery[], where?: string | NeonWhereQuery | NeonWhereQuery[]): Promise<number | NeonError> => {
    const ret = await fetchFromNeonBackend<number>('count', { from, where })
    if (isNeonSuccess(ret)) {
      return (ret as Array<number>).at(0) || -1
    }
    else {
      return handleNeonError(ret)
    }
  }

  const select = async <T> (columns: string | string[], from: string | NeonTableQuery | NeonTableQuery[], where?: string | NeonWhereQuery | NeonWhereQuery[], order?: string | NeonOrderQuery | NeonOrderQuery[], limit?: number, group?: string | string[], having?: string | NeonWhereQuery | NeonWhereQuery[]): Promise<Array<T> | NeonError> => {
    const ret = await fetchFromNeonBackend<T>('select', { columns, from, where, order, limit, group, having })
    if (isNeonSuccess(ret)) {
      return ret as Array<T>
    }
    else {
      return handleNeonError(ret)
    }
  }

  const insert = async (table: string | NeonTableQuery, values: Record<string, string>): Promise<string | NeonError> => {
    return await callNeonBackend('insert', { table, values })
  }

  const update = async (table: string | NeonTableQuery, values: Record<string, string>, where?: string | NeonWhereQuery | NeonWhereQuery[]): Promise<string | NeonError> => {
    return await callNeonBackend('update', { table, values, where })
  }

  const del = async (table: string | NeonTableQuery, where?: string | NeonWhereQuery | NeonWhereQuery[]): Promise<string | NeonError> => {
    return await callNeonBackend('delete', { table, where })
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

// for methods where we don't expect results (INSERT, UPDATE, DELETE)
// backend returns an array with single string containing either 'OK' or an error cause
async function callNeonBackend(method: string, body: Record<string, unknown>): Promise<string | NeonError> {
  const ret = await fetchFromNeonBackend<string>(method, body)
  if (isNeonSuccess(ret)) {
    return (ret as Array<string>)[0]
  }
  else {
    return handleNeonError(ret)
  }
}

// this is the actual call for server-side endpoints
// backend returns either an array of results or an error object
async function fetchFromNeonBackend<T>(method: string, body: Record<string, unknown>): Promise<Array<T> | NeonError> {
  try {
    return await $fetch<Array<T> | NeonError>(`/api/_neon/${method}`, {
      method: 'POST',
      body,
    })
  }
  catch (err) {
    const error = err as Error
    return {
      name: 'NuxtNeonClientError',
      source: 'fetchFromNeonBackend',
      code: 500,
      message: error.message,
    }
  }
}
