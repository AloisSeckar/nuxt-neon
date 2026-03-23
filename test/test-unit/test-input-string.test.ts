import { describe, test, expect } from 'vitest'
import { testInputString } from '../../src/runtime/server/utils/helpers/sanitizeSQL'

const ERROR_MSG = 'rejected as potential SQL injection'

describe('Helper `testInputString` unitn test suite', async () => {
  test('Should allow valid inputs', () => {
    // simple identifier
    expect(testInputString('a', true)).toBe(undefined)
    // identifier with underscore
    expect(testInputString('a_b', true)).toBe(undefined)
  })

  test('Should reject semicolons', () => {
    // naive semicolon
    expect(() => testInputString('a; DROP TABLE users', true)).toThrowError(new RegExp(ERROR_MSG))
  })

  test('Should reject comments', () => {
    // naive -- comment
    expect(() => testInputString('a -- COMMENT', true)).toThrowError(new RegExp(ERROR_MSG))
    // naive /* */ comment
    expect(() => testInputString('a /* COMMENT */', true)).toThrowError(new RegExp(ERROR_MSG))
  })

  test('Should reject control characters', () => {
    expect(() => testInputString('a\u0001', true)).toThrowError(new RegExp(ERROR_MSG))
  })
})
