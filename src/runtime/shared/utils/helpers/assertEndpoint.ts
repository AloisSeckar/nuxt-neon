// cannot reference from '#imports' in test files
// so the core logic is placed here, separated from useRuntimeConfig call
import type { NeonEndpointName } from '../../types/neon'

export function isNeonEndpointAllowed(endpoint: NeonEndpointName, allowedEndpoints: string[]): boolean {
  if (allowedEndpoints.includes('NONE')) {
    return false
  }
  if (allowedEndpoints.includes('ALL')) {
    return true
  }
  return allowedEndpoints.includes(endpoint)
}

export function isAnyNeonEndpointAllowed(allowedEndpoints: string[]): boolean {
  return allowedEndpoints.length > 0 && !allowedEndpoints.includes('NONE')
}
