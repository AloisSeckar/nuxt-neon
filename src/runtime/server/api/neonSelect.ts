import type { H3Event, EventHandlerRequest } from 'h3'
import type { NeonDataResponse } from '../../shared/types/neon'
import {
  defineEventHandler, getForbiddenError, parseNeonError,
  readBody, useNeonServer, useRuntimeConfig,
} from '#imports'

export default defineEventHandler(async <T> (event: H3Event<EventHandlerRequest>): Promise<NeonDataResponse<T>> => {
  try {
    const debug = useRuntimeConfig().public.neonDebugRuntime === true
    if (debug) {
      console.debug('Neon `select` API endpoint invoked')
    }

    const endpoints = useRuntimeConfig().public.neonExposeEndpoints === true
    if (!endpoints) {
      return getForbiddenError('/api/_neon/select')
    }

    const body = await readBody(event)
    if (debug) {
      console.debug('Request body:', body)
    }

    const { select } = useNeonServer()
    return await select<T>({ ...body })
  }
  catch (err) {
    return await parseNeonError('/api/_neon/select', err)
  }
})
