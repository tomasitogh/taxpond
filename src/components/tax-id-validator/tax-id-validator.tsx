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

export function TaxIdValidator() {
  const [selectedType, setSelectedType] = useState<TaxIdType>('AR_CUIT')
  const [validationResults, setValidationResults] =
    useState<ValidationResultsType | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          Country / Tax ID Type
        </label>
        <Select
          value={selectedType}
          onValueChange={(v) => setSelectedType(v as TaxIdType)}
        >
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
          <TabsTrigger value="single">Validate Code</TabsTrigger>
          <TabsTrigger value="file">Validate File</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <div className="rounded-xl border border-border p-6">
            <SingleValidator selectedType={selectedType} />
          </div>
        </TabsContent>

        <TabsContent value="file">
          <div className="rounded-xl border border-border p-6">
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
