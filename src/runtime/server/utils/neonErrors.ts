// server-side re-export of NeonError-related utils

import type { NeonError } from '../../utils/neonTypes'
import { isNeonSuccess, isNeonError, formatNeonError } from '../../utils/neonErrors'
import { useRuntimeConfig, useStorage } from '#imports'

export {
  isNeonSuccess,
  isNeonError,
  formatNeonError,
}

export async function getGenericError(source: string, message: string): Promise<NeonError> {
  return {
    name: 'NuxtNeonServerError',
    source,
    code: 500,
    message,
    sql: await getSQLIfAllowed(),
  }
}

export async function parseNeonClientError(source: string, err: unknown): Promise<NeonError> {
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
    if (jsonStr) {
      message = JSON.parse(jsonStr).message
    }

    return {
      name: 'NuxtNeonServerError',
      source,
      code,
      message,
      sql: await getSQLIfAllowed(),
    }
  }
  else {
    console.debug('Received other error object:')
    console.debug(name, message)

    return await getGenericError(source, message)
  }
}

async function getSQLIfAllowed(): Promise<string | undefined> {
  if (useRuntimeConfig().public.neonDebugSQL) {
    return await useStorage().getItem('neonSQLQuery') as string
  }
  return undefined
}
