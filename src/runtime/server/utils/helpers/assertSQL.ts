// cannot reference from '#imports' due to unit tests!
import {
  NEON_JOIN_TYPES, NEON_SORT_DIRECTIONS,
  NEON_WHERE_OPERATORS, NEON_WHERE_RELATIONS,
} from '../../../shared/types/neon-constants'
import type {
  NeonFromType,
  NeonJoinType, NeonSortDirection,
  NeonWhereOperator, NeonWhereRelation,
} from '../../../shared/types/neon'

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

export function assertAllowedTable(table: NeonFromType, allowedTables: string[]): void {
  let tableName: string
  if (typeof table === 'string') {
    // string - test as-is
    tableName = table
  } else if (Array.isArray(table)) {
    // array of table objects - check each one recursively
    table.forEach(t => assertAllowedTable(t, allowedTables))
    return
  } else {
    // table object - test with or without schema
    if (table.schema) {
      tableName = `${table.schema}.${table.table}`
    } else {
      tableName = table.table
    }
  }

  // ALL = everything is allowed (unsafe)
  if (allowedTables.includes('NEON_ALL')) {
    return
  }

  // PUBLIC = all user-defined tables
  // filter out:
  // - tables with "pg_" prefix
  // - tables within "information_schema"
  if (allowedTables.includes('NEON_PUBLIC')) {
    if ((!tableName.includes('pg_') && !tableName.includes('information_schema.')) || allowedTables.includes(tableName)) {
      return
    }
  }

  // otherwise - table must be explicitly listed
  if (!allowedTables.includes(tableName)) {
    throw new Error(`Query for table '${tableName}' rejected as not allowed. Whitelisted tables can be set via \`neon.neonAllowedTables\` or \`NUXT_NEON_ALLOWED_TABLES\``)
  }
}

export function assertAllowedQuery(query: string, allowedQueries: string[]): void {
  // ALL = everything is allowed (unsafe)
  if (allowedQueries.includes('NEON_ALL')) {
    return
  }

  // otherwise - table must be explicitly listed
  if (!allowedQueries.includes(query)) {
    throw new Error(`Query '${query}' rejected as not allowed. Whitelisted queries can be set via \`neon.neonAllowedQueries\` or \`NUXT_NEON_ALLOWED_QUERIES\``)
  }
}
