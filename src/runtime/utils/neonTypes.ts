/**
 * Possible options for Neon driver SSL mode.
 * @see https://neon.tech/docs/connect/connect-securely#connection-modes
 */
export type SSLModeOption = 'require' | 'verify-ca' | 'verify-full' | 'none'

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
  /** Table name */
  table: string
  /** Alias used for table */
  alias: string
  /** Left column (including alias) for JOIN (ignored for 1st table) */
  idColumn1?: string
  /** Right column (including alias) for JOIN (ignored for 1st table) */
  idColumn2?: string
}

/** Object for defining a WHERE clause. */
export type NeonWhereQuery = {
  /** Column name */
  column: string
  /** Condition type */
  relation: '=' | '!=' | '>' | '>=' | '<' | '<=' | 'LIKE'
  /** Value to be used for filtering */
  value: string
  /** Relation with other clauses (ignored for 1st clause) */
  operator?: 'AND' | 'OR'
}

/** Object for defining an ORDER BY clause. */
export type NeonOrderQuery = {
  /** Column name */
  column: string
  /** Sort direction (`ASC` if not specified) */
  direction?: 'ASC' | 'DESC'
}
