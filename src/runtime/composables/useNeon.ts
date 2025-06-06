import type {
  NeonBodyType, NeonDataType, NeonEditType, NeonStatusType, NeonError,
  NeonCountQuery, NeonCountType, NeonSelectQuery, NeonInsertQuery,
  NeonUpdateQuery, NeonDeleteQuery,
} from '../utils/neonTypes'
import { NEON_RAW_WARNING, displayRawWarning } from '../utils/neonWarnings'
import { formatNeonError, handleNeonError, isNeonSuccess } from '../utils/neonErrors'
import { useRuntimeConfig } from '#imports'

export function useNeon() {
  const neonStatus = async (anonymous: boolean = true, debug: boolean = false): Promise<NeonStatusType> => {
    const dbName = useRuntimeConfig().public.neonDB as string

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

  const raw = async <T> (query: string): Promise<NeonDataType<T>> => {
    if (displayRawWarning() && query !== 'SELECT 1=1 as status') {
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

  const count = async (query: NeonCountQuery): Promise<NeonCountType> => {
    const ret = await fetchFromNeonBackend<number>('count', { ...query })
    if (isNeonSuccess(ret)) {
      return (ret as Array<number>).at(0) || -1
    }
    else {
      return handleNeonError(ret)
    }
  }

  const select = async <T> (query: NeonSelectQuery): Promise<NeonDataType<T>> => {
    const ret = await fetchFromNeonBackend<T>('select', { ...query })
    if (isNeonSuccess(ret)) {
      return ret as Array<T>
    }
    else {
      return handleNeonError(ret)
    }
  }

  const insert = async (query: NeonInsertQuery): Promise<NeonEditType> => {
    return await callNeonBackend('insert', { ...query })
  }

  const update = async (query: NeonUpdateQuery): Promise<NeonEditType> => {
    return await callNeonBackend('update', { ...query })
  }

  const del = async (query: NeonDeleteQuery): Promise<NeonEditType> => {
    return await callNeonBackend('delete', { ...query })
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
async function callNeonBackend(method: string, body: NeonBodyType): Promise<NeonEditType> {
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
async function fetchFromNeonBackend<T>(method: string, body: NeonBodyType): Promise<NeonDataType<T>> {
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
