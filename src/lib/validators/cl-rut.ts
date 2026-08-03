const RUT_WEIGHTS = [2, 3, 4, 5, 6, 7]

export function validateRUT(rut: string): boolean {
  const cleaned = rut.replace(/[^0-9kK]/g, '')

  if (cleaned.length < 8 || cleaned.length > 9) return false

  const body = cleaned.slice(0, -1)
  const expectedCheck = cleaned.slice(-1).toUpperCase()

  let sum = 0
  let weightIndex = 0

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]!, 10) * RUT_WEIGHTS[weightIndex % RUT_WEIGHTS.length]!
    weightIndex++
  }

  const remainder = 11 - (sum % 11)
  let computedCheck: string
  if (remainder === 11) computedCheck = '0'
  else if (remainder === 10) computedCheck = 'K'
  else computedCheck = String(remainder)

  return computedCheck === expectedCheck
}

export function formatRUT(value: string): string {
  const cleaned = value.replace(/[^0-9kK]/g, '')
  if (cleaned.length <= 1) return cleaned

  const body = cleaned.slice(0, -1)
  const check = cleaned.slice(-1).toUpperCase()

  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${formatted}-${check}`
}
