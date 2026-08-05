import { isNeonScanQueriesEnabled } from '../config/neonConfig'

// treat incoming input by enforcing PostgreSQL identifier quoting rules
export function sanitizeSQLIdentifier(identifier: string): string {
  if (identifier) {
    testInputString(identifier)
    // in case alias or schema is passed, quote each dot-separated part
    return identifier
      .split('.')
      .map(part => '"' + part.replaceAll('"', '""') + '"')
      .join('.')
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
    throw new Error(`Value ${input} rejected as potential SQL injection (${(e as Error).message}). Report bug in Nuxt Neon module repository if this is a false positive.`, { cause: e })
  }
}
