// Special test type to verify type imports from module package root are available
// To verify, run "pnpm test:types:module"

import type {
  NeonSSLModeOption,
  NeonWhereType,
  NeonSelectQuery,
  NeonError,
  ModuleOptions,
} from 'nuxt-neon'

const _sslMode: NeonSSLModeOption = 'require'

const where: NeonWhereType = {
  column: 'id',
  operator: '=',
  value: '123',
}

const _query: NeonSelectQuery = {
  columns: 'id',
  from: 'users',
  where,
}

const _error: NeonError = {
  name: 'NuxtNeonServerError',
  source: 'test',
  code: 500,
  message: 'Test error',
}

const _options: ModuleOptions = {
  neonDB: 'test',
  neonSSLMode: 'require',
  neonDebugSQL: false,
  neonDebugRuntime: false,
  neonExposeEndpoints: false,
  neonExposeRawEndpoint: false,
  neonAllowedTables: 'NEON_PUBLIC',
  neonAllowedQueries: undefined,
}
