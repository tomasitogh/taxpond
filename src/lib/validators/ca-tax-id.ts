function validateLuhn(digits: string): boolean {
  let sum = 0
  const len = digits.length
  for (let i = 0; i < len; i++) {
    let val = parseInt(digits[i]!, 10)
    if (i % 2 === 1) {
      val *= 2
      if (val > 9) val -= 9
    }
    sum += val
  }
  return sum % 10 === 0
}

export function validateCanadaTaxId(value: string): boolean {
  const cleaned = value.replace(/[^0-9A-Za-z]/g, '')

  if (cleaned.startsWith('000000000')) {
    return false
  }

  // 1. 9-digit (SIN or 9-digit BN)
  if (/^\d{9}$/.test(cleaned)) {
    return validateLuhn(cleaned)
  }

  // 2. 15-character BN (9 digits + 2 letters + 4 digits)
  if (/^\d{9}[A-Za-z]{2}\d{4}$/.test(cleaned)) {
    const registrationNumber = cleaned.slice(0, 9)
    return validateLuhn(registrationNumber)
  }

  return false
}

export function formatCanadaTaxId(value: string): string {
  const cleaned = value.replace(/[^0-9A-Za-z]/g, '')
  const hasLetters = /[A-Za-z]/.test(cleaned)

  if (hasLetters || cleaned.length > 9) {
    // Format as 15-character BN: XXXXX-XXXX-XX-XXXX
    const upper = cleaned.toUpperCase()
    if (upper.length <= 5) return upper
    if (upper.length <= 9) return `${upper.slice(0, 5)}-${upper.slice(5)}`
    if (upper.length <= 11) return `${upper.slice(0, 5)}-${upper.slice(5, 9)}-${upper.slice(9)}`
    return `${upper.slice(0, 5)}-${upper.slice(5, 9)}-${upper.slice(9, 11)}-${upper.slice(11, 15)}`
  }

  // Pure digits and <= 9 digits: decide SIN vs BN based on separator in the original input
  const isSinFormat = value.includes('-')
    ? value.indexOf('-') === 3
    : value.includes(' ')
      ? value.indexOf(' ') === 3
      : false

  if (isSinFormat) {
    // Format as SIN: XXX-XXX-XXX
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 9)}`
  } else {
    // Format as 9-digit BN: XXXXX-XXXX
    if (cleaned.length <= 5) return cleaned
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 9)}`
  }
}
