import type { NeonCountResponse } from '../../shared/types/neon'
import {
  defineEventHandler, getForbiddenError, isNeonEndpointAllowed, parseNeonError,
  readBody, useNeonServer, useRuntimeConfig,
} from '#imports'

export default defineEventHandler(async (event): Promise<NeonCountResponse> => {
  try {
    const debug = useRuntimeConfig().public.neonDebugRuntime === true
    if (debug) {
      console.debug('Neon `count` API endpoint invoked')
    }

    if (!isNeonEndpointAllowed('COUNT')) {
      return getForbiddenError('/api/_neon/count')
    }

    const body = await readBody(event)
    if (debug) {
      console.debug('Request body:', body)
    }

    const { count } = useNeonServer()
    return await count({ ...body })
  }
  catch (err) {
    return await parseNeonError('/api/_neon/count', err)
  }
})
