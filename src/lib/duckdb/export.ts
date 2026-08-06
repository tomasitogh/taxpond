import type { DuckDBConnection, DuckDBInstance } from './types'

/**
 * Exports a query result as a CSV file download.
 *
 * Uses DuckDB's native COPY TO through the virtual filesystem instead of
 * serializing rows in JavaScript — this keeps memory flat for exports of
 * millions of rows. The SQL must not contain LIMIT/OFFSET so the export
 * includes the full result set.
 */
export async function exportQueryToCSV(
  db: DuckDBInstance,
  conn: DuckDBConnection,
  sql: string,
  downloadName: string
): Promise<void> {
  const virtualFile = 'taxpond_export.csv'
  await conn.query(`COPY (${sql}) TO '${virtualFile}' (HEADER, DELIMITER ',')`)
  try {
    const buffer = await db.copyFileToBuffer(virtualFile)
    const blob = new Blob([new Uint8Array(buffer)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = downloadName
    anchor.click()
    // Delay revocation — some browsers cancel the download if revoked immediately
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } finally {
    await db.dropFile(virtualFile)
  }
}

/**
 * Converts an array of rows to a CSV string and downloads it.
 * Used for grouped/post-processed results.
 */
export function downloadCSVFromRows(
  columns: string[],
  rows: Record<string, unknown>[],
  downloadName: string
): void {
  const header = columns.map((col) => `"${col.replaceAll('"', '""')}"`).join(',')
  const body = rows
    .map((row) =>
      columns
        .map((col) => {
          const val = row[col]
          if (val == null) return ''
          return `"${String(val).replaceAll('"', '""')}"`
        })
        .join(',')
    )
    .join('\n')
  const csvContent = `${header}\n${body}`
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = downloadName
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
