import type { H3Event, EventHandlerRequest } from 'h3'
import type { NeonDataType } from '../../utils/neonTypes'
import { getForbiddenError, parseNeonClientError } from '../utils/neonErrors'
import { defineEventHandler, readBody, useNeonServer, useRuntimeConfig } from '#imports'

export default defineEventHandler(async <T> (event: H3Event<EventHandlerRequest>): Promise<NeonDataType<T>> => {
  try {
    const debug = useRuntimeConfig().public.neonDebugRuntime === true
    if (debug) {
      console.debug('Neon `raw` API endpoint invoked')
    }

    const endpoints = useRuntimeConfig().public.neonExposeEndpoints === true
    if (!endpoints) {
      return getForbiddenError('/api/_neon/raw')
    }

    const body = await readBody(event)
    if (debug) {
      console.debug('Request body:', body)
    }

    const { raw } = useNeonServer()
    return await raw(body.query)
  }
  catch (err) {
    return await parseNeonClientError('/api/_neon/raw', err)
  }
})
