// server-side re-export of NeonError-related utils

import type { NeonError } from '../../utils/neonTypes'
import { isNeonSuccess, isNeonError, formatNeonError } from '../../utils/neonErrors'

export {
  isNeonSuccess,
  isNeonError,
  formatNeonError,
}

export function getGenericError(source: string, message: string): NeonError {
  return {
    name: 'NuxtNeonServerError',
    source,
    code: 500,
    message,
  }
}

export function parseNeonClientError(source: string, err: unknown): NeonError {
  const error = err as Error
  const name = error.name
  let message = error.message

  if (name === 'NeonDbError') {
    console.debug('Parsing raw error message from Neon serverless client:')
    console.debug(message)

    const codeInfo = message.match(/HTTP status (\d+)/)
    const code = codeInfo ? Number(codeInfo[1]) : 500

    const jsonStart = message.indexOf('{')
    const jsonEnd = message.lastIndexOf('}') + 1
    const jsonStr = message.slice(jsonStart, jsonEnd)
    message = JSON.parse(jsonStr).message

    return {
      name: 'NuxtNeonServerError',
      source,
      code,
      message,
    }
  }
  else {
    console.debug('Received other error object:')
    console.debug(name, message)

    return getGenericError(source, message)
  }
}
