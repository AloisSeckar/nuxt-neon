import { describe, test, expect } from 'vitest'
import { testInputString } from '../../src/runtime/server/utils/helpers/sanitizeSQL'

const ERROR_MSG = 'rejected as potential SQL injection'

describe('Helper `testInputString` unitn test suite', async () => {
  test('Should allow valid inputs', () => {
    // simple identifier
    expect(testInputString('a')).toBe(undefined)
    // identifier with underscore
    expect(testInputString('a_b')).toBe(undefined)
  })

  test('Should reject semicolons', () => {
    // naive semicolon
    expect(() => testInputString('a; DROP TABLE users')).toThrowError(new RegExp(ERROR_MSG))
  })

  test('Should reject comments', () => {
    // naive -- comment
    expect(() => testInputString('a -- COMMENT')).toThrowError(new RegExp(ERROR_MSG))
    // naive /* */ comment
    expect(() => testInputString('a /* COMMENT */')).toThrowError(new RegExp(ERROR_MSG))
  })

  test('Should reject dots', () => {
    // naive .
    expect(() => testInputString('a.a')).toThrowError(new RegExp(ERROR_MSG))
    // resembling number, but invalid
    expect(() => testInputString('a.23')).toThrowError(new RegExp(ERROR_MSG))
  })

  test('Should allow dots if it is a valid number', () => {
    expect(testInputString('1.23', true)).toBe(undefined)
  })

  test('Should allow dots if told so', () => {
    expect(testInputString('a.a', true)).toBe(undefined)
  })

  test('Should reject control characters', () => {
    expect(() => testInputString('a\u0001')).toThrowError(new RegExp(ERROR_MSG))
  })
})
