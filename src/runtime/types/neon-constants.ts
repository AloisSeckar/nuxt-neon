export const NEON_WHERE_OPERATORS = [
  '=', '!=', '>', 'GT', '>=', 'GTE', '<', 'LT', '<=', 'LTE',
  'LIKE', 'IN', 'NOT IN', 'BETWEEN',
] as const

export const NEON_WHERE_RELATIONS = [
  'AND', 'OR',
] as const

export const NEON_JOIN_TYPES = [
  'INNER', 'LEFT', 'RIGHT', 'FULL',
] as const

export const NEON_SORT_DIRECTIONS = [
  'ASC', 'asc', 'DESC', 'desc',
] as const
