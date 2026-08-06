import { describe, it, expect } from 'vitest'
import {
  buildQuery,
  buildCountQuery,
  buildExportQuery,
  normalizeNumberString,
  sumRawNumbers,
  processGroupedResults,
  quoteIdent,
  quoteLiteral,
} from '../query-builder'

const COLUMNS = ['Date', 'Tax ID', 'Description', 'Amount', 'Currency']
const TYPES = { Date: 'date', Amount: 'number' } as const

describe('quoteIdent / quoteLiteral', () => {
  it('escapes double quotes in identifiers', () => {
    expect(quoteIdent('Tax ID')).toBe('"Tax ID"')
    expect(quoteIdent('weird"col')).toBe('"weird""col"')
  })

  it('escapes single quotes in literals', () => {
    expect(quoteLiteral('USD')).toBe("'USD'")
    expect(quoteLiteral("O'Brien")).toBe("'O''Brien'")
  })
})

describe('normalizeNumberString', () => {
  it('parses US format (dot decimal, comma thousands)', () => {
    expect(normalizeNumberString('125000.00')).toBe('125000.00')
    expect(normalizeNumberString('1,234,567.89')).toBe('1234567.89')
  })

  it('parses LATAM format (comma decimal, dot thousands)', () => {
    expect(normalizeNumberString('125000,00')).toBe('125000.00')
    expect(normalizeNumberString('1.234.567,89')).toBe('1234567.89')
  })

  it('treats a single separator followed by 3 digits as thousands', () => {
    expect(normalizeNumberString('1.234')).toBe('1234')
    expect(normalizeNumberString('1,234')).toBe('1234')
  })

  it('treats a single separator followed by other digit counts as decimal', () => {
    expect(normalizeNumberString('1.2345')).toBe('1.2345')
    expect(normalizeNumberString('12,34')).toBe('12.34')
    expect(normalizeNumberString('0,123456')).toBe('0.123456')
  })

  it('handles repeated separators as thousands', () => {
    expect(normalizeNumberString('1.234.567')).toBe('1234567')
    expect(normalizeNumberString('1,234,567')).toBe('1234567')
  })

  it('handles negatives and surrounding spaces', () => {
    expect(normalizeNumberString('-1.234,56')).toBe('-1234.56')
    expect(normalizeNumberString(' 1234.5 ')).toBe('1234.5')
  })

  it('returns null for unparseable input', () => {
    expect(normalizeNumberString('abc')).toBeNull()
    expect(normalizeNumberString('')).toBeNull()
    expect(normalizeNumberString('   ')).toBeNull()
    expect(normalizeNumberString('$1.234')).toBeNull()
  })
})

describe('sumRawNumbers', () => {
  it('sums parseable values', () => {
    expect(sumRawNumbers(['1.234.567,89', '2.000,00', '500'])).toBe(1237067.89)
  })

  it('treats unparseable values as 0', () => {
    expect(sumRawNumbers(['100', 'abc', '200'])).toBe(300)
  })

  it('handles empty arrays and nulls', () => {
    expect(sumRawNumbers([])).toBe(0)
    expect(sumRawNumbers([null, undefined, ''])).toBe(0)
  })
})

describe('processGroupedResults', () => {
  it('converts list() arrays to SUMmed numbers and renames _raw_* columns', () => {
    const rows = [
      {
        Currency: 'USD',
        _raw_Amount: ['100.00', '200.50', '50.25'],
        row_count: BigInt(3),
      },
    ]
    const { rows: processed, columns } = processGroupedResults(rows, [
      'Currency',
      '_raw_Amount',
      'row_count',
    ])
    expect((processed[0] as Record<string, unknown>).Amount).toBeCloseTo(350.75)
    expect(processed[0]).not.toHaveProperty('_raw_Amount')
    expect(columns).toEqual(['Currency', 'Amount', 'row_count'])
  })

  it('handles objects with toArray() method (like Arrow Vectors)', () => {
    const rows = [
      {
        Currency: 'USD',
        _raw_Amount: {
          toArray: () => ['150.25', '300.75'],
        },
        row_count: BigInt(2),
      },
    ]
    const { rows: processed } = processGroupedResults(rows, ['Currency', '_raw_Amount'])
    expect((processed[0] as Record<string, unknown>).Amount).toBeCloseTo(451.0)
  })

  it('handles custom iterable objects', () => {
    const customIterable = {
      *[Symbol.iterator]() {
        yield '50.00'
        yield '25.50'
      },
    }
    const rows = [
      {
        Currency: 'USD',
        _raw_Amount: customIterable,
        row_count: BigInt(2),
      },
    ]
    const { rows: processed } = processGroupedResults(rows, ['Currency', '_raw_Amount'])
    expect((processed[0] as Record<string, unknown>).Amount).toBeCloseTo(75.5)
  })
})

describe('buildQuery', () => {
  it('selects all columns without group by', () => {
    const sql = buildQuery('uploaded_data', {
      columns: COLUMNS,
      columnTypes: { ...TYPES },
      limit: 50,
      offset: 0,
    })
    expect(sql).toBe(
      'SELECT "Date", "Tax ID", "Description", "Amount", "Currency" ' +
        'FROM "uploaded_data" LIMIT 50 OFFSET 0'
    )
  })

  it('applies equality filters with escaping', () => {
    const sql = buildQuery('uploaded_data', {
      columns: COLUMNS,
      columnTypes: { ...TYPES },
      filters: [
        { column: 'Currency', value: 'USD' },
        { column: 'Description', value: "O'Brien" },
      ],
    })
    expect(sql).toContain(`WHERE "Currency" = 'USD' AND "Description" = 'O''Brien'`)
  })

  it('groups by keys with list() for number columns and COUNT(*)', () => {
    const sql = buildQuery('uploaded_data', {
      columns: COLUMNS,
      columnTypes: { ...TYPES },
      filters: [{ column: 'Currency', value: 'USD' }],
      groupBy: ['Currency'],
      limit: 50,
      offset: 0,
    })
    expect(sql).toBe(
      'SELECT "Currency", list("Amount") AS "_raw_Amount", COUNT(*) AS row_count ' +
        `FROM "uploaded_data" WHERE "Currency" = 'USD' GROUP BY 1 ORDER BY 1 LIMIT 50 OFFSET 0`
    )
  })

  it('supports multiple grouping keys', () => {
    const sql = buildQuery('uploaded_data', {
      columns: COLUMNS,
      columnTypes: { ...TYPES },
      groupBy: ['Currency', 'Date'],
    })
    expect(sql).toBe(
      'SELECT "Currency", "Date", list("Amount") AS "_raw_Amount", COUNT(*) AS row_count ' +
        'FROM "uploaded_data" GROUP BY 1, 2 ORDER BY 1, 2'
    )
  })

  it('does not list() a number column that is itself a grouping key', () => {
    const sql = buildQuery('uploaded_data', {
      columns: COLUMNS,
      columnTypes: { ...TYPES },
      groupBy: ['Amount', 'Currency'],
    })
    expect(sql).toContain('SELECT "Amount", "Currency", COUNT(*) AS row_count')
    expect(sql).not.toContain('list(')
  })

  it('omits list() when no number columns exist outside group by', () => {
    const sql = buildQuery('uploaded_data', {
      columns: COLUMNS,
      columnTypes: {},
      groupBy: ['Currency'],
    })
    expect(sql).toBe(
      'SELECT "Currency", COUNT(*) AS row_count FROM "uploaded_data" GROUP BY 1 ORDER BY 1'
    )
  })
})

describe('buildCountQuery', () => {
  it('counts plain rows without group by', () => {
    const sql = buildCountQuery('uploaded_data', {
      columns: COLUMNS,
      columnTypes: {},
      filters: [{ column: 'Currency', value: 'ARS' }],
    })
    expect(sql).toBe(`SELECT COUNT(*) AS count FROM "uploaded_data" WHERE "Currency" = 'ARS'`)
  })

  it('counts groups via subquery with group by', () => {
    const sql = buildCountQuery('uploaded_data', {
      columns: COLUMNS,
      columnTypes: { ...TYPES },
      groupBy: ['Currency'],
    })
    expect(sql).toBe(
      'SELECT COUNT(*) AS count FROM (SELECT "Currency" FROM "uploaded_data" GROUP BY 1) AS grouped'
    )
  })
})

describe('buildExportQuery', () => {
  it('builds a plain query without LIMIT or group by', () => {
    const sql = buildExportQuery('uploaded_data', {
      columns: COLUMNS,
      columnTypes: { ...TYPES },
      filters: [{ column: 'Currency', value: 'USD' }],
    })
    expect(sql).toBe(
      `SELECT "Date", "Tax ID", "Description", "Amount", "Currency" FROM "uploaded_data" WHERE "Currency" = 'USD'`
    )
  })
})
