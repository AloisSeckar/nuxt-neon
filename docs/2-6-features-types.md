# Neon SQL API

The Neon SQL API provides a convenient object-oriented way to interact with your Neon database without writing raw SQL queries. It is used for passing arguments into [SQL wrappers](2-2-features-server.md#sql-wrappers) for `SELECT`, `INSERT`, `UPDATE`, and `DELETE` functions.

Passed-in values are checked and sanitized to prevent SQL injection attacks before being used to construct the respective SQL query.

In case you'll encounter a situation that is not supported by the current API, you are encouraged to [open an issue](https://github.com/AloisSeckar/nuxt-neon/issues) with a new feature request. Meanwhile, you can fall back to using [`raw` wrapper](2-2-features-server.md#raw).

Up-to-date definition of all types can be found in the [`neon.ts` file](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/shared/types/neon.ts).

## `NeonSelectQuery`

For constructing `SELECT` queries, use:

```ts
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

### `columns`{#select-columns}

Property `columns` represent the columns to be selected from the database table(s).

Values can be passed in four different ways - single string, array of strings (column names, possibly prefixed with table alias), single `NeonColumnObject`, or array of `NeonColumnObject`.

Special values `'*'` (all columns) and `count(*)` or `count(col)` (number of retrieved rows) are supported.

```ts
type NeonColumnType = string | string[] | NeonColumnObject | NeonColumnObject[]

type NeonColumnObject = {
  // table alias 
  alias?: string
  // column name
  name: string
}
```

### `from`{#select-from}

Property `from` represents the table(s) to select from in the database after `FROM` SQL keyword.

Values `join*` are only relevant if working with mutiple tables that you want to join via a simple column relation. Note that this can also be substituted with adequate `WHERE` clause(s) - e.g. `p1.id = p2.id`.

```ts
type NeonFromType = string | NeonTableObject | NeonTableObject[]

type NeonTableObject = {
  // DB schema name
  schema?: string
  // table name
  table: string
  // alias used for table in column references
  alias?: string

  // JOIN parameters (will be ignored for 1st table in array)

  // left column (may include alias) - first table
  joinColumn1?: string | NeonColumnObject
  // right column (may include alias) - second table
  joinColumn2?: string | NeonColumnObject
  // type for JOIN - defaults to 'INNER'
  joinType?: NeonJoinType
}

type NeonJoinType = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL'
```

### `where`{#select-where}

Property `where` represents the filtering option(s) after `WHERE` SQL keyword.

For security reasons, plain string values are not allowed here and the API must be used.

**Special usage notes:**

- for `IN` and `NOT IN` operators, comma separated list is expected as `value` (e.g. `1,2,3`)
- for `BETWEEN` operators, exactly two comma separated values are expected as `value` (e.g. `1,2`)
- because of [possible issues with angle brackets](https://github.com/AloisSeckar/nuxt-neon/issues/45), safe aliases `GT`, `GTE`, `LT`, `LTE` exist along with `>`, `>=`, `<`, `<=` operators. When communicating between frontend `useNeonClient` composable and the backend API endpoints, values are being automatically converted.

```ts
type NeonWhereType = NeonWhereCondition | NeonWhereCondition[]

type NeonWhereCondition = {
  // column definition (see `columns`)
  column: string | NeonColumnObject
  // logical comparison operation type
  operator: NeonWhereOperator
  // value to be used for filtering - either string or column from another table
  value: string | NeonColumnObject

  // relations between where clauses (will be ignored for 1st clause in array)

  // relation to other clauses - defaults to 'AND'
  relation?: NeonWhereRelation
}

type NeonWhereOperator = '=' | '!=' | '>' | 'GT' | '>=' | 'GTE' | '<' | 'LT' |
  '<=' | 'LTE' | 'LIKE' | 'IN' | 'NOT IN' | 'BETWEEN'

type NeonWhereRelation = 'AND' | 'OR'
```

### `order`{#select-order}

Property `order` represents the column(s) to order results by its values after `ORDER BY` SQL keyword.

```ts
type NeonOrderType = NeonOrderObject | NeonOrderObject[]

type NeonOrderObject = {
  // column definition (see `columns`)
  column: string | NeonColumnObject,
  // sort direction - defaults to 'ASC'
  direction?: NeonSortDirection,
}

type NeonSortDirection = 'ASC' | 'DESC'
```

### `limit`{#select-limit}

Property `limit` represents the maximum number of rows to be retrieved after `LIMIT` SQL keyword. It must be a positive integer.

### `group`{#select-group}

Property `group` represents the column(s) to group results by its values after `GROUP BY` SQL keyword.

For type definition see [`columns`](#select-columns).

Note that columns mentioned in `group` must also appear in `columns` property to make a valid SQL query, though this is currently not enforced at the module level.

### `having`{#select-having}

Property `having` represents the filtering option(s) of grouped columns after `HAVING` SQL keyword.

For type definition see [`where`](#select-where).

Note that columns mentioned in `having` must also appear in `group` property to make a valid SQL query, though this is currently not enforced at the module level.

## `NeonCountQuery`

For constructing `COUNT` queries, use:

```ts
type NeonCountQuery = {
  from: NeonFromType
  where?: NeonWhereType
}
```

The `columns` property is omitted as special value `COUNT(*)` is always used. The `count` function then makes an internal call to `select` wrapper with appropriate parameters.

### `from`{#count-from}

See [`from`](#select-from)

### `where`{#count-where}

See [`where`](#select-where)

## `NeonInsertQuery`

For constructing `INSERT` queries, use:

```ts
type NeonInsertQuery = {
  table: NeonTableType
  values: NeonInsertType
}
``` 

### `table`{#insert-table}

Property `table` represents the table to add new data into after `INSERT INTO` SQL keyword.

```ts
type NeonTableType = string | NeonTableObject
```

This type is similar to [`NeonFromType`](#select-from) with the exception that it can only accept SINGLE instance of `NeonTableObject` as `INSERT` can only be performed into one table at the time.

For `INSERT` statements, table definition **must not** contain an `alias` and function will throw an error if attempted to.

### `values`{#insert-values}

Property `values` represent the key-value pairs to be inserted into the database table.

```ts
type NeonInsertType = Record<string, string> | Record<string, string>[]
```

It is possible to insert multiple rows at once by passing an array of key-value pairs. Both keys and values are sanitized when constructing the SQL query.

## `NeonUpdateQuery`

For constructing `UPDATE` queries, use:

```ts
type NeonUpdateQuery = {
  table: NeonTableType
  values: NeonUpdateType
  where?: NeonWhereType
}
```

### `table`{#update-table}

See [`table`](#insert-table)

For `UPDATE` statements, `alias` **can** be used.

### `values`{#update-values}    

Property `values` represent the key-value pairs to be inserted into the database table.

```ts
type NeonUpdateType = Record<string, string>
```

Unlike for [`INSERT`](#insert-values), there can only be one set of key-value pairs passed.

### `where`{#update-where}

See [`where`](#select-where)

The `where` affects which rows are updated and it is highly advised always to provide such constraints. Without any limitations, **all rows** in the table will be updated.

## `NeonDeleteQuery`

For constructing `DELETE` queries, use:

```ts
type NeonDeleteQuery = {
  table: NeonTableType
  where?:NeonWhereType
}
```

### `table`{#delete-table}

See [`table`](#insert-table)

For `DELETE` statements, `alias` **can** be used.

### `where`{#delete-where}

See [`where`](#select-where)

The `where` affects which rows are deleted and it is highly advised always to provide such constraints. Without any limitations, **all rows** in the table will be deleted.
