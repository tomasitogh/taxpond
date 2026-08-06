# AGENTS.md — Taxpond

## Project Overview

Taxpond is a browser-based tax compliance tool for Latin American businesses. It processes, cleans, and reconciles millions of tax records directly in the user's browser using DuckDB compiled to WebAssembly. No data leaves the machine — zero server-side processing, zero compliance risk.

**Core problem:** Tax compliance in LATAM requires juggling spreadsheets across 6+ countries, each with its own Tax ID format, reporting schema, and regulatory quirks — while sensitive financial data gets uploaded to third-party servers.

**Solution:** Run the entire processing pipeline client-side. Users upload CSV/Excel files, DuckDB WASM mounts them as relational tables, and the user can filter, group, sort, and validate tax IDs via SQL queries — all without an internet connection or server.

## Tech Stack

| Layer           | Technology                      |
| --------------- | ------------------------------- |
| Framework       | Next.js 16+ (App Router)        |
| Language        | TypeScript (strict mode)        |
| UI              | Shadcn UI + Tailwind CSS 4      |
| Database Engine | DuckDB WASM                     |
| Package Manager | pnpm                            |
| Deployment      | Vercel (static)                 |
| Testing         | Vitest                          |
| Linting         | ESLint (flat config) + Prettier |

## Project Structure

```
taxpond-app/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── (marketing)/          # Landing page, company info
│   │   │   ├── page.tsx          # Homepage (minimalist)
│   │   │   ├── company/          # Company info
│   │   │   └── home-page-content.tsx
│   │   ├── (products)/           # Product pages
│   │   │   └── tax-processor/
│   │   │       ├── page.tsx      # Main tax processor page
│   │   │       └── try/          # Prototype with mock data
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── navbar.tsx            # Global navigation bar
│   │   ├── tax-id-validator/     # Tax ID validation components
│   │   │   ├── tax-id-validator.tsx
│   │   │   ├── single-validator.tsx
│   │   │   ├── file-validator.tsx
│   │   │   └── validation-results.tsx
│   │   ├── tax-processor/        # CSV processor components
│   │   │   ├── file-uploader.tsx # Drag & drop + click upload
│   │   │   ├── column-controls.tsx # Per-column type/filter/group controls
│   │   │   └── data-table.tsx    # Results table + pagination
│   │   ├── theme-provider.tsx    # Dark/light mode
│   │   └── ui/                   # Shadcn UI primitives
│   └── lib/
│       ├── duckdb/               # DuckDB WASM integration
│       │   ├── connection.ts     # Singleton + lazy loading
│       │   ├── csv-loader.ts     # CSV file loading
│       │   ├── export.ts         # CSV export (COPY TO + download)
│       │   ├── file-loaders.ts   # Generic file loaders
│       │   ├── query.ts          # Query execution
│       │   ├── types.ts          # TypeScript types
│       │   ├── udf.ts            # User-defined functions
│       │   └── provider.tsx      # React context provider
│       ├── query-builder.ts      # SQL builder + cast macros (parse_amount/parse_date)
│       ├── validators/           # Tax ID validators
│       │   ├── ar-cuit.ts        # Argentina CUIT
│       │   ├── cl-rut.ts         # Chile RUT
│       │   ├── ca-tax-id.ts      # Canada SIN/BN
│       │   └── index.ts          # Barrel exports + config
│       ├── i18n/                 # Internationalization
│       └── utils.ts              # Utility functions
├── docs/                         # Design decisions, feature specs
├── public/                       # Static assets
├── eslint.config.mjs             # ESLint flat config
├── next.config.ts                # Next.js config (WASM enabled)
├── tsconfig.json                 # TypeScript config
└── package.json
```

## Development Commands

```bash
# CRITICAL: This project uses webpack, NOT Turbopack
# Turbopack has problems with WASM — always use --webpack flag
pnpm dev --webpack          # Start dev server (http://localhost:3000)
pnpm build --webpack        # Build for production
pnpm start --webpack        # Start production server

# Quality checks
pnpm lint                   # ESLint
pnpm format:check           # Prettier
pnpm type-check             # TypeScript type checking
pnpm test                   # Vitest test suite
pnpm format                 # Auto-fix Prettier formatting
```

**IMPORTANT:** Turbopack is NOT configured for this project because it has problems with WASM. Always use `--webpack` flag.

## Architecture

### Client-Side Processing Pipeline

```
User uploads CSV
    ↓
File API reads file (file.text())
    ↓
DuckDB WASM registers as virtual table (registerFileBuffer + read_csv_auto)
    ↓
UI controls generate SQL queries (buildQuery)
    ↓
DuckDB executes query client-side (~50ms for 2M rows)
    ↓
Virtualized table renders results (@tanstack/react-virtual)
```

### DuckDB WASM Singleton

The DuckDB instance is lazy-loaded and shared across the app:

```typescript
// src/lib/duckdb/connection.ts
let dbInstance: DuckDBInstance | null = null

export async function getDuckDB(): Promise<DuckDBInstance> {
  if (dbInstance) return dbInstance
  // Lazy load ~30MB WASM bundle
  const { AsyncDuckDB, ConsoleLogger } = await import('@duckdb/duckdb-wasm')
  // ... instantiate and return
}
```

### Query Builder Pattern

UI actions generate SQL dynamically:

```typescript
// src/lib/query-builder.ts
interface QueryOptions {
  columns: string[] // all columns, original order
  columnTypes: Record<string, ColumnType> // 'string' (default) | 'date' | 'number'
  filters?: { column: string; value: string }[] // equality on raw VARCHAR values
  groupBy?: string[] // grouping keys; number columns not grouped get SUM()ed
  limit?: number
  offset?: number
}
```

Casts are applied in JavaScript after retrieval (the hybrid approach — DuckDB
handles filtering, grouping, and counting on raw VARCHAR; JS parses numbers
via `normalizeNumberString` which detects `.`/`,` punctuation for thousands
vs decimals). For grouped queries, `list()` gathers raw values per group and
JS sums them. All identifiers/literals are escaped via `quoteIdent`/`quoteLiteral`.

### Tax ID Validators

Pure TypeScript functions (no DuckDB dependency for individual validation):

```typescript
// src/lib/validators/ar-cuit.ts
export function validateCUIT(cuit: string): boolean {
  // Strip non-numeric characters
  // Validate length and format
  // Apply Modulo 11 algorithm
  // Compare against check digit
}
```

Supported countries:

- **Argentina:** CUIT (Modulo 11, weights `[5,4,3,2,7,6,5,4,3,2]`)
- **Chile:** RUT (Modulo 11 variant, weights `[2,3,4,5,6,7]` cycle)
- **Canada:** SIN/BN (weighted sum algorithm)

## Code Style & Conventions

### TypeScript

- **Strict mode enabled** — no `any` types unless absolutely necessary (with comment explaining why)
- Use `type` imports: `import type { Foo } from './bar'` (enforced by ESLint)
- Unused vars: prefix with `_` (e.g., `_unused`)

### React

- Use `'use client'` directive for client components
- Components are functional (no class components)
- Shadcn UI conventions for new primitives
- Place new UI components in `src/components/ui/`

### Styling

- **Tailwind CSS 4** with `tailwind-merge` for class merging
- **Typography:** Inter for UI, Space Grotesk (tabular-nums) for financial data
- **Buttons:** Always `rounded-full`
- **Cards/Containers:** `rounded-xl` with 1px subtle borders, no heavy shadows
- **Colors:**
  - Light: white bg, black text, yellow accent (`#FFD600`)
  - Dark: black bg, white text, same yellow accent
  - Toggle via `dark:` Tailwind classes

### File Naming

- Components: `kebab-case.tsx` (e.g., `tax-id-validator.tsx`)
- Utilities: `kebab-case.ts` (e.g., `csv-loader.ts`)
- Tests: `__tests__/` directory adjacent to source

### Commit Messages

Follow Conventional Commits:

```
feat: add RUT validator for Chile
fix: correct CUIT checksum calculation
docs: update README with benchmark data
chore: upgrade duckdb to 0.10.0
test: add unit tests for RFC validator
```

## Performance Considerations

### DuckDB WASM Bundle

- **~30MB WASM bundle** — lazy load, never include in main chunk
- Use `dynamic import()` for DuckDB initialization
- Verify `next.config.ts` has `experiments.asyncWebAssembly = true`

### Large File Handling

- Files >10MB: use `ReadableStream` + `TextDecoderStream` to avoid blocking main thread
- DuckDB `read_csv_auto` handles encoding (UTF-8, Latin-1)
- Register files as virtual buffers: `db.registerFileBuffer()`

### Virtual Scrolling

- Use `@tanstack/react-virtual` for data tables
- `overscan: 20` (render 20 extra rows outside viewport)
- `estimateSize: 35` (35px per row)
- Only ~50 DOM nodes rendered for 2M rows

### Query Optimization

- DuckDB processes `GROUP BY`, `JOIN`, aggregations vectorized (multi-core)
- For error-only views: use `WHERE` clause to reduce data transfer from WASM to JS
- Typical performance: ~50ms for 2M row queries on mid-range hardware

## Testing

- **Framework:** Vitest
- **Pattern:** Co-located tests in `__tests__/` directories
- **Focus areas:**
  - Tax ID validators (pure functions, easy to test)
  - Query builder logic
  - DuckDB integration (mock WASM where needed)

```bash
pnpm test                    # Run all tests
pnpm test -- --watch         # Watch mode
```

## Common Pitfalls

1. **Turbopack + WASM = broken.** Always use `--webpack` flag.
2. **DuckDB WASM needs Worker access.** CSP headers in production may block Worker loading. Verify Vercel config.
3. **Safari WASM support.** Test DuckDB loading on Safari — may have issues.
4. **CSV encoding.** Latin American CSVs often use Latin-1. Use DuckDB's `ENCODING='latin1'` option if needed.
5. **Large bundle impact.** DuckDB WASM affects Lighthouse score. Lazy loading is mandatory.
6. **No `any` types.** TypeScript strict mode enforces this. Use `unknown` and type assertions when necessary.

## Key Files Reference

| File                               | Purpose                                      |
| ---------------------------------- | -------------------------------------------- |
| `src/lib/duckdb/connection.ts`     | DuckDB singleton, lazy WASM loading          |
| `src/lib/duckdb/csv-loader.ts`     | CSV file registration and loading            |
| `src/lib/duckdb/export.ts`         | CSV export via COPY TO + browser download    |
| `src/lib/query-builder.ts`         | SQL builder, cast macros, number parsing     |
| `src/lib/validators/ar-cuit.ts`    | Argentina CUIT validator                     |
| `src/lib/validators/cl-rut.ts`     | Chile RUT validator                          |
| `src/lib/validators/ca-tax-id.ts`  | Canada SIN/BN validator                      |
| `src/lib/validators/index.ts`      | Tax ID config registry                       |
| `src/components/navbar.tsx`        | Global navigation (Products dropdown, theme) |
| `src/components/tax-id-validator/` | Tax ID validation UI components              |
| `next.config.ts`                   | Webpack WASM experiment enabled              |
| `eslint.config.mjs`                | ESLint flat config with TypeScript rules     |

## Roadmap

- [x] CSV processing engine in WASM (MVP — `/tax-processor/try`)
- [ ] Interactive data grid (filters, group by, column types, CSV export done; virtual scrolling pending)
- [ ] Tax ID syntactic validator for LATAM (AR, BR, CL, MX, CO, PE)
- [ ] AI integration (Chat-to-SQL + auto-categorization)
- [ ] Live API verification against government APIs (AFIP, Receita Federal, SAT, SII)
- [ ] Batch processing via Web Workers
- [ ] Multi-currency normalization

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on:

- Development setup
- Branch naming (`feat/`, `fix/`, `docs/`, `test/`)
- PR process
- Adding new Tax ID validators (step-by-step guide)
