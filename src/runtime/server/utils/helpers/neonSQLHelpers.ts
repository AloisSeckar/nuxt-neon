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
          tables += ` JOIN ${tableWithSchemaAndAlias(t)} ON ${joinCondition}`
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
  const left = typeof c1 === 'string' ? c1 : columnWithAlias(c1)
  const right = typeof c2 === 'string' ? c2 : columnWithAlias(c2)
  return `${left} = ${right}`
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
    if (typeof columns === 'object') {
      sqlString += columnWithAlias(columns)
    }
    else {
      sqlString += columns
    }
  }
  return sqlString
}

// include table alias if specified
function columnWithAlias(c: NeonColumnObject): string {
  if (c.alias) {
    return `${c.alias}.${c.name}`
  }
  return c.name
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
          conditions += ` ${w.operator} ${whereColumnWithAlias(w)} ${w.condition} ${escapeIfNeeded(w.value)}`
        }
        else {
          conditions = `${whereColumnWithAlias(w)} ${w.condition} ${escapeIfNeeded(w.value)}`
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

// include table alias if specified
function whereColumnWithAlias(w: NeonWhereObject): string {
  if (w.alias) {
    return `${w.alias}.${w.column}`
  }
  return w.column
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
    sqlString += getColumnsClause(group)
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
