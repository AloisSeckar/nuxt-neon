import type {
  NeonInsertQuery, NeonSelectQuery, NeonUpdateQuery, NeonDeleteQuery,
} from '../../../utils/neonTypes'
import {
  getTableName, isTableWithAlias, fixTableAliasForUpdate, getTableClause, getColumnsClause,
  getWhereClause, getOrderClause, getGroupByClause, getHavingClause, getLimitClause,
} from './buildSQLUtils'
import { sanitizeSQLString } from './sanitizeSQL'

export function getSelectSQL(query: NeonSelectQuery): string {
  let sqlString = 'SELECT '

  sqlString += getColumnsClause(query.columns)
  sqlString += getTableClause(query.from)
  sqlString += getWhereClause(query.where)
  sqlString += getGroupByClause(query.group)
  sqlString += getHavingClause(query.having)
  sqlString += getOrderClause(query.order)
  sqlString += getLimitClause(query.limit)

  return sqlString
}

export function getInsertSQL(query: NeonInsertQuery): string {
  // alias is technically not allowed for insert
  if (isTableWithAlias(query.table)) {
    throw new Error('Table alias is not allowed for INSERT statement')
  }

  // data to be inserted
  const rows = Array.isArray(query.values) ? query.values : [query.values]

  // definition of columns for the insert statement
  const columns = Object.keys(rows[0])
  const sqlColumns = columns.map(col => sanitizeSQLString(col)).join(', ')

  // definition of values for the insert statement
  const valueTuples = rows.map(row =>
    '(' + columns.map(col => sanitizeSQLString(row[col])).join(', ') + ')',
  ).join(', ')

  return `INSERT INTO ${getTableName(query.table)} (${sqlColumns}) VALUES ${valueTuples}`
}

export function getUpdateSQL(query: NeonUpdateQuery): string {
  let sqlString = `UPDATE ${getTableName(query.table)}`

  // alias has a special syntax in update with "AS"
  if (isTableWithAlias(query.table)) {
    fixTableAliasForUpdate(sqlString, query.table)
  }

  sqlString += ' SET '
  Object.entries(query.values).forEach(([key, value]) => {
    const sanitizedKey = '"' + sanitizeSQLString(key).slice(1, -1) + '"' // columns in update must be double-quoted
    sqlString += `${sanitizedKey} = ${sanitizeSQLString(value)}, `
  })
  sqlString = sqlString.slice(0, -2) // remove last comma and space

  sqlString += getWhereClause(query.where)

  return sqlString
}

export function getDeleteSQL(query: NeonDeleteQuery): string {
  let sqlString = `DELETE FROM ${getTableName(query.table)}`

  sqlString += getWhereClause(query.where)

  return sqlString
}
