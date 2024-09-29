import { neon } from '@neondatabase/serverless'
import { useRuntimeConfig } from '#app'

export function useNeon() {
  const neonClient = neon(buildNeonConnectionString())

  return {
    neonClient,
  }
}

function buildNeonConnectionString() {
  const neonHost = useRuntimeConfig().public.neonHost
  const neonPass = useRuntimeConfig().public.neonPass
  const neonUser = useRuntimeConfig().public.neonUser
  const neonDB = useRuntimeConfig().public.neonDB

  let connectionString = `postgresql://${neonUser}:${neonPass}@${neonHost}.neon.tech/${neonDB}`

  const sslMode = useRuntimeConfig().public.sslMode
  if (sslMode !== 'none') {
    connectionString += `?sslmode=${sslMode}`
  }

  return connectionString
}
