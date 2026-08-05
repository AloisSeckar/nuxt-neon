import {
  NEON_WHERE_OPERATORS, NEON_WHERE_RELATIONS,
  NEON_JOIN_TYPES, NEON_SORT_DIRECTIONS,
  type NEON_ENDPOINT_NAMES, type NEON_EXPOSE_ENDPOINTS_OPTIONS,
} from './neon-constants'

import type { FullQueryResults, NeonQueryFunction, NeonQueryPromise, QueryRows } from '@neondatabase/serverless'
import * as v from 'valibot'

/**
 * Type for Neon driver instance
 * @see https://neon.com/docs/serverless/serverless-driver
 */
export type NeonDriver = NeonQueryFunction<boolean, boolean>

/**
 * Type based on Neon serverless driver's `query` method that is used to perform the DB calls
 *  @see https://neon.com/docs/serverless/serverless-driver
 */
export type NeonDriverResult<ArrayMode extends boolean, FullQuery extends boolean> = NeonQueryPromise<ArrayMode, FullQuery, FullQuery extends true ? FullQueryResults<ArrayMode> : QueryRows<ArrayMode>>

/**
 * Possible options for Neon driver SSL mode.
 * @see https://neon.tech/docs/connect/connect-securely#connection-modes
 */
export type NeonSSLModeOption = 'require' | 'verify-ca' | 'verify-full' | 'none'

/** Enum-like type to define a single exposable server API endpoint */
export type NeonEndpointName = typeof NEON_ENDPOINT_NAMES[number]

/**
 * Possible options for `neonExposeEndpoints` module option.
 * `NONE` disables all endpoints, `ALL` enables all of them.
 * Otherwise, specific endpoint names can be listed (single value or array) to enable only those.
 */
export type NeonExposeEndpointsOption = typeof NEON_EXPOSE_ENDPOINTS_OPTIONS[number]

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

/** Valibot schema for object defining a column with a table alias. */
export const NeonColumnObjectSchema = v.object({
  /** Alias used for table */
  alias: v.optional(v.string()),
  /** Column name */
  name: v.string(),
})

/** Object for defining column with a table alias */
export type NeonColumnObject = v.InferOutput<typeof NeonColumnObjectSchema>

/** Enum-like type to define JOIN type */
export type NeonJoinType = typeof NEON_JOIN_TYPES[number]

/** Valibot schema for object defining 2+ tables for JOIN in SELECT. */
export const NeonTableObjectSchema = v.object({
  /** Schema name */
  schema: v.optional(v.string()),
  /** Table name */
  table: v.string(),
  /** Alias used for table */
  alias: v.optional(v.string()),
  /** Left column (may include alias) for JOIN (ignored for 1st table in array) */
  joinColumn1: v.optional(v.union([v.string(), NeonColumnObjectSchema])),
  /** Right column (may include alias) for JOIN (ignored for 1st table in array) */
  joinColumn2: v.optional(v.union([v.string(), NeonColumnObjectSchema])),
  /** Type for JOIN (ignored for 1st table in array) */
  joinType: v.optional(v.picklist(NEON_JOIN_TYPES)),
})

/** Object for defining 2+ tables for JOIN in SELECT. */
export type NeonTableObject = v.InferOutput<typeof NeonTableObjectSchema>

/** Enum-like type to define operation for column-value pair in WHERE clause */
export type NeonWhereOperator = typeof NEON_WHERE_OPERATORS[number]

/** Enum-like type to define logical relations between more WHERE clauses */
export type NeonWhereRelation = typeof NEON_WHERE_RELATIONS[number]

/** Valibot schema for object defining a WHERE clause. */
export const NeonWhereObjectSchema = v.object({
  /** Column definition */
  column: v.union([v.string(), NeonColumnObjectSchema]),
  /** Operation type */
  operator: v.picklist(NEON_WHERE_OPERATORS),
  /** String value to be used for filtering or column from other table */
  value: v.union([v.string(), NeonColumnObjectSchema]),
  /** Relation with other clauses (ignored for 1st clause) */
  relation: v.optional(v.picklist(NEON_WHERE_RELATIONS)),
})

/** Object for defining a WHERE clause. */
export type NeonWhereObject = v.InferOutput<typeof NeonWhereObjectSchema>

/** Enum-like type to define `ascending` or `descending` sorting */
export type NeonSortDirection = typeof NEON_SORT_DIRECTIONS[number]

/** Valibot schema for object defining an ORDER BY clause. */
export const NeonOrderObjectSchema = v.object({
  /** Column definition */
  column: v.union([v.string(), NeonColumnObjectSchema]),
  /** Sort direction (`ASC` if not specified) */
  direction: v.optional(v.picklist(NEON_SORT_DIRECTIONS)),
})

/** Object for defining an ORDER BY clause. */
export type NeonOrderObject = v.InferOutput<typeof NeonOrderObjectSchema>

// consolidated types

export type NeonDataResponse<T> = Array<T> | NeonError
export type NeonCountResponse = number | NeonError
export type NeonEditResponse = 'OK' | NeonError
export type NeonStatusResponse = NeonStatusResult

/** Object for passing parameterized SQL queries to Neon driver. */
export type NeonParametrizedQuery = {
  /** SQL string with parameter placeholders (`$1`, `$2`, ...) */
  query: string
  /** Array of values that will be interpolated by Neon driver */
  params: string[]
}

export const NeonColumnTypeSchema = v.union([v.string(), v.array(v.string()), NeonColumnObjectSchema, v.array(NeonColumnObjectSchema)])
export type NeonColumnType = v.InferOutput<typeof NeonColumnTypeSchema>

export const NeonTableTypeSchema = v.union([v.string(), NeonTableObjectSchema])
export type NeonTableType = v.InferOutput<typeof NeonTableTypeSchema>

export const NeonFromTypeSchema = v.union([v.string(), NeonTableObjectSchema, v.array(NeonTableObjectSchema)])
export type NeonFromType = v.InferOutput<typeof NeonFromTypeSchema>

export const NeonWhereTypeSchema = v.union([NeonWhereObjectSchema, v.array(NeonWhereObjectSchema)])
export type NeonWhereType = v.InferOutput<typeof NeonWhereTypeSchema>

export const NeonOrderTypeSchema = v.union([NeonOrderObjectSchema, v.array(NeonOrderObjectSchema)])
export type NeonOrderType = v.InferOutput<typeof NeonOrderTypeSchema>

export const NeonInsertTypeSchema = v.union([v.record(v.string(), v.string()), v.array(v.record(v.string(), v.string()))])
export type NeonInsertType = v.InferOutput<typeof NeonInsertTypeSchema>

export const NeonUpdateTypeSchema = v.record(v.string(), v.string())
export type NeonUpdateType = v.InferOutput<typeof NeonUpdateTypeSchema>

export type NeonBodyType = Record<string, unknown>

// query objects for SQL wrappers

export const NeonCountQuerySchema = v.object({
  from: NeonFromTypeSchema,
  where: v.optional(NeonWhereTypeSchema),
})
export type NeonCountQuery = v.InferOutput<typeof NeonCountQuerySchema>

export const NeonSelectQuerySchema = v.object({
  columns: NeonColumnTypeSchema,
  from: NeonFromTypeSchema,
  where: v.optional(NeonWhereTypeSchema),
  order: v.optional(NeonOrderTypeSchema),
  limit: v.optional(v.number()),
  group: v.optional(NeonColumnTypeSchema),
  having: v.optional(NeonWhereTypeSchema),
})
export type NeonSelectQuery = v.InferOutput<typeof NeonSelectQuerySchema>

export const NeonInsertQuerySchema = v.object({
  table: NeonTableTypeSchema,
  values: NeonInsertTypeSchema,
})
export type NeonInsertQuery = v.InferOutput<typeof NeonInsertQuerySchema>

export const NeonUpdateQuerySchema = v.object({
  table: NeonTableTypeSchema,
  values: NeonUpdateTypeSchema,
  where: v.optional(NeonWhereTypeSchema),
})
export type NeonUpdateQuery = v.InferOutput<typeof NeonUpdateQuerySchema>

export const NeonDeleteQuerySchema = v.object({
  table: NeonTableTypeSchema,
  where: v.optional(NeonWhereTypeSchema),
})
export type NeonDeleteQuery = v.InferOutput<typeof NeonDeleteQuerySchema>

export const NeonRawQuerySchema = v.object({
  query: v.string(),
})
export type NeonRawQuery = v.InferOutput<typeof NeonRawQuerySchema>
