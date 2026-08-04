import { validateCUIT, formatCUIT } from './ar-cuit'
import { validateRUT, formatRUT } from './cl-rut'
import { validateCanadaTaxId, formatCanadaTaxId } from './ca-tax-id'

export type TaxIdType = 'AR_CUIT' | 'CL_RUT' | 'CA_TAX_ID'

export interface TaxIdConfig {
  type: TaxIdType
  country: string
  label: string
  placeholder: string
  example: string
  validate: (value: string) => boolean
  format: (value: string) => string
  udfFunction: string
}

export const TAX_ID_CONFIGS: Record<TaxIdType, TaxIdConfig> = {
  AR_CUIT: {
    type: 'AR_CUIT',
    country: 'Argentina',
    label: 'CUIT',
    placeholder: 'XX-XXXXXXXX-X',
    example: '20-12345678-3',
    validate: validateCUIT,
    format: formatCUIT,
    udfFunction: 'is_valid_cuit',
  },
  CL_RUT: {
    type: 'CL_RUT',
    country: 'Chile',
    label: 'RUT',
    placeholder: 'X.XXX.XXX-X',
    example: '12.345.678-5',
    validate: validateRUT,
    format: formatRUT,
    udfFunction: 'is_valid_rut',
  },
  CA_TAX_ID: {
    type: 'CA_TAX_ID',
    country: 'Canada',
    label: 'SIN / BN',
    placeholder: 'XXX-XXX-XXX or XXXXX-XXXX-XX-XXXX',
    example: '130-692-544 or 49000-0007-RC-0001',
    validate: validateCanadaTaxId,
    format: formatCanadaTaxId,
    udfFunction: 'is_valid_ca_tax_id',
  },
}

export const TAX_ID_OPTIONS = Object.values(TAX_ID_CONFIGS)

export { validateCUIT, formatCUIT } from './ar-cuit'
export { validateRUT, formatRUT } from './cl-rut'
export { validateCanadaTaxId, formatCanadaTaxId } from './ca-tax-id'
