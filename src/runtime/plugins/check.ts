import type { Plugin } from '#app'
import { defineNuxtPlugin, useNeonClient, useRuntimeConfig } from '#imports'

const plugin: Plugin = defineNuxtPlugin(async (_nuxtApp) => {
  // perform a test connection to the database if requested
  if (useRuntimeConfig().public.neonDebugRuntime === true) {
    console.debug('Testing provided connection to Neon database - client-side')
    const { isOk } = useNeonClient()
    console.debug(await isOk() ? 'Connection OK (client side)' : 'ERROR')
  }
})

export default plugin
