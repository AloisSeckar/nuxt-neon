# Module options

Nuxt Neon can be configured by a set of options.

Options can be set either by overriding the default options values using key `neon` inside `nuxt.config.ts`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  neon: {
    neonSSLMode: 'verify-full',
    neonDebugSQL: true,
    neonDebugRuntime: true,
    // other module overrides
  },
  // other configuration
})
```

Or via env variables that are mapped into Nuxt [runtime config](https://nuxt.com/docs/4.x/guide/going-further/runtime-config):

```sh [.env]
NUXT_PUBLIC_NEON_SSL_MODE=verify-full
NUXT_PUBLIC_NEON_DEBUG_SQL=true
NUXT_PUBLIC_NEON_DEBUG_RUNTIME=true
# other module overrides
```

## Database connection

Following set of server-side only variables is used to construct the PostgreSQL connection string into your Neon database:

```sh [.env]
NUXT_NEON_HOST=your-neon-host
NUXT_NEON_USER=your-neon-user
NUXT_NEON_PASS=your-neon-password
NUXT_NEON_DB=your-neon-database
```

Those values can **only be passed as env variables** and **cannot** be set via module options in `nuxt.config.ts`. This should prevent you from being tempted to hardcode them into source code and accidentaly leak them by pushing into Git repository.

> [!WARNING]
> Of course, you must also avoid to commit your `.env` file with sensitive values into Git repository!

## Server-side options

Following options only affect server-side behavior and the values are not exposed to client-side.

### `neonAllowedTables`

Comma-separated list of tables allowed for querying. By default, it is allowed to query all user-defined tables. You may either lift the restriction imposed on system tables or limit access only to specified list of tables.

**Possible values:**

- `NEON_PUBLIC` - all user-defined tables (default)
- `NEON_ALL` - all tables including `pg_*` and `information_schema.*` system tables
- comma-separated list of table names (eg. `products,orders`)

**Special usage notes:**

- special values **can** be combined with specific table names via comma-separation (eg. `NEON_PUBLIC,pg_database,information_schema.sql_features`)
- adding a system table will override `NEON_PUBLIC` for this particular table
- if schema is used for a table (see [here](2-6-features-types.md#select-from)), allowed value must contain it exactly (eg. `schema.products,schema.orders`)

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  neon: {
    neonAllowedTables: 'products,orders',
  },
})
```

```sh [.env]
NUXT_NEON_ALLOWED_TABLES='products,orders'
```

### `neonAllowedQueries`

Semicolon-separatedlist of SQL queries allowed to be executed via [`raw`](2-2-features-server.md#raw) SQL wrapper.

**Possible values:**

- `''` - no raw queries are allowed (default)
- `NEON_ALL` - any valid SQL query can be executed (**extra discouraged**)
- semicolon-separated list of raw SQL queries (eg. `SELECT * FROM users;SELECT * FROM products`)

**Special usage notes:**

- This option is only relevant if `neonExposeRawEndpoint` is `true`. Otherwise the raw endpoint is blocked completely.

> [!WARNING]
> You should only use this as a last resort for use-cases that cannot be covered by other SQL wrappers while requesting and waiting for the fix.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  neon: {
    neonAllowedQueries: 'SELECT * FROM users;SELECT * FROM products',
  },
})
```

```sh [.env]
NUXT_NEON_ALLOWED_QUERIES='SELECT * FROM users;SELECT * FROM products'
```

## Public options

Following options are available at both server and client side.

### `neonDB`

Neon database name (your database name) which **WILL BE** exposed to client-side.

**Possible values:**

- string (eg. `my_database`)

**Special usage notes:**

- this will allow to disclose your database name on client side, which you might or might not want to do
- it will appear in result of [`neonStatus`](2-2-features-server.md#neonStatus) once set
- when building DB connection string, module uses `NUXT_NEON_DB` env value and **NOT** this
- the value may differ from the actual `NUXT_NEON_DB` env value

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  neon: {
    neonDB: 'SELECT * FROM users;SELECT * FROM products',
  },
})
```

```sh [.env]
NUXT_PUBLIC_NEON_DB='my_database'
```

### `neonSSLMode`

Allows setting [secure connection mode](https://neon.tech/docs/connect/connect-securely) when constructing the DB connection string by adding `sslmode` parameter to 

**Possible values:**

- `require` (default)
- `verify-ca`
- `verify-full`
- `none` (sslmode is **not** inclued in the connection string)

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  neon: {
    neonSSLMode: 'verify-ca',
  },
})
```

```sh [.env]
NUXT_PUBLIC_NEON_SSL_MODE='verify-ca'
```

### `neonDebugSQL`

If set to `true`, the actual SQL query produced is captured and attached to error responses.

**Possible values:**

- `true`
- `false` (default)

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  neon: {
    neonDebugSQL: true,
  },
})
```

```sh [.env]
NUXT_PUBLIC_NEON_DEBUG_SQL=true
```

### `neonDebugRuntime`

If set to `true`, extra runtime information is captured and logged.

**Possible values:**

- `true`
- `false` (default)

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  neon: {
    neonDebugRuntime: true,
  },
})
```

```sh [.env]
NUXT_PUBLIC_NEON_DEBUG_RUNTIME=true
```

### `neonExposeEndpoints`

If set to `true`, Nuxt Neon can be used client-side via exposed API endpoints.

> [!DANGER]
> Exposing your connection client-side is **DANGEROUS** and highly **DISCOURAGED**.
> 
> See [here](2-1-features.md#client-side-features-🥶) for more details.

**Possible values:**

- `true`
- `false` (default)

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  neon: {
    neonExposeEndpoints: true,
  },
})
```

```sh [.env]
NUXT_PUBLIC_NEON_EXPOSE_ENDPOINTS=true
```

### `neonExposeRawEndpoint`

If set to `true`, [`raw` SQL wrapper](2-2-features-server.md#raw) can be used.

> [!DANGER]
> Allowing any valid SQL query to run directly is **DANGEROUS** and highly **DISCOURAGED**.
> 
> See [here](2-2-features-server.md#raw) for more details.

**Possible values:**

- `true`
- `false` (default)

**Special usage notes:**

- even if `neonExposeEndpoints` is `false`, setting this to `true` will allow `raw` queries server-side
- even if `neonExposeEndpoints` is `true`, you still need to set this one to `true` as well to allow `raw` queries client-side
- you still need to set allowed queries via [`neonAllowedQueries`](#neonallowedqueries) before running raw queries

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  neon: {
    neonExposeRawEndpoint: true,
  },
})
```

```sh [.env]
NUXT_PUBLIC_NEON_EXPOSE_RAW_ENDPOINT=true
```
