import type { H3Event, EventHandlerRequest } from 'h3'
import * as v from 'valibot'
import { NeonRawQuerySchema, type NeonDataResponse } from '../../shared/types/neon'
import {
  defineEventHandler, getForbiddenError, getValidationError, isNeonEndpointAllowed, parseNeonError,
  readBody, useNeonServer, useRuntimeConfig,
} from '#imports'

export default defineEventHandler(async <T> (event: H3Event<EventHandlerRequest>): Promise<NeonDataResponse<T>> => {
  try {
    const debug = useRuntimeConfig().public.neonDebugRuntime === true
    if (debug) {
      console.debug('Neon `raw` API endpoint invoked')
    }

    if (!isNeonEndpointAllowed('RAW')) {
      return getForbiddenError('/api/_neon/raw')
    }

    const body = await readBody(event)
    if (debug) {
      console.debug('Request body:', body)
    }

    const checkedBody = v.safeParse(NeonRawQuerySchema, body)
    if (!checkedBody.success) {
      return getValidationError('/api/_neon/raw', v.summarize(checkedBody.issues))
    }

    const { raw } = useNeonServer()
    return await raw<T>(checkedBody.output.query)
  }
  catch (err) {
    return await parseNeonError('/api/_neon/raw', err)
  }
})
