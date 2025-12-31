import { addImports, addPlugin, addServerHandler, addServerImports, addTypeTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import commonjs from 'vite-plugin-commonjs'
import type { NeonSSLModeOption } from './runtime/utils/neonTypes'

// Module options TypeScript interface definition

export interface ModuleOptions {
  /** Neon database name (your database name) - WILL BE exposed to client-side */
  neonDB: string
  /** SSL mode in connection = `sslmode` driver option (`require` by default) */
  neonSSLMode: NeonSSLModeOption
  /** If true, the SQL query is captured and attached to error response */
  neonDebugSQL: boolean
  /** If true, extra runtime information is captured and logged */
  neonDebugRuntime: boolean
  /** If true, API endpoints are exposed from server-side */
  neonExposeEndpoints: boolean
  /** If true and `neonExposeEndpoints` is also true, API endpoints for `raw` SQL query is exposed from server-side */
  neonExposeRawEndpoint: boolean
  /**
   * Comma-separated list of allowed table names for queries.
   * Empty array would result into all queries being rejected.
   * For raw string values with schema prefixes (eg. `schema.table`), exact same value must be listed.
   * Special values:
   * - `NEON_ALL` = all tables including system tables are allowed (unsafe)
   * - `NEON_PUBLIC` = all user-defined tables are allowed, `pg_*` and `information_schema.*` tables are rejected (default)
   */
  neonAllowedTables: string
  /**
   * Semicolon-separated list of allowed raw SQL queries.
   * Empty array would result into all raw queries being rejected (except health-check).
   * This option is only relevant if `neonExposeRawEndpoint` is set to `true`.
   */
  neonAllowedQueries?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-neon',
    version: '0.7.1',
    configKey: 'neon',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    neonDB: '',
    neonSSLMode: 'require',
    neonDebugSQL: false,
    neonDebugRuntime: false,
    neonExposeEndpoints: false,
    neonExposeRawEndpoint: false,
    neonAllowedTables: 'NEON_PUBLIC',
    neonAllowedQueries: undefined,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.neonHost = '' // pass via .env file
    nuxt.options.runtimeConfig.neonUser = '' // pass via .env file
    nuxt.options.runtimeConfig.neonPass = '' // pass via .env file
    nuxt.options.runtimeConfig.neonDB = '' // pass via .env file
    nuxt.options.runtimeConfig.neonAllowedTables = options.neonAllowedTables
    nuxt.options.runtimeConfig.neonAllowedQueries = options.neonAllowedQueries
    nuxt.options.runtimeConfig.public.neonDB = options.neonDB
    nuxt.options.runtimeConfig.public.neonSSLMode = options.neonSSLMode
    nuxt.options.runtimeConfig.public.neonDebugSQL = options.neonDebugSQL
    nuxt.options.runtimeConfig.public.neonDebugRuntime = options.neonDebugRuntime
    nuxt.options.runtimeConfig.public.neonExposeEndpoints = options.neonExposeEndpoints
    nuxt.options.runtimeConfig.public.neonExposeRawEndpoint = options.neonExposeRawEndpoint

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
        name: 'useNeonClient',
        as: 'useNeonClient',
        from: resolver.resolve('runtime/composables/useNeonClient'),
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
      // Neon DB driver instance
      {
        name: 'useNeonDriver',
        as: 'useNeonDriver',
        from: resolver.resolve('runtime/server/utils/useNeonDriver'),
      },
      // wrapper methods
      {
        name: 'raw',
        as: 'raw',
        from: resolver.resolve('runtime/server/utils/neonSQL'),
      },
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

    // 'sqlstring' only exists as a CommonJS module
    // this should allow it being consumed in ESM runtimes
    nuxt.options.vite ??= {}
    nuxt.options.vite.plugins ??= []
    nuxt.options.vite.plugins.push(commonjs())
    nuxt.options.vite.optimizeDeps ??= {}
    nuxt.options.vite.optimizeDeps.include ??= []
    nuxt.options.vite.optimizeDeps.include.push('sqlstring')

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))
  },
})
