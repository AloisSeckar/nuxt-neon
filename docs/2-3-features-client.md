# Client-side features 🥶

> [!CAUTION]
> **Exposing database connection to the client side is a serious security risk!** While Nuxt Neon technically allows accessing the Neon database quasi-directly from the client side via a set of wrapper functions and exposed API endpoints, it is advised not to use them in production.

> [!WARNING]
> By default, calling Neon directly from front-end via API endpoints or SQL wrappers is **disabled** and **will throw an error** if invoked. 
> 
> It requires an explicit opt-in via a [module option](2-5-features-options.md#neonexposeendpoints) to be allowed. 

Once enabled, you can use pretty much the same health checks and SQL wrappers as on the server side accessible via `useNeonClient()` composable. The only difference is that the client-side variants aren't accepting `NeonDriver` instance as parameter (the connection is only proxied via server-side API endpoints).

You cannot obtain direct access to `useNeonDriver()` and `useNeonServer()` on client side as those functions will throw an error if called from the client side.

## Health checks

### `isOk`

Simple `true/false` connection test:

```ts
// async (): Promise<boolean>
const { isOk } = useNeonClient()

const isConnected: boolean = await isOk()
```

Check [server-side `isOk`](2-2-features-server.md#isok) for more details.

### `neonStatus`

More detailed DB status check:

```ts
// async (): Promise<NeonStatusResponse>
const { neonStatus } = useNeonClient()

const status: NeonStatusResponse = await neonStatus()
```

Check [server-side `neonStatus`](2-2-features-server.md#isok) for more details.

Unlike the server counter-part, it returns `useRuntimeConfig().public.neonDB` as `database` value (which may be empty or set to something else than the actual DB name used for connection at server-side). Also, `debugInfo` is only populated when `useRuntimeConfig().public.neonDebugRuntime` is set to `true` to avoid accidental leakage of implementation detail. It is advised only to use this option during development and debugging.

## SQL Wrappers

#### `select()`

```ts
// async (
//   query: NeonSelectQuery
// ): Promise<NeonDataResponse<T>>
const { select } = useNeonClient()

const result: NeonDataResponse<T> = await select<T>(query)

type NeonSelectQuery = {
  columns: NeonColumnType
  from: NeonFromType
  where?: NeonWhereType
  order?: NeonOrderType
  limit?: number
  group?: NeonColumnType
  having?: NeonWhereType
}

type NeonDataResponse<T> = Array<T> | NeonError
```

Check [server-side `select`](2-2-features-server.md#select) for more details.

#### `count()`

```ts
// async (
//   query: NeonCountQuery
// ): Promise<NeonCountResponse>
const { count } = useNeonClient()

const totalCount: NeonCountResponse = await count(query)

type NeonCountQuery = {
  table: NeonTableType
  where?: NeonWhereType
}

type NeonCountResponse = number | NeonError
```

Check [server-side `count`](2-2-features-server.md#count) for more details.

#### `insert()`

```ts
// async (
//   query: NeonInsertQuery
// ): NeonEditResponse 
const { insert } = useNeonClient()

const result: NeonEditResponse = await insert(query)

type NeonInsertQuery = {
  table: NeonTableType
  values: NeonInsertType
}

type NeonEditResponse = 'OK' | NeonError
```

Check [server-side `insert`](2-2-features-server.md#insert) for more details.

#### `update()`

```ts
// async (
//   query: NeonUpdateQuery
// ): NeonEditResponse
const { update } = useNeonClient()

const result: NeonEditResponse = await update(query)

type NeonUpdateQuery = {
  table: NeonTableType
  values: NeonUpdateType
  where?: NeonWhereType
}

type NeonEditResponse = 'OK' | NeonError
```

Check [server-side `update`](2-2-features-server.md#update) for more details.

#### `del()`

```ts
// async (
//   query: NeonDeleteQuery
// ): NeonEditResponse
const { del } = useNeonClient()

const result: NeonEditResponse = await del(query)

type NeonDeleteQuery = {
  table: NeonTableType
  where?: NeonWhereType
}

type NeonEditResponse = 'OK' | NeonError
```

Check [server-side `del`](2-2-features-server.md#del) for more details.

#### `raw`

```ts
// async (
//   query: string
// ): Promise<NeonDataResponse<T>>
const { raw } = useNeonClient()

const result: NeonDataResponse<T> = await raw<T>('SELECT * FROM users')

type NeonDataResponse<T> = Array<T> | NeonError
```

Check [server-side `raw`](2-2-features-server.md#raw) for more details.

> [!TIP]
> Same configuration options requirements apply on both client and server side.
