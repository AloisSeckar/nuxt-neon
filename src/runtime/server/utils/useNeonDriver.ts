import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
import { useRuntimeConfig } from '#imports'

export const useNeonDriver = () => {
  if (import.meta.client) {
    throw new Error('useNeonDriver can only be used within Nuxt server-side context')
  }

  let neonClient: NeonQueryFunction<boolean, boolean> | null = null
  if (neonClient === null) {
    if (useRuntimeConfig().public.neonDebugRuntime === true) {
      console.debug('Creating new Neon client instance')
    }
    const neonConnectionString = buildNeonConnectionString()
    neonClient = neon(neonConnectionString)
  }

  return {
    // keep the exported name consistent with function from `@neondatabase/serverless` package
    neon: neonClient,
  }
}

function buildNeonConnectionString() {
  const nuxtConfig = useRuntimeConfig()
  const neonHost = nuxtConfig.neonHost
  const neonPass = nuxtConfig.neonPass
  const neonUser = nuxtConfig.neonUser
  const neonDB = nuxtConfig.neonDB || nuxtConfig.public.neonDB

  let connectionString = `postgresql://${neonUser}:${neonPass}@${neonHost}.neon.tech/${neonDB}`

  const sslMode = nuxtConfig.public.neonSSLMode
  if (sslMode !== 'none') {
    connectionString += `?sslmode=${sslMode}`
  }

  return connectionString
}
