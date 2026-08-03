import type { AsyncDuckDB, AsyncDuckDBConnection } from '@duckdb/duckdb-wasm'

export type DuckDBInstance = AsyncDuckDB
export type DuckDBConnection = AsyncDuckDBConnection

export interface QueryResult<T = Record<string, unknown>> {
  rows: T[]
  columns: string[]
  rowCount: number
}

export interface FileLoaderResult {
  columns: string[]
  rowCount: number
  tableName: string
}

export type FileExtension = '.csv' | '.xlsx' | '.xlsm'

export interface FileLoader {
  extension: FileExtension
  load: (
    db: DuckDBInstance,
    conn: DuckDBConnection,
    file: File,
    tableName?: string,
  ) => Promise<FileLoaderResult>
}
