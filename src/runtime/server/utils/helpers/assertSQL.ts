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

export function assertAllowedTable(table: string, allowedTables: string[]): void {
  // ALL = everything is allowed (unsafe)
  if (allowedTables.includes('NEON_ALL')) {
    return
  }

  // PUBLIC = all user-defined tables
  // filter out:
  // - tables with "pg_" prefix
  // - tables within "information_schema"
  if (allowedTables.includes('NEON_PUBLIC')) {
    if ((!table.includes('pg_') && !table.includes('information_schema.')) || allowedTables.includes(table)) {
      return
    }
  }

  // otherwise - table must be explicitly listed
  if (!allowedTables.includes(table)) {
    throw new Error(`Query for table '${table}' rejected as not allowed. Whitelisted tables can be set via \`neon.neonAllowedTables: true\` or \`NUXT_PUBLIC_NEON_ALLOWED_TABLES:\``)
  }
}
