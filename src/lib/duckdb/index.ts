export { DuckDBProvider, useDuckDB } from './provider'
export { getDuckDB, getConnection, resetConnection } from './connection'
export { executeQuery, getColumns, getRowCount } from './query'
export { validateWithUDF } from './udf'
export {
  loadFile,
  registerFileLoader,
  getFileLoader,
  getSupportedExtensions,
  isExtensionSupported,
  getFileExtension,
} from './file-loaders'
export type {
  DuckDBInstance,
  DuckDBConnection,
  QueryResult,
  FileLoaderResult,
  FileExtension,
  FileLoader,
} from './types'
