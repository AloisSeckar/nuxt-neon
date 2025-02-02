import type { NeonStatusResult } from '../utils/neonTypes'
import { useRuntimeConfig } from '#imports'

export function useNeon() {
  const neonStatus = async (anonymous: boolean = true, debug: boolean = false): Promise<NeonStatusResult> => {
    let error = null
    try {
      await raw('SELECT 1=1')
    }
    catch (err) {
      error = err as Error
    }

    return {
      database: getDBName(anonymous),
      status: error ? 'ERR' : 'OK',
      debugInfo: debug ? error?.message : '',
    }
  }

  const isOk = async () => {
    return (await neonStatus()).status === 'OK'
  }

  const raw = async (query: string) => {
    let data = null
    let error = null
    try {
      data = await $fetch('/api/_neon/raw', {
        method: 'POST',
        body: { query },
      })
    }
    catch (err) {
      error = err as Error
    }

    // TODO better handling
    if (error) {
      throw new Error(error.message)
    }
    return data
  }

  const select = async (columns: string[], from: string[], where?: string[], order?: string, limit?: number) => {
    let data = null
    let error = null
    try {
      data = await $fetch('/api/_neon/select', {
        method: 'POST',
        body: { columns, from, where, order, limit },
      })
    }
    catch (err) {
      error = err as Error
    }

    // TODO better handling
    if (error) {
      throw new Error(error.message)
    }
    return data
  }

  const insert = async (table: string, values: string[], columns?: string[]) => {
    let data = null
    let error = null
    try {
      data = await $fetch('/api/_neon/insert', {
        method: 'POST',
        body: { table, values, columns },
      })
    }
    catch (err) {
      error = err as Error
    }

    // TODO better handling
    if (error) {
      throw new Error(error.message)
    }
    return data
  }

  const update = async (table: string, values: Record<string, string>, where?: string[]) => {
    let data = null
    let error = null
    try {
      data = await $fetch('/api/_neon/update', {
        method: 'POST',
        body: { table, values, where },
      })
    }
    catch (err) {
      error = err as Error
    }

    // TODO better handling
    if (error) {
      throw new Error(error.message)
    }
    return data
  }

  const del = async (table: string, where?: string[]) => {
    let data = null
    let error = null
    try {
      data = await $fetch('/api/_neon/delete', {
        method: 'POST',
        body: { table, where },
      })
    }
    catch (err) {
      error = err as Error
    }

    // TODO better handling
    if (error) {
      throw new Error(error.message)
    }
    return data
  }

  return {
    // health check probes
    neonStatus,
    isOk,
    // SQL wrappers
    raw,
    select,
    insert,
    update,
    del,
  }
}

function getDBName(anonymous: boolean = false) {
  return anonymous ? '' : useRuntimeConfig().public.neonDB
}
