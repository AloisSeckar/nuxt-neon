import type { NeonQueryFunction } from '@neondatabase/serverless'
import type { NeonTableQuery, NeonWhereQuery, NeonOrderQuery } from '../../utils/neonTypes'
import type { NeonDriverResult } from './getNeonClient'
import { sanitizeSQLString } from './sanitizeSQL'

// separate wrapper instead of forcing users to pass 'count(*)' as column name
export async function count(neon: NeonQueryFunction<boolean, boolean>, from: string | NeonTableQuery | NeonTableQuery[], where?: string | NeonWhereQuery | NeonWhereQuery[]) {
  return await select(neon, ['count(*)'], from, where, undefined, undefined)
}

export async function select(neon: NeonQueryFunction<boolean, boolean>, columns: string | string[], from: string | NeonTableQuery | NeonTableQuery[], where?: string | NeonWhereQuery | NeonWhereQuery[], order?: string | NeonOrderQuery | NeonOrderQuery[], limit?: number, group?: string | string[], having?: string | NeonWhereQuery | NeonWhereQuery[]): Promise<NeonDriverResult<false, false>> {
  let sqlString = 'SELECT '

  if (Array.isArray(columns)) {
    sqlString += columns.join(', ')
  }
  else {
    sqlString += columns
  }

  sqlString += getTableClause(from)

  sqlString += getWhereClause(where)

  sqlString += getGroupByClause(group)

  sqlString += getHavingClause(having)

  sqlString += getOrderClause(order)

  if (limit) {
    sqlString += ` LIMIT ${limit}`
  }

  console.debug(sqlString)

  // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
  return await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
}

export async function insert(neon: NeonQueryFunction<boolean, boolean>, table: string | NeonTableQuery, values: Record<string, string>): Promise<NeonDriverResult<false, false>> {
  let sqlString = `INSERT INTO ${table}`

  const sqlColumns = [] as string[]
  const sqlValues = [] as string[]
  for (const [key, value] of Object.entries(values)) {
    sqlColumns.push(key)
    sqlValues.push(sanitizeSQLString(value))
  }

  sqlString += ' ('
  sqlString += sqlColumns.join(', ')
  sqlString += ') '

  sqlString += ' VALUES ('
  sqlString += sqlValues.join(', ')
  sqlString += ')'

  // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
  return await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
}

export async function update(neon: NeonQueryFunction<boolean, boolean>, table: string | NeonTableQuery, values: Record<string, string>, where?: string | NeonWhereQuery | NeonWhereQuery[]): Promise<NeonDriverResult<false, false>> {
  let sqlString = `UPDATE ${table}`

  sqlString += ' SET '
  Object.entries(values).forEach(([key, value]) => {
    sqlString += `${key} = ${sanitizeSQLString(value)},`
  })
  sqlString = sqlString.slice(0, -1) // remove last comma

  sqlString += getWhereClause(where)

  console.debug(sqlString)

  // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
  return await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
}

export async function del(neon: NeonQueryFunction<boolean, boolean>, table: string | NeonTableQuery, where?: string | NeonWhereQuery | NeonWhereQuery[]): Promise<NeonDriverResult<false, false>> {
  let sqlString = `DELETE FROM ${table}`

  sqlString += getWhereClause(where)

  console.debug(sqlString)

  // passing in "queryOpts" (matching with defaults) to fullfill TypeScript requirements
  return await neon.query(sqlString, undefined, { arrayMode: false, fullResults: false })
}

function getTableClause(from: string | NeonTableQuery | NeonTableQuery[]): string {
  let sqlString = ' FROM '
  if (typeof from === 'string') {
    sqlString += from
  }
  else if (Array.isArray(from)) {
    let tables = ''
    from.forEach((t) => {
      if (tables) {
        tables += ` JOIN ${tableWithSchema(t)} ${t.alias} ON ${t.joinColumn1} = ${t.joinColumn2}`
      }
      else {
        tables = `${tableWithSchema(t)} ${t.alias}`
      }
    })
    sqlString += tables
  }
  else {
    sqlString += tableWithSchema(from)
  }
  return sqlString
}

// include schema name if specified
function tableWithSchema(t: NeonTableQuery): string {
  if (t.schema) {
    return `${t.schema}.${t.table}`
  }
  return t.table
}

function getWhereClause(where?: string | NeonWhereQuery | NeonWhereQuery[]): string {
  let sqlString = ''
  if (where) {
    sqlString += ' WHERE '
    if (typeof where === 'string') {
      sqlString += where
    }
    else if (Array.isArray(where)) {
      let conditions = ''
      where.forEach((w) => {
        if (conditions) {
          conditions += ` ${w.operator} ${w.column} ${w.condition} ${escapeIfNeeded(w.value)}`
        }
        else {
          conditions = `${w.column} ${w.condition} ${escapeIfNeeded(w.value)}`
        }
      })
      sqlString += conditions
    }
    else {
      sqlString += `${where.column} ${where.condition} ${escapeIfNeeded(where.value)}`
    }
  }
  return sqlString
}

function getOrderClause(order?: string | NeonOrderQuery | NeonOrderQuery[]): string {
  let sqlString = ''
  if (order) {
    sqlString = ' ORDER BY '
    if (typeof order === 'string') {
      sqlString += order
    }
    else if (Array.isArray(order)) {
      let ordering = ''
      order.forEach((o) => {
        if (ordering) {
          ordering += `, ${o.column} ${o.direction || 'ASC'}`
        }
        else {
          ordering = `${o.column} ${o.direction || 'ASC'}`
        }
      })
      sqlString += ordering
    }
    else {
      sqlString += `${order.column} ${order.direction || 'ASC'}`
    }
  }
  return sqlString
}

function getGroupByClause(group?: string | string[]): string {
  let sqlString = ''
  if (group) {
    sqlString = ' GROUP BY '
    if (Array.isArray(group)) {
      sqlString += group.join(', ')
    }
    else {
      sqlString += group
    }
  }
  return sqlString
}

function getHavingClause(having?: string | NeonWhereQuery | NeonWhereQuery[]): string {
  let sqlString = ''
  if (having) {
    sqlString += ' HAVING '
    if (typeof having === 'string') {
      sqlString += having
    }
    else if (Array.isArray(having)) {
      let conditions = ''
      having.forEach((h) => {
        if (conditions) {
          conditions += ` ${h.operator} ${h.column} ${h.condition} ${escapeIfNeeded(h.value)}`
        }
        else {
          conditions = `${h.column} ${h.condition} ${escapeIfNeeded(h.value)}`
        }
      })
      sqlString += conditions
    }
    else {
      sqlString += `${having.column} ${having.condition} ${escapeIfNeeded(having.value)}`
    }
  }
  return sqlString
}

function escapeIfNeeded(value: unknown) {
  if (typeof value === 'string' && !value.startsWith('\'')) {
    value = '\'' + value
  }
  if (typeof value === 'string' && !value.endsWith('\'')) {
    value = value + '\''
  }
  return value
}
