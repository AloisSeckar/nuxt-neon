import type { NeonEndpointName } from '../types/neon'
import { isNeonEndpointAllowed as isEndpointAllowed } from './helpers/assertEndpoint'
import { useRuntimeConfig } from '#imports'

function getAllowedEndpoints(): string[] {
  return useRuntimeConfig().public.neonExposeEndpoints?.split(',') || []
}

export function isNeonEndpointAllowed(endpoint: NeonEndpointName): boolean {
  return isEndpointAllowed(endpoint, getAllowedEndpoints())
}
