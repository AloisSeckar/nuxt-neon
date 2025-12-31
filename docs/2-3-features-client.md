# Client-side features 🛑

TODO add detailed description for client-side wrappers

Once enabled, you can use following client-side features:

#### `useNeonClient` composable

This module exposes `useNeonClient()` composable on the client side. Currently two health check probes and six SQL wrappers are available:

```ts
// health check probes
const { isOk, neonStatus } = useNeonClient()
// SQL wrappers
const { raw, count, select, insert, update, del } = useNeonClient()
```

#### Health checks

Current status of the connection can be quickly checked by calling async function `isOk` provided by `useNeon` composable: 

```ts
// async (): Promise<boolean>
const { isOk } = useNeonClient()
```

The return value `true/false` is based on more complex probe function `neonStatus` which is also available:

```ts
// async (anonymous: boolean = true, debug: boolean = false): Promise<NeonStatusResult>
const { neonStatus } = useNeonClient()
```

The test is performed by firing a `SELECT 1=1` query to the current Neon database.

The function takes two optional parameters:
- `anonymous: boolean = true` - if set to `false`, it will disclose database name
- `debug: boolean = false` - if set to `true`, if will append the root cause returned by Neon driver when error occured [**WARNING**: may expose sensitive data! Use with caution]

Value returned is a `NeonStatusResult` promise:
- `database: string` - name of the Neon database (hidden, if `anonymous = true`)
- `status: 'OK' | 'ERR'` - `OK` if connection works, `ERR` if error occured
- `debug?: string` - Neon driver error, if `status = 'ERR'` and `debug = true`

#### SQL Wrappers

This module offers SQL client-side wrappers that communicate with Nuxt server-side endpoints connected to the native `neonClient`. Currently six of them are availabl within `useNeon` composable:
- `raw()` - client-side RAW wrapper (extra discouraged*)
- `count()` - client-side COUNT wrapper
- `select()` - cient-side SELECT wrapper
- `insert()` - cient-side INSERT wrapper
- `update()` - cient-side UPDATE wrapper
- `del()` - cient-side DELETE wrapper

*) Needs module option `neonExposeRawEndpoint: true` or runtime config variable `NUXT_PUBLIC_NEON_EXPOSE_RAW_ENDPOINT=true` to be allowed.

#### `raw()`

```ts
// async <T> (query: string): Promise<Array<T> | NeonError>
const { raw } = useNeonClient()
```

This wrapper allows you to perform **ANY** SQL directly.

Returns the result of the query (Neon client returns `[]` for INSERT, UPDATE and DELETE) or DB client's error message. Generic casting can be used for type-hint (`raw<T>()`).

**SECURITY WARNING**: the value of `query` cannot be sanitized before being applied to the database, so make sure you **NEVER allow unchecked user input via `raw` handler**. This method is implemented to allow bypassing edge cases that cannot be covered by following wrappers that ensure input security more.

As additional security measure you must explicitly allow queries that can be executed like this via module option `neonAllowedQueries` or runtime config variable `NUXT_PUBLIC_NEON_ALLOWED_QUERIES`. If the executed query is not in the white-list, it will be rejected with error message.

#### `count()`

```ts
// async (from: string | NeonTableObject | NeonTableObject[], where?: string | NeonWhereObject | NeonWhereObject[]): Promise<number | NeonError>
const { count } = useNeonClient()
```

This is a special wrapper to allow `select count(*) from` query:
- **from** - definition of table(s) to select from
  - can be either a string with custom value (including more complicated)
  - or an instance (or array) of [`NeonTableObject`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/types/neon.d.ts#L50) type which will be parsed into a chain of `JOIN` clauses
- **where** - _optional_ definition of filter conditions
  - can be either a string with custom value (including more complicated)
  - or an instance (or array) of [`NeonWhereObject`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/types/neon.d.ts#L76) type which will be parsed into chain of clauses

It just calls the `select()` wrapper function under the hood, but abstracts users from having to pass `columns = ['count(*)']`.

#### `select()`

```ts
// async <T> (columns: string | string[] | NeonColumnObject | NeonColumnObject[], from: string | NeonTableObject | NeonTableObject[], where?: string | NeonWhereObject | NeonWhereObject[], order?: string | NeonOrderObject | NeonOrderObject[], limit?: number, group?: string | string[] | NeonColumnObject | NeonColumnObject[], having?: string | NeonWhereObject | NeonWhereObject[]): Promise<Array<T> | NeonError>
const { select } = useNeonClient()
```

You can perform `SELECT` operation via this function with following parameters:
- **columns** - array of columns you want to retrieve
  - can be a string or array of strings
  - you can use special `*` for "all columns"
  - you can also use SQL functions (e.g. `count(*)`) 
  - if you use aliases in `from` part, you can to provide them together with the column name (e.g. `t.column`)
  - or an instance (or array) of [`NeonColumnObject`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/types/neon.d.ts#L42) type which can handle `alias` as well
- **from** - definition of table(s) to select from
  - can be either a string with custom value (including more complicated)
  - or an instance (or array) of [`NeonTableObject`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/types/neon.d.ts#L50) type which will (usually) be parsed into a chain of `JOIN` clauses (`JOIN` type can be specified, defaults to `INNER JOIN`)
  - the `JOIN` clause is not required and can be substituted with adequate `WHERE` clause(s) - e.g. `p1.id = p2.id`
- **where** - _optional_ definition of filter conditions
  - can be either a string with custom value (including more complicated)
  - or an instance (or array) of [`NeonWhereObject`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/types/neon.d.ts#L76) type which will be parsed into chain of clauses
  - if you use aliases in `from` part, you have to provide them together with the column name (e.g. `t.column = 1`)
  - all possible operators are listed [here](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/types/neon.d.ts#L69)
  - for `IN` and `NOT IN`, list of comma separated values is expected as `value` (e.g. `1,2,3`)
  - for `BETWEEN`, exactly two comma separated values are expected as `value` (e.g. `1,2`)
  - because of [possible issues with angle brackets](https://github.com/AloisSeckar/nuxt-neon/issues/45), safe aliases `GT`, `GTE`, `LT`, `LTE` exist within `NeonWhereOperator` type for `>`, `>=`, `<`, `<=` operators. When communicating between `useNeon` composable and the backend API endpoints, automatic conversion happens.
- **order** - _optional_ criteria for ordering results
  - can be either a string with custom value (including more complicated)
  - or an instance (or array) of [`NeonOrderObject`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/types/neon.d.ts#92) type which will be parsed into chain of clauses
  - if you use aliases in `from` part, you have to provide them together with the column name (e.g. `t.column DESC`)
- **limit** - _optional_ limit of results, if more results expected (number)
- **group** - _optional_ definition for GROUP BY aggregation clause
- **having** - _optional_ definition for HAVING aggregation critera clause

Returns the result of the SELECT query (Neon client returns `[]` for empty set) or returned erorr message. Generic casting can be used for type-hint (`select<T>()`).

#### `insert()`

```ts
// async (table: string | NeonTableObject, values: Record<string, string> | Record<string, string>[]): Promise<string | NeonError>
const { insert } = useNeonClient()
```

You can perform `INSERT` operation via this with following parameters:
- **table** - DB table to insert into
- **values** - list of key-value pairs to be updated, values are being sanitized before applied to database. If you intend to enter more than one row at once, you can also pass an array of arguments.

Returns `'OK'` if query was successfully executed or returned erorr message.

Currently, `INSERT` is limited to one row at the time.

#### `update()`

```ts
// sync (table: string | NeonTableObject, values: Record<string, string>, where?: string | NeonWhereObject | NeonWhereObject[]): Promise<string | NeonError>
const { update } = useNeonClient()
```
You can perform `UPDATE` operation via this function with following parameters:
- **table** - DB table to be updated
- **values** - list of key-value pairs to be updated, values are being sanitized before applied to database
- **where** - _optional_ definition of filter conditions
  - can be either a string with custom value (including more complicated)
  - or an instance (or array) of [`NeonWhereObject`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/types/neon.d.ts#L76) type which will be parsed into chain of clauses

#### `del()`

**NOTE:** Because `delete` is not allowed as identifier in TypeScript, the wrapper for SQL DELETE function is available here as `del()`.

```ts
// async (table: string | NeonTableObject, where?: string | NeonWhereObject | NeonWhereObject[]): Promise<string | NeonError>
const { del } = useNeonClient()
```
You can perform `DELETE` operation via this function with following parameters:
- **table** - DB table to be deleled from
- **where** - _optional_ definition of filter conditions
  - can be either a string with custom value (including more complicated)
  - or an instance (or array) of [`NeonWhereObject`](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/types/neon.d.ts#L76) type which will be parsed into chain of clauses

Returns `'OK'` if query was successfully executed or returned erorr message.
