import type {
  NeonSelectQuery, NeonCountQuery, NeonInsertQuery, NeonUpdateQuery, NeonDeleteQuery,
  NeonCountResponse, NeonDataResponse, NeonEditResponse, NeonStatusResponse,
  NeonBodyType, NeonWhereType, NeonError,
} from '../shared/types/neon'
import {
  NEON_ENDPOINTS_DISABLED, NEON_RAW_ENDPOINT_DISABLED,
  encodeWhereType, formatNeonError, handleNeonError,
  isNeonSuccess, useRuntimeConfig,
} from '#imports'

export const useNeonClient = () => {
  const neonStatus = async (): Promise<NeonStatusResponse> => {
    const dbName = useRuntimeConfig().public.neonDB as string
    const debug = useRuntimeConfig().public.neonDebugRuntime as boolean

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
      database: dbName,
      status: error ? 'ERR' : 'OK',
      debugInfo: debug ? error : '',
    }
  }

  const isOk = async (): Promise<boolean> => {
    return (await neonStatus()).status === 'OK'
  }

  const raw = async <T> (query: string): Promise<NeonDataResponse<T>> => {
    const ret = await fetchFromNeonBackend<T>('raw', { query })
    if (isNeonSuccess(ret)) {
      return ret as Array<T>
    } else {
      return handleNeonError(ret)
    }
  }

  const count = async (query: NeonCountQuery): Promise<NeonCountResponse> => {
    const ret = await fetchFromNeonBackend<number>('count', { ...query })
    if (isNeonSuccess(ret)) {
      return (ret as Array<number>).at(0) || -1
    } else {
      return handleNeonError(ret)
    }
  }

  const select = async <T> (query: NeonSelectQuery): Promise<NeonDataResponse<T>> => {
    const ret = await fetchFromNeonBackend<T>('select', { ...query })
    if (isNeonSuccess(ret)) {
      return ret as Array<T>
    } else {
      return handleNeonError(ret)
    }
  }

  const insert = async (query: NeonInsertQuery): Promise<NeonEditResponse> => {
    return await fetchFromNeonBackend('insert', { ...query }) as NeonEditResponse
  }

  const update = async (query: NeonUpdateQuery): Promise<NeonEditResponse> => {
    return await fetchFromNeonBackend('update', { ...query }) as NeonEditResponse
  }

  const del = async (query: NeonDeleteQuery): Promise<NeonEditResponse> => {
    return await fetchFromNeonBackend('delete', { ...query }) as NeonEditResponse
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

type NeonResponse<T> = NeonDataResponse<T> | NeonCountResponse | NeonEditResponse

// this is the actual call for server-side endpoints
// backend returns either an array of results or an error object
async function fetchFromNeonBackend<T>(method: string, body: NeonBodyType): Promise<NeonResponse<T>> {
  const debug = useRuntimeConfig().public.neonDebugRuntime === true
  const endpoints = useRuntimeConfig().public.neonExposeEndpoints === true
  try {
    // guards
    if (!endpoints) {
      throw new Error(NEON_ENDPOINTS_DISABLED)
    }
    if (method === 'raw' && body.query !== 'SELECT 1=1 as status') {
      const rawEndpoint = useRuntimeConfig().public.neonExposeRawEndpoint === true
      if (!rawEndpoint) {
        throw new Error(NEON_RAW_ENDPOINT_DISABLED)
      }
    }

    // fix for https://github.com/AloisSeckar/nuxt-neon/issues/45
    if (Object.hasOwn(body, 'where')) {
      body.where = encodeWhereType(body.where as NeonWhereType)
    }
    if (Object.hasOwn(body, 'having')) {
      body.having = encodeWhereType(body.having as NeonWhereType)
    }

    if (debug) {
      console.debug(`Calling Neon '${method}' with:`, body)
    }
    return await $fetch<Array<T> | NeonError>(`/api/_neon/${method}`, {
      method: 'POST',
      body,
    })
  }
  catch (err) {
    if (debug) {
      console.warn(`Neon '${method}' failed`)
    }
    const error = err as Error
    return {
      name: 'NuxtNeonClientError',
      source: 'fetchFromNeonBackend',
      code: 500,
      message: error.message,
    }
  }
}
