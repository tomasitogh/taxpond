"use client"

import * as React from "react"
import { Upload, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const MOCK_COLUMNS = ["Date", "Tax ID", "Description", "Amount", "Currency"]

const MOCK_DATA = [
  { Date: "2025-01-15", "Tax ID": "20-12345678-3", Description: "Consultoría energetica", Amount: "125000.00", Currency: "ARS" },
  { Date: "2025-01-16", "Tax ID": "20-87654321-9", Description: "Servicios de auditoria", Amount: "89500.50", Currency: "ARS" },
  { Date: "2025-02-01", "Tax ID": "30-71234567-0", Description: "Licencia software", Amount: "45000.00", Currency: "USD" },
  { Date: "2025-02-10", "Tax ID": "20-11111111-1", Description: "Honorarios directivos", Amount: "320000.00", Currency: "ARS" },
  { Date: "2025-02-15", "Tax ID": "27-22222222-5", Description: "Reembolso gastos viaje", Amount: "78000.25", Currency: "ARS" },
  { Date: "2025-03-01", "Tax ID": "30-33333333-7", Description: "Mantenimiento servers", Amount: "15000.00", Currency: "USD" },
  { Date: "2025-03-05", "Tax ID": "20-44444444-2", Description: "Capacitación personal", Amount: "62000.00", Currency: "ARS" },
  { Date: "2025-03-10", "Tax ID": "20-55555555-8", Description: "Seguro commercial", Amount: "98000.00", Currency: "ARS" },
  { Date: "2025-03-15", "Tax ID": "30-66666666-4", Description: "Publicidad digital", Amount: "21000.75", Currency: "USD" },
  { Date: "2025-04-01", "Tax ID": "20-77777777-0", Description: "Alquiler oficina", Amount: "185000.00", Currency: "ARS" },
  { Date: "2025-04-05", "Tax ID": "20-88888888-6", Description: "Servicios legales", Amount: "145000.00", Currency: "ARS" },
  { Date: "2025-04-10", "Tax ID": "30-99999999-1", Description: "Cloud hosting", Amount: "3200.00", Currency: "USD" },
  { Date: "2025-04-15", "Tax ID": "20-10101010-3", Description: "Commissiones ventas", Amount: "275000.00", Currency: "ARS" },
  { Date: "2025-05-01", "Tax ID": "20-20202020-7", Description: "Gastos bancarios", Amount: "4500.00", Currency: "ARS" },
  { Date: "2025-05-05", "Tax ID": "30-30303030-2", Description: "Telecomunicaciones", Amount: "12000.00", Currency: "ARS" },
  { Date: "2025-05-10", "Tax ID": "20-40404040-8", Description: "Mater prima importada", Amount: "58000.00", Currency: "USD" },
  { Date: "2025-05-15", "Tax ID": "20-50505050-4", Description: "Transporte mercaderia", Amount: "33000.00", Currency: "ARS" },
  { Date: "2025-06-01", "Tax ID": "30-60606060-0", Description: "Seguros varios", Amount: "41000.00", Currency: "ARS" },
  { Date: "2025-06-05", "Tax ID": "20-70707070-6", Description: "Consultoria IT", Amount: "67000.50", Currency: "USD" },
  { Date: "2025-06-10", "Tax ID": "20-80808080-2", Description: "Suministros oficina", Amount: "8900.00", Currency: "ARS" },
]

const ROWS_PER_PAGE = 10

export default function TaxProcessorTryPage() {
  const [isDragOver, setIsDragOver] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [columnFilters, setColumnFilters] = React.useState<Record<string, string | null>>({})
  const [columnGroupBys, setColumnGroupBys] = React.useState<Record<string, boolean>>({})

  const totalPages = Math.ceil(MOCK_DATA.length / ROWS_PER_PAGE)
  const paginatedData = MOCK_DATA.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  )

  function handleFilterSelect(column: string, value: string | null) {
    setColumnFilters((prev) => ({ ...prev, [column]: value }))
  }

  function handleGroupByToggle(column: string) {
    setColumnGroupBys((prev) => ({ ...prev, [column]: !prev[column] }))
  }

  function handleApplyQuery() {
    // Mock: in real implementation, this would build and execute a DuckDB SQL query
    console.log("Apply query with:", { columnFilters, columnGroupBys })
  }

  const uniqueValues = (col: string) => {
    const vals = Array.from(new Set(MOCK_DATA.map((r) => r[col as keyof typeof r])))
    return vals.sort()
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Start uploading your report.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground sm:text-1xl">
          Remember, this data IS NOT being shared with anyone, this runs in your computer.
        </p>
      </div>

      {/* Upload Area */}
      <div className="mt-8 flex justify-center">
        <button
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragOver(false)
            // Mock: in real implementation, this would read the CSV file
          }}
          onClick={() => {
            // Mock: would open file picker
          }}
          className={`flex w-72 items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-4 text-sm font-medium transition-colors ${
            isDragOver
              ? "border-[#FFD600] bg-[#FFD600]/5 text-foreground"
              : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30"
          }`}
        >
          Upload file
          <Upload className="h-4 w-4" />
        </button>
      </div>

      {/* Column Controls + Apply Query */}
      <div className="mt-10">
        <div className="flex items-start gap-4">
          {/* Column Filter/GroupBy Controls */}
          <div className="flex flex-1 gap-3 overflow-x-auto">
            {MOCK_COLUMNS.map((col) => (
              <div key={col} className="flex min-w-[140px] flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground">
                  {col}
                </span>
                <div className="flex gap-1">
                  {/* Filter by */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-transparent px-2 text-xs font-medium text-foreground hover:bg-accent">
                      Filter by
                      <ChevronDown className="h-3 w-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="max-h-60 overflow-auto">
                      <DropdownMenuItem onClick={() => handleFilterSelect(col, null)}>
                        All
                      </DropdownMenuItem>
                      {uniqueValues(col).map((val) => (
                        <DropdownMenuItem
                          key={val}
                          onClick={() => handleFilterSelect(col, val)}
                        >
                          {val}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Group by */}
                  <Button
                    variant={columnGroupBys[col] ? "default" : "outline"}
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={() => handleGroupByToggle(col)}
                  >
                    Group by
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Apply Query Button */}
          <Button
            onClick={handleApplyQuery}
            className="shrink-0 bg-[#FFD600] text-foreground hover:bg-[#FFD600]/90"
          >
            Apply query
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {MOCK_COLUMNS.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-xs font-medium text-muted-foreground"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-border last:border-0 hover:bg-muted/30"
                >
                  {MOCK_COLUMNS.map((col) => (
                    <td key={col} className="px-4 py-3 text-foreground">
                      {row[col as keyof typeof row]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Showing {(currentPage - 1) * ROWS_PER_PAGE + 1}-
            {Math.min(currentPage * ROWS_PER_PAGE, MOCK_DATA.length)} of{" "}
            {MOCK_DATA.length} rows
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                className="h-7 w-7 p-0 text-xs"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
