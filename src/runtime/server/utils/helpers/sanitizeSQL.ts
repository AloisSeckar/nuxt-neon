import SqlString from 'sqlstring'

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
    testInputString(identifier, true)
    let sanitized = SqlString.escape(identifier)
    // in case alias or schema is passed, add double quotes
    sanitized = sanitized.replaceAll('.', '"."')
    // in PostgreSQL, identifiers must be wrapped in double quotes
    return '"' + sanitized.slice(1, -1) + '"'
  }
  return identifier
}

// reject obvious SQL injection attempts before passing inputs further
// if allowDots is true, dots are allowed (for schema.table or table.alias)
export function testInputString(input: string, allowDots = false): void {
  if (input) {
    try {
    // semicolon => SQL injection attempt
      if (input.includes(';')) {
        throw new Error('contains semicolon')
      }
      // equals => SQL injection attempt
      if (input.includes('=')) {
        throw new Error('contains equals sign')
      }
      // comments => SQL injection attempt
      if (input.includes('--') || input.includes('/*') || input.includes('*/')) {
        throw new Error('contains comments')
      }
      // dot - schemas and aliases are handled, dots in values are suspicious
      // ignore if told so (explicit internal call for schema.table or table.alias)
      // can be decimal number though
      if (!allowDots) {
        if (input.includes('.') && Number.isNaN(Number(input))) {
          throw new Error('contains dot')
        }
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
}
