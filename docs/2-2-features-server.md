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

Nuxt Neon uses them to construct a PostgreSQL connection string:

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

Value returned is a `NeonStatusType` promise:
- `database: string` - name of the Neon database - `useRuntimeConfig().neonDB` value
- `status: 'OK' | 'ERR'` - `OK` if connection works, `ERR` if error occured
- `debug?: string` - the error message returned from unsuccessful query attempt

## SQL wrappers

There are currently six SQL wrapper functions provided by Nuxt Neon to simplify common database operations. They can be unwrapped from `useNeonServer()` composable-like function. With exeception of the `raw` wrapper which takes raw SQL query strings, all other use custom object-like API for constructing desired queries.

> [!TIP]
> As additional security measure, you can explicitly allow tables that can be queried via [`neonAllowedTables`](2-5-features-options.md#neonallowedtables) module option.

### `select`

For invoking `SELECT` queries you can use:

```ts
// async (
//   query: NeonSelectQuery, 
//   neon: NeonDriver = getDefaultNeonDriver()
// ): Promise<Array<T>>

const { select } = useNeonServer()

const result: Array<T> = await select<T>(query)

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

The function returns an array of objects extracted from the database based on the SQL `SELECT` query constructed from the passed `query` object. The type signature allows generic parameter `T` to be passed in according to your needs. 

For type definition of `NeonSelectQuery` refer to [type definition page](2-6-features-types.md#neonselectquery).

The Neon driver will throw an error, if the query fails.

### `count`

For simplified `COUNT` query (only `COUNT(*)` is supported) you can use:

```ts
// async (
//   query: NeonCountQuery,
//   neon: NeonDriver = getDefaultNeonDriver()
// ): Promise<number>

const { count } = useNeonServer()

const totalCount: number = await count(query)

type NeonCountQuery = {
  table: NeonTableType
  where?: NeonWhereType
}
```

This just calls the `select()` wrapper function under the hood, but abstracts users from having to pass `columns = ['count(*)']` and automatically extracts the count value from the response. This wrapper exists solely for convenience for the most straightforward use-case. For more complex scenarios, please use the `select` wrapper with more flexible API directly.

For type definition of `NeonCountQuery` refer to [type definition page](2-6-features-types.md#neoncountquery).

The Neon driver will throw an error, if the query fails.

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

Currently, `INSERT` is limited to one row at the time.

Successful `INSERT` query only returns `[]` (an empty array) as response. 

For type definition of `NeonInsertQuery` refer to [type definition page](2-6-features-types.md#neoninsertquery).

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

Successful `UPDATE` query only returns `[]` (an empty array) as response.

For type definition of `NeonUpdateQuery` refer to [type definition page](2-6-features-types.md#neonupdatequery).

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

Successful `DELETE` query only returns `[]` (an empty array) as response.

For type definition of `NeonDeleteQuery` refer to [type definition page](2-6-features-types.md#neondeletequery).

The Neon driver will throw an error, if the query fails.

### `raw`

> [!CAUTION]
> This will allow running **ANY** valid SQL queries against your database. Be careful with this.

This special wrapper is meant as an escape hatch for running raw SQL queries that are not currently supported by other wrappers. You are encouraged to [open a new issue](https://github.com/AloisSeckar/nuxt-neon/issues) with your needs. Using `raw` wrapper should be only temporary solution until the fix is delivered. **NEVER allow unchecked user input via `raw` handler**.

> [!WARNING]
> By default, the `raw` function is **disabled** and **will throw an error** if invoked. 
> 
> It requires an explicit opt-in via a [module option](2-5-features-options.md#neonexposerawendpoint) to be allowed. 

> [!TIP]
> As additional security measure, you must explicitly allow queries that can be executed like this via [`neonAllowedQueries`](2-5-features-options.md#neonallowedqueries) module option. If the executed query is not on the white-list, it will be rejected with error message.

If the wrapper is allowed, you can execute (allowed) raw queries using:

```ts
// async (
//   query: string, 
//   neon: NeonDriver = getDefaultNeonDriver()
// ): Promise<Array<T>>

const { raw } = useNeonServer()

const result: Array<T> = await raw<T>('SELECT * FROM users')
```
