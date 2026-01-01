# Server-side features 🌞

> [!TIP]
> **It is advised only to use Nuxt Neon module server-side**. You should keep your DB operations sealed behind Nuxt runtime server and only expose custom API endpoints to your client-side.

## Neon serverless driver

Nuxt Neon is connecting into your Neon database using the [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver). 

The connection is configured via a set of Nuxt private [runtime config variables](https://nuxt.com/docs/4.x/guide/going-further/runtime-config):

```sh [.env]
NUXT_NEON_HOST=your-neon-host
NUXT_NEON_USER=your-neon-user
NUXT_NEON_PASS=your-neon-password
NUXT_NEON_DB=your-neon-database
```

Nuxt Neon uses them to costruct a PostgreSQL connection string:

```ts
`postgresql://${NUXT_NEON_USER}:${NUXT_NEON_PASS}@${NUXT_NEON_HOST}.neon.tech/${NUXT[_PUBLIC]NEON_DB}`
```

And instantiates the Neon serverless driver on the Nuxt server with it inside [simple utility class](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/server/utils/useNeonDriver.ts). The result is a function that underlying Neon driver uses to establish the connection into the serverless PostgreSQL database. Like that, sensitive connection data are sealed within the Nuxt server. On the other hand, this means **you cannot use Nuxt Neon in static builds** and deploy without JS runtime.

Right now, the function is singleton-like, meaning you can create only one per Nuxt application. If different behavior is needed, please [open an issue](https://github.com/AloisSeckar/nuxt-neon/issues).

The function can be obtained as:

```ts
const { neon } = useNeonDriver()
```

If you need, you can use it exactly as described in the [Neon docs](https://neon.tech/docs/serverless/serverless-driver) to build your fully custom solutions.

Alternatively, this driver instance can be optionally passed into server-side health check utils and SQL wrapper functions that are described below. This might be useful if you need to do some special augmenting of the instance. If nothing is passed, the default result of `useNeonDriver()` is used.

## Health checks

Nuxt Neon provides two health check utilities to monitor the status of your Neon database. They can be unwrapped from `useNeonServer()` composable-like function.

### `isOk`

Status of the connection can be quickly checked with `isOk`: 

```ts
// async (
//   neon: NeonDriver = getDefaultNeonDriver()
// ): Promise<boolean>
const { isOk } = useNeonServer()

const isConnected: boolean = await isOk()
```

The function returns `true` if the connection into the database is set up correctly and works. It calls `neonStatus()` under the hood and checks if returned status is `OK`.

### `neonStatus`

For more advanced status monitoring, you can use `neonStatus`:

```ts
// async (
//   anonymous: boolean = true, 
//   debug: boolean = false
//   neon: NeonDriver = getDefaultNeonDriver()
// ): Promise<NeonStatusType>
const { neonStatus } = useNeonServer()

const status: NeonStatusType = await neonStatus()

type NeonStatusType = {
  database: string,
  status: 'OK' | 'ERROR',
  debugInfo?: string,
}
```

The test is performed by firing a `SELECT 1=1` query to the current Neon database.

The function takes two optional parameters:
- `anonymous: boolean = true` - if set to `false`, it will disclose database name (`useRuntimeConfig().public.neonDB` value)
- `debug: boolean = false` - if set to `true`, if will append the root cause returned by Neon driver when error occured [**WARNING**: may expose sensitive data! Use with caution]

Value returned is a `NeonStatusResult` promise:
- `database: string` - name of the Neon database (hidden, if `anonymous = true`)
- `status: 'OK' | 'ERR'` - `OK` if connection works, `ERR` if error occured
- `debug?: string` - Neon driver error, if `status = 'ERR'` and `debug = true`

## SQL wrappers

There are currently six SQL wrapper functions provided by Nuxt Neon to simplify common database operations. They can be unwrapped from `useNeonServer()` composable-like function. With exeception of the `raw` wrapper which takes raw SQL query strings, all other use custom object-like API for constructing desired queries.

> [!TIP]
> As additional security measure, you can explicitly allow tables that can be queried via module option `neonAllowedTables` or runtime config variable `NUXT_PUBLIC_NEON_ALLOWED_TABLES` (comma separated list). 
> 
> The default value equals to special `NEON_PUBLIC` which means all user-defined tables can be queried. System tables (`pg_*` or `information_schema.*`) are forbidden. To allow them, use special `NEON_ALL` value in the list of allowed tables. Alternatively, you can make an explicit list of tables that should only allowed (including specific system ones).
> 
> If using schemas, allowed tables must use and match the schema too (e.g. `schema.users`).

### `select`

For invoking `SELECT` queries you can use:

```ts
// async (
//   query: NeonSelectQuery, 
//   neon: NeonDriver = getDefaultNeonDriver()
// ): Promise<Array<T>>
const { select } = useNeonServer()

const result: Array<T> = await select<T>()

type NeonSelectQuery = {
  columns: NeonColumnType
  from: NeonFromType
  where?: NeonWhereType
  order?: NeonOrderType
  limit?: number
  group?: NeonColumnType
  having?: NeonWhereType
}
```

The function returns an array of objects extracted from the database based on the SQL `SELECT` query constructed from the passed `NeonSelectQuery` object. The type signature allows generic parameter `T` to be passed in according to your needs.

You can construct and execute the `SELECT` query via this function with following parameters:
- **columns** - array of columns you want to retrieve
  - can be a string or array of strings
  - you can use special `*` for "all columns"
  - you can also use SQL functions (e.g. `count(*)`) 
  - if you use aliases in `from` part, you can to provide them together with the column name (e.g. `t.column`)
  - or an instance (or array) of [`NeonColumnObject`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/shared/types/neon.ts#L48) type which can handle `alias` as well
- **from** - definition of table(s) to select from
  - can be either a string with custom value (including more complicated)
  - or an instance (or array) of [`NeonTableObject`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/shared/types/neon.ts#L56) type which will (usually) be parsed into a chain of `JOIN` clauses (`JOIN` type can be specified, defaults to `INNER JOIN`)
  - the `JOIN` clause is not required and can be substituted with adequate `WHERE` clause(s) - e.g. `p1.id = p2.id`
- **where** - _optional_ definition of filter conditions
  - can be either a string with custom value (including more complicated)
  - or an instance (or array) of [`NeonWhereObject`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/shared/types/neon.ts#L81) type which will be parsed into chain of clauses
  - if you use aliases in `from` part, you have to provide them together with the column name (e.g. `t.column = 1`)
  - all possible operators are listed [here](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/shared/types/neon-constants.ts#L1)
  - for `IN` and `NOT IN`, list of comma separated values is expected as `value` (e.g. `1,2,3`)
  - for `BETWEEN`, exactly two comma separated values are expected as `value` (e.g. `1,2`)
  - because of [possible issues with angle brackets](https://github.com/AloisSeckar/nuxt-neon/issues/45), safe aliases `GT`, `GTE`, `LT`, `LTE` exist within `NeonWhereOperator` type for `>`, `>=`, `<`, `<=` operators. When communicating between `useNeon` composable and the backend API endpoints, automatic conversion happens.
- **order** - _optional_ criteria for ordering results
  - can be either a string with custom value (including more complicated)
  - or an instance (or array) of [`NeonOrderObject`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/shared/types/neon.ts#L96) type which will be parsed into chain of clauses
  - if you use aliases in `from` part, you have to provide them together with the column name (e.g. `t.column DESC`)
- **limit** - _optional_ limit of results, if more results expected (number)
- **group** - _optional_ definition for GROUP BY aggregation clause
- **having** - _optional_ definition for HAVING aggregation critera clause

The Neon driver will throw an error, if the query fails.

### `count`

For simplified `COUNT` query (only `COUNT(*)` is supported) you can use:

```ts
// async (
//   query: NeonCountQuery,
//   neon: NeonDriver = getDefaultNeonDriver()
// ): Promise<number>
const { count } = useNeonServer()

const totalCount: number = await count()

type NeonCountQuery = {
  table: NeonTableType
  where?: NeonWhereType
}
```

You can construct and execute the `COUNT` query via this function with following parameters:
- **from** - definition of table(s) to select from
  - can be either a string with custom value (including more complicated)
  - or an instance (or array) of [`NeonTableObject`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/shared/types/neon.ts#L56) type which will be parsed into a chain of `JOIN` clauses
- **where** - _optional_ definition of filter conditions
  - can be either a string with custom value (including more complicated)
  - or an instance (or array) of [`NeonWhereObject`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/shared/types/neon.ts#L81) type which will be parsed into chain of clauses

It just calls the `select()` wrapper function under the hood, but abstracts users from having to pass `columns = ['count(*)']` and extracts the count value from the response. This wrapper exists solely for convenience for the most straightforward use-case. For more complex scenarios, please use the `select` wrapper with more flexible API directly.

### `insert`

For invoking `INSERT` queries you can use:

```ts
// async (
//   query: NeonInsertQuery,
//   neon: NeonDriver = getDefaultNeonDriver()
// ): NeonDriverResponse 
const { insert } = useNeonServer()

const result: NeonDriverResponse = await insert()

type NeonInsertQuery = {
  table: NeonTableType
  values: NeonInsertType
}
```

You can construct and execute the `INSERT` query via this function with following parameters:
- **table** - DB table to insert into
- **values** - list of key-value pairs to be updated, values are being sanitized before applied to database. If you intend to enter more than one row at once, you can also pass an array of arguments.

Currently, `INSERT` is limited to one row at the time.

Successful `INSERT` query only returns `[]` (an empty array) as response. 

The Neon driver will throw an error, if the query fails.

### `update`

For invoking `UPDATE` queries you can use:

```ts
// async (
//   query: NeonUpdateQuery,
//   neon: NeonDriver = getDefaultNeonDriver()
// ): NeonDriverResponse
const { update } = useNeonServer()

const result: NeonDriverResponse = await update()

type NeonUpdateQuery = {
  table: NeonTableType
  values: NeonUpdateType
  where?: NeonWhereType
}
```

You can construct and execute the `UPDATE` query via this function with following parameters:
- **table** - DB table to be updated
- **values** - list of key-value pairs to be updated, values are being sanitized before applied to database
- **where** - _optional_ definition of filter conditions
  - can be either a string with custom value (including more complicated)
  - or an instance (or array) of [`NeonWhereObject`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/shared/types/neon.ts#L81) type which will be parsed into chain of clauses

Successful `UPDATE` query only returns `[]` (an empty array) as response.

The Neon driver will throw an error, if the query fails.

### `del`

**NOTE:** Because `delete` is not allowed as identifier in TypeScript, the wrapper for SQL DELETE function is available here as `del()`.

For invoking `DELETE` queries you can use:

```ts   
// async (
//   query: NeonDeleteQuery,
//   neon: NeonDriver = getDefaultNeonDriver()
// ): NeonDriverResponse
const { del } = useNeonServer()

const result: NeonDriverResponse = await del()

type NeonDeleteQuery = {
  table: NeonTableType
  where?: NeonWhereType
}
```

You can construct and execute the `DELETE` query via this function with following parameters:
- **table** - DB table to be deleled from
- **where** - _optional_ definition of filter conditions
  - can be either a string with custom value (including more complicated)
  - or an instance (or array) of [`NeonWhereObject`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/shared/types/neon.ts#L81) type which will be parsed into chain of clauses

Successful `DELETE` query only returns `[]` (an empty array) as response.

The Neon driver will throw an error, if the query fails.

### `raw`

> [!CAUTION]
> This will allow running **ANY** raw SQL queries against your database. Be careful with this.

This special wrapper is meant as an escape hatch for running raw SQL queries that are currently supported by other wrappers. You are encouraged to [open a new issue](https://github.com/AloisSeckar/nuxt-neon/issues) with your needs. Using `raw` wrapper should be only temporary solution until the fix is delivered. **NEVER allow unchecked user input via `raw` handler**.

> [!WARNING]
> By default, the `raw` function is **disabled** and **will throw an error** if invoked. 
> 
> It requires an explicit opt-in via module option `neonExposeRawEndpoint: true` or runtime config variable `NUXT_PUBLIC_NEON_EXPOSE_RAW_ENDPOINT=true` to be allowed. 

> [!TIP]
> As additional security measure, you must explicitly allow queries that can be executed like this via module option `neonAllowedQueries` or runtime config variable `NUXT_PUBLIC_NEON_ALLOWED_QUERIES` (semicolon separated list). If the executed query is not in the white-list, it will be rejected with error message. For unprobable cause that you insist on allowing any query, you can put special `NEON_ALL` value into the list of allowed queries.

If the wrapper is allowed, you can execute (allowed) raw queries using:

```ts
// async (
//   query: string, 
//   neon: NeonDriver = getDefaultNeonDriver()
// ): Promise<Array<T>>
const { raw } = useNeonServer()

const result: Array<T> = await raw<T>('SELECT * FROM users')
```
