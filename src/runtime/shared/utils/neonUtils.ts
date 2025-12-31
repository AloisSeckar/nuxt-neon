import type { NeonWhereType, NeonWhereOperator, NeonSSLModeOption } from '../types/neon'

// workaround so this type can be referenced in module.ts
export type { NeonSSLModeOption }

// fix for https://github.com/AloisSeckar/nuxt-neon/issues/45
// replace ">" and "<" in WHERE clauses with safe values (will be reverted in backend)
export function encodeWhereType(where?: NeonWhereType) {
  if (where) {
    if (Array.isArray(where)) {
      where.forEach((w) => {
        w.operator = encodeWhereString(w.operator)
      })
    } else {
      where.operator = encodeWhereString(where.operator)
    }
  }
  return where
}

function encodeWhereString(where?: string) {
  if (where) {
    where = where.replaceAll('<=', 'LTE').replaceAll('<', 'LT').replaceAll('>=', 'GTE').replaceAll('>', 'GT')
  }
  return where as NeonWhereOperator
}

export function decodeWhereType(where?: NeonWhereType) {
  if (where) {
    if (Array.isArray(where)) {
      where.forEach((w) => {
        w.operator = decodeWhereString(w.operator)
      })
    } else {
      where.operator = decodeWhereString(where.operator)
    }
  }
  return where
}

function decodeWhereString(where?: string) {
  if (where) {
    where = where.replaceAll('LTE', '<=').replaceAll('LT', '<').replaceAll('GTE', '>=').replaceAll('GT', '>')
  }
  return where as NeonWhereOperator
}
