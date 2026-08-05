import { describe, test, expect } from 'vitest'
import { isNeonEndpointAllowed } from '../../src/runtime/shared/utils/helpers/assertEndpoint'

describe('Unit tests for `isNeonEndpointAllowed` guard', () => {
  test('Should reject everything if nothing is allowed', () => {
    expect(isNeonEndpointAllowed('SELECT', [])).toBe(false)
    expect(isNeonEndpointAllowed('COUNT', [])).toBe(false)
    expect(isNeonEndpointAllowed('INSERT', [])).toBe(false)
    expect(isNeonEndpointAllowed('UPDATE', [])).toBe(false)
    expect(isNeonEndpointAllowed('DELETE', [])).toBe(false)
    expect(isNeonEndpointAllowed('RAW', [])).toBe(false)
  })

  test('Should reject everything if NONE is allowed', () => {
    expect(isNeonEndpointAllowed('SELECT', ['NONE'])).toBe(false)
    expect(isNeonEndpointAllowed('RAW', ['NONE'])).toBe(false)
  })

  test('Should allow everything if ALL is allowed', () => {
    expect(isNeonEndpointAllowed('SELECT', ['ALL'])).toBe(true)
    expect(isNeonEndpointAllowed('COUNT', ['ALL'])).toBe(true)
    expect(isNeonEndpointAllowed('INSERT', ['ALL'])).toBe(true)
    expect(isNeonEndpointAllowed('UPDATE', ['ALL'])).toBe(true)
    expect(isNeonEndpointAllowed('DELETE', ['ALL'])).toBe(true)
    expect(isNeonEndpointAllowed('RAW', ['ALL'])).toBe(true)
  })

  test('Should allow only explicitly listed endpoint', () => {
    expect(isNeonEndpointAllowed('SELECT', ['SELECT'])).toBe(true)
    expect(isNeonEndpointAllowed('COUNT', ['SELECT'])).toBe(false)
    expect(isNeonEndpointAllowed('INSERT', ['SELECT'])).toBe(false)
    expect(isNeonEndpointAllowed('UPDATE', ['SELECT'])).toBe(false)
    expect(isNeonEndpointAllowed('DELETE', ['SELECT'])).toBe(false)
    expect(isNeonEndpointAllowed('RAW', ['SELECT'])).toBe(false)
  })

  test('Should work correctly with multiple explicit values', () => {
    expect(isNeonEndpointAllowed('SELECT', ['SELECT', 'INSERT'])).toBe(true)
    expect(isNeonEndpointAllowed('INSERT', ['SELECT', 'INSERT'])).toBe(true)
    expect(isNeonEndpointAllowed('UPDATE', ['SELECT', 'INSERT'])).toBe(false)
    expect(isNeonEndpointAllowed('DELETE', ['SELECT', 'INSERT'])).toBe(false)
    expect(isNeonEndpointAllowed('COUNT', ['SELECT', 'INSERT'])).toBe(false)
    expect(isNeonEndpointAllowed('RAW', ['SELECT', 'INSERT'])).toBe(false)
  })

  test('NONE should take precedence over ALL', () => {
    expect(isNeonEndpointAllowed('SELECT', ['NONE', 'ALL'])).toBe(false)
  })

  test('NONE should take precedence over explicit values', () => {
    expect(isNeonEndpointAllowed('SELECT', ['NONE', 'SELECT'])).toBe(false)
  })

  test('ALL should take precedence over explicit values', () => {
    expect(isNeonEndpointAllowed('DELETE', ['ALL', 'SELECT'])).toBe(true)
  })
})
