import type {
  NeonFromType, NeonTableType, NeonTableObject, NeonOrderType,
  NeonColumnObject, NeonColumnType, NeonWhereObject, NeonWhereType,
} from '../../../utils/neonTypes'
import {
  decodeWhereType,
} from '../../../utils/neonUtils'
import {
  assertNeonWhereOperator, assertNeonWhereRelation,
  assertNeonJoinType, assertNeonSortDirection,
} from './assertSQL'
import {
  sanitizeSQLIdentifier, sanitizeSQLString,
} from './sanitizeSQL'

export function getTableName(table: NeonTableType): string {
  if (typeof table === 'string') {
    return sanitizeSQLIdentifier(table)
  } else {
    if (table.schema) {
      const tableWithSchema = `${table.schema}.${table.table}`
      if (table.alias) {
        return `${sanitizeSQLIdentifier(tableWithSchema)} ${sanitizeSQLIdentifier(table.alias)}`
      } else {
        return sanitizeSQLIdentifier(tableWithSchema)
      }
    } else {
      if (table.alias) {
        return `${sanitizeSQLIdentifier(table.table)} ${sanitizeSQLIdentifier(table.alias)}`
      } else {
        return sanitizeSQLIdentifier(table.table)
      }
    }
  }
}

export function isTableWithAlias(table: NeonTableType): boolean {
  return typeof table === 'object'
    && table !== null
    && typeof table.alias === 'string'
    && table.alias.trim() !== ''
}

export function fixTableAliasForUpdate(sqlString: string, table: NeonTableType): void {
  const alias = (table as NeonTableObject).alias
  sqlString.replace(` ${alias}`, ` AS ${alias}`)
}

export function getTableClause(from: NeonFromType): string {
  let sqlString = ' FROM '
  if (typeof from === 'string') {
    sqlString += getTableName(from)
  }
  else if (Array.isArray(from)) {
    let tables = ''
    from.forEach((t) => {
      if (tables) {
        if (t.joinColumn1) {
          const joinClause = getJoinClause(t.joinColumn1!, t.joinColumn2!)
          assertNeonJoinType(t.joinType)
          tables += ` ${t.joinType || 'INNER'} JOIN ${getTableName(t)} ON ${joinClause}`
        } else {
          tables += `, ${getTableName(t)}`
        }
      } else {
        tables = getTableName(t)
      }
    })
    sqlString += tables
  } else {
    sqlString += getTableName(from)
  }
  return sqlString
}

// handle join clause
function getJoinClause(c1: string | NeonColumnObject, c2: string | NeonColumnObject) {
  return `${columnWithAlias(c1)} = ${columnWithAlias(c2)}`
}

export function getColumnsClause(columns: NeonColumnType): string {
  let sqlString = ''
  if (Array.isArray(columns)) {
    if (columns[0] && (typeof columns[0] === 'object')) {
      sqlString += columns.map(c => columnWithAlias(c as NeonColumnObject)).join(', ')
    } else {
      sqlString += columns.map(c => columnWithAlias(c as string)).join(', ')
    }
  } else {
    sqlString += columnWithAlias(columns)
  }
  return sqlString
}

// include table alias if specified
function columnWithAlias(c: string | NeonColumnObject): string {
  if (typeof c === 'string') {
    // exception for '*' (all columns)
    if (c === '*') {
      return c
    }
    // exception for 'count(*)' or 'count(column)'
    if (c.match(/^count\([*|[\w]+\)$/)) {
      return c
    }
    // return sanitized value
    return sanitizeSQLIdentifier(c)
  }

  if (c.alias) {
    return sanitizeSQLIdentifier(`${c.alias}.${c.name}`)
  }

  return sanitizeSQLIdentifier(c.name)
}

export function getWhereClause(where?: NeonWhereType): string {
  let sqlString = ''

  // fix for https://github.com/AloisSeckar/nuxt-neon/issues/45
  where = decodeWhereType(where)

  if (where) {
    if (Array.isArray(where)) {
      if (where.length > 0) {
        let clauses = ''
        where.forEach((w) => {
          if (clauses) {
            clauses += formatWhereObject(w, true)
          } else {
            clauses = formatWhereObject(w)
          }
        })
        sqlString += clauses
      }
    } else {
      sqlString += formatWhereObject(where)
    }
  }

  if (sqlString) {
    sqlString = ' WHERE ' + sqlString
  }
  return sqlString
}

function formatWhereObject(w: NeonWhereObject, includeRelation: boolean = false) {
  let whereSQL = ''

  if (includeRelation) {
    assertNeonWhereRelation(w.relation)
    whereSQL += ` ${w.relation} `
  }

  whereSQL += columnWithAlias(w.column)

  assertNeonWhereOperator(w.operator)
  whereSQL += ` ${w.operator} `

  if (w.operator.includes('IN')) {
    // values separated by comma must be passed
    const inValues = w.value.toString().split(',')
    whereSQL += `('`
    whereSQL += inValues.join(`', '`)
    whereSQL += `')`
  }
  else if (w.operator === 'BETWEEN') {
    // exactly two values separated by comma must be passed
    const betweenValues = w.value.toString().split(',')
    whereSQL += `${formatWhereValue(betweenValues[0]!)} AND ${formatWhereValue(betweenValues[1]!)}`
  } else {
    // no special processing for other operators
    whereSQL += formatWhereValue(w.value)
  }

  return whereSQL
}

function formatWhereValue(v: string | NeonColumnObject) {
  // plain value from current table
  if (typeof v === 'string') {
    // remove surrounding quotes if present (to avoid double-escaping)
    if (v.startsWith('\'') && v.endsWith('\'')) {
      v = v.slice(1, -1)
    }
    // sanitize rest
    return sanitizeSQLString(v)
  }
  // column from another table
  return columnWithAlias(v)
}

export function getOrderClause(order?: NeonOrderType): string {
  let sqlString = ''

  if (order) {
    if (Array.isArray(order)) {
      if (order.length > 0) {
        let ordering = ''
        order.forEach((o) => {
          if (ordering) {
            ordering += `, `
          }
          assertNeonSortDirection(o.direction)
          ordering += `${columnWithAlias(o.column)} ${o.direction?.toUpperCase() || 'ASC'}`
        })
        sqlString += ordering
      }
    } else {
      assertNeonSortDirection(order.direction)
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
    if (Array.isArray(having)) {
      if (having.length > 0) {
        let clauses = ''
        having.forEach((h) => {
          if (clauses) {
            clauses += formatWhereObject(h, true)
          } else {
            clauses = formatWhereObject(h)
          }
        })
        sqlString += clauses
      }
    } else {
      sqlString += formatWhereObject(having)
    }
  }

  if (sqlString) {
    sqlString = ' HAVING ' + sqlString
  }
  return sqlString
}

export function getLimitClause(limit?: number): string {
  let sqlString = ''
  if (limit && typeof limit === 'number') {
    sqlString += ` LIMIT ${limit}`
  }
  return sqlString
}
