import { AsyncDuckDB, ConsoleLogger } from '@duckdb/duckdb-wasm'
import type { DuckDBInstance, DuckDBConnection } from './types'

let dbInstance: DuckDBInstance | null = null
let connInstance: DuckDBConnection | null = null

const DUCKDB_BUNDLES = {
  mvp: {
    mainModule: new URL(
      '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm',
      import.meta.url,
    ).href,
    mainWorker: new URL(
      '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js',
      import.meta.url,
    ).href,
  },
  eh: {
    mainModule: new URL(
      '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm',
      import.meta.url,
    ).href,
    mainWorker: new URL(
      '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js',
      import.meta.url,
    ).href,
  },
}

const DUCKDB_CONFIG = {}

export async function getDuckDB(): Promise<DuckDBInstance> {
  if (dbInstance) return dbInstance

  const logger = new ConsoleLogger()
  const worker = new Worker(DUCKDB_BUNDLES.mvp.mainWorker)
  const db = new AsyncDuckDB(logger, worker)
  await db.instantiate(DUCKDB_BUNDLES.mvp.mainModule)
  await db.open(DUCKDB_CONFIG)

  dbInstance = db
  return db
}

export async function getConnection(): Promise<DuckDBConnection> {
  if (connInstance) return connInstance

  const db = await getDuckDB()
  const conn = await db.connect()

  connInstance = conn
  return conn
}

export async function resetConnection(): Promise<void> {
  if (connInstance) {
    await connInstance.close()
    connInstance = null
  }
}
