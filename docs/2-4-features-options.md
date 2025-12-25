# Module options

Nuxt Neon can be configured by overriding the default options values using key `neon` inside `nuxt.config.ts`.

## Existing options

Following can be set via `defineNuxtConfig`:

- `neonSSLMode` - allows setting [secure connection mode](https://neon.tech/docs/connect/connect-securely) when constructing the DB connection string by adding `sslmode` parameter to URL. Values can be:
  - `require` (default)
  - `verify-ca`
  - `verify-full`
  - `none` (sslmode is **not** inclued in the connection string)
- `neonRawWarning` - display warning message when using `raw()` SQL wrapper
  - `true` (default)
  - `false`
- `neonDebugSQL` - if true, the SQL query is captured and attached to error response
  - `true`
  - `false` (default)
- `neonDebugSQL` - if true, the SQL query is captured and attached to error response
  - `true`
  - `false` (default)
- `neonDebugRuntime` - if true, extra runtime information is captured and logged
  - `true`
  - `false` (default)
- `neonExposeEndpoints` - if true, Nuxt Neon can be used client-side via exposed API endpoints (**discouraged**)
  - `true`
  - `false` (default)
- `neonExposeRawEndpoint` - if true, `raw()` SQL wrapper can be used client-side via exposed API endpoint (**extra discouraged**)
  - `true`
  - `false` (default)
- `neonAllowedTables` - list of tables allowed for querying
  - comma-separated list of table names (eg. `users,products,orders`)
  - `NEON_PUBLIC` (default) - all user tables
  - `NEON_ALL` (discouraged) - all tables including `pg_*` and `information_schema.*` system tables

Example:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  neon: {
    neonSSLMode: 'verify-full',
    neonRawWarning: false,
    neonDebugSQL: true,
    neonDebugRuntime: true,
    neonExposeEndpoints: true, // discouraged
    neonExposeRawEndpoint: true, // extra discouraged
    neonAllowedTables: ['NEON_ALL'], // discouraged (system tables will be allowed)
  },
  // other configuration
})
```

## As runtime config

Module options can also be passed as Nuxt runtime config variables in `.env` file, eg.:

```
NUXT_PUBLIC_NEON_SSL_MODE=verify-full
NUXT_PUBLIC_NEON_RAW_WARNING=false
NUXT_PUBLIC_NEON_DEBUG_SQL=true
NUXT_PUBLIC_NEON_DEBUG_RUNTIME=true
# discouraged
NUXT_PUBLIC_NEON_EXPOSE_ENDPOINTS=true
# extra discouraged
NUXT_PUBLIC_NEON_EXPOSE_RAW_ENDPOINT=true
# discouraged
NUXT_PUBLIC_NEON_ALLOWED_TABLES=NEON_ALL
```
