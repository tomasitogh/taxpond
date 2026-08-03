import type {
  DuckDBInstance,
  DuckDBConnection,
  FileLoader,
  FileLoaderResult,
} from './types'
import { getColumns, getRowCount } from './query'

async function loadCSV(
  db: DuckDBInstance,
  conn: DuckDBConnection,
  file: File,
  tableName: string = 'uploaded_data',
): Promise<FileLoaderResult> {
  const buffer = await file.arrayBuffer()
  const uint8 = new Uint8Array(buffer)

  await db.registerFileBuffer(`${tableName}.csv`, uint8)

  await conn.query(`
    CREATE OR REPLACE VIEW ${tableName} AS 
    SELECT * FROM read_csv_auto('${tableName}.csv', header=true, sample_size=10000, all_varchar=true)
  `)

  const columns = await getColumns(conn, tableName)
  const rowCount = await getRowCount(conn, tableName)

  return { columns, rowCount, tableName }
}

export const csvLoader: FileLoader = {
  extension: '.csv',
  load: loadCSV,
}
