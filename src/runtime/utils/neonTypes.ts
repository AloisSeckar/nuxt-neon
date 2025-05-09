// NOTE: if adding new type also add reference into ../types/neon.d.ts

/**
 * Possible options for Neon driver SSL mode.
 * @see https://neon.tech/docs/connect/connect-securely#connection-modes
 */
export type SSLModeOption = 'require' | 'verify-ca' | 'verify-full' | 'none'

/** Custom error object to be passed when something goes wrong */
export type NeonError = {
  name: 'NuxtNeonServerError' | 'NuxtNeonClientError'
  source: string
  code: number
  message: string
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

/** Object for defining 2+ tables for JOIN in SELECT. */
export type NeonTableQuery = {
  /** Schema name */
  schema?: string
  /** Table name */
  table: string
  /** Alias used for table */
  alias: string
  /** Left column (including alias) for JOIN (ignored for 1st table) */
  joinColumn1?: string
  /** Right column (including alias) for JOIN (ignored for 1st table) */
  joinColumn2?: string
}

/** Enum-like type to define operation for column-value pair in WHERE clause */
export type NeonWhereCondition = '=' | '!=' | '>' | '>=' | '<' | '<=' | 'LIKE'

/** Enum-like type to define logical operator between more WHERE clauses */
export type NeonWhereOperator = 'AND' | 'OR'

/** Object for defining a WHERE clause. */
export type NeonWhereQuery = {
  /** Column name */
  column: string
  /** Condition type */
  condition: NeonWhereCondition
  /** Value to be used for filtering */
  value: string
  /** Relation with other clauses (ignored for 1st clause) */
  operator?: NeonWhereOperator
}

/** Enum-like type to define `ascending` or `descending` sorting */
export type NeonSortDirection = 'ASC' | 'DESC'

/** Object for defining an ORDER BY clause. */
export type NeonOrderQuery = {
  /** Column name */
  column: string
  /** Sort direction (`ASC` if not specified) */
  direction?: NeonSortDirection
}
