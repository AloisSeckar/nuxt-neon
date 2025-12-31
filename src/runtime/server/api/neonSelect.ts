import type { H3Event, EventHandlerRequest } from 'h3'
import type { NeonDataType } from '../../shared/types/neon'
import {
  defineEventHandler, getForbiddenError, parseNeonClientError,
  readBody, useNeonServer, useRuntimeConfig,
} from '#imports'

export default defineEventHandler(async <T> (event: H3Event<EventHandlerRequest>): Promise<NeonDataType<T>> => {
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
    return await parseNeonClientError('/api/_neon/select', err)
  }
})
