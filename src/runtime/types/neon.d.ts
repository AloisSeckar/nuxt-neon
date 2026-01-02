import type { NeonSSLModeOption } from '../shared/types/neon'

export * from '../shared/types/neon'

declare module '@nuxt/schema' {
  interface RuntimeConfig {
    neonHost: string
    neonUser: string
    neonPass: string
    neonDB: string
    neonAllowedTables: string
    neonAllowedQueries?: string
  }

  interface PublicRuntimeConfig {
    neonDB: string
    neonSSLMode: NeonSSLModeOption
    neonDebugSQL: boolean
    neonDebugRuntime: boolean
    neonExposeEndpoints: boolean
    neonExposeRawEndpoint: boolean
  }
}

export {}
