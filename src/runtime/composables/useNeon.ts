import type { NeonStatusResult, NeonTableQuery, NeonWhereQuery, NeonOrderQuery } from '../utils/neonTypes'
import { NEON_RAW_WARNING, displayRawWarning } from '../utils/neonWarnings'
import { useRuntimeConfig } from '#imports'

export function useNeon() {
  const neonStatus = async (anonymous: boolean = true, debug: boolean = false): Promise<NeonStatusResult> => {
    const dbName = useRuntimeConfig().public.neonDB

    let error = null
    try {
      await raw('SELECT 1=1')
    }
    catch (err) {
      error = err as Error
    }

    return {
      database: anonymous ? '' : dbName,
      status: error ? 'ERR' : 'OK',
      debugInfo: debug ? error?.message : '',
    }
  }

  const isOk = async (): Promise<boolean> => {
    return (await neonStatus()).status === 'OK'
  }

  const raw = async <T> (query: string): Promise<T> => {
    if (displayRawWarning()) {
      console.warn(NEON_RAW_WARNING)
    }
    return await fetchFromNeonBackend<T>('raw', { query })
  }

  const count = async (from: string | NeonTableQuery[], where?: string | NeonWhereQuery | NeonWhereQuery[]): Promise<number> => {
    return await fetchFromNeonBackend<number>('count', { from, where })
  }

  const select = async <T> (columns: string | string[], from: string | NeonTableQuery[], where?: string | NeonWhereQuery | NeonWhereQuery[], order?: string | NeonOrderQuery | NeonOrderQuery[], limit?: number): Promise<T> => {
    return await fetchFromNeonBackend('select', { columns, from, where, order, limit })
  }

  const insert = async (table: string, values: string[], columns?: string[]): Promise<string> => {
    return await callNeonBackend('insert', { table, values, columns })
  }

  const update = async (table: string, values: Record<string, string>, where?: string | NeonWhereQuery | NeonWhereQuery[]): Promise<string> => {
    return await callNeonBackend('update', { table, values, where })
  }

  const del = async (table: string, where?: string | NeonWhereQuery | NeonWhereQuery[]): Promise<string> => {
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
// just let the operation happen and return "OK" (if no error is thrown)
// TODO introduce a custom type for this kind of operations
async function callNeonBackend(method: string, body: Record<string, unknown>): Promise<string> {
  await fetchFromNeonBackend<unknown>(method, body)
  return 'OK'
}

// this is the actual call for server-side endpoints
async function fetchFromNeonBackend<T>(method: string, body: Record<string, unknown>): Promise<T> {
  let result = null
  let error = null
  try {
    result = await $fetch<T>(`/api/_neon/${method}`, {
      method: 'POST',
      body,
    })
  }
  catch (err) {
    error = err as Error
    throw new Error(error.message)
  }

  return result
}
