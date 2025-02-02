# Nuxt-Neon

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A simple [Nuxt module](https://nuxt.com/modules) alowing smooth integration with [Neon database](https://neon.tech/).

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## How to use?

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add nuxt-neon
```

Provide connection details to your Neon DB instance through a set of Nuxt [runtime config variables](https://nuxt.com/docs/guide/going-further/runtime-config#environment-variables):
- `NUXT_NEON_HOST`
- `NUXT_NEON_USER`
- `NUXT_NEON_PASS`
- `NUXT_PUBLIC_NEON_DB`

Nuxt-Neon will construct a PostgreSQL connection string based on given values:

```ts
`postgresql://${NUXT_NEON_USER}:${NUXT_NEON_PASS}@${NUXT_NEON_HOST}.neon.tech/${NUXT_PUBLIC_NEON_DB}`
```

Settings are used to initialize the [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver) object initialized on the Nuxt server.

NOTE: Sensitive connection data are sealed on Nuxt server. The only public property is the database name.

### `useNeon` composable

This module exposes `useNeon()` composable on the client side. Currently two health check probes and five SQL wrappers are available:

```ts
// health check probes
const { isOk, neonStatus } = useNeon()
// SQL wrappers
const { raw, select, insert, update, del } = useNeon()
```

That's it! Your Nuxt app is now connected to a Neon database instance ✨

### Health check

Current status of the connection can be quickly checked by calling async function `isOk` provided by `useNeon` composable: 

```ts
const { isOk } = useNeon()
```

The return value `true/false` is based on more complex probe function `neonStatus` which is also available:

```ts
const { neonStatus } = useNeon()
```

The test is performed by firing a `SELECT 1=1` query to the current Neon database.

The function takes two optional parameters:
- `anonymous: boolean = true` - if set to `false`, it will disclose database name
- `debug: boolean = false` - if set to `true`, if will append the root cause returned by Neon driver [**WARNING**: may expose sensitive data! Use with caution]

Value returned is a `NeonStatusResult` promise:
- `database: string` - name of the Neon database (hidden, if `anonymous = true`)
- `status: 'OK' | 'ERR'` - `OK` if connection works, `ERR` if error occured
- `debug?: string` - Neon driver error, if `status = 'ERR'` and `debug = true`

### SQL Wrappers

This module offers SQL wrappers that communicate with Nuxt server-side endpoints connected to the native `neonClient`. Currently 5 of them are available.

#### `raw()`

```ts
// async function raw(query: string)
const { raw } = useNeon()
```

This wrapper allows you to perform **ANY** SQL directly.

Returns the result of the query (Neon client returns `[]` for INSERT, UPDATE and DELETE) or returned erorr message.

**SECURITY WARNING**: the value of `query` cannot be sanitized before being applied to the database, so make sure you **NEVER allow unchecked user input via `raw` handler**. This method is implemented to allow bypassing edge cases that cannot be covered by the following wrappers, that ensure input security more.

#### `select()`

```ts
// async function select(columns: string[], from: string[], where?: string[], order?: string, limit?: number)
const { select } = useNeon()
```

You can perform `SELECT` operation via this function with following parameters:
- **neon** - Neon Serverless Client instance obtained from `useNeon()`
- **columns** - array of columns you want to retrieve
  - you can also use special `*` for "all columns"
  - you can use SQL functions (e.g. `count(*)`) 
  - if you need aliases, you have to provide them together with the column name (e.g. `t.column`)
- **from** - array of tables to select from
  - more tables are internally joined with `JOIN`
  - if you need aliases, you have to provide them together with the table name (e.g. `table t`)
- **where** - _optional_ array of select conditions
  - more clauses are internally joined with `AND`
- **order** - _optional_ criteria for ordering results
  - you can include direction (e.g `t.column DESC`)
- **limit** - _optional_ limit, if more results expected

Returns the result of the SELECT query (Neon client returns `[]` for empty set) or returned erorr message.

Inputs are being sanitized before applied to database.

#### `insert()`

```ts
// async function insert(table: string, values: string[], columns?: string[])
const { insert } = useNeon()
```

You can perform `INSERT` operation via this with following parameters:
- **neon** - Neon Serverless Client instance obtained from `useNeon()`
- **table** - DB table to insert into
- **values** - list of values to be inserted
- **columns** - _optional_ definition of columns for values 
  - if used, `columns.length` must match `values.length`

Returns `'OK'` if query was successfully executed or returned erorr message.

Inputs are being sanitized before applied to database.

#### `update()`

```ts
// async function update(table: string, values: Record<string, string>, where?: string[])
const { update } = useNeon()
```
You can perform `UPDATE` operation via this function with following parameters:
- **neon** - Neon Serverless Client instance obtained from `useNeon()`
- **table** - DB table to be updated
- **values** - list of key-value pairs to be updated
- **where** - _optional_ array of limiting conditions
  - more clauses are internally joined with `AND`

Inputs are being sanitized before applied to database.

#### `del()`

**NOTE:** Because `delete` is not allowed as identifier in TypeScript, the wrapper for SQL DELETE function is available here as `del()`.

```ts
// async function del(table: string, where?: string[])
const { del } = useNeon()
```
You can perform `DELETE` operation via this function with following parameters:
- **neon** - Neon Serverless Client instance obtained from `useNeon()`
- **table** - DB table to be deleled from
- **where** - _optional_ array of limiting conditions
  - more clauses are internally joined with `AND`

Returns `'OK'` if query was successfully executed or returned erorr message.

Inputs are being sanitized before applied to database.

## Module options

Nuxt-Neon can be configured by overriding the default options values using key `neon` inside `nuxt.config.ts`.

Existing options:

- `sslMode` - allows setting [secure connection mode](https://neon.tech/docs/connect/connect-securely) when constructing the DB connection string by adding `sslmode` parameter to URL. Values can be:
  - `require` (default)
  - `verify-ca`
  - `verify-full`
  - `none` (sslmode is **not** inclued in the connection string)

Example:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  neon: {
    sslMode: 'verify-full',
  },
  // other configuration
})
```

## See also

- [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver) for the full reference of provided features like the `transaction()` function.

## Contribution

Contributions welcome! Let's make this module better together.

 Contact https://github.com/AloisSeckar for more info.

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-neon/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-neon

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-neon.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npmjs.com/package/nuxt-neon

[license-src]: https://img.shields.io/npm/l/nuxt-neon.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://github.com/AloisSeckar/nuxt-neon/blob/master/LICENSE

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
