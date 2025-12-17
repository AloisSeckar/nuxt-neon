import type { H3Event, EventHandlerRequest } from 'h3'
import type { NeonDataType } from '../../utils/neonTypes'
import { getNeonClient } from '../utils/getNeonClient'
import { getForbiddenError, parseNeonClientError } from '../utils/neonErrors'
import { select } from '../utils/neonSQL'
import { defineEventHandler, readBody, useRuntimeConfig } from '#imports'

export default defineEventHandler(async <T> (event: H3Event<EventHandlerRequest>): Promise<NeonDataType<T>> => {
  try {
    const debug = useRuntimeConfig().public.neonDebugRuntime === true
    if (debug) {
      console.debug('Neon `select` API endpoint invoked')
    }

    const endpoints = useRuntimeConfig().public.neonExposeEndpoints === true
    if (!endpoints) {
      return await getForbiddenError('/api/_neon/select')
    }

    const body = await readBody(event)
    if (debug) {
      console.debug('Request body:', body)
    }

    const neon = getNeonClient()

    const results = await select(neon, { ...body })
    return results as Array<T>
  }
  catch (err) {
    return await parseNeonClientError('/api/_neon/select', err)
  }
})
