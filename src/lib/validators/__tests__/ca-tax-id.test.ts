import { describe, it, expect } from 'vitest'
import { validateCanadaTaxId, formatCanadaTaxId } from '../ca-tax-id'

describe('validateCanadaTaxId', () => {
  it('accepts valid SINs', () => {
    expect(validateCanadaTaxId('130-692-544')).toBe(true)
    expect(validateCanadaTaxId('130692544')).toBe(true)
    expect(validateCanadaTaxId('046 454 286')).toBe(true)
    expect(validateCanadaTaxId('046-454-286')).toBe(true)
  })

  it('accepts valid 9-digit BNs', () => {
    expect(validateCanadaTaxId('49000-0007')).toBe(true)
    expect(validateCanadaTaxId('490000007')).toBe(true)
    expect(validateCanadaTaxId('10000-0009')).toBe(true)
  })

  it('accepts valid 15-character BNs', () => {
    expect(validateCanadaTaxId('490000007RC0001')).toBe(true)
    expect(validateCanadaTaxId('49000-0007-RC-0001')).toBe(true)
    expect(validateCanadaTaxId('49000-0007 RC0001')).toBe(true)
    expect(validateCanadaTaxId('100000009RT0002')).toBe(true)
  })

  it('rejects invalid check digits', () => {
    // SIN/BN invalid check digit
    expect(validateCanadaTaxId('130-692-540')).toBe(false)
    expect(validateCanadaTaxId('49000-0000')).toBe(false)
    expect(validateCanadaTaxId('490000000RC0001')).toBe(false)
  })

  it('rejects malformed input', () => {
    expect(validateCanadaTaxId('1234')).toBe(false)
    expect(validateCanadaTaxId('')).toBe(false)
    expect(validateCanadaTaxId('abc')).toBe(false)
    // 15-char structure with letters in wrong place or invalid lengths
    expect(validateCanadaTaxId('490000007120001')).toBe(false)
    expect(validateCanadaTaxId('490000007RCA001')).toBe(false)
  })

  it('rejects zero-filled edge cases', () => {
    expect(validateCanadaTaxId('000000000')).toBe(false)
    expect(validateCanadaTaxId('000000000RT0001')).toBe(false)
    expect(validateCanadaTaxId('000-000-000')).toBe(false)
    expect(validateCanadaTaxId('00000-0000-RT-0001')).toBe(false)
  })
})

describe('formatCanadaTaxId', () => {
  it('formats raw digits depending on input style / length', () => {
    // defaults to 9-digit BN format (5-4) if no SIN-like separator is present
    expect(formatCanadaTaxId('490000007')).toBe('49000-0007')
    // respects SIN-like separator if present at index 3
    expect(formatCanadaTaxId('130-692544')).toBe('130-692-544')
    expect(formatCanadaTaxId('130 692544')).toBe('130-692-544')
    // 15-character BN format
    expect(formatCanadaTaxId('490000007RC0001')).toBe('49000-0007-RC-0001')
  })

  it('handles partial input', () => {
    expect(formatCanadaTaxId('123')).toBe('123')
    expect(formatCanadaTaxId('123456')).toBe('12345-6')
    expect(formatCanadaTaxId('123-456')).toBe('123-456') // SIN style
  })

  it('strips non-alphanumeric characters', () => {
    expect(formatCanadaTaxId('49000-0007-RC-0001')).toBe('49000-0007-RC-0001')
  })
})
