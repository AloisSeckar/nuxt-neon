import type { NeonDataType } from '../../shared/types/neon'
import {
  defineEventHandler, getForbiddenError, parseNeonError,
  readBody, useNeonServer, useRuntimeConfig,
} from '#imports'

export default defineEventHandler(async (event): Promise<NeonDataType<string>> => {
  try {
    const debug = useRuntimeConfig().public.neonDebugRuntime === true
    if (debug) {
      console.debug('Neon `insert` API endpoint invoked')
    }

    const endpoints = useRuntimeConfig().public.neonExposeEndpoints === true
    if (!endpoints) {
      return getForbiddenError('/api/_neon/insert')
    }

    const body = await readBody(event)
    if (debug) {
      console.debug('Request body:', body)
    }

    const { insert } = useNeonServer()
    return await insert({ ...body })
  }
  catch (err) {
    return await parseNeonError('/api/_neon/insert', err)
  }
})
