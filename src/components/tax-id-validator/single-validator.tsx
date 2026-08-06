'use client'

import { useState, useCallback } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { TAX_ID_CONFIGS, type TaxIdType } from '@/lib/validators'
import { useLanguage } from '@/lib/i18n/context'

interface SingleValidatorProps {
  selectedType: TaxIdType
}

export function SingleValidator({ selectedType }: SingleValidatorProps) {
  const { t } = useLanguage()
  const [value, setValue] = useState('')
  const config = TAX_ID_CONFIGS[selectedType]

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      const formatted = config.format(raw)
      setValue(formatted)
    },
    [config]
  )

  const isValid = value.length > 0 && config.validate(value)
  const hasValue = value.length > 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="tax-id-input" className="text-foreground text-sm font-medium">
          {t.taxIdValidator.single.enter.replace('{label}', config.label)}
        </label>
        <div className="relative">
          <Input
            id="tax-id-input"
            type="text"
            placeholder={config.placeholder}
            value={value}
            onChange={handleChange}
            className="font-data pr-10"
          />
          {hasValue && (
            <div className="absolute top-1/2 right-3 -translate-y-1/2">
              {isValid ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          )}
        </div>
      </div>

      {hasValue && (
        <div
          className={`flex items-center gap-2 rounded-lg border p-3 ${
            isValid
              ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950'
              : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
          }`}
        >
          {isValid ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          )}
          <span
            className={`text-sm font-medium ${
              isValid ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'
            }`}
          >
            {isValid ? t.taxIdValidator.single.valid : t.taxIdValidator.single.invalid}
          </span>
        </div>
      )}

      <p className="text-muted-foreground text-xs">
        {t.taxIdValidator.single.example} <span className="font-data">{config.example}</span>
      </p>
    </div>
  )
}
