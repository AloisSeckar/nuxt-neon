import type { NeonEndpointName } from '../types/neon'
import { isNeonEndpointAllowed as isEndpointAllowed } from './helpers/assertEndpoint'
import { useRuntimeConfig } from '#imports'

function getAllowedEndpoints(): string[] {
  const exposeEndpoints = useRuntimeConfig().public.neonExposeEndpoints

  if (typeof exposeEndpoints !== 'string') {
    return []
  }

  return exposeEndpoints?.split(',') || []
}

export function isNeonEndpointAllowed(endpoint: NeonEndpointName): boolean {
  return isEndpointAllowed(endpoint, getAllowedEndpoints())
}
