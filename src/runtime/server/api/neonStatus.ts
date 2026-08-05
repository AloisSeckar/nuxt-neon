import type { NeonStatusResponse } from '../../shared/types/neon'
import { defineEventHandler, useNeonServer, useRuntimeConfig } from '#imports'

// always reachable regardless of `neonExposeEndpoints`, since it exposes no data, just a connectivity probe
export default defineEventHandler(async (): Promise<NeonStatusResponse> => {
  const debug = useRuntimeConfig().public.neonDebugRuntime === true
  if (debug) {
    console.debug('Neon `status` API endpoint invoked')
  }

  const { neonStatus } = useNeonServer()
  const result = await neonStatus()

  return {
    database: useRuntimeConfig().public.neonDB, // note this public value might be different from the actual db name or not set at all
    status: result.status,
    debugInfo: debug ? result.debugInfo : '',
  }
})
