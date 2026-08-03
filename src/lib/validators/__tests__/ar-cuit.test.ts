import { describe, it, expect } from 'vitest'
import { validateCUIT, formatCUIT } from '../ar-cuit'

describe('validateCUIT', () => {
  it('accepts valid CUITs', () => {
    expect(validateCUIT('20-12345678-6')).toBe(true)
    expect(validateCUIT('20123456786')).toBe(true)
    expect(validateCUIT('27-36857329-4')).toBe(true)
    expect(validateCUIT('30-71234567-1')).toBe(true)
  })

  it('rejects invalid check digits', () => {
    expect(validateCUIT('20-12345678-0')).toBe(false)
    expect(validateCUIT('20123456781')).toBe(false)
  })

  it('rejects malformed input', () => {
    expect(validateCUIT('1234')).toBe(false)
    expect(validateCUIT('')).toBe(false)
    expect(validateCUIT('abc')).toBe(false)
  })

  it('handles input without dashes', () => {
    expect(validateCUIT('20123456786')).toBe(true)
  })
})

describe('formatCUIT', () => {
  it('formats raw digits', () => {
    expect(formatCUIT('20123456786')).toBe('20-12345678-6')
  })

  it('handles partial input', () => {
    expect(formatCUIT('20')).toBe('20')
    expect(formatCUIT('201234')).toBe('20-1234')
  })

  it('strips non-digit characters', () => {
    expect(formatCUIT('20-1234-5678-6')).toBe('20-12345678-6')
  })
})
