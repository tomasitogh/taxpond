'use client'

import { useMemo, useState } from 'react'
import { Download, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface ValidationResults {
  total: number
  valid: number
  errors: number
  data: Record<string, unknown>[]
  columns: string[]
}

interface ValidationResultsProps {
  results: ValidationResults
}

export function ValidationResults({ results }: ValidationResultsProps) {
  const [showErrorsOnly, setShowErrorsOnly] = useState(false)

  const displayData = useMemo(() => {
    if (showErrorsOnly) {
      return results.data.filter((row) => row.tax_id_valido === false)
    }
    return results.data
  }, [results.data, showErrorsOnly])

  const handleExportCSV = () => {
    const headers = [...results.columns, 'Valid Tax IDs']
    const rows = results.data.map((row) => {
      const status = row.tax_id_valido === true ? 'Valid' : 'Invalid'
      return [...results.columns, 'Valid Tax IDs']
        .map((h) => {
          if (h === 'Valid Tax IDs') return `"${status}"`
          return `"${String(row[h] ?? '')}"`
        })
        .join(',')
    })
    const csv = [headers.join(','), ...rows].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'validated_tax_ids.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="border-border rounded-xl border p-4 text-center">
          <p className="font-data text-foreground text-2xl font-bold">
            {results.total.toLocaleString()}
          </p>
          <p className="text-muted-foreground text-sm">Total rows</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-950">
          <p className="font-data text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {results.valid.toLocaleString()}
          </p>
          <p className="text-sm text-emerald-700 dark:text-emerald-300">Valid</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center dark:border-red-800 dark:bg-red-950">
          <p className="font-data text-2xl font-bold text-red-600 dark:text-red-400">
            {results.errors.toLocaleString()}
          </p>
          <p className="text-sm text-red-700 dark:text-red-300">Invalid</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={showErrorsOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowErrorsOnly(true)}
            className="rounded-full"
          >
            <XCircle className="mr-1 h-3 w-3" />
            Errors ({results.errors.toLocaleString()})
          </Button>
          <Button
            variant={!showErrorsOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowErrorsOnly(false)}
            className="rounded-full"
          >
            <CheckCircle2 className="mr-1 h-3 w-3" />
            All ({results.total.toLocaleString()})
          </Button>
        </div>

        <Button variant="outline" size="sm" onClick={handleExportCSV} className="rounded-full">
          <Download className="mr-1 h-3 w-3" />
          Export CSV
        </Button>
      </div>

      <div className="border-border overflow-hidden rounded-xl border">
        <div className="max-h-[400px] overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted sticky top-0">
              <tr>
                {results.columns.map((col) => (
                  <th
                    key={col}
                    className="border-border text-muted-foreground border-b px-3 py-2 text-left font-medium"
                  >
                    {col}
                  </th>
                ))}
                <th className="border-border text-muted-foreground border-b px-3 py-2 text-left font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {displayData.slice(0, 100).map((row, i) => (
                <tr key={i} className="border-border border-b last:border-0">
                  {results.columns.map((col) => (
                    <td key={col} className="font-data px-3 py-2">
                      {String(row[col] ?? '')}
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    {row.tax_id_valido === true ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" />
                        Valid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-300">
                        <XCircle className="h-3 w-3" />
                        Invalid
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {displayData.length > 100 && (
          <div className="border-border bg-muted text-muted-foreground border-t px-3 py-2 text-center text-xs">
            Showing 100 of {displayData.length.toLocaleString()} rows
          </div>
        )}
      </div>
    </div>
  )
}
