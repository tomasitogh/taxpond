'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDuckDB } from '@/lib/duckdb'
import { loadFile } from '@/lib/duckdb'
import { validateWithUDF } from '@/lib/duckdb/udf'
import { TAX_ID_CONFIGS, type TaxIdType } from '@/lib/validators'
import type { ValidationResults } from './validation-results'

interface FileValidatorProps {
  selectedType: TaxIdType
  onValidationComplete: (results: ValidationResults) => void
}

export function FileValidator({ selectedType, onValidationComplete }: FileValidatorProps) {
  const { db, conn } = useDuckDB()
  const [file, setFile] = useState<File | null>(null)
  const [columns, setColumns] = useState<string[]>([])
  const [selectedColumn, setSelectedColumn] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rowCount, setRowCount] = useState<number>(0)

  const config = TAX_ID_CONFIGS[selectedType]

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (!selectedFile) return

      setFile(selectedFile)
      setError(null)
      setIsLoading(true)

      try {
        const result = await loadFile(db, conn, selectedFile)
        setColumns(result.columns)
        setRowCount(result.rowCount)
        setSelectedColumn('')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load file')
      } finally {
        setIsLoading(false)
      }
    },
    [db, conn]
  )

  const handleValidate = useCallback(async () => {
    if (!selectedColumn) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await validateWithUDF(conn, 'uploaded_data', selectedColumn, config.validate)

      onValidationComplete({
        total: result.rows.length,
        valid: result.validCount,
        errors: result.errorCount,
        data: result.rows,
        columns: result.columns,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation failed')
    } finally {
      setIsLoading(false)
    }
  }, [conn, config, selectedColumn, onValidationComplete])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-foreground text-sm font-medium">Upload file</label>
        <div className="flex items-center gap-3">
          <label
            className={`border-border hover:border-muted-foreground/30 flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-dashed px-4 py-2 text-sm transition-colors ${
              file
                ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950'
                : ''
            }`}
          >
            {file ? (
              <FileText className="h-4 w-4 text-emerald-600" />
            ) : (
              <Upload className="text-muted-foreground h-4 w-4" />
            )}
            <span
              className={file ? 'text-emerald-700 dark:text-emerald-300' : 'text-muted-foreground'}
            >
              {file ? file.name : 'Choose CSV file'}
            </span>
            <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
          </label>
          {file && (
            <span className="text-muted-foreground text-xs">{rowCount.toLocaleString()} rows</span>
          )}
        </div>
      </div>

      {columns.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className="text-foreground text-sm font-medium">
            Select column with {config.label}
          </label>
          <Select value={selectedColumn} onValueChange={(v) => setSelectedColumn(v ?? '')}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a column..." />
            </SelectTrigger>
            <SelectContent>
              {columns.map((col) => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      <Button
        onClick={handleValidate}
        disabled={!selectedColumn || isLoading}
        className="rounded-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Validating...
          </>
        ) : (
          `Validate ${config.label}`
        )}
      </Button>
    </div>
  )
}
