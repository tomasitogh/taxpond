import { describe, it, expect } from 'vitest'
import { validateRUT, formatRUT } from '../cl-rut'

describe('validateRUT', () => {
  it('accepts valid RUTs', () => {
    expect(validateRUT('12.345.678-5')).toBe(true)
    expect(validateRUT('12345678-5')).toBe(true)
    expect(validateRUT('1234567-4')).toBe(true)
    expect(validateRUT('15678901-1')).toBe(true)
  })

  it('rejects invalid check digits', () => {
    expect(validateRUT('12.345.678-0')).toBe(false)
    expect(validateRUT('12345678-1')).toBe(false)
  })

  it('rejects malformed input', () => {
    expect(validateRUT('1234')).toBe(false)
    expect(validateRUT('')).toBe(false)
    expect(validateRUT('abc')).toBe(false)
  })

  it('handles short RUTs (7 digits)', () => {
    expect(validateRUT('1234567-4')).toBe(true)
  })

  it('handles K check digit', () => {
    expect(validateRUT('10000013-K')).toBe(true)
  })
})

describe('formatRUT', () => {
  it('formats raw digits with dots', () => {
    expect(formatRUT('123456785')).toBe('12.345.678-5')
  })

  it('handles partial input', () => {
    expect(formatRUT('1234')).toBe('123-4')
  })

  it('preserves K check digit', () => {
    expect(formatRUT('12345678K')).toBe('12.345.678-K')
  })

  it('strips non-alphanumeric characters', () => {
    expect(formatRUT('12.345.678-5')).toBe('12.345.678-5')
  })
})
