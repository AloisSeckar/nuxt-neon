import { neon } from '@neondatabase/serverless'
import { useRuntimeConfig } from '#app'

export function useNeon() {
  const neonHost = useRuntimeConfig().public.neonHost
  const neonPass = useRuntimeConfig().public.neonPass
  const neonUser = useRuntimeConfig().public.neonUser
  const neonDB = useRuntimeConfig().public.neonDB

  const neonClient = neon(`postgresql://${neonUser}:${neonPass}@${neonHost}.neon.tech/${neonDB}?sslmode=require`)

  return {
    neonClient,
  }
}
