import { neon } from '@neondatabase/serverless'
import type { NeonQueryFunction } from '@neondatabase/serverless'
import { useRuntimeConfig } from '#imports'

let neonClient: NeonQueryFunction<boolean, boolean> | null = null
export function getNeonClient() {
  const neonConnectionString = buildNeonConnectionString()
  if (neonClient === null) {
    neonClient = neon(neonConnectionString)
  }
  return neonClient
}

function buildNeonConnectionString() {
  const nuxtConfig = useRuntimeConfig()
  const neonHost = nuxtConfig.neonHost
  const neonPass = nuxtConfig.neonPass
  const neonUser = nuxtConfig.neonUser
  const neonDB = nuxtConfig.neonDB || nuxtConfig.public.neonDB

  let connectionString = `postgresql://${neonUser}:${neonPass}@${neonHost}.neon.tech/${neonDB}`

  const sslMode = nuxtConfig.public.neonSSLMode || nuxtConfig.public.sslMode
  if (sslMode !== 'none') {
    connectionString += `?sslmode=${sslMode}`
  }

  return connectionString
}
