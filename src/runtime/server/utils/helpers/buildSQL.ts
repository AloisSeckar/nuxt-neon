// cannot reference from '#imports' in runtime server utils
import type {
  NeonInsertQuery, NeonSelectQuery, NeonUpdateQuery, NeonDeleteQuery,
  NeonParametrizedQuery,
} from '../../../shared/types/neon'
import {
  getTableName, isTableWithAlias, fixTableAliasForUpdate, getTableClause, getColumnsClause,
  getWhereClause, getOrderClause, getGroupByClause, getHavingClause, getLimitClause,
} from './buildSQLUtils'
import { createSQLBinder } from './bindSQL'
import { sanitizeSQLString } from './sanitizeSQL'

export function getSelectSQL(query: NeonSelectQuery): NeonParametrizedQuery {
  const binder = createSQLBinder()

  let sqlString = 'SELECT '

  sqlString += getColumnsClause(query.columns)
  sqlString += getTableClause(query.from)
  sqlString += getWhereClause(query.where, binder)
  sqlString += getGroupByClause(query.group)
  sqlString += getHavingClause(query.having, binder)
  sqlString += getOrderClause(query.order)
  sqlString += getLimitClause(query.limit)

  return { query: sqlString, params: binder.params }
}

export function getInsertSQL(query: NeonInsertQuery): NeonParametrizedQuery {
  // alias is technically not allowed for insert
  if (isTableWithAlias(query.table)) {
    throw new Error('Table alias is not allowed for INSERT statement')
  }

  const binder = createSQLBinder()

  // data to be inserted
  const rows = Array.isArray(query.values) ? query.values : [query.values]

  // definition of columns for the insert statement
  // columns in insert must be double-quoted
  const columns = Object.keys(rows[0]!)
  const sqlColumns = columns.map(col => `"${sanitizeSQLString(col).slice(1, -1)}"`).join(', ')

  // definition of values for the insert statement
  // values are bound as parameters ($1, $2, ...)
  const valueTuples = rows.map(row =>
    '(' + columns.map(col => binder.bind(row[col]!)).join(', ') + ')',
  ).join(', ')

  return {
    query: `INSERT INTO ${getTableName(query.table)} (${sqlColumns}) VALUES ${valueTuples}`,
    params: binder.params,
  }
}

export function getUpdateSQL(query: NeonUpdateQuery): NeonParametrizedQuery {
  const binder = createSQLBinder()

  let sqlString = `UPDATE ${getTableName(query.table)}`

  // alias has a special syntax in update with "AS"
  if (isTableWithAlias(query.table)) {
    sqlString = fixTableAliasForUpdate(sqlString, query.table)
  }

  sqlString += ' SET '
  Object.entries(query.values).forEach(([key, value]) => {
    // columns in update must be double-quoted, values are bound as parameters
    sqlString += `"${sanitizeSQLString(key).slice(1, -1)}" = ${binder.bind(value)}, `
  })
  sqlString = sqlString.slice(0, -2) // remove last comma and space

  sqlString += getWhereClause(query.where, binder)

  return { query: sqlString, params: binder.params }
}

export function getDeleteSQL(query: NeonDeleteQuery): NeonParametrizedQuery {
  const binder = createSQLBinder()

  let sqlString = `DELETE FROM ${getTableName(query.table)}`

  sqlString += getWhereClause(query.where, binder)

  return { query: sqlString, params: binder.params }
}
