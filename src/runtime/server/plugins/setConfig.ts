import type { NitroAppPlugin } from 'nitropack'
import { setNeonScanQueriesEnabled } from '../utils/config/neonConfig'
import { defineNitroPlugin, useRuntimeConfig } from '#imports'

const plugin: NitroAppPlugin = defineNitroPlugin(async (_nitroApp) => {
  // populate configuration so it can be consumed by utility functions
  // without depending on `useRuntimeConfig`
  setNeonScanQueriesEnabled(useRuntimeConfig().neonScanQueries !== false)
})

export default plugin
