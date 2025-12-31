import type { NeonDataType } from '../../utils/neonTypes'
import { getForbiddenError, parseNeonClientError } from '../utils/neonErrors'
import { count } from '../utils/neonSQL'
import { defineEventHandler, readBody, useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event): Promise<NeonDataType<number>> => {
  try {
    const debug = useRuntimeConfig().public.neonDebugRuntime === true
    if (debug) {
      console.debug('Neon `count` API endpoint invoked')
    }

    const endpoints = useRuntimeConfig().public.neonExposeEndpoints === true
    if (!endpoints) {
      return getForbiddenError('/api/_neon/count')
    }

    const body = await readBody(event)
    if (debug) {
      console.debug('Request body:', body)
    }

    // result is returned as [ { count: 'n' } ]
    const countData = await count({ ...body }) as { count: number }[]
    // extract only the number
    // or return -1 if response cannot be parsed
    return [countData?.at(0)?.count || -1]
  }
  catch (err) {
    return await parseNeonClientError('/api/_neon/count', err)
  }
})
