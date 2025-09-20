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
- `NUXT_NEON_DB`

For database name, you can alternatively set:
- `NUXT_PUBLIC_NEON_DB`

Note this will allow to disclose your database name on client side, which you might or might not want to do. If both env variables are set, `NUXT_NEON_DB` is always used for the actual connection string, but value of `NUXT_PUBLIC_NEON_DB` becomes available on client side.

Nuxt-Neon will construct a PostgreSQL connection string based on given values:

```ts
`postgresql://${NUXT_NEON_USER}:${NUXT_NEON_PASS}@${NUXT_NEON_HOST}.neon.tech/${NUXT[_PUBLIC]NEON_DB}`
```

Settings are used to initialize the [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver) object initialized on the Nuxt server.

NOTE: Sensitive connection data are sealed on Nuxt server. The only public property might be the database name (if you pick the public variant).

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
// async (): Promise<boolean>
const { isOk } = useNeon()
```

The return value `true/false` is based on more complex probe function `neonStatus` which is also available:

```ts
// async (anonymous: boolean = true, debug: boolean = false): Promise<NeonStatusResult>
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
// async <T> (query: string): Promise<Array<T> | NeonError>
const { raw } = useNeon()
```

This wrapper allows you to perform **ANY** SQL directly.

Returns the result of the query (Neon client returns `[]` for INSERT, UPDATE and DELETE) or DB client's erorr message. Generic casting can be used for type-hint (`raw<T>()`).

**SECURITY WARNING**: the value of `query` cannot be sanitized before being applied to the database, so make sure you **NEVER allow unchecked user input via `raw` handler**. This method is implemented to allow bypassing edge cases that cannot be covered by the following wrappers, that ensure input security more.

Since this method is potentially unsafe, a warning will display by default, if called. If you are 100% sure what you are doing, you can disable the warning by setting `neon.neonRawWarning: false`

#### `count()`

```ts
// async (from: string | NeonTableObject | NeonTableObject[], where?: string | NeonWhereObject | NeonWhereObject[]): Promise<number | NeonError>
const { count } = useNeon()
```

This is a special wrapper to allow `select count(*) from` query:
- **from** - definition of table(s) to select from
  - can be either a string with custom value (including more complicated)
  - or an instance (or array) of [`NeonTableObject`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/utils/neonTypes.ts#L45) type which will be parsed into a chain of `JOIN` clauses
- **where** - _optional_ definition of filter conditions
  - can be either a string with custom value (including more complicated)
  - oran instance (or array) of [`NeonWhereObject`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/utils/neonTypes.ts#L65) type which will be parsed into chain of clauses

It just calls the `select()` wrapper function under the hood, but abstracts users from having to pass `columns = ['count(*)']`.

#### `select()`

```ts
// async <T> (columns: string | string[] | NeonColumnObject | NeonColumnObject[], from: string | NeonTableObject | NeonTableObject[], where?: string | NeonWhereObject | NeonWhereObject[], order?: string | NeonOrderObject | NeonOrderObject[], limit?: number, group?: string | string[] | NeonColumnObject | NeonColumnObject[], having?: string | NeonWhereObject | NeonWhereObject[]): Promise<Array<T> | NeonError>
const { select } = useNeon()
```

You can perform `SELECT` operation via this function with following parameters:
- **columns** - array of columns you want to retrieve
  - can be a string or array of strings
  - you can use special `*` for "all columns"
  - you can also use SQL functions (e.g. `count(*)`) 
  - if you use aliases in `from` part, you can to provide them together with the column name (e.g. `t.column`)
  - or an instance (or array) of [`NeonColumnObject`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/utils/neonTypes.ts#L37) type which can handle `alias` as well
- **from** - definition of table(s) to select from
  - can be either a string with custom value (including more complicated)
  - or an instance (or array) of [`NeonTableObject`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/utils/neonTypes.ts#L45) type which will (usually) be parsed into a chain of `JOIN` clauses
  - the `JOIN` clause is not required and can be substituted with adequate `WHERE` condition(s), however, due to current API limitations, such clause(s) need to be passed in as a raw string (e.g. `p1.id = p2.id`)
- **where** - _optional_ definition of filter conditions
  - can be either a string with custom value (including more complicated)
  - or an instance (or array) of [`NeonWhereObject`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/utils/neonTypes.ts#L65) type which will be parsed into chain of clauses
  - if you use aliases in `from` part, you have to provide them together with the column name (e.g. `t.column = 1`)
- **order** - _optional_ criteria for ordering results
  - can be either a string with custom value (including more complicated)
  - or an instance (or array) of [`NeonOrderObject`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/utils/neonTypes.ts#L82) type which will be parsed into chain of clauses
  - if you use aliases in `from` part, you have to provide them together with the column name (e.g. `t.column DESC`)
- **limit** - _optional_ limit of results, if more results expected (number)
- **group** - _optional_ definition for GROUP BY aggregation clause
- **having** - _optional_ definition for HAVING aggregation critera clause

Returns the result of the SELECT query (Neon client returns `[]` for empty set) or returned erorr message. Generic casting can be used for type-hint (`select<T>()`).

#### `insert()`

```ts
// async (table: string | NeonTableObject, values: Record<string, string> | Record<string, string>[]): Promise<string | NeonError>
const { insert } = useNeon()
```

You can perform `INSERT` operation via this with following parameters:
- **table** - DB table to insert into
- **values** - list of key-value pairs to be updated, values are being sanitized before applied to database. If you intend to enter more than one row at once, you can also pass an array of arguments.

Returns `'OK'` if query was successfully executed or returned erorr message.

Currently, `INSERT` is limited to one row at the time.

#### `update()`

```ts
// sync (table: string | NeonTableObject, values: Record<string, string>, where?: string | NeonWhereObject | NeonWhereObject[]): Promise<string | NeonError>
const { update } = useNeon()
```
You can perform `UPDATE` operation via this function with following parameters:
- **table** - DB table to be updated
- **values** - list of key-value pairs to be updated, values are being sanitized before applied to database
- **where** - _optional_ definition of filter conditions
  - can be either a string with custom value (including more complicated)
  - or an instance (or array) of [`NeonWhereObject`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/utils/neonTypes.ts#L65) type which will be parsed into chain of clauses

#### `del()`

**NOTE:** Because `delete` is not allowed as identifier in TypeScript, the wrapper for SQL DELETE function is available here as `del()`.

```ts
// async (table: string | NeonTableObject, where?: string | NeonWhereObject | NeonWhereObject[]): Promise<string | NeonError>
const { del } = useNeon()
```
You can perform `DELETE` operation via this function with following parameters:
- **table** - DB table to be deleled from
- **where** - _optional_ definition of filter conditions
  - can be either a string with custom value (including more complicated)
  - or an instance (or array) of [`NeonWhereObject`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/utils/neonTypes.ts#L65) type which will be parsed into chain of clauses

Returns `'OK'` if query was successfully executed or returned erorr message.

### Server side

Following server-side util methods are exposed for usage in your server routes:
- `getNeonClient()` - returns an instance on `neonClient` constructed based on config params (connection-string builder is not exposed)
- `count()` - server-side variant of COUNT wrapper, requires `neonClient` to be passed as 1st param
- `select()` - server-side variant of SELECT wrapper, requires `neonClient` to be passed as 1st param
- `insert()` - server-side variant of INSERT wrapper, requires `neonClient` to be passed as 1st param
- `update()` - server-side variant of UPDATE wrapper, requires `neonClient` to be passed as 1st param
- `del()` - server-side variant of DELETE wrapper, requires `neonClient` to be passed as 1st param

Server-side wrappers return promise of `NeonDriverResult`, which is a type derived from the underlaying Neon Serverless Driver. As of now, the results are opinionated to [default settings](https://neon.tech/docs/serverless/serverless-driver#neon-function-configuration-options). 

### Error handling

When an error is occured and caught within the module, an instance of `NeonError` is returned instead of expected data. 

Utility functions `isNeonSuccess(obj: unknown): boolean` and `isNeonError(obj: unknown): boolean` can be used to verify the results. 

Utility `formatNeonError(err: NeonError): string` can be used to print out error data in a consistent way.

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
- `neonDebugSQL` - if true, the SQL query is captured and attached to error response
  - `true`
  - `false` (default)
- `neonDebugSQL` - if true, the SQL query is captured and attached to error response
  - `true`
  - `false` (default)
- `neonDebugRuntime` - if true, extra runtime information is captured and logged
  - `true`
  - `false` (default)

Example:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  neon: {
    neonSSLMode: 'verify-full',
    neonRawWarning: false,
    neonDebugSQL: true,
  },
  // other configuration
})
```

### As runtime config

Module options can also be passed as Nuxt runtime config variables in `.env` file, eg.:

```
NUXT_PUBLIC_NEON_SSL_MODE=verify-full
NUXT_PUBLIC_NEON_RAW_WARNING=false
NUXT_PUBLIC_NEON_DEBUG_SQL=true
```

## See also

- [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver) for the full reference of provided features like the `transaction()` function.

## Contribution

Contributions welcome! Let's make this module better together.

 Contact https://github.com/AloisSeckar for more info.

 The module is being developed using `pnpm` package manager.

 Neon DB instance is required - then you have to setup `.env` files with connection info.

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  pnpm install
  
  # Generate type stubs
  pnpm dev:prepare
  
  # Develop with the playground
  pnpm dev
  
  # Build the playground
  pnpm dev:build
  
  # Run ESLint
  pnpm lint

  # Prepare test environment
  pnpm exec playwright-core install
  
  # Run Vitest
  pnpm test
  pnpm test:watch
  
  # Release new version
  pnpm release
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
