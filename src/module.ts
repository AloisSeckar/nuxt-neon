import { addImports, addPlugin, addServerHandler, addServerImports, addTypeTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import commonjs from 'vite-plugin-commonjs'
import type { NeonSSLModeOption } from './runtime/utils/neonTypes'

// Module options TypeScript interface definition

export interface ModuleOptions {
  /** Neon database host server (`neon_hostname`) */
  neonHost: string
  /** Neon database user (your account) */
  neonUser: string
  /** Neon database password (your password) */
  neonPass: string
  /** Neon database name (your database name) */
  neonDB: string
  /** SSL mode in connection = `sslmode` driver option (`require` by default) */
  neonSSLMode: NeonSSLModeOption
  /** Display warning when `raw()` wrapper is used (`true` by default) */
  neonRawWarning: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-neon',
    version: '0.5.0',
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
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.neonHost = options.neonHost
    nuxt.options.runtimeConfig.neonUser = options.neonUser
    nuxt.options.runtimeConfig.neonPass = options.neonPass
    nuxt.options.runtimeConfig.neonDB = options.neonDB
    nuxt.options.runtimeConfig.public.neonDB = options.neonDB
    nuxt.options.runtimeConfig.public.neonSSLMode = options.neonSSLMode
    nuxt.options.runtimeConfig.public.neonRawWarning = options.neonRawWarning

    addServerHandler({
      route: '/api/_neon/raw',
      handler: resolver.resolve('runtime/server/api/neonRaw'),
    })
    addServerHandler({
      route: '/api/_neon/count',
      handler: resolver.resolve('runtime/server/api/neonCount'),
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

    addImports([
      // main client-side composable exposing SQL client and wrapper methods
      {
        name: 'useNeon',
        as: 'useNeon',
        from: resolver.resolve('runtime/composables/useNeon'),
      },
      // error-handling utilities
      {
        name: 'isNeonSuccess',
        as: 'isNeonSuccess',
        from: resolver.resolve('runtime/utils/neonErrors'),
      },
      {
        name: 'isNeonError',
        as: 'isNeonError',
        from: resolver.resolve('runtime/utils/neonErrors'),
      },
      {
        name: 'formatNeonError',
        as: 'formatNeonError',
        from: resolver.resolve('runtime/utils/neonErrors'),
      },
    ])

    addServerImports([
      // SQL client instance
      {
        name: 'getNeonClient',
        as: 'getNeonClient',
        from: resolver.resolve('runtime/server/utils/getNeonClient'),
      },
      // wrapper methods
      {
        name: 'count',
        as: 'count',
        from: resolver.resolve('runtime/server/utils/neonSQL'),
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
      // error-handling utilities
      {
        name: 'isNeonSuccess',
        as: 'isNeonSuccess',
        from: resolver.resolve('runtime/server/utils/neonErrors'),
      },
      {
        name: 'isNeonError',
        as: 'isNeonError',
        from: resolver.resolve('runtime/server/utils/neonErrors'),
      },
      {
        name: 'formatNeonError',
        as: 'formatNeonError',
        from: resolver.resolve('runtime/server/utils/neonErrors'),
      },
    ])

    // export types
    addTypeTemplate({
      src: resolver.resolve('runtime/types/neon.d.ts'),
      filename: 'types/neon.d.ts',
    })
    /*
    nuxt.hook('prepare:types', async (options) => {
      options.references.push({ path: resolver.resolve(nuxt.options.buildDir, 'types/neon.d.ts') })
    })
    */

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
