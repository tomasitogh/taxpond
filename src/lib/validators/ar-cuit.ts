const CUIT_WEIGHTS = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]

export function validateCUIT(cuit: string): boolean {
  const cleaned = cuit.replace(/[^0-9]/g, '')

  if (cleaned.length !== 11) return false

  let sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]!, 10) * CUIT_WEIGHTS[i]!
  }

  const remainder = sum % 11
  const checkDigit = remainder === 0 ? 0 : remainder === 1 ? 9 : 11 - remainder

  return checkDigit === parseInt(cleaned[10]!, 10)
}

export function formatCUIT(value: string): string {
  const cleaned = value.replace(/[^0-9]/g, '')
  if (cleaned.length <= 2) return cleaned
  if (cleaned.length <= 10) return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`
  return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 10)}-${cleaned.slice(10, 11)}`
}
