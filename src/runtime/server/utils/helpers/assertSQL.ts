import {
  NEON_JOIN_TYPES, NEON_SORT_DIRECTIONS,
  NEON_WHERE_OPERATORS, NEON_WHERE_RELATIONS,
} from '../../../utils/neonTypes'
import type {
  NeonJoinType, NeonSortDirection,
  NeonWhereOperator, NeonWhereRelation,
} from '../../../utils/neonTypes'

export function assertNeonWhereOperator(operator?: string): void {
  if (operator) {
    if (!NEON_WHERE_OPERATORS.includes(operator as NeonWhereOperator)) {
      throw new Error(`Invalid WHERE operator '${operator}' rejected as potential SQL injection. Report bug in Nuxt Neon module repository if this is a false positive.`)
    }
  }
}

export function assertNeonWhereRelation(relation?: string): void {
  if (relation) {
    if (!NEON_WHERE_RELATIONS.includes(relation as NeonWhereRelation)) {
      throw new Error(`Invalid WHERE relation '${relation}' rejected as potential SQL injection. Report bug in Nuxt Neon module repository if this is a false positive.`)
    }
  }
}

export function assertNeonJoinType(type?: string): void {
  if (type) {
    if (!NEON_JOIN_TYPES.includes(type as NeonJoinType)) {
      throw new Error(`Invalid JOIN type '${type}' rejected as potential SQL injection. Report bug in Nuxt Neon module repository if this is a false positive.`)
    }
  }
}
export function assertNeonSortDirection(direction?: string): void {
  if (direction) {
    if (!NEON_SORT_DIRECTIONS.includes(direction as NeonSortDirection)) {
      throw new Error(`Invalid SORT direction '${direction}' rejected as potential SQL injection. Report bug in Nuxt Neon module repository if this is a false positive.`)
    }
  }
}
