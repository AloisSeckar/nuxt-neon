import type { NeonDataType } from '../../utils/neonTypes'
import { getForbiddenError, getGenericError, parseNeonClientError } from '../utils/neonErrors'
import { defineEventHandler, readBody, useNeonServer, useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event): Promise<NeonDataType<string>> => {
  try {
    const debug = useRuntimeConfig().public.neonDebugRuntime === true
    if (debug) {
      console.debug('Neon `delete` API endpoint invoked')
    }

    const endpoints = useRuntimeConfig().public.neonExposeEndpoints === true
    if (!endpoints) {
      return getForbiddenError('/api/_neon/delete')
    }

    const body = await readBody(event)
    if (debug) {
      console.debug('Request body:', body)
    }

    const { del } = useNeonServer()
    const ret = await del({ ...body })

    // successful DELETE operation returns []
    if (ret.length === 0) {
      return ['OK']
    } else {
      console.debug(ret)
      // TODO can we extract more detailed error cause from within the driver response?
      return await getGenericError('/api/_neon/delete', 'DELETE operation failed')
    }
  }
  catch (err) {
    return await parseNeonClientError('/api/_neon/delete', err)
  }
})
