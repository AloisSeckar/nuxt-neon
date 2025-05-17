import { useRuntimeConfig } from '#imports'

export const NEON_RAW_WARNING = 'nuxt-neon: using `raw()` SQL handler is potentially unsafe! Consider using other methods where inputs are sanitized. Disable this warning using `neon.neonRawWarning: false` or `NUXT_PUBLIC_NEON_RAW_WARNING: false`, if you are confident with your code.'

export function displayRawWarning() {
  return useRuntimeConfig().public.neonRawWarning
}
