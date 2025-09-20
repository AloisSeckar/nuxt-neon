import { defineNuxtPlugin, useNeon, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin(async (/* nuxtApp */) => {
  // perform a test connection to the database if requested
  if (useRuntimeConfig().public.neonDebugRuntime === true) {
    console.debug('Testing provided connection to Neon database')
    const { isOk } = useNeon()
    console.debug(await isOk() ? 'Connection OK' : 'ERROR')
  }
})
