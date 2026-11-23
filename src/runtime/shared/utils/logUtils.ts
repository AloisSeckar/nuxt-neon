import { useRuntimeConfig } from '#imports'

export function isDebugEnabled(): boolean {
  return useRuntimeConfig().public.neonDebugRuntime === true
}
