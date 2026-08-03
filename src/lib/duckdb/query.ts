import type { DuckDBConnection, QueryResult } from './types'

export async function executeQuery<T extends Record<string, unknown> = Record<string, unknown>>(
  conn: DuckDBConnection,
  sql: string
): Promise<QueryResult<T>> {
  const arrowTable = await conn.query(sql)
  const rows = arrowTable.toArray().map((row) => {
    const obj: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(row)) {
      obj[key] = value
    }
    return obj as T
  })
  const columns = arrowTable.schema.fields.map((f) => f.name)

  return {
    rows,
    columns,
    rowCount: rows.length,
  }
}

export async function getColumns(conn: DuckDBConnection, tableName: string): Promise<string[]> {
  const result = await executeQuery<{ column_name: string }>(conn, `DESCRIBE ${tableName}`)
  return result.rows.map((r) => String(r.column_name))
}

export async function getRowCount(conn: DuckDBConnection, tableName: string): Promise<number> {
  const result = await executeQuery<{ count: number }>(
    conn,
    `SELECT COUNT(*) as count FROM ${tableName}`
  )
  return Number(result.rows[0]?.count ?? 0)
}
