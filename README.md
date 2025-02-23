# Nuxt-Neon

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

![nuxt-neon](https://github.com/user-attachments/assets/35d6c6dd-5063-4501-ac2a-86bebec53abf)

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

This module exposes `useNeon()` composable on the client side. Currently two health check probes and six SQL wrappers are available:

```ts
// health check probes
const { isOk, neonStatus } = useNeon()
// SQL wrappers
const { raw, count, select, insert, update, del } = useNeon()
```

That's it! Your Nuxt app is now connected to a Neon database instance ✨

### Health checks

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
- `debug: boolean = false` - if set to `true`, if will append the root cause returned by Neon driver when error occured [**WARNING**: may expose sensitive data! Use with caution]

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

Returns the result of the query (Neon client returns `[]` for INSERT, UPDATE and DELETE) or DB client's erorr message.

**SECURITY WARNING**: the value of `query` cannot be sanitized before being applied to the database, so make sure you **NEVER allow unchecked user input via `raw` handler**. This method is implemented to allow bypassing edge cases that cannot be covered by the following wrappers, that ensure input security more.

Since this method is potentially unsafe, a warning will display by default, if called. If you are 100% sure what you are doing, you can disable the warning by setting `neon.neonRawWarning: false`

#### `count()`

```ts
// async function count(from: string | NeonTableQuery[], where?: string | NeonWhereQuery[])
const { count } = useNeon()
```

This is a special wrapper to allow `select count(*) from` query:
- **from** - definition tables to select from
  - can be either a string with custom value (including more complicated)
  - or an array of [`NeonTableQuery`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/utils/neonTypes.ts#L26) type which will be parsed into a chain of `JOIN` clauses
- **where** - _optional_ definition of filter conditions
  - can be either a string with custom value (including more complicated)
  - or an array of [`NeonWhereQuery`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/utils/neonTypes.ts#L38) type which will be parsed into chain of clauses

It just calls the `select()` wrapper function under the hood, but abstracts users from having to pass `columns = ['count(*)']`.

#### `select()`

```ts
// async function select(columns: string[], from: string | NeonTableQuery[], where?: string | NeonWhereQuery[], order?: string, limit?: number)
const { select } = useNeon()
```

You can perform `SELECT` operation via this function with following parameters:
- **columns** - array of columns you want to retrieve
  - you can also use special `*` for "all columns"
  - you can use SQL functions (e.g. `count(*)`) 
  - if you use aliases in `from` part, you have to provide them together with the column name (e.g. `t.column`)
- **from** - definition tables to select from
  - can be either a string with custom value (including more complicated)
  - or an array of [`NeonTableQuery`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/utils/neonTypes.ts#L26) type which will be parsed into a chain of `JOIN` clauses
- **where** - _optional_ definition of filter conditions
  - can be either a string with custom value (including more complicated)
  - or an array of [`NeonWhereQuery`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/utils/neonTypes.ts#L38) type which will be parsed into chain of clauses
  - if you use aliases in `from` part, you have to provide them together with the column name (e.g. `t.column = 1`)
- **order** - _optional_ criteria for ordering results
  - can be either a string with custom value (including more complicated)
  - or an array of [`NeonOrderQuery`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/utils/neonTypes.ts#L50) type which will be parsed into chain of clauses
  - if you use aliases in `from` part, you have to provide them together with the column name (e.g. `t.column DESC`)
- **limit** - _optional_ limit of results, if more results expected (number)

Returns the result of the SELECT query (Neon client returns `[]` for empty set) or returned erorr message.

#### `insert()`

```ts
// async function insert(table: string, values: string[], columns?: string[])
const { insert } = useNeon()
```

You can perform `INSERT` operation via this with following parameters:
- **table** - DB table to insert into
- **values** - list of values to be inserted, values are being sanitized before applied to database
- **columns** - _optional_ definition of columns for values 
  - if used, `columns.length` must match `values.length`

Returns `'OK'` if query was successfully executed or returned erorr message.

#### `update()`

```ts
// async function update(table: string, values: Record<string, string>, where?: string | NeonWhereQuery[])
const { update } = useNeon()
```
You can perform `UPDATE` operation via this function with following parameters:
- **table** - DB table to be updated
- **values** - list of key-value pairs to be updated, values are being sanitized before applied to database
- **where** - _optional_ definition of filter conditions
  - can be either a string with custom value (including more complicated)
  - or an array of [`NeonWhereQuery`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/utils/neonTypes.ts#L38) type which will be parsed into chain of clauses

#### `del()`

**NOTE:** Because `delete` is not allowed as identifier in TypeScript, the wrapper for SQL DELETE function is available here as `del()`.

```ts
// async function del(table: string, where?: string | NeonWhereQuery[])
const { del } = useNeon()
```
You can perform `DELETE` operation via this function with following parameters:
- **table** - DB table to be deleled from
- **where** - _optional_ definition of filter conditions
  - can be either a string with custom value (including more complicated)
  - or an array of [`NeonWhereQuery`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/utils/neonTypes.ts#L38) type which will be parsed into chain of clauses

Returns `'OK'` if query was successfully executed or returned erorr message.

### Server side

Following server-side util methods are exposed for usage in your server routes:
- `getNeonClient()` - returns an instance on `neonClient` constructed based on config params (connection-string builder is not exposed)
- `count()` - server-side variant of COUNT wrapper, requires `neonClient` to be passed as 1st param
- `select()` - server-side variant of SELECT wrapper, requires `neonClient` to be passed as 1st param
- `insert()` - server-side variant of INSERT wrapper, requires `neonClient` to be passed as 1st param
- `update()` - server-side variant of UPDATE wrapper, requires `neonClient` to be passed as 1st param
- `del()` - server-side variant of DELETE wrapper, requires `neonClient` to be passed as 1st param

## Module options

Nuxt-Neon can be configured by overriding the default options values using key `neon` inside `nuxt.config.ts`.

Existing options:

- `neonSSLMode` - allows setting [secure connection mode](https://neon.tech/docs/connect/connect-securely) when constructing the DB connection string by adding `sslmode` parameter to URL. Values can be:
  - `require` (default)
  - `verify-ca`
  - `verify-full`
  - `none` (sslmode is **not** inclued in the connection string)
- `neonRawWarning` - display warning message when using `raw()` SQL wrapper
  - `true` (default)
  - `false`

Example:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  neon: {
    neonSSLMode: 'verify-full',
    neonRawWarning: false,
  },
  // other configuration
})
```

### As runtime config

Module options can also be passed as Nuxt runtime config variables in `.env` file, eg.:

```
NUXT_PUBLIC_NEON_SSL_MODE=verify-full
NUXT_PUBLIC_NEON_RAW_WARNING=false
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
