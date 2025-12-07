// NOTE: when editing this file, please also update exports in `src/utils/neonTypes.ts`

/**
 * Possible options for Neon driver SSL mode.
 * @see https://neon.tech/docs/connect/connect-securely#connection-modes
 */
export type NeonSSLModeOption = 'require' | 'verify-ca' | 'verify-full' | 'none'

/** Custom error object to be passed when something goes wrong */
export type NeonError = {
  name: 'NuxtNeonServerError' | 'NuxtNeonClientError'
  source: string
  code: number
  message: string
  sql?: string
}

/** Result of `neonStatus` health check. */
export type NeonStatusResult = {
  /**
   * Database name based on `NUXT_PUBLIC_NEON_DB`.
   * Empty unless called with `anonymous = false`.
   */
  database: string
  /**
   * `OK` if database connection can be established,
   * `ERR` if error was thrown by the Neon driver.
   */
  status: 'OK' | 'ERR'
  /**
   * Details, if error is encountered.
   * Empty unless called with `debug = true`.
   */
  debugInfo?: string
}

/** Object for defining column with a table alias */
export type NeonColumnObject = {
  /** Alias used for table */
  alias?: string
  /** Column name */
  name: string
}

/** Object for defining 2+ tables for JOIN in SELECT. */
export type NeonTableObject = {
  /** Schema name */
  schema?: string
  /** Table name */
  table: string
  /** Alias used for table */
  alias?: string
  /** Left column (including alias) for JOIN (ignored for 1st table) */
  joinColumn1?: string | NeonColumnObject
  /** Right column (including alias) for JOIN (ignored for 1st table) */
  joinColumn2?: string | NeonColumnObject
  /** Type for JOIN (ignored for 1st table) */
  joinType?: NeonJoinType
}

/** Enum-like type to define JOIN type */
export type NeonJoinType = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL'

/** Enum-like type to define operation for column-value pair in WHERE clause */
export type NeonWhereCondition = '=' | '!=' | '>' | '>=' | '<' | '<=' | 'LIKE'
type NeonEncodedWhereCondition = 'GT' | 'GTE' | 'LT' | 'LTE' // internal type for encoded angle brackets

/** Enum-like type to define logical operator between more WHERE clauses */
export type NeonWhereOperator = 'AND' | 'OR'

/** Object for defining a WHERE clause. */
export type NeonWhereObject = {
  /** Column definition */
  column: string | NeonColumnObject
  /** Condition type */
  condition: NeonWhereCondition | NeonEncodedWhereCondition
  /** String value to be used for filtering or column from other table */
  value: string | NeonColumnObject
  /** Relation with other clauses (ignored for 1st clause) */
  operator?: NeonWhereOperator
}

/** Enum-like type to define `ascending` or `descending` sorting */
export type NeonSortDirection = 'ASC' | 'DESC'

/** Object for defining an ORDER BY clause. */
export type NeonOrderObject = {
  /** Column definition */
  column: string | NeonColumnObject
  /** Sort direction (`ASC` if not specified) */
  direction?: NeonSortDirection
}

// consolidated types

export type NeonDataType<T> = Array<T> | NeonError
export type NeonCountType = number | NeonError
export type NeonEditType = string | NeonError
export type NeonStatusType = NeonStatusResult

export type NeonColumnType = string | string[] | NeonColumnObject | NeonColumnObject[]
export type NeonTableType = string | NeonTableObject
export type NeonFromType = string | NeonTableObject | NeonTableObject[]
export type NeonWhereType = string | NeonWhereObject | NeonWhereObject[]
export type NeonOrderType = string | NeonOrderObject | NeonOrderObject[]
export type NeonInsertType = Record<string, string> | Record<string, string>[]
export type NeonUpdateType = Record<string, string>
export type NeonBodyType = Record<string, unknown>

// query objects for SQL wrappers

export type NeonCountQuery = {
  from: NeonFromType
  where?: NeonWhereType
}

export type NeonSelectQuery = {
  columns: NeonColumnType
  from: NeonFromType
  where?: NeonWhereType
  order?: NeonOrderType
  limit?: number
  group?: NeonColumnType
  having?: NeonWhereType
}

export type NeonInsertQuery = {
  table: NeonTableType
  values: NeonInsertType
}

export type NeonUpdateQuery = {
  table: NeonTableType
  values: NeonUpdateType
  where?: NeonWhereType
}

export type NeonDeleteQuery = {
  table: NeonTableType
  where?: NeonWhereType
}
