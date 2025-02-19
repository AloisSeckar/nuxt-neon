import { defineNuxtModule, addImports, addPlugin, addServerHandler, addServerImports, createResolver } from '@nuxt/kit'
import commonjs from 'vite-plugin-commonjs'
import type { SSLModeOption } from './runtime/utils/neonTypes'

// Module options TypeScript interface definition

export interface ModuleOptions {
  neonHost: string
  neonUser: string
  neonPass: string
  neonDB: string
  neonSSLMode: SSLModeOption
  neonRawWarning: boolean
  sslMode: SSLModeOption
  rawWarning: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-neon',
    version: '0.3.1',
    configKey: 'neon',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    neonHost: '',
    neonUser: '',
    neonPass: '',
    neonDB: '',
    neonSSLMode: 'require',
    neonRawWarning: true,
    sslMode: 'require',
    rawWarning: true,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.neonHost = options.neonHost
    nuxt.options.runtimeConfig.neonUser = options.neonUser
    nuxt.options.runtimeConfig.neonPass = options.neonPass
    nuxt.options.runtimeConfig.public.neonDB = options.neonDB
    nuxt.options.runtimeConfig.public.neonSSLMode = options.neonSSLMode
    nuxt.options.runtimeConfig.public.neonRawWarning = options.neonRawWarning
    nuxt.options.runtimeConfig.public.sslMode = options.sslMode
    nuxt.options.runtimeConfig.public.rawWarning = options.rawWarning

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

    addServerImports([
      {
        name: 'getNeonClient',
        as: 'getNeonClient',
        from: resolver.resolve('runtime/server/utils/getNeonClient'),
      },
      {
        name: 'select',
        as: 'select',
        from: resolver.resolve('runtime/server/utils/neonSQL'),
      },
      {
        name: 'insert',
        as: 'insert',
        from: resolver.resolve('runtime/server/utils/neonSQL'),
      },
      {
        name: 'update',
        as: 'update',
        from: resolver.resolve('runtime/server/utils/neonSQL'),
      },
      {
        name: 'del',
        as: 'del',
        from: resolver.resolve('runtime/server/utils/neonSQL'),
      },
    ])

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
