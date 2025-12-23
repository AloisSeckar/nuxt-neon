import SqlString from 'sqlstring'
import {
  NEON_JOIN_TYPES, NEON_SORT_DIRECTIONS,
  NEON_WHERE_OPERATORS, NEON_WHERE_RELATIONS,
} from '../../../utils/neonTypes'
import type {
  NeonJoinType, NeonSortDirection,
  NeonWhereOperator, NeonWhereRelation,
} from '../../../utils/neonTypes'

export function sanitizeSQLString(sql: string): string {
  testInputString(sql)
  return SqlString.escape(sql)
}

export function sanitizeSQLArray(sql: string[]): string[] {
  const sanitizedSQL = [] as string[]
  sql?.forEach((sql) => {
    testInputString(sql)
    sanitizedSQL.push(sanitizeSQLString(sql))
  })
  return sanitizedSQL
}

export function sanitizeSQLIdentifier(identifier: string): string {
  if (identifier) {
    testInputString(identifier, true)
    let sanitized = SqlString.escape(identifier)
    // in case alias or schema is passed, add double quotes
    sanitized = sanitized.replaceAll('.', '"."')
    // in PostgreSQL, identifiers must be wrapped in double quotes
    return '"' + sanitized.slice(1, -1) + '"'
  }
  return identifier
}

// reject obvious SQL injection attempts before passing inputs further
// if allowDots is true, dots are allowed (for schema.table or table.alias)
export function testInputString(input: string, allowDots = false): void {
  if (input) {
    try {
    // semicolon => SQL injection attempt
      if (input.includes(';')) {
        throw new Error('Invald input - contains semicolon')
      }
      // equals => SQL injection attempt
      if (input.includes('=')) {
        throw new Error('Invald input - contains equals')
      }
      // comments => SQL injection attempt
      if (input.includes('--') || input.includes('/*') || input.includes('*/')) {
        throw new Error('Invald input - contains comments')
      }
      // dot - schemas and aliases are handled, dots in values are suspicious
      // ignore if told so (explicit internal call for schema.table or table.alias)
      // can be decimal number though
      if (!allowDots) {
        if (input.includes('.') && Number.isNaN(Number(input))) {
          throw new Error('Invald input - contains dot')
        }
      }
      // control characters
      // eslint-disable-next-line no-control-regex
      if (/[\x00-\x1F\x7F]/.test(input)) {
        throw new Error('Invald input - contains control characters')
      }
    }
    catch (e) {
      // TODO this should depend on runtime config, but `#imports` currently doesn't work in tests
      console.debug('testInputString', input, (e as Error).message)
      //
      throw new Error(`Value ${input} rejected as potential SQL injection. Report bug in Nuxt Neon module repository if this is a false positive.`)
    }
  }
}

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
