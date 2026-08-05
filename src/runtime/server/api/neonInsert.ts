import * as v from 'valibot'
import { NeonInsertQuerySchema, type NeonEditResponse } from '../../shared/types/neon'
import {
  defineEventHandler, getForbiddenError, getValidationError, isNeonEndpointAllowed, parseNeonError,
  readBody, useNeonServer, useRuntimeConfig,
} from '#imports'

export default defineEventHandler(async (event): Promise<NeonEditResponse> => {
  try {
    const debug = useRuntimeConfig().public.neonDebugRuntime === true
    if (debug) {
      console.debug('Neon `insert` API endpoint invoked')
    }

    if (!isNeonEndpointAllowed('INSERT')) {
      return getForbiddenError('/api/_neon/insert')
    }

    const body = await readBody(event)
    if (debug) {
      console.debug('Request body:', body)
    }

    const checkedBody = v.safeParse(NeonInsertQuerySchema, body)
    if (!checkedBody.success) {
      return getValidationError('/api/_neon/insert', v.summarize(checkedBody.issues))
    }

    const { insert } = useNeonServer()
    return await insert(checkedBody.output)
  }
  catch (err) {
    return await parseNeonError('/api/_neon/insert', err)
  }
})
