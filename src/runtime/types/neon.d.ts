import type * as types from '../utils/neonTypes'

declare global {
  export type NeonSSLModeOption = types.NeonSSLModeOption
  export type NeonError = types.NeonError
  export type NeonStatusResult = types.NeonStatusResult
  export type NeonTableQuery = types.NeonTableQuery
  export type NeonWhereCondition = types.NeonWhereCondition
  export type NeonWhereOperator = types.NeonWhereOperator
  export type NeonWhereQuery = types.NeonWhereQuery
  export type NeonSortDirection = types.NeonSortDirection
  export type NeonOrderQuery = types.NeonOrderQuery

  export type NeonDataType<T> = types.NeonDataType<T>
  export type NeonCountType = types.NeonCountType
  export type NeonEditType = types.NeonEditType
  export type NeonStatusType = types.NeonStatusType

  export type NeonColumnType = types.NeonColumnType
  export type NeonTableType = types.NeonTableType
  export type NeonFromType = types.NeonFromType
  export type NeonWhereType = types.NeonWhereType
  export type NeonOrderType = types.NeonOrderType
  export type NeonValueType = types.NeonValueType
  export type NeonBodyType = types.NeonBodyType
}
