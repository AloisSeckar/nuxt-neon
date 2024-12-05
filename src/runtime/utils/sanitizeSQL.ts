import * as SqlString from 'sqlstring'

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
