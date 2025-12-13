import type { NeonDataType } from '../../utils/neonTypes'
import { getNeonClient } from '../utils/getNeonClient'
import { getGenericError, parseNeonClientError } from '../utils/neonErrors'
import { update } from '../utils/neonSQL'
import { defineEventHandler, readBody, useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event): Promise<NeonDataType<string>> => {
  try {
    const debug = useRuntimeConfig().public.neonDebugRuntime === true
    if (debug) {
      console.debug('Neon `update` API endpoint invoked')
    }

    const body = await readBody(event)
    if (debug) {
      console.debug('Request body:', body)
    }

    const neon = getNeonClient()

    const ret = await update(neon, { ...body })

    // successful UPDATE operation returns []
    if (ret.length === 0) {
      return ['OK']
    }
    else {
      // TODO can we extract more detailed error cause from within the driver response?
      return await getGenericError('/api/_neon/update', 'UPDATE operation failed')
    }
  }
  catch (err) {
    return await parseNeonClientError('/api/_neon/update', err)
  }
})
