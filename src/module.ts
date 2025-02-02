import { defineNuxtModule, addImports, addPlugin, addServerHandler, createResolver } from '@nuxt/kit'
import commonjs from 'vite-plugin-commonjs'
import type { SSLModeOption } from './runtime/utils/neonTypes'

// Module options TypeScript interface definition

export interface ModuleOptions {
  neonHost: string
  neonUser: string
  neonPass: string
  neonDB: string
  sslMode: SSLModeOption
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-neon',
    version: '0.3.0',
    configKey: 'neon',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    neonHost: '',
    neonUser: '',
    neonPass: '',
    neonDB: '',
    sslMode: 'require',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.neonHost = options.neonHost
    nuxt.options.runtimeConfig.neonUser = options.neonUser
    nuxt.options.runtimeConfig.neonPass = options.neonPass
    nuxt.options.runtimeConfig.public.neonDB = options.neonDB
    nuxt.options.runtimeConfig.public.sslMode = options.sslMode

    addServerHandler({
      route: '/api/_neon/raw',
      handler: resolver.resolve('runtime/server/api/neonRaw'),
    })
    addServerHandler({
      route: '/api/_neon/select',
      handler: resolver.resolve('runtime/server/api/neonSelect'),
    })
    addServerHandler({
      route: '/api/_neon/insert',
      handler: resolver.resolve('runtime/server/api/neonInsert'),
    })
    addServerHandler({
      route: '/api/_neon/update',
      handler: resolver.resolve('runtime/server/api/neonUpdate'),
    })
    addServerHandler({
      route: '/api/_neon/delete',
      handler: resolver.resolve('runtime/server/api/neonDelete'),
    })

    addImports({
      name: 'useNeon',
      as: 'useNeon',
      from: resolver.resolve('runtime/composables/useNeon'),
    })

    // 'sqlstring' only exists as a CommonJS module
    // this should allow it being consumed in ESM runtimes
    nuxt.hook('vite:extendConfig', (config) => {
      config.plugins = config.plugins || []
      config.plugins.push(commonjs())
      config.optimizeDeps = config.optimizeDeps || {}
      config.optimizeDeps.include = config.optimizeDeps.include || []
      config.optimizeDeps.include.push('sqlstring')
    })

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))
  },
})
