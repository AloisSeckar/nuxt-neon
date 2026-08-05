import type { NeonEndpointName } from '../types/neon'
import {
  isNeonEndpointAllowed as isEndpointAllowed,
  isAnyNeonEndpointAllowed as isAnyEndpointAllowed,
} from './helpers/assertEndpoint'
// this only works in runtime => actual logic is moved into helper functions
import { useRuntimeConfig } from '#imports'

function getAllowedEndpoints(): string[] {
  console.log('Allowed endpoints:', useRuntimeConfig().public.neonExposeEndpoints)
  return useRuntimeConfig().public.neonExposeEndpoints?.split(',') || []
}

export function isNeonEndpointAllowed(endpoint: NeonEndpointName): boolean {
  return isEndpointAllowed(endpoint, getAllowedEndpoints())
}

export function isAnyNeonEndpointAllowed(): boolean {
  return isAnyEndpointAllowed(getAllowedEndpoints())
}
