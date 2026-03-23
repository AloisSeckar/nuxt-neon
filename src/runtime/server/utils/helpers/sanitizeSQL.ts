import SqlString from 'sqlstring'
import { isNeonScanQueriesEnabled } from '../config/neonConfig'

export function sanitizeSQLString(sql: string): string {
  testInputString(sql)
  return SqlString.escape(sql)
}

export function sanitizeSQLArray(sql: string[]): string[] {
  const sanitizedSQL = [] as string[]
  sql?.forEach((sql) => {
    testInputString(sql)
    sanitizedSQL.push(sanitizeSQLString(sql))
  })
  return sanitizedSQL
}

export function sanitizeSQLIdentifier(identifier: string): string {
  if (identifier) {
    testInputString(identifier)
    let sanitized = SqlString.escape(identifier)
    // in case alias or schema is passed, add double quotes
    sanitized = sanitized.replaceAll('.', '"."')
    // in PostgreSQL, identifiers must be wrapped in double quotes
    return '"' + sanitized.slice(1, -1) + '"'
  }
  return identifier
}

// reject obvious SQL injection attempts before passing inputs further
// user can turn this off by setting `neonScanQueries` to false
export function testInputString(input: string, scanQueries: boolean = isNeonScanQueriesEnabled()): void {
  if (!input || !scanQueries) {
    return
  }
  try {
    // semicolon => SQL injection attempt
    if (input.includes(';')) {
      throw new Error('contains semicolon')
    }
    // comments => SQL injection attempt
    if (input.includes('--') || input.includes('/*') || input.includes('*/')) {
      throw new Error('contains comments')
    }
    // control characters
    // eslint-disable-next-line no-control-regex
    if (/[\x00-\x1F\x7F]/.test(input)) {
      throw new Error('contains control characters')
    }
  }
  catch (e) {
    throw new Error(`Value ${input} rejected as potential SQL injection (${(e as Error).message}). Report bug in Nuxt Neon module repository if this is a false positive.`)
  }
}
