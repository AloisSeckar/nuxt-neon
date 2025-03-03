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

  const isOk = async () => {
    return (await neonStatus()).status === 'OK'
  }

  const raw = async (query: string) => {
    if (displayRawWarning()) {
      console.warn(NEON_RAW_WARNING)
    }
    return await callNeonBackend('raw', { query }, true)
  }

  const count = async (from: string | NeonTableQuery[], where?: string | NeonWhereQuery[]) => {
    return await callNeonBackend('count', { from, where }, true)
  }

  const select = async (columns: string[], from: string | NeonTableQuery[], where?: string | NeonWhereQuery[], order?: string | NeonOrderQuery[], limit?: number) => {
    return await callNeonBackend('select', { columns, from, where, order, limit }, true)
  }

  const insert = async (table: string, values: string[], columns?: string[]) => {
    return await callNeonBackend('insert', { table, values, columns }, false)
  }

  const update = async (table: string, values: Record<string, string>, where?: string | NeonWhereQuery[]) => {
    return await callNeonBackend('update', { table, values, where }, false)
  }

  const del = async (table: string, where?: string | NeonWhereQuery[]) => {
    return await callNeonBackend('delete', { table, where }, false)
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

/* eslint-disable  @typescript-eslint/no-explicit-any */ // FetchOptions are typed with "any"
async function callNeonBackend(method: string, body: Record<string, any>, returnResult: boolean) {
  let result = null
  let error = null
  try {
    result = await $fetch(`/api/_neon/${method}`, {
      method: 'POST',
      body,
    })
  }
  catch (err) {
    error = err as Error
    throw new Error(error.message)
  }

  return returnResult ? result : 'OK'
}
