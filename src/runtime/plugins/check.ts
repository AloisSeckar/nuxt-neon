import type { Plugin } from '#app'
import { defineNuxtPlugin, isDebugEnabled, useNeonClient } from '#imports'

const plugin: Plugin = defineNuxtPlugin(async (_nuxtApp) => {
  // perform a test connection to the database if requested
  if (isDebugEnabled()) {
    console.debug('Testing provided connection to Neon database - client-side')
    const { isOk } = useNeonClient()
    console.debug(await isOk() ? 'Connection OK (client side)' : 'ERROR')
  }
})

export default plugin
