import type { H3Event, EventHandlerRequest } from 'h3'
import type { NeonDataType } from '../../utils/neonTypes'
import { getNeonClient } from '../utils/getNeonClient'
import { getForbiddenError, parseNeonClientError } from '../utils/neonErrors'
import { NEON_RAW_WARNING, displayRawWarning } from '../../utils/neonWarnings'
import { raw } from '../utils/neonSQL'
import { debugSQLIfAllowed } from '../utils/helpers/debugSQL'
import { defineEventHandler, readBody, useRuntimeConfig } from '#imports'

export default defineEventHandler(async <T> (event: H3Event<EventHandlerRequest>): Promise<NeonDataType<T>> => {
  try {
    const debug = useRuntimeConfig().public.neonDebugRuntime === true
    if (debug) {
      console.debug('Neon `raw` API endpoint invoked')
    }

    const endpoints = useRuntimeConfig().public.neonExposeEndpoints === true
    if (!endpoints) {
      return await getForbiddenError('/api/_neon/raw')
    }

    const body = await readBody(event)
    const statusQuery = body.query === 'SELECT 1=1 as status'

    if (!statusQuery) {
      const rawEndpoint = useRuntimeConfig().public.neonExposeRawEndpoint === true
      if (!rawEndpoint) {
        return await getForbiddenError('/api/_neon/raw', true)
      }
    }

    if (debug) {
      console.debug('Request body:', body)
    }

    const neon = getNeonClient()

    // warning about this method being potentially unsafe
    // skip warning for a harmless health-check triggered by neonStatus() function
    if (displayRawWarning() && body.query !== 'SELECT 1=1 as status') {
      console.warn(NEON_RAW_WARNING)
    }

    debugSQLIfAllowed(body.query)

    // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
    return await raw(neon, body.query)
  }
  catch (err) {
    return await parseNeonClientError('/api/_neon/raw', err)
  }
})
