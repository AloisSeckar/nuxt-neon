import { defineNuxtPlugin, useNeonClient, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin(async (_nuxtApp) => {
  // only relevant, if db is exposed to client-side
  if (useRuntimeConfig().public.neonExposeEndpoints !== true) {
    return
  }
  // perform a test connection to the database if requested
  if (useRuntimeConfig().public.neonDebugRuntime === true) {
    console.debug('Testing provided connection to Neon database - client-side')
    const { isOk } = useNeonClient()
    console.debug(await isOk() ? 'Connection OK (client side)' : 'ERROR')
  }
})
