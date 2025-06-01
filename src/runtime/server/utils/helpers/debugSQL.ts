import { useRuntimeConfig, useStorage } from '#imports'

export async function debugSQLIfAllowed(sqlString: string) {
  if (useRuntimeConfig().public.neonDebugSQL === true) {
    await useStorage().setItem('neonSQLQuery', sqlString)
  }
}
