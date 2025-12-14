import type {
  NeonFromType, NeonTableType, NeonTableObject, NeonOrderType,
  NeonColumnObject, NeonColumnType, NeonWhereObject, NeonWhereType,
} from '../../../utils/neonTypes'
import { decodeWhereType } from '../../../utils/neonUtils'

export function getTableName(table: NeonTableType): string {
  if (typeof table === 'string') {
    // return as is
    return table
  }
  else {
    // evaluate schema and alias
    return tableWithSchemaAndAlias(table)
  }
}

export function isTableWithAlias(table: NeonTableType): boolean {
  return typeof table === 'object'
    && table !== null
    && typeof table.alias === 'string'
    && table.alias.trim() !== ''
}

export function getTableClause(from: NeonFromType): string {
  let sqlString = ' FROM '
  if (typeof from === 'string') {
    sqlString += from
  }
  else if (Array.isArray(from)) {
    let tables = ''
    from.forEach((t) => {
      if (tables) {
        if (t.joinColumn1) {
          const joinCondition = getJoinCondition(t.joinColumn1!, t.joinColumn2!)
          tables += ` ${t.joinType || 'INNER'} JOIN ${tableWithSchemaAndAlias(t)} ON ${joinCondition}`
        }
        else {
          tables += `, ${tableWithSchemaAndAlias(t)}`
        }
      }
      else {
        tables = tableWithSchemaAndAlias(t)
      }
    })
    sqlString += tables
  }
  else {
    sqlString += tableWithSchemaAndAlias(from)
  }
  return sqlString
}

// include schema name if specified
function tableWithSchemaAndAlias(t: NeonTableObject): string {
  if (t.schema) {
    return `${t.schema}.${tableWithAlias(t)}`
  }
  return tableWithAlias(t)
}

function tableWithAlias(t: NeonTableObject): string {
  if (t.alias) {
    return `${t.table} ${t.alias}`
  }
  return t.table
}

// handle join condition
function getJoinCondition(c1: string | NeonColumnObject, c2: string | NeonColumnObject) {
  return `${columnWithAlias(c1)} = ${columnWithAlias(c2)}`
}

export function getColumnsClause(columns: NeonColumnType): string {
  let sqlString = ''
  if (Array.isArray(columns)) {
    if (columns[0] && (typeof columns[0] === 'object')) {
      sqlString += columns.map(c => columnWithAlias(c as NeonColumnObject)).join(', ')
    }
    else {
      sqlString += columns.join(', ')
    }
  }
  else {
    sqlString += columnWithAlias(columns)
  }
  return sqlString
}

// include table alias if specified
function columnWithAlias(c: string | NeonColumnObject): string {
  if (typeof c === 'string') {
    return c
  }

  if (c.alias) {
    return `${c.alias}.${c.name}`
  }

  return c.name
}

export function getWhereClause(where?: NeonWhereType): string {
  let sqlString = ''

  // fix for https://github.com/AloisSeckar/nuxt-neon/issues/45
  where = decodeWhereType(where)

  if (where) {
    if (typeof where === 'string') {
      sqlString += where
    }
    else if (Array.isArray(where)) {
      if (where.length > 0) {
        let clause = ''
        where.forEach((w) => {
          if (clause) {
            clause += formatWhereObject(w, true)
          }
          else {
            clause = formatWhereObject(w)
          }
        })
        sqlString += clause
      }
    }
    else {
      sqlString += formatWhereObject(where)
    }
  }

  if (sqlString) {
    sqlString = ' WHERE ' + sqlString
  }
  return sqlString
}

function formatWhereObject(w: NeonWhereObject, includeOperator: boolean = false) {
  let whereSQL = ''

  if (includeOperator) {
    whereSQL += ` ${w.operator} `
  }

  whereSQL += columnWithAlias(w.column)
  whereSQL += ` ${w.condition} `

  if (w.condition.includes('IN')) {
    // values separated by comma must be passed
    const inValues = w.value.toString().split(',')
    whereSQL += `('`
    whereSQL += inValues.join(`', '`)
    whereSQL += `')`
  }
  else if (w.condition === 'BETWEEN') {
    // exactly two values separated by comma must be passed
    const betweenValues = w.value.toString().split(',')
    whereSQL += `${betweenValues[0]} AND ${betweenValues[1]}`
  }
  else {
    // no special processing for other operators
    whereSQL += formatWhereValue(w.value)
  }

  return whereSQL
}

function formatWhereValue(v: string | NeonColumnObject) {
  // plain value from current table
  if (typeof v === 'string') {
    return escapeIfNeeded(v)
  }
  // column from another table
  return columnWithAlias(v)
}

export function getOrderClause(order?: NeonOrderType): string {
  let sqlString = ''

  if (order) {
    if (typeof order === 'string') {
      sqlString += order
    }
    else if (Array.isArray(order)) {
      if (order.length > 0) {
        let ordering = ''
        order.forEach((o) => {
          if (ordering) {
            ordering += `, `
          }
          ordering += `${columnWithAlias(o.column)} ${o.direction?.toUpperCase() || 'ASC'}`
        })
        sqlString += ordering
      }
    }
    else {
      sqlString += `${columnWithAlias(order.column)} ${order.direction?.toUpperCase() || 'ASC'}`
    }
  }

  if (sqlString) {
    sqlString = ' ORDER BY ' + sqlString
  }
  return sqlString
}

export function getGroupByClause(group?: NeonColumnType): string {
  let sqlString = ''
  if (group) {
    sqlString = ' GROUP BY '
    sqlString += getColumnsClause(group)
  }
  return sqlString
}

export function getHavingClause(having?: NeonWhereType): string {
  let sqlString = ''

  // fix for https://github.com/AloisSeckar/nuxt-neon/issues/45
  having = decodeWhereType(having)

  if (having) {
    if (typeof having === 'string') {
      sqlString += having
    }
    else if (Array.isArray(having)) {
      if (having.length > 0) {
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
    }
    else {
      sqlString += `${having.column} ${having.condition} ${escapeIfNeeded(having.value)}`
    }
  }

  if (sqlString) {
    sqlString = ' HAVING ' + sqlString
  }
  return sqlString
}

export function getLimitClause(limit?: number): string {
  let sqlString = ''
  if (limit) {
    sqlString += ` LIMIT ${limit}`
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
