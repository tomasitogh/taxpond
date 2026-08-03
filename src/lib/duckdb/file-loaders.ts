import type {
  DuckDBInstance,
  DuckDBConnection,
  FileExtension,
  FileLoader,
  FileLoaderResult,
} from './types'
import { csvLoader } from './csv-loader'

const loaders = new Map<FileExtension, FileLoader>([['.csv', csvLoader]])

export function registerFileLoader(loader: FileLoader): void {
  loaders.set(loader.extension, loader)
}

export function getFileLoader(extension: FileExtension): FileLoader | undefined {
  return loaders.get(extension)
}

export function getSupportedExtensions(): FileExtension[] {
  return Array.from(loaders.keys())
}

export function isExtensionSupported(filename: string): boolean {
  const ext = getFileExtension(filename)
  return loaders.has(ext)
}

export function getFileExtension(filename: string): FileExtension {
  const dotIndex = filename.lastIndexOf('.')
  if (dotIndex === -1) return '.csv'
  return filename.slice(dotIndex).toLowerCase() as FileExtension
}

export async function loadFile(
  db: DuckDBInstance,
  conn: DuckDBConnection,
  file: File,
  tableName?: string
): Promise<FileLoaderResult> {
  const ext = getFileExtension(file.name)
  const loader = loaders.get(ext)

  if (!loader) {
    throw new Error(
      `Unsupported file format: ${ext}. Supported: ${getSupportedExtensions().join(', ')}`
    )
  }

  return loader.load(db, conn, file, tableName)
}
