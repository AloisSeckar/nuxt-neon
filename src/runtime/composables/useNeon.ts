import { neon } from '@neondatabase/serverless'
import type { NeonStatusResult } from '../utils/neonTypes'
import { select, insert, update, del } from '../utils/neonSQL'
import { useRuntimeConfig } from '#app'

export function useNeon() {
  const neonConnectionString = buildNeonConnectionString()
  const neonClient = neon(neonConnectionString)

  const neonStatus = async (anonymous: boolean = true, debug: boolean = false): Promise<NeonStatusResult> => {
    const connectionString = buildNeonConnectionString(anonymous)

    let success = false
    let debugInfo = undefined
    await Promise.resolve(neonClient`SELECT 1=1`)
      .then(() => {
        success = true
      })
      .catch((error) => {
        if (debug) {
          debugInfo = error as string
        }
      })

    return {
      connectionString,
      status: success ? 'OK' : 'ERR',
      debugInfo,
    }
  }

  const isOk = async () => {
    return (await neonStatus()).status === 'OK'
  }

  return {
    neonClient,
    // health check probes
    neonStatus,
    isOk,
    // SQL function wrappers
    select,
    insert,
    update,
    del,
  }
}

function buildNeonConnectionString(anonymous: boolean = false) {
  const neonHost = useRuntimeConfig().public.neonHost
  const neonPass = useRuntimeConfig().public.neonPass
  const neonUser = useRuntimeConfig().public.neonUser
  const neonDB = useRuntimeConfig().public.neonDB

  let connectionString = `postgresql://${anonymous ? 'USER' : neonUser}:${anonymous ? 'PASS' : neonPass}@${neonHost}.neon.tech/${neonDB}`

  const sslMode = useRuntimeConfig().public.sslMode
  if (sslMode !== 'none') {
    connectionString += `?sslmode=${sslMode}`
  }

  return connectionString
}
