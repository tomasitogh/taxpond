'use client'

import * as React from 'react'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getDuckDB, getConnection, loadFile, executeQuery } from '@/lib/duckdb'
import type { DuckDBConnection, DuckDBInstance, QueryResult } from '@/lib/duckdb'
import {
  buildQuery,
  buildCountQuery,
  buildExportQuery,
  processGroupedResults,
  quoteIdent,
} from '@/lib/query-builder'
import type { ColumnType, QueryOptions } from '@/lib/query-builder'
import { exportQueryToCSV, downloadCSVFromRows } from '@/lib/duckdb/export'
import { FileUploader } from '@/components/tax-processor/file-uploader'
import { ColumnControls } from '@/components/tax-processor/column-controls'
import { DataTable } from '@/components/tax-processor/data-table'
import { useLanguage } from '@/lib/i18n/context'

const TABLE_NAME = 'uploaded_data'
const PAGE_SIZE = 50
const MAX_FILE_SIZE_MB = 200
const MAX_DISTINCT_VALUES = 200

type Status = 'idle' | 'loading-engine' | 'loading-file' | 'ready' | 'querying'

export default function TaxProcessorTryPage() {
  const { t } = useLanguage()
  const [status, setStatus] = React.useState<Status>('idle')
  const [error, setError] = React.useState<string | null>(null)
  const [fileName, setFileName] = React.useState<string | null>(null)
  const [columns, setColumns] = React.useState<string[]>([])
  const [totalRows, setTotalRows] = React.useState(0)
  const [columnTypes, setColumnTypes] = React.useState<Record<string, ColumnType>>({})
  const [filters, setFilters] = React.useState<Record<string, string | null>>({})
  const [groupBys, setGroupBys] = React.useState<string[]>([])
  const [result, setResult] = React.useState<QueryResult | null>(null)
  const [filteredCount, setFilteredCount] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [appliedOptions, setAppliedOptions] = React.useState<QueryOptions | null>(null)

  const engineRef = React.useRef<{ db: DuckDBInstance; conn: DuckDBConnection } | null>(null)
  const distinctCache = React.useRef(new Map<string, string[]>())

  const runQuery = React.useCallback(async (options: QueryOptions, targetPage: number) => {
    const engine = engineRef.current
    if (!engine) return
    setStatus('querying')
    setError(null)
    try {
      const countResult = await executeQuery<{ count: unknown }>(
        engine.conn,
        buildCountQuery(TABLE_NAME, options)
      )
      const total = Number(countResult.rows[0]?.count ?? 0)
      const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE))
      const safePage = Math.min(Math.max(1, targetPage), maxPage)

      const data = await executeQuery(
        engine.conn,
        buildQuery(TABLE_NAME, {
          ...options,
          limit: PAGE_SIZE,
          offset: (safePage - 1) * PAGE_SIZE,
        })
      )

      // Post-process: convert list() arrays into SUMmed numbers for grouped queries
      const isGrouped = (options.groupBy?.length ?? 0) > 0
      if (isGrouped) {
        const { rows, columns: cleanColumns } = processGroupedResults(data.rows, data.columns)
        setResult({ ...data, rows, columns: cleanColumns })
      } else {
        setResult(data)
      }

      setFilteredCount(total)
      setPage(safePage)
      setAppliedOptions(options)
      setStatus('ready')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query failed')
      setStatus('ready')
    }
  }, [])

  async function handleFileSelect(file: File) {
    setError(null)

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError(t.taxProcessor.tryPage.onlyCsv)
      return
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(t.taxProcessor.tryPage.fileTooLarge.replace('{size}', String(MAX_FILE_SIZE_MB)))
      return
    }

    try {
      let engine = engineRef.current
      if (!engine) {
        setStatus('loading-engine')
        const db = await getDuckDB()
        const conn = await getConnection()
        engine = { db, conn }
        engineRef.current = engine
      }

      setStatus('loading-file')
      const loaded = await loadFile(engine.db, engine.conn, file)

      distinctCache.current.clear()
      setFileName(file.name)
      setColumns(loaded.columns)
      setTotalRows(loaded.rowCount)
      setColumnTypes({})
      setFilters({})
      setGroupBys([])

      // Auto-run an unfiltered first page so the table shows data immediately
      await runQuery({ columns: loaded.columns, columnTypes: {} }, 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.taxProcessor.tryPage.failedLoad)
      setStatus(columns.length > 0 ? 'ready' : 'idle')
    }
  }

  function currentOptions(): QueryOptions {
    return {
      columns,
      columnTypes,
      filters: Object.entries(filters).flatMap(([column, value]) =>
        value == null ? [] : [{ column, value }]
      ),
      groupBy: groupBys,
    }
  }

  const getDistinctValues = React.useCallback(async (column: string): Promise<string[]> => {
    const cached = distinctCache.current.get(column)
    if (cached) return cached
    const engine = engineRef.current
    if (!engine) return []

    const result = await executeQuery(
      engine.conn,
      `SELECT DISTINCT ${quoteIdent(column)} AS value FROM ${quoteIdent(TABLE_NAME)} ORDER BY 1 LIMIT ${MAX_DISTINCT_VALUES}`
    )
    const values = result.rows.map((row) => String(row.value ?? ''))
    distinctCache.current.set(column, values)
    return values
  }, [])

  async function handleExport() {
    const engine = engineRef.current
    if (!engine || !appliedOptions || !fileName) return
    setStatus('querying')
    setError(null)
    try {
      const isGrouped = (appliedOptions.groupBy?.length ?? 0) > 0
      const downloadName = `${fileName.replace(/\.csv$/i, '')}_processed.csv`

      if (isGrouped) {
        // Run full query without limit/offset pagination
        const sql = buildQuery(TABLE_NAME, {
          ...appliedOptions,
          limit: undefined,
          offset: undefined,
        })
        const data = await executeQuery(engine.conn, sql)
        const { rows, columns: cleanColumns } = processGroupedResults(data.rows, data.columns)
        downloadCSVFromRows(cleanColumns, rows, downloadName)
      } else {
        // Export raw filtered data (no group by, no pagination)
        const sql = buildExportQuery(TABLE_NAME, appliedOptions)
        await exportQueryToCSV(engine.db, engine.conn, sql, downloadName)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setStatus('ready')
    }
  }

  const isQuerying = status === 'querying'
  const isLoadingFile = status === 'loading-engine' || status === 'loading-file'

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
          {t.taxProcessor.tryPage.title}
        </h1>
        <p className="text-muted-foreground sm:text-1xl mt-4 text-lg">
          {t.taxProcessor.tryPage.subtitle}
        </p>
      </div>

      {/* Upload Area */}
      <div className="mt-8 flex justify-center">
        <FileUploader
          isLoading={isLoadingFile}
          loadingLabel={
            status === 'loading-engine'
              ? t.taxProcessor.tryPage.loadingEngine
              : t.taxProcessor.tryPage.readingFile
          }
          fileName={fileName}
          rowCount={totalRows}
          onFileSelect={handleFileSelect}
        />
      </div>

      {error && (
        <div className="mx-auto mt-4 max-w-2xl rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {columns.length > 0 && (
        <>
          {/* Column Controls + Actions */}
          <div className="mt-10">
            <div className="flex items-start gap-4">
              <ColumnControls
                columns={columns}
                columnTypes={columnTypes}
                filters={filters}
                groupBys={groupBys}
                getDistinctValues={getDistinctValues}
                onTypeChange={(col, type) => setColumnTypes((prev) => ({ ...prev, [col]: type }))}
                onFilterSelect={(col, value) => setFilters((prev) => ({ ...prev, [col]: value }))}
                onGroupByToggle={(col) =>
                  setGroupBys((prev) =>
                    prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
                  )
                }
              />

              <div className="flex shrink-0 flex-col gap-2">
                <Button
                  onClick={() => runQuery(currentOptions(), 1)}
                  disabled={isQuerying}
                  className="bg-[#FFD600] text-black hover:bg-[#FFD600]/90"
                >
                  {isQuerying && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t.taxProcessor.tryPage.applyQuery}
                </Button>
                <Button variant="outline" onClick={handleExport} disabled={!result || isQuerying}>
                  <Download className="h-4 w-4" />
                  {t.taxProcessor.tryPage.exportCsv}
                </Button>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="mt-6">
            <DataTable
              columns={result?.columns ?? columns}
              rows={result?.rows ?? []}
              page={page}
              filteredCount={filteredCount}
              pageSize={PAGE_SIZE}
              isLoading={isQuerying}
              onPageChange={(p) => {
                if (appliedOptions) runQuery(appliedOptions, p)
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}
