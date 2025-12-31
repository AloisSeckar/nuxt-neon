import type { NeonDataType } from '../../shared/types/neon'
import {
  defineEventHandler, getForbiddenError, getGenericError, parseNeonClientError,
  readBody, useNeonServer, useRuntimeConfig,
} from '#imports'

export default defineEventHandler(async (event): Promise<NeonDataType<string>> => {
  try {
    const debug = useRuntimeConfig().public.neonDebugRuntime === true
    if (debug) {
      console.debug('Neon `insert` API endpoint invoked')
    }

    const endpoints = useRuntimeConfig().public.neonExposeEndpoints === true
    if (!endpoints) {
      return getForbiddenError('/api/_neon/insert')
    }

    const body = await readBody(event)
    if (debug) {
      console.debug('Request body:', body)
    }

    const { insert } = useNeonServer()
    const ret = await insert({ ...body })

    // successful INSERT operation returns []
    if (ret.length === 0) {
      return ['OK']
    } else {
      console.debug(ret)
      // TODO can we extract more detailed error cause from within the driver response?
      return await getGenericError('/api/_neon/insert', 'INSERT operation failed')
    }
  }
  catch (err) {
    return await parseNeonClientError('/api/_neon/insert', err)
  }
})
