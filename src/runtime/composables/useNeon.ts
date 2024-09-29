import { neon } from '@neondatabase/serverless'
import { useRuntimeConfig } from '#app'

export function useNeon() {
  const neonConnectionString = buildNeonConnectionString()
  const neonClient = neon(neonConnectionString)

  const neonStatus = async (anonymous: boolean = true, debug: boolean = false): Promise<string> => {
    const anonConnectionString = buildNeonConnectionString(anonymous)
    return await Promise.resolve(neonClient`SELECT 1=1`)
      .then(() => `connection to ${anonConnectionString} - OK`)
      .catch(error => `connection to ${anonConnectionString} - ERR${debug ? ` - ${error}` : ''}`)
  }

  return {
    neonClient,
    neonStatus,
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
