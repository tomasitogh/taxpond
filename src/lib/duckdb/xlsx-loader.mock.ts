/**
 * XLSX Loader - MOCK / REFERENCE IMPLEMENTATION
 *
 * This file demonstrates how to extend the file loader architecture
 * to support Excel files (.xlsx, .xlsm) in the future.
 *
 * XLSX files are ZIP archives containing XML files:
 * - xl/workbook.xml          → Sheet metadata
 * - xl/worksheets/sheet1.xml → Cell data
 * - xl/sharedStrings.xml     → Shared string table
 * - [Content_Types].xml      → MIME types
 *
 * The approach:
 * 1. Use fflate to decompress the ZIP in-memory
 * 2. Parse xl/sharedStrings.xml to get the string table
 * 3. Parse xl/worksheets/sheet1.xml to get cell references
 * 4. Convert to CSV and load via the existing csvLoader
 *
 * This is NOT active code - it's a reference for future implementation.
 */

import type { FileLoader, FileLoaderResult } from './types'
import type { DuckDBInstance, DuckDBConnection } from './types'

// --- Types ---

interface SharedStrings {
  strings: string[]
  count: number
}

interface Cell {
  reference: string
  value: string | number | boolean
  type: 'string' | 'number' | 'boolean' | 'empty'
}

interface SheetData {
  cells: Cell[]
  dimensions: { rows: number; cols: number }
}

// --- Mock Implementation ---

/**
 * Parse xl/sharedStrings.xml to extract the shared string table.
 * XLSX stores repeated strings once here and references by index.
 */
function _parseSharedStrings(xml: string): SharedStrings {
  const strings: string[] = []
  const regex = new RegExp('<si>([\\s\\S]*?)<\\/si>', 'g')
  const textRegex = new RegExp('<t[^>]*>([\\s\\S]*?)<\\/t>', 'g')

  let match
  while ((match = regex.exec(xml)) !== null) {
    const siContent = match[1] ?? ''
    let text = ''
    let textMatch
    while ((textMatch = textRegex.exec(siContent)) !== null) {
      text += textMatch[1] ?? ''
    }
    strings.push(text)
  }

  return { strings, count: strings.length }
}

/**
 * Parse xl/worksheets/sheet1.xml to extract cell data.
 * Cells reference the shared string table by index.
 */
function _parseSheetData(xml: string, sharedStrings: SharedStrings): SheetData {
  const cells: Cell[] = []
  const rowRegex = new RegExp('<row[^>]*>([\\s\\S]*?)<\\/row>', 'g')
  const cellRegex = new RegExp(
    '<c[^>]*r="([A-Z]+\\d+)"[^>]*(?:t="([^"]*)")?[^>]*>(?:<v>([\\s\\S]*?)<\\/v>)?<\\/c>',
    'g'
  )

  let maxRow = 0
  let maxCol = 0

  let rowMatch
  while ((rowMatch = rowRegex.exec(xml)) !== null) {
    const rowContent = rowMatch[1] ?? ''
    let cellMatch
    while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
      const reference = cellMatch[1] ?? ''
      const type = cellMatch[2] ?? ''
      const value = cellMatch[3] ?? ''

      // Parse column letter to index (A=0, B=1, ..., Z=25, AA=26)
      const colStr = reference.replace(/\d/g, '')
      let colIndex = 0
      for (let i = 0; i < colStr.length; i++) {
        colIndex = colIndex * 26 + (colStr.charCodeAt(i) - 64)
      }
      colIndex -= 1

      const rowNum = parseInt(reference.replace(/[A-Z]/g, ''), 10) - 1

      maxRow = Math.max(maxRow, rowNum)
      maxCol = Math.max(maxCol, colIndex)

      let cellValue: string | number | boolean = value
      let cellType: Cell['type'] = 'string'

      if (type === 's') {
        // Shared string reference
        const index = parseInt(value, 10)
        cellValue = sharedStrings.strings[index] ?? ''
        cellType = 'string'
      } else if (type === 'b') {
        cellValue = value === '1'
        cellType = 'boolean'
      } else if (type === '' && !isNaN(Number(value))) {
        cellValue = Number(value)
        cellType = 'number'
      }

      cells.push({ reference, value: cellValue, type: cellType })
    }
  }

  return {
    cells,
    dimensions: { rows: maxRow + 1, cols: maxCol + 1 },
  }
}

/**
 * Convert sheet data to CSV format.
 */
function _sheetToCsv(data: SheetData): string {
  const grid: string[][] = []

  for (const cell of data.cells) {
    const colStr = cell.reference.replace(/\d/g, '')
    let colIndex = 0
    for (let i = 0; i < colStr.length; i++) {
      colIndex = colIndex * 26 + (colStr.charCodeAt(i) - 64)
    }
    colIndex -= 1

    const rowNum = parseInt(cell.reference.replace(/[A-Z]/g, ''), 10) - 1

    if (!grid[rowNum]) grid[rowNum] = []
    grid[rowNum][colIndex] = String(cell.value)
  }

  return grid
    .map((row) => (row ?? []).map((cell) => `"${(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n')
}

// --- FileLoader Implementation ---

/**
 * Load an XLSX file into DuckDB.
 *
 * Flow:
 * 1. Read file as ArrayBuffer
 * 2. Decompress ZIP with fflate
 * 3. Parse shared strings XML
 * 4. Parse sheet XML
 * 5. Convert to CSV
 * 6. Load via csvLoader pattern
 */
async function loadXLSX(
  _db: DuckDBInstance,
  _conn: DuckDBConnection,
  _file: File,
  _tableName: string = 'uploaded_data'
): Promise<FileLoaderResult> {
  // Step 1: Read file
  // const buffer = await _file.arrayBuffer()
  // const uint8 = new Uint8Array(buffer)

  // Step 2: Decompress ZIP (requires fflate)
  // const { unzipSync } = await import('fflate')
  // const unzipped = unzipSync(uint8)

  // Step 3-4: Parse XML files
  // const sharedStringsXml = new TextDecoder().decode(
  //   unzipped['xl/sharedStrings.xml']
  // )
  // const sheetXml = new TextDecoder().decode(
  //   unzipped['xl/worksheets/sheet1.xml']
  // )

  // const sharedStrings = parseSharedStrings(sharedStringsXml)
  // const sheetData = parseSheetData(sheetXml, sharedStrings)

  // Step 5-6: Convert to CSV and load
  // const csv = sheetToCsv(sheetData)
  // return loadCSVFromContent(_conn, csv, _tableName)

  throw new Error(
    'XLSX loader not yet implemented. See src/lib/duckdb/xlsx-loader.mock.ts for reference.'
  )
}

/**
 * Future FileLoader registration:
 *
 * import { registerFileLoader } from './file-loaders'
 *
 * registerFileLoader({
 *   extension: '.xlsx',
 *   load: loadXLSX,
 * })
 *
 * registerFileLoader({
 *   extension: '.xlsm',
 *   load: loadXLSX,  // Same parser, preserves macros
 * })
 */

export const xlsxLoader: FileLoader = {
  extension: '.xlsx',
  load: loadXLSX,
}
