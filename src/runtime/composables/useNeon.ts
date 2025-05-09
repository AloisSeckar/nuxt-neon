import type { NeonStatusResult, NeonTableQuery, NeonWhereQuery, NeonOrderQuery } from '../utils/neonTypes'
import { NEON_RAW_WARNING, displayRawWarning } from '../utils/neonWarnings'
import { formatNeonError, isNeonSuccess } from '../utils/neonErrors'
import { useRuntimeConfig } from '#imports'

export function useNeon() {
  const neonStatus = async (anonymous: boolean = true, debug: boolean = false): Promise<NeonStatusResult> => {
    const dbName = useRuntimeConfig().public.neonDB

    let error = ''
    try {
      const ret = await raw<{ status: boolean }>('SELECT 1=1 as status')
      const value = ret.at(0)
      if (typeof value === 'string' && (value as string)?.startsWith('NuxtNeon')) {
        error = value
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

  const raw = async <T> (query: string): Promise<Array<T | string>> => {
    if (displayRawWarning()) {
      console.warn(NEON_RAW_WARNING)
    }
    const ret = await fetchFromNeonBackend<T>('raw', { query })
    if (isNeonSuccess(ret)) {
      return ret as Array<T>
    }
    else {
      const err = formatNeonError(ret as NeonError)
      console.debug(err)
      return [err]
    }
  }

  const count = async (from: string | NeonTableQuery | NeonTableQuery[], where?: string | NeonWhereQuery | NeonWhereQuery[]): Promise<number | string> => {
    const ret = await fetchFromNeonBackend<number>('count', { from, where })
    if (isNeonSuccess(ret)) {
      return (ret as Array<number>).at(0) || -1
    }
    else {
      const err = formatNeonError(ret as NeonError)
      console.debug(err)
      return err
    }
  }

  const select = async <T> (columns: string | string[], from: string | NeonTableQuery | NeonTableQuery[], where?: string | NeonWhereQuery | NeonWhereQuery[], order?: string | NeonOrderQuery | NeonOrderQuery[], limit?: number): Promise<Array<T | string>> => {
    const ret = await fetchFromNeonBackend<T>('select', { columns, from, where, order, limit })
    if (isNeonSuccess(ret)) {
      return ret as Array<T>
    }
    else {
      const err = formatNeonError(ret as NeonError)
      console.debug(err)
      return [err]
    }
  }

  const insert = async (table: string | NeonTableQuery, values: Record<string, string>): Promise<string> => {
    return await callNeonBackend('insert', { table, values })
  }

  const update = async (table: string | NeonTableQuery, values: Record<string, string>, where?: string | NeonWhereQuery | NeonWhereQuery[]): Promise<string> => {
    return await callNeonBackend('update', { table, values, where })
  }

  const del = async (table: string | NeonTableQuery, where?: string | NeonWhereQuery | NeonWhereQuery[]): Promise<string> => {
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
async function callNeonBackend(method: string, body: Record<string, unknown>): Promise<string> {
  const ret = await fetchFromNeonBackend<string>(method, body)
  if (isNeonSuccess(ret)) {
    return (ret as Array<string>)[0]
  }
  else {
    return formatNeonError(ret as NeonError)
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
