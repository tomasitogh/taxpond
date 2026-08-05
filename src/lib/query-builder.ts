export type ColumnType = 'string' | 'date' | 'number'

export interface ColumnFilter {
  column: string
  value: string
}

export interface QueryOptions {
  /** All columns of the uploaded table, in original order. */
  columns: string[]
  /** UI-chosen type per column. Missing entries default to 'string'. */
  columnTypes: Record<string, ColumnType>
  /** Equality filters on raw VARCHAR values. */
  filters?: ColumnFilter[]
  /** Columns used as grouping keys (in selection order). */
  groupBy?: string[]
  limit?: number
  offset?: number
}

/* -------------------------------------------------------------------------- */
/* SQL escaping                                                               */
/* -------------------------------------------------------------------------- */

export function quoteIdent(ident: string): string {
  return `"${ident.replaceAll('"', '""')}"`
}

export function quoteLiteral(value: string): string {
  return `'${value.replaceAll("'", "''")}'`
}

/* -------------------------------------------------------------------------- */
/* Query building                                                             */
/* -------------------------------------------------------------------------- */

function typeOf(columnTypes: Record<string, ColumnType>, column: string): ColumnType {
  return columnTypes[column] ?? 'string'
}

function buildWhereClause(filters: ColumnFilter[]): string {
  if (filters.length === 0) return ''
  const clauses = filters.map((f) => `${quoteIdent(f.column)} = ${quoteLiteral(f.value)}`)
  return ` WHERE ${clauses.join(' AND ')}`
}

/**
 * Builds the main SELECT query.
 *
 * - **No group by**: plain `SELECT "col", ... FROM t` — all columns as raw
 *   VARCHAR. Casts (number/date) are applied in JavaScript after retrieval.
 * - **With group by**: `SELECT keys, list("numCol") AS _raw_numCol, COUNT(*) AS row_count`.
 *   `list()` gathers the raw VARCHAR values per group; the caller parses and
 *   sums them in JavaScript (the hybrid approach — avoids DuckDB-WASM macros
 *   which trigger `_setThrew is not defined` in the MVP bundle).
 */
export function buildQuery(tableName: string, options: QueryOptions): string {
  const { columns, columnTypes, filters = [], groupBy = [], limit, offset } = options
  const table = quoteIdent(tableName)
  const where = buildWhereClause(filters)

  let sql: string

  if (groupBy.length === 0) {
    const selectList = columns.map((col) => quoteIdent(col)).join(', ')
    sql = `SELECT ${selectList} FROM ${table}${where}`
  } else {
    const keys = groupBy.map((col) => quoteIdent(col))
    const numCols = columns.filter(
      (col) => typeOf(columnTypes, col) === 'number' && !groupBy.includes(col)
    )
    const lists = numCols.map((col) => `list(${quoteIdent(col)}) AS _raw_${col}`)
    const selectList = [...keys, ...lists, 'COUNT(*) AS row_count'].join(', ')
    const ordinals = groupBy.map((_, i) => String(i + 1)).join(', ')
    sql = `SELECT ${selectList} FROM ${table}${where} GROUP BY ${ordinals} ORDER BY ${ordinals}`
  }

  if (limit !== undefined) sql += ` LIMIT ${limit}`
  if (offset !== undefined) sql += ` OFFSET ${offset}`
  return sql
}

/** Total rows matching the options (groups count as one row each). */
export function buildCountQuery(tableName: string, options: QueryOptions): string {
  const { filters = [], groupBy = [] } = options
  const table = quoteIdent(tableName)
  const where = buildWhereClause(filters)

  if (groupBy.length === 0) {
    return `SELECT COUNT(*) AS count FROM ${table}${where}`
  }

  const keys = groupBy.map((col) => quoteIdent(col))
  const ordinals = groupBy.map((_, i) => String(i + 1)).join(', ')
  return `SELECT COUNT(*) AS count FROM (SELECT ${keys.join(', ')} FROM ${table}${where} GROUP BY ${ordinals}) AS grouped`
}

/**
 * Builds a query for CSV export: filtered, no group by, no pagination.
 */
export function buildExportQuery(tableName: string, options: QueryOptions): string {
  const { columns, filters = [] } = options
  const table = quoteIdent(tableName)
  const where = buildWhereClause(filters)
  const selectList = columns.map((col) => quoteIdent(col)).join(', ')
  return `SELECT ${selectList} FROM ${table}${where}`
}

/* -------------------------------------------------------------------------- */
/* Number parsing (pure JavaScript — the hybrid approach)                     */
/* -------------------------------------------------------------------------- */

/**
 * Parses a LATAM/US-formatted numeric string into a canonical numeric string.
 *
 * Rules:
 * - Both '.' and ',' present → the rightmost is the decimal separator
 *   ('1.234.567,89' → '1234567.89', '1,234,567.89' → '1234567.89').
 * - Only one separator → if it appears multiple times, or is followed by
 *   exactly 3 digits, it is a thousands separator ('1.234' → '1234');
 *   otherwise it is the decimal separator ('125000.00' → '125000.00').
 * - Anything unparseable → null.
 */
export function normalizeNumberString(raw: string): string | null {
  const s = raw.trim()
  if (s === '') return null

  const hasDot = s.includes('.')
  const hasComma = s.includes(',')

  let normalized: string
  if (hasDot && hasComma) {
    normalized =
      s.lastIndexOf('.') > s.lastIndexOf(',')
        ? s.replaceAll(',', '')
        : s.replaceAll('.', '').replace(',', '.')
  } else if (hasDot) {
    const parts = s.split('.')
    normalized = parts.length > 2 || parts[1].length === 3 ? parts.join('') : s
  } else if (hasComma) {
    const parts = s.split(',')
    normalized = parts.length > 2 || parts[1].length === 3 ? parts.join('') : s.replace(',', '.')
  } else {
    normalized = s
  }

  return /^-?\d+(\.\d+)?$/.test(normalized) ? normalized : null
}

/**
 * Sum a list of raw VARCHAR values as numbers. Values that can't be parsed
 * are treated as 0. Used to aggregate `list()` results from grouped queries.
 */
export function sumRawNumbers(rawValues: unknown[]): number {
  let total = 0
  for (const v of rawValues) {
    if (v == null) continue
    const n = normalizeNumberString(String(v))
    if (n !== null) total += Number(n)
  }
  return total
}

/**
 * Process grouped query results: convert `list()` arrays into SUMmed numbers
 * and clean up the internal `_raw_*` columns.
 *
 * `resultColumns` are the DuckDB output columns (e.g. `['Currency',
 * '_raw_Amount', 'row_count']`). The function replaces `_raw_*` entries with
 * the original column name and computes the sum.
 */
export function processGroupedResults<T extends Record<string, unknown>>(
  rows: T[],
  resultColumns: string[]
): { rows: T[]; columns: string[] } {
  const numCols = resultColumns.filter((col) => col.startsWith('_raw_')).map((col) => col.slice(5))

  const processed = rows.map((row) => {
    const newRow: Record<string, unknown> = { ...row }
    for (const col of numCols) {
      const rawKey = `_raw_${col}`
      if (rawKey in newRow) {
        const rawList = newRow[rawKey]
        newRow[col] = Array.isArray(rawList) ? sumRawNumbers(rawList) : 0
        delete newRow[rawKey]
      }
    }
    return newRow as T
  })

  const cleanColumns = resultColumns.map((col) => (col.startsWith('_raw_') ? col.slice(5) : col))

  return { rows: processed, columns: cleanColumns }
}
