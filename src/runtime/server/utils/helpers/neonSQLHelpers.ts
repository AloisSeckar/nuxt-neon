export function getTableClause(from: NeonFromType): string {
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

export function getColumnsClause(columns: NeonColumnType): string {
  let sqlString = ''
  if (Array.isArray(columns)) {
    sqlString += columns.join(', ')
  }
  else {
    sqlString += columns
  }
  return sqlString
}

export function getWhereClause(where?: NeonWhereType): string {
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

export function getOrderClause(order?: NeonOrderType): string {
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

export function getGroupByClause(group?: NeonColumnType): string {
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

export function getHavingClause(having?: NeonWhereType): string {
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
