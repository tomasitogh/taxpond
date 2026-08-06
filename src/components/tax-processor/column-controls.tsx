'use client'

import * as React from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ColumnType } from '@/lib/query-builder'
import { useLanguage } from '@/lib/i18n/context'

const COLUMN_TYPES: { value: ColumnType; key: 'string' | 'date' | 'number' }[] = [
  { value: 'string', key: 'string' },
  { value: 'date', key: 'date' },
  { value: 'number', key: 'number' },
]

interface ColumnControlsProps {
  columns: string[]
  columnTypes: Record<string, ColumnType>
  filters: Record<string, string | null>
  groupBys: string[]
  getDistinctValues: (column: string) => Promise<string[]>
  onTypeChange: (column: string, type: ColumnType) => void
  onFilterSelect: (column: string, value: string | null) => void
  onGroupByToggle: (column: string) => void
}

export function ColumnControls(props: ColumnControlsProps) {
  return (
    <div className="flex flex-1 gap-3 overflow-x-auto pb-1">
      {props.columns.map((column) => (
        <ColumnControl key={column} column={column} {...props} />
      ))}
    </div>
  )
}

function ColumnControl({
  column,
  columnTypes,
  filters,
  groupBys,
  getDistinctValues,
  onTypeChange,
  onFilterSelect,
  onGroupByToggle,
}: ColumnControlsProps & { column: string }) {
  const { t } = useLanguage()
  const [distinctValues, setDistinctValues] = React.useState<string[] | null>(null)

  const currentType = columnTypes[column] ?? 'string'
  const currentFilter = filters[column] ?? null
  const isGrouped = groupBys.includes(column)

  async function loadDistinctValues(open: boolean) {
    if (!open || distinctValues !== null) return
    setDistinctValues(await getDistinctValues(column))
  }

  return (
    <div className="flex min-w-[180px] flex-col gap-1">
      <span className="text-muted-foreground truncate text-xs font-medium" title={column}>
        {column}
      </span>

      {/* Type selector */}
      <DropdownMenu>
        <DropdownMenuTrigger className="border-border text-foreground hover:bg-accent inline-flex h-7 w-full items-center justify-between gap-1 rounded-md border bg-transparent px-2 text-xs font-medium">
          {t.taxProcessor.tryPage.columnTypes[currentType]}
          <ChevronDown className="h-3 w-3 shrink-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {COLUMN_TYPES.map((tItem) => (
            <DropdownMenuItem key={tItem.value} onClick={() => onTypeChange(column, tItem.value)}>
              <span className="flex w-full items-center justify-between gap-2">
                {t.taxProcessor.tryPage.columnTypes[tItem.key]}
                {currentType === tItem.value && <Check className="h-3 w-3" />}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex gap-1">
        {/* Filter by */}
        <DropdownMenu onOpenChange={(open) => loadDistinctValues(open)}>
          <DropdownMenuTrigger className="border-border text-foreground hover:bg-accent inline-flex h-7 max-w-[120px] items-center gap-1 rounded-md border bg-transparent px-2 text-xs font-medium">
            <span className="truncate">{currentFilter ?? t.taxProcessor.tryPage.filterBy}</span>
            <ChevronDown className="h-3 w-3 shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-60 overflow-auto">
            <DropdownMenuItem onClick={() => onFilterSelect(column, null)}>
              {t.taxProcessor.tryPage.all}
            </DropdownMenuItem>
            {distinctValues?.map((val) => (
              <DropdownMenuItem key={val} onClick={() => onFilterSelect(column, val)}>
                {val}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Group by / SUM */}
        {currentType === 'number' ? (
          <Button
            variant="default"
            size="sm"
            className="h-7 gap-1 rounded-md bg-[#FFD600] text-xs font-semibold text-black hover:bg-[#FFD600]/90"
            onClick={() => onTypeChange(column, 'string')}
          >
            SUM
          </Button>
        ) : (
          <Button
            variant={isGrouped ? 'default' : 'outline'}
            size="sm"
            className="h-7 gap-1 text-xs"
            onClick={() => onGroupByToggle(column)}
          >
            {t.taxProcessor.tryPage.groupBy}
          </Button>
        )}
      </div>
    </div>
  )
}
