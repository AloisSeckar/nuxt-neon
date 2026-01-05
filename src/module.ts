import {
  addImports, addPlugin,
  addServerHandler, addServerImports, addServerPlugin,
  addTypeTemplate, createResolver, defineNuxtModule,
} from '@nuxt/kit'
import commonjs from 'vite-plugin-commonjs'
import type { NeonSSLModeOption } from './runtime/shared/types/neon'

// re-export types
export type * from './runtime/shared/types/neon'

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
    version: '0.8.2',
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
    neonAllowedQueries: '',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // 1. resolve configuration
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

    // 2. register server API endpoints
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

    // 3. augment #imports
    const neonClient = resolver.resolve('runtime/composables/useNeonClient')
    const neonErrors = resolver.resolve('runtime/shared/utils/neonErrors')
    const neonUtils = resolver.resolve('runtime/shared/utils/neonUtils')
    const neonServer = resolver.resolve('runtime/server/utils/useNeonServer')
    const neonServerDriver = resolver.resolve('runtime/server/utils/useNeonDriver')
    const neonServerErrors = resolver.resolve('runtime/server/utils/neonErrors')

    // client-side #imports
    addImports([
      { name: 'useNeonClient', from: neonClient },
    ])
    addImports([
      { name: 'NEON_ENDPOINTS_DISABLED', from: neonErrors },
      { name: 'NEON_RAW_ENDPOINT_DISABLED', from: neonErrors },
      { name: 'isNeonSuccess', from: neonErrors },
      { name: 'isNeonError', from: neonErrors },
      { name: 'formatNeonError', from: neonErrors },
      { name: 'handleNeonError', from: neonErrors },
    ])
    addImports([
      { name: 'encodeWhereType', from: neonUtils },
      { name: 'encodeWhereString', from: neonUtils },
      { name: 'decodeWhereType', from: neonUtils },
      { name: 'decodeWhereString', from: neonUtils },
    ])

    // server-side #imports
    addServerImports([
      { name: 'useNeonServer', from: neonServer },
    ])
    addServerImports([
      { name: 'useNeonDriver', from: neonServerDriver },
    ])
    addServerImports([
      { name: 'getForbiddenError', from: neonServerErrors },
      { name: 'getGenericError', from: neonServerErrors },
      { name: 'parseNeonError', from: neonServerErrors },
    ])
    addServerImports([
      { name: 'NEON_ENDPOINTS_DISABLED', from: neonErrors },
      { name: 'NEON_RAW_ENDPOINT_DISABLED', from: neonErrors },
      { name: 'isNeonSuccess', from: neonErrors },
      { name: 'isNeonError', from: neonErrors },
      { name: 'formatNeonError', from: neonErrors },
      { name: 'handleNeonError', from: neonErrors },
    ])
    addServerImports([
      { name: 'encodeWhereType', from: neonUtils },
      { name: 'decodeWhereType', from: neonUtils },
    ])

    // 4. export types
    addTypeTemplate({
      src: resolver.resolve('runtime/types/neon.d.ts'),
      filename: 'types/neon.d.ts',
    })

    // 'sqlstring' only exists as a CommonJS module
    // this should allow it being consumed in ESM runtimes
    nuxt.options.vite ||= {}
    nuxt.options.vite.plugins ||= []
    nuxt.options.vite.plugins.push(commonjs())
    nuxt.options.vite.optimizeDeps ||= {}
    nuxt.options.vite.optimizeDeps.include ||= []
    nuxt.options.vite.optimizeDeps.include.push('sqlstring')

    // plugins
    // do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin({
      src: resolver.resolve('./runtime/plugins/check'),
      mode: 'client',
    })

    addServerPlugin(resolver.resolve('./runtime/server/plugins/check'))
  },
})
