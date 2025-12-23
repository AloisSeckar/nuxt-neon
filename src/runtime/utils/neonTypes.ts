// NOTE: this is used for re-exporting types declared in `neon.d.ts`

import * as constants from '../types/neon-constants'
import type * as types from '../types/neon.d.ts'

export const NEON_WHERE_OPERATORS = constants.NEON_WHERE_OPERATORS
export const NEON_WHERE_RELATIONS = constants.NEON_WHERE_RELATIONS
export const NEON_JOIN_TYPES = constants.NEON_JOIN_TYPES
export const NEON_SORT_DIRECTIONS = constants.NEON_SORT_DIRECTIONS

export type NeonSSLModeOption = types.NeonSSLModeOption
export type NeonError = types.NeonError
export type NeonStatusResult = types.NeonStatusResult

export type NeonColumnObject = types.NeonColumnObject
export type NeonTableObject = types.NeonTableObject
export type NeonJoinType = types.NeonJoinType
export type NeonWhereOperator = types.NeonWhereOperator
export type NeonWhereRelation = types.NeonWhereRelation
export type NeonWhereObject = types.NeonWhereObject
export type NeonSortDirection = types.NeonSortDirection
export type NeonOrderObject = types.NeonOrderObject

export type NeonDataType<T> = types.NeonDataType<T>
export type NeonCountType = types.NeonCountType
export type NeonEditType = types.NeonEditType
export type NeonStatusType = types.NeonStatusType

export type NeonColumnType = types.NeonColumnType
export type NeonTableType = types.NeonTableType
export type NeonFromType = types.NeonFromType
export type NeonWhereType = types.NeonWhereType
export type NeonOrderType = types.NeonOrderType
export type NeonInsertType = types.NeonInsertType
export type NeonUpdateType = types.NeonUpdateType
export type NeonBodyType = types.NeonBodyType

export type NeonCountQuery = types.NeonCountQuery
export type NeonSelectQuery = types.NeonSelectQuery
export type NeonInsertQuery = types.NeonInsertQuery
export type NeonUpdateQuery = types.NeonUpdateQuery
export type NeonDeleteQuery = types.NeonDeleteQuery
