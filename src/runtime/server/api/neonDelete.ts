import * as v from 'valibot'
import { NeonDeleteQuerySchema, type NeonEditResponse } from '../../shared/types/neon'
import {
  defineEventHandler, getForbiddenError, getValidationError, isNeonEndpointAllowed, parseNeonError,
  readBody, useNeonServer, useRuntimeConfig,
} from '#imports'

export default defineEventHandler(async (event): Promise<NeonEditResponse> => {
  try {
    const debug = useRuntimeConfig().public.neonDebugRuntime === true
    if (debug) {
      console.debug('Neon `delete` API endpoint invoked')
    }

    if (!isNeonEndpointAllowed('DELETE')) {
      return getForbiddenError('/api/_neon/delete')
    }

    const body = await readBody(event)
    if (debug) {
      console.debug('Request body:', body)
    }

    const checkedBody = v.safeParse(NeonDeleteQuerySchema, body)
    if (!checkedBody.success) {
      return getValidationError('/api/_neon/delete', v.summarize(checkedBody.issues))
    }

    const { del } = useNeonServer()
    return await del(checkedBody.output)
  }
  catch (err) {
    return await parseNeonError('/api/_neon/delete', err)
  }
})
