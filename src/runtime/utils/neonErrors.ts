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
    && 'source' in obj
    && typeof obj['source'] === 'string'
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
  return `Error in ${err.source}: ${err.message}`
}
