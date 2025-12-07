import type { NeonWhereType, NeonWhereCondition } from './neonTypes'

// fix for https://github.com/AloisSeckar/nuxt-neon/issues/45
// replace ">" and "<" in WHERE clauses with safe values (will be reverted in backend)
export function encodeWhereType(where?: NeonWhereType) {
  if (where) {
    if (typeof where === 'string') {
      where = encodeWhereString(where)
    }
    else if (Array.isArray(where)) {
      where.forEach((w) => {
        w.condition = encodeWhereString(w.condition)
      })
    }
    else {
      where.condition = encodeWhereString(where.condition)
    }
  }
  return where
}

function encodeWhereString(where?: string) {
  if (where) {
    where = where.replaceAll('<=', 'LTE').replaceAll('<', 'LT').replaceAll('>=', 'GTE').replaceAll('>', 'GT')
  }
  return where as NeonWhereCondition | 'GT' | 'GTE' | 'LT' | 'LTE'
}

export function decodeWhereType(where?: NeonWhereType) {
  if (where) {
    if (typeof where === 'string') {
      where = decodeWhereString(where)
    }
    else if (Array.isArray(where)) {
      where.forEach((w) => {
        w.condition = decodeWhereString(w.condition)
      })
    }
    else {
      where.condition = decodeWhereString(where.condition)
    }
  }
  return where
}

function decodeWhereString(where?: string) {
  if (where) {
    where = where.replaceAll('LTE', '<=').replaceAll('LT', '<').replaceAll('GTE', '>=').replaceAll('GT', '>')
  }
  return where as NeonWhereCondition
}
