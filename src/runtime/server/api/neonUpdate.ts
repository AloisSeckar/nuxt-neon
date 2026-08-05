import * as v from 'valibot'
import { NeonUpdateQuerySchema, type NeonEditResponse } from '../../shared/types/neon'
import {
  defineEventHandler, getForbiddenError, getValidationError, isNeonEndpointAllowed, parseNeonError,
  readBody, useNeonServer, useRuntimeConfig,
} from '#imports'

export default defineEventHandler(async (event): Promise<NeonEditResponse> => {
  try {
    const debug = useRuntimeConfig().public.neonDebugRuntime === true
    if (debug) {
      console.debug('Neon `update` API endpoint invoked')
    }

    if (!isNeonEndpointAllowed('UPDATE')) {
      return getForbiddenError('/api/_neon/update')
    }

    const body = await readBody(event)
    if (debug) {
      console.debug('Request body:', body)
    }

    const checkedBody = v.safeParse(NeonUpdateQuerySchema, body)
    if (!checkedBody.success) {
      return getValidationError('/api/_neon/update', v.summarize(checkedBody.issues))
    }

    const { update } = useNeonServer()
    return await update(checkedBody.output)
  }
  catch (err) {
    return await parseNeonError('/api/_neon/update', err)
  }
})
