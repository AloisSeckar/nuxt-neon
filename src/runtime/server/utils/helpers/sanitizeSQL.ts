import SqlString from 'sqlstring'

export function sanitizeSQLString(sql: string): string {
  return SqlString.escape(sql)
}

export function sanitizeSQLArray(sql: string[]): string[] {
  const sanitizedSQL = [] as string[]
  sql?.forEach((sql) => {
    sanitizedSQL.push(sanitizeSQLString(sql))
  })
  return sanitizedSQL
}

export function sanitizeSQLIdentifier(identifier: string): string {
  if (identifier) {
    let sanitized = SqlString.escape(identifier)
    // in case alias or schema is passed, add double quotes
    sanitized = sanitized.replaceAll('.', '"."')
    // in PostgreSQL, identifiers must be wrapped in double quotes
    return '"' + sanitized.slice(1, -1) + '"'
  }
  return identifier
}
