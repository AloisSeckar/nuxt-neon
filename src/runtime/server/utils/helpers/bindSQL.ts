// cannot reference from '#imports' in runtime server utils
import { testInputString } from './sanitizeSQL'

// an accumulator for collecting values for parametrized SQL query
export type SQLBinder = {
  // ordered array of values to be passed into the query
  readonly params: string[]
  // register new value and return its `$N` order for the query
  bind: (value: string) => string
}

export function createSQLBinder(): SQLBinder {
  const params: string[] = []
  return {
    params,
    bind(value: string): string {
      testInputString(value)
      params.push(value)
      return `$${params.length}`
    },
  }
}
