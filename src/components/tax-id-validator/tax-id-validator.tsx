'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SingleValidator } from './single-validator'
import { FileValidator } from './file-validator'
import { ValidationResults } from './validation-results'
import { TAX_ID_OPTIONS, type TaxIdType } from '@/lib/validators'
import type { ValidationResults as ValidationResultsType } from './validation-results'
import { useLanguage } from '@/lib/i18n/context'

export function TaxIdValidator() {
  const { t } = useLanguage()
  const [selectedType, setSelectedType] = useState<TaxIdType>('AR_CUIT')
  const [validationResults, setValidationResults] = useState<ValidationResultsType | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-foreground text-sm font-medium">{t.taxIdValidator.label}</label>
        <Select value={selectedType} onValueChange={(v) => setSelectedType(v as TaxIdType)}>
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TAX_ID_OPTIONS.map((opt) => (
              <SelectItem key={opt.type} value={opt.type}>
                {opt.country} ({opt.label})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="single">
        <TabsList>
          <TabsTrigger value="single">{t.taxIdValidator.tabs.single}</TabsTrigger>
          <TabsTrigger value="file">{t.taxIdValidator.tabs.file}</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <div className="border-border rounded-xl border p-6">
            <SingleValidator selectedType={selectedType} />
          </div>
        </TabsContent>

        <TabsContent value="file">
          <div className="border-border rounded-xl border p-6">
            <FileValidator
              selectedType={selectedType}
              onValidationComplete={setValidationResults}
            />
          </div>
        </TabsContent>
      </Tabs>

      {validationResults && <ValidationResults results={validationResults} />}
    </div>
  )
}
