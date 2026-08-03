import type { DuckDBConnection } from './types'
import { executeQuery, getColumns } from './query'

/**
 * Instead of using DuckDB's JavaScript UDFs (which have Emscripten issues),
 * we query the column data and validate in pure JavaScript.
 * This is more reliable and gives us full control over validation logic.
 */
export async function validateWithUDF(
  conn: DuckDBConnection,
  tableName: string,
  columnName: string,
  validator: (value: string) => boolean,
): Promise<{ rows: Record<string, unknown>[]; validCount: number; errorCount: number; columns: string[] }> {
  const columns = await getColumns(conn, tableName)
  
  const result = await executeQuery<Record<string, unknown>>(
    conn,
    `SELECT * FROM ${tableName}`,
  )

  const rows = result.rows.map((row) => ({
    ...row,
    tax_id_valido: validator(String(row[columnName] ?? '')),
  }))

  const validCount = rows.filter((r) => r.tax_id_valido).length
  const errorCount = rows.length - validCount

  return { rows, validCount, errorCount, columns }
}
