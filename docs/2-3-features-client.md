# Client-side features 🥶

> [!CAUTION]
> **Exposing database connection to the client side is a serious security risk!** While Nuxt Neon technically allows accessing the Neon database quasi-directly from the client side via a set of wrapper functions and exposed API endpoints, it is advised not to use them in production.

> [!WARNING]
> By default, calling Neon directly from front-end via API endpoints or SQL wrappers is **disabled** and **will throw an error** if invoked. 
> 
> It requires an explicit opt-in via module option `neonExposeEndpoints: true` or runtime config variable `NUXT_PUBLIC_NEON_EXPOSE_ENDPOINTS=true` to be allowed.

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
// async (
//   anonymous: boolean = true, 
//   debug: boolean = false
// ): Promise<NeonStatusType>
const { neonStatus } = useNeonClient()

const status: NeonStatusType = await neonStatus()
```

Check [server-side `neonStatus`](2-2-features-server.md#isok) for more details.

## SQL Wrappers

#### `select()`

```ts
// async (
//   query: NeonSelectQuery
// ): Promise<NeonDataType<T>>
const { select } = useNeonClient()

const result: NeonDataType<T> = await select<T>()

type NeonDataType<T> = Array<T> | NeonError
```

Check [server-side `select`](2-2-features-server.md#select) for more details.

#### `count()`

```ts
// async (
//   query: NeonCountQuery
// ): Promise<NeonCountType>
const { count } = useNeonClient()

const totalCount: NeonCountType = await count()

type NeonCountType = number | NeonError
```

Check [server-side `count`](2-2-features-server.md#count) for more details.

#### `insert()`

```ts
// async (
//   query: NeonInsertQuery
// ): NeonEditType 
const { insert } = useNeonClient()

const result: NeonEditType = await insert()

type NeonEditType = string | NeonError
```

Check [server-side `insert`](2-2-features-server.md#insert) for more details.

#### `update()`

```ts
// async (
//   query: NeonUpdateQuery
// ): NeonEditType
const { update } = useNeonClient()

const result: NeonEditType = await update()

type NeonEditType = string | NeonError
```

Check [server-side `update`](2-2-features-server.md#update) for more details.

#### `del()`

```ts
// async (
//   query: NeonDeleteQuery
// ): NeonEditType
const { del } = useNeonClient()

const result: NeonEditType = await del()

type NeonEditType = string | NeonError
```

Check [server-side `del`](2-2-features-server.md#del) for more details.

#### `raw`

```ts
// async (
//   query: string
// ): Promise<NeonDataType<T>>
const { raw } = useNeonClient()

const result: NeonDataType<T> = await raw<T>('SELECT * FROM users')

type NeonDataType<T> = Array<T> | NeonError
```

Check [server-side `raw`](2-2-features-server.md#raw) for more details.

> [!TIP]
> Same configuration options requirements apply on both client and server side.
