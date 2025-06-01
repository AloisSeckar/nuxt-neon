import type { NeonError } from '../utils/neonTypes'

/**
 * Helper to verify result of nuxt-neon methods.
 * Internally it is just an inverted call of `isNeonError`.
 *
 * @param obj result to be tested
 * @returns `true` if `obj` is NOT an instance of `NeonError`
 */
export const isNeonSuccess = (obj: unknown): boolean => {
  return !isNeonError(obj)
}

/**
 * Helper to verify result of nuxt-neon methods.
 *
 * @param obj result to be tested
 * @returns `true` if `obj` is an instance of `NeonError`
 */
export const isNeonError = (obj: unknown): boolean => {
  return (
    obj !== null
    && typeof obj === 'object'
    && 'name' in obj
    && (obj['name'] === 'NuxtNeonServerError' || obj['name'] === 'NuxtNeonClientError')
    && 'source' in obj
    && typeof obj['source'] === 'string'
    && 'code' in obj
    && typeof obj['code'] === 'number'
    && 'message' in obj
    && typeof obj['message'] === 'string'
  )
}

/**
 * Helper to print out `NeonError` object in a consistent way.
 *
 * @param err an instance of `NeonError`
 * @returns `string` representation of the error
 */
export const formatNeonError = (err: NeonError): string => {
  return `${err.name} in ${err.source}: ${err.message} (status: ${err.code})`
}

// used 4x in useNeon => introduced to avoid duplication
export function handleNeonError(obj: unknown) {
  const err = obj as NeonError
  console.debug(formatNeonError(err))
  return err
}
