'use client'

import { useState, useCallback } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { TAX_ID_CONFIGS, type TaxIdType } from '@/lib/validators'

interface SingleValidatorProps {
  selectedType: TaxIdType
}

export function SingleValidator({ selectedType }: SingleValidatorProps) {
  const [value, setValue] = useState('')
  const config = TAX_ID_CONFIGS[selectedType]

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      const formatted = config.format(raw)
      setValue(formatted)
    },
    [config],
  )

  const isValid = value.length > 0 && config.validate(value)
  const hasValue = value.length > 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="tax-id-input" className="text-sm font-medium text-foreground">
          Enter {config.label}
        </label>
        <div className="relative">
          <Input
            id="tax-id-input"
            type="text"
            placeholder={config.placeholder}
            value={value}
            onChange={handleChange}
            className="pr-10 font-data"
          />
          {hasValue && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
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
              isValid
                ? 'text-emerald-700 dark:text-emerald-300'
                : 'text-red-700 dark:text-red-300'
            }`}
          >
            {isValid ? 'Valid check digit' : 'Invalid check digit'}
          </span>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Example: <span className="font-data">{config.example}</span>
      </p>
    </div>
  )
}
