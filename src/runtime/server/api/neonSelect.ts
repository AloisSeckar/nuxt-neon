import type { H3Event, EventHandlerRequest } from 'h3'
import * as v from 'valibot'
import { NeonSelectQuerySchema, type NeonDataResponse } from '../../shared/types/neon'
import {
  defineEventHandler, getForbiddenError, getValidationError, isNeonEndpointAllowed, parseNeonError,
  readBody, useNeonServer, useRuntimeConfig,
} from '#imports'

export default defineEventHandler(async <T> (event: H3Event<EventHandlerRequest>): Promise<NeonDataResponse<T>> => {
  try {
    const debug = useRuntimeConfig().public.neonDebugRuntime === true
    if (debug) {
      console.debug('Neon `select` API endpoint invoked')
    }

    if (!isNeonEndpointAllowed('SELECT')) {
      return getForbiddenError('/api/_neon/select')
    }

    const body = await readBody(event)
    if (debug) {
      console.debug('Request body:', body)
    }

    const checkedBody = v.safeParse(NeonSelectQuerySchema, body)
    if (!checkedBody.success) {
      return getValidationError('/api/_neon/select', v.summarize(checkedBody.issues))
    }

    const { select } = useNeonServer()
    return await select<T>(checkedBody.output)
  }
  catch (err) {
    return await parseNeonError('/api/_neon/select', err)
  }
})
