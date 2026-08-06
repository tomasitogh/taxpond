'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n/context'

interface DataTableProps {
  columns: string[]
  rows: Record<string, unknown>[]
  page: number
  filteredCount: number
  pageSize: number
  isLoading: boolean
  onPageChange: (page: number) => void
}

function formatCell(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'bigint') return value.toString()
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatHeader(column: string, t: any): string {
  return column === 'row_count' ? t.taxProcessor.tryPage.rows : column
}

export function DataTable({
  columns,
  rows,
  page,
  filteredCount,
  pageSize,
  isLoading,
  onPageChange,
}: DataTableProps) {
  const { t } = useLanguage()
  const pageCount = Math.max(1, Math.ceil(filteredCount / pageSize))
  const from = filteredCount === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, filteredCount)

  return (
    <div className="border-border overflow-hidden rounded-xl border">
      <div
        className={`overflow-x-auto transition-opacity ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border bg-muted/50 border-b">
              {columns.map((col) => (
                <th
                  key={col}
                  className="text-muted-foreground px-4 py-3 text-left text-xs font-medium whitespace-nowrap"
                >
                  {formatHeader(col, t)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-muted-foreground px-4 py-8 text-center text-sm"
                >
                  {t.taxProcessor.tryPage.noRows}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={i} className="border-border hover:bg-muted/30 border-b last:border-0">
                  {columns.map((col) => (
                    <td key={col} className="text-foreground px-4 py-3 whitespace-nowrap">
                      {formatCell(row[col])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-border flex items-center justify-between border-t px-4 py-3">
        <p className="text-muted-foreground text-xs">
          {filteredCount === 0
            ? t.taxProcessor.tryPage.rowsCount.replace('{count}', '0')
            : t.taxProcessor.tryPage.showingRows
                .replace('{from}', from.toLocaleString())
                .replace('{to}', to.toLocaleString())
                .replace('{total}', filteredCount.toLocaleString())}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => onPageChange(page - 1)}
            disabled={isLoading || page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-muted-foreground text-xs">
            {t.taxProcessor.tryPage.pageOf
              .replace('{page}', page.toLocaleString())
              .replace('{pageCount}', pageCount.toLocaleString())}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => onPageChange(page + 1)}
            disabled={isLoading || page >= pageCount}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
