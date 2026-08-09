import type { NitroAppPlugin } from 'nitropack'
import { defineNitroPlugin, useNeonServer, useRuntimeConfig } from '#imports'

const plugin: NitroAppPlugin = defineNitroPlugin(async (_nitroApp) => {
  // perform a test connection to the database if requested
  if (useRuntimeConfig().public.neonDebugRuntime === true) {
    console.debug('Testing provided connection to Neon database - server-side')
    const { isOk } = useNeonServer()
    console.debug(await isOk() ? 'Connection OK (server side)' : 'ERROR')
  }
})

export default plugin
