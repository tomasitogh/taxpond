# Feature Specifications — Taxpond

> Fecha: 29 de Julio de 2026
> Stack: Next.js 16, React 19, Shadcn UI, Tailwind CSS 4, TypeScript
> Stack adicional propuesto: DuckDB-WASM

---

## Tabla de contenidos

1. [Tax Reports Processor (La Grilla Interactiva)](#1-tax-reports-processor)
2. [Validador Masivo de Tax IDs](#2-validador-masivo-de-tax-ids)
3. [Evaluación de viabilidad y dificultad](#3-evaluación-de-viabilidad-y-dificultad)

---

## 1. Tax Reports Processor

### Visión general

El usuario sube un archivo CSV pesado (hasta 100 MB / ~2 millones de filas), la app lo carga en memoria del navegador usando la File API, DuckDB-WASM lo monta como tabla relacional, y el usuario puede interactuar con ella (filtrar, agrupar, ordenar) ejecutando consultas SQL en el cliente sin necesidad de servidor ni conexión a internet.

### Dependencias necesarias

```bash
npm install duckdb @duckdb/duckdb-wasm
```

> **Nota sobre duckdb-wasm**: El bundle WASM de DuckDB es grande (~30 MB). Se debe configurar el lazy loading para que no bloquee el tiempo de carga inicial de la página. Ver Paso 1B más abajo.

### Paso 1A: Componente de Drag & Drop (File API)

**Qué se hace**: Crear un componente `FileUploader` que acepte archivos por drag & drop o click, y lea el contenido completo en memoria.

**Archivos a crear/modificar**:

- `src/components/tax-processor/file-uploader.tsx` — Componente reutilizable.
- `src/app/(products)/tax-processor/page.tsx` — Página existente, integrar el componente.

**Implementación paso a paso**:

1. En `file-uploader.tsx`, usar `onDragOver`, `onDragLeave` y `onDrop` del DOM para manejar el drag & drop (ya hay un mock funcional en `tax-processor/page.tsx:36-44`).

2. En el handler `onDrop`, acceder a `e.dataTransfer.files[0]` para obtener el objeto `File`.

3. Validar que el archivo sea `.csv` (o `.xlsx` si se quiere soporte futuro). Rechazar archivos de más de 200 MB con un toast de Shadcn.

4. Usar `FileReader` o, preferiblemente, `file.text()` (API moderna) para leer el contenido completo del archivo en un string:

```typescript
const content = await file.text()
```

> **Para archivos de 100 MB**: `file.text()` funciona bien en browsers modernos. La operación es síncrona en el hilo principal, pero para CSVs muy grandes se puede usar `ReadableStream` + `TextDecoderStream` si se quiere evitar bloquear la UI. Por ahora, `file.text()` es suficiente.

5. Guardar el string crudo y el nombre del archivo en estado de React (`useState`).

6. Emitir el contenido al componente padre o a un context/store.

**Estado de React propuesto**:

```typescript
interface FileState {
  fileName: string
  rawCSV: string
  isLoading: boolean
  error: string | null
}
```

**UX**: Mientras se lee el archivo, mostrar un spinner o skeleton. Para archivos de 100 MB la lectura toma < 1 segundo en un SSD moderno.

---

### Paso 1B: Inicialización lazy de DuckDB-WASM

**Qué se hace**: Cargar DuckDB-WASM solo cuando el usuario necesita procesar datos, no al cargar la página.

**Archivo a crear**:

- `src/lib/duckdb.ts` — Singleton para inicializar y reutilizar la instancia de DuckDB.

**Implementación paso a paso**:

1. Crear un módulo `src/lib/duckdb.ts` que exporte una función `getDuckDB()` que devuelva una instancia de `Database`.

2. Usar lazy loading con dynamic import para que el bundle WASM no se incluya en el chunk principal:

```typescript
let dbPromise: Promise<Database> | null = null

export async function getDuckDB(): Promise<Database> {
  if (!dbPromise) {
    const { DuckDB } = await import('@duckdb/duckdb-wasm')
    const duckdb = new DuckDB()
    await duckdb.instantiate()
    dbPromise = duckdb.connect()
  }
  return dbPromise
}
```

> **Importante**: DuckDB-WASM requiere que los archivos `.wasm` estén accesibles desde el browser. Next.js los sirve desde `node_modules` o se pueden copiar a `public/`. Verificar que `next.config.ts` no bloquee la carga de `.wasm`.

3. Configurar `next.config.ts` para permitir la carga de WASM (si es necesario):

```typescript
// next.config.ts
const config = {
  // ... config existente
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    }
    return config
  },
}
```

4. Probar que DuckDB-WASM carga correctamente abriendo la consola del navegador y verificando que no hay errores de WASM.

---

### Paso 2: Montar el CSV como tabla en DuckDB

**Qué se hace**: Tomar el string crudo del CSV y registrarlo como una tabla/queryable en DuckDB.

**Archivo a modificar**:

- `src/lib/duckdb.ts` — Agregar función para registrar CSV.

**Implementación paso a paso**:

1. DuckDB-WASM puede leer CSV directamente desde un string usando `CREATE VIEW` o `read_csv_auto`:

```typescript
export async function registerCSV(db: Database, csvContent: string, tableName: string) {
  // Registrar el CSV como una tabla virtual usando read_csv_auto
  await db.query(`
    CREATE OR REPLACE VIEW ${tableName} AS 
    SELECT * FROM read_csv_auto('${tableName}')
  `)
}
```

> **Problema**: `read_csv_auto` espera un path de archivo o un buffer, no un string directo. Para strings, la forma correcta es:

```typescript
// Opción 1: Usar DuckDB API para registrar un buffer
const buffer = new TextEncoder().encode(csvContent)
db.registerFileBuffer(`${tableName}.csv`, buffer)

await db.query(`
  CREATE OR REPLACE VIEW ${tableName} AS 
  SELECT * FROM read_csv_auto('${tableName}.csv')
`)
```

2. La función `registerFileBuffer` de DuckDB-WASM permite registrar un `Uint8Array` como archivo virtual en el sistema de archivos en memoria de DuckDB.

3. Después de registrar el buffer, ejecutar `read_csv_auto` para crear un view o tabla que sea queryable.

4. **Parseo de headers**: DuckDB `read_csv_auto` detecta automáticamente los headers del CSV. No es necesario parsear manualmente.

5. **Manejo de encoding**: CSVs de Latinoamérica suelen venir en UTF-8 o Latin-1. DuckDB soporta ambos. Si hay problemas de encoding, usar la opción `ENCODING='latin1'` en `read_csv_auto`.

**Función completa propuesta**:

```typescript
export async function loadCSV(
  db: Database,
  csvContent: string,
  tableName: string = 'uploaded_data'
) {
  const encoder = new TextEncoder()
  const buffer = encoder.encode(csvContent)

  db.registerFileBuffer(`${tableName}.csv`, buffer)

  await db.query(`
    CREATE OR REPLACE VIEW ${tableName} AS 
    SELECT * FROM read_csv_auto('${tableName}.csv', header=true, sample_size=10000)
  `)

  // Verificar que se cargó correctamente
  const countResult = await db.query(`SELECT COUNT(*) as total FROM ${tableName}`)
  const total = await countResult.toArray()
  return total[0].total
}
```

---

### Paso 3: Interacción UI = Consultas SQL

**Qué se hace**: Crear controles de UI (botones, dropdowns) que, al interactuar, generen y ejecuten consultas SQL dinámicamente sobre la tabla montada.

**Archivos a crear/modificar**:

- `src/components/tax-processor/data-controls.tsx` — Panel de controles (agrupar, filtrar, ordenar, buscar).
- `src/lib/query-builder.ts` — Lógica para construir SQL a partir de acciones del usuario.
- `src/app/(products)/tax-processor/page.tsx` — Integrar todo.

**Implementación paso a paso**:

1. **Diseñar el query builder**: Crear un módulo `query-builder.ts` que reciba acciones del usuario y devuelva strings SQL:

```typescript
interface QueryOptions {
  select?: string[] // Columnas a mostrar
  groupBy?: string[] // Agrupar por
  aggregates?: { column: string; fn: 'SUM' | 'COUNT' | 'AVG' | 'MIN' | 'MAX' }[]
  orderBy?: string // Ordenar por
  orderDirection?: 'ASC' | 'DESC'
  where?: string // Filtro WHERE
  limit?: number // Límite de filas
}

export function buildQuery(tableName: string, options: QueryOptions): string {
  const parts: string[] = ['SELECT']

  // SELECT clause
  const selectParts: string[] = []
  if (options.groupBy) {
    selectParts.push(...options.groupBy)
  }
  if (options.aggregates) {
    for (const agg of options.aggregates) {
      selectParts.push(`${agg.fn}(${agg.column}) as ${agg.fn.toLowerCase()}_${agg.column}`)
    }
  }
  if (selectParts.length === 0) {
    selectParts.push('*')
  }
  parts.push(selectParts.join(', '))

  // FROM clause
  parts.push(`FROM ${tableName}`)

  // WHERE clause
  if (options.where) {
    parts.push(`WHERE ${options.where}`)
  }

  // GROUP BY clause
  if (options.groupBy && options.groupBy.length > 0) {
    parts.push(`GROUP BY ${options.groupBy.join(', ')}`)
  }

  // ORDER BY clause
  if (options.orderBy) {
    parts.push(`ORDER BY ${options.orderBy} ${options.orderDirection || 'ASC'}`)
  }

  // LIMIT clause
  if (options.limit) {
    parts.push(`LIMIT ${options.limit}`)
  }

  return parts.join(' ')
}
```

2. **Crear controles de UI en `data-controls.tsx`**:

   - **Selector de columnas**: Checkbox o toggle para elegir qué columnas mostrar. Se genera un `SELECT col1, col2, ...`.
   - **Botón "Agrupar por Fecha"**: Al hacer click, ejecuta `SELECT fecha, SUM(monto) FROM uploaded_data GROUP BY fecha`.
   - **Botón "Sumar Montos"**: Similar, ejecuta una agregación.
   - **Buscador de texto libre**: Un input que, al escribir, genera `WHERE columna ILIKE '%texto%'` (búsqueda parcial case-insensitive).
   - **Filtros**: Dropdowns por columna para filtrar valores específicos.
   - **Ordenamiento**: Click en el header de columna para `ORDER BY columna ASC/DESC`.

3. **Ejecutar la consulta**:

```typescript
import { getDuckDB } from '@/lib/duckdb'

export async function executeQuery(sql: string) {
  const db = await getDuckDB()
  const result = await db.query(sql)
  const rows = await result.toArray()
  return rows
}
```

4. **Manejo de errores SQL**: Envolver la ejecución en try/catch y mostrar errores en un toast de Shadcn. Errores comunes: columna inexistente, tipo de dato incorrecto.

---

### Paso 4: Ejecución y Renderizado

**Qué se hace**: Mostrar los resultados de la consulta SQL en una tabla de Shadcn UI con virtualización para manejar millones de filas sin bloquear el DOM.

**Dependencia adicional**:

```bash
npm install @tanstack/react-virtual
```

**Archivos a crear/modificar**:

- `src/components/tax-processor/data-table.tsx` — Tabla virtualizada.
- `src/app/(products)/tax-processor/page.tsx` — Estado compartido entre controles y tabla.

**Implementación paso a paso**:

1. **Crear `data-table.tsx`** con virtualización usando `@tanstack/react-virtual`:

```typescript
'use client'

import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

interface DataTableProps {
  columns: string[]
  data: Record<string, unknown>[]
}

export function DataTable({ columns, data }: DataTableProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35, // alto estimado por fila
    overscan: 20, // filas extra renderizadas fuera del viewport
  })

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto rounded-lg border">
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: `${virtualRow.start}px`,
              width: '100%',
              height: `${virtualRow.size}px`,
            }}
            className="flex items-center border-b px-4"
          >
            {columns.map((col) => (
              <div key={col} className="flex-1 truncate text-sm">
                {String(data[virtualRow.index][col] ?? '')}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
```

2. **¿Por qué virtualización?**: React renderiza el DOM real solo de las filas visibles (+ 20 de buffer). Para 2 millones de filas, solo se renderizan ~50 en el DOM. Sin virtualización, el DOM se colapsa.

3. **Estado compartido**: Usar un `useState` en la página o un Zustand store simple para compartir entre `DataControls` y `DataTable`:

```typescript
// En tax-processor/page.tsx
const [queryResult, setQueryResult] = useState<Record<string, unknown>[]>([])
const [columns, setColumns] = useState<string[]>([])
const [currentSQL, setCurrentSQL] = useState<string>('')
const [isLoading, setIsLoading] = useState(false)
```

4. **Flujo completo**:
   - Usuario carga CSV → `loadCSV()` → DuckDB tiene la tabla.
   - Usuario hace click en "Agrupar por Fecha" → `buildQuery()` genera SQL → `executeQuery()` → resultado se guarda en `queryResult`.
   - `DataTable` recibe `queryResult` y lo renderiza virtualizado.

5. **Indicador de carga**: Mostrar un skeleton o spinner mientras DuckDB ejecuta la consulta (generalmente < 50ms para 2M de filas, pero puede variar en dispositivos lentos).

6. **Exportar resultados**: Agregar un botón "Exportar CSV" que convierta `queryResult` a CSV y descargue el archivo usando `URL.createObjectURL`:

```typescript
function exportToCSV(data: Record<string, unknown>[], columns: string[]) {
  const header = columns.join(',')
  const rows = data.map((row) => columns.map((col) => `"${String(row[col] ?? '')}"`).join(','))
  const csv = [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'resultados.csv'
  a.click()
  URL.revokeObjectURL(url)
}
```

---

### Flujo completo — Diagrama de secuencia

```
Usuario                    Browser (React)              DuckDB-WASM (WASM en Memoria)
  |                              |                              |
  |-- drag & drop archivo ------>|                              |
  |                              |-- file.text() -------------->|
  |                              |<-- string CSV ---------------|
  |                              |                              |
  |                              |-- getDuckDB() -------------->|
  |                              |<-- instancia DB -------------|
  |                              |                              |
  |                              |-- registerFileBuffer() ----->|
  |                              |-- CREATE VIEW -------------->|
  |                              |<-- OK ----------------------|
  |                              |                              |
  |-- clickea "Agrupar" -------->|                              |
  |                              |-- buildQuery() ------------->|
  |                              |-- db.query(SQL) ----------->|
  |                              |<-- result rows --------------|
  |                              |                              |
  |<-- tabla renderizada --------|                              |
```

---

## 2. Validador de Tax IDs (Individual + Masivo)

### Visión general

Feature dual: validación individual de tax IDs (solo TypeScript, respuesta instantánea) y validación masiva via DuckDB WASM con validación en JavaScript puro.

**Decisión de arquitectura**: Se usa un approach híbrido: DuckDB WASM para cargar y manejar archivos CSV (ventajas: detección de tipos, manejo de encoding, queries SQL), y JavaScript puro para la validación (evita bugs conocidos de DuckDB's JavaScript UDFs con Emscripten). Las funciones de validación son las mismas para ambos modos.

### Dependencias adicionales

```bash
pnpm add @duckdb/duckdb-wasm @duckdb/duckdb-wasm-binding fflate
```

- `@duckdb/duckdb-wasm` + `@duckdb/duckdb-wasm-binding`: Motor DuckDB WASM
- `fflate`: Descompresión ZIP ligera (para soporte futuro de XLSX/XLSM)

### Países soportados (MVP)

| País      | ID   | Algoritmo                                          | Estado |
| --------- | ---- | -------------------------------------------------- | ------ |
| Argentina | CUIT | Módulo 11, pesos `[5,4,3,2,7,6,5,4,3,2]`           | MVP    |
| Chile     | RUT  | Módulo 11 variante, pesos `[2,3,4,5,6,7]` en ciclo | MVP    |

### Paso 1: Validadores puros (TypeScript)

**Archivos a crear**:

- `src/lib/validators/ar-cuit.ts` — `validateCUIT(cuit: string): boolean`
- `src/lib/validators/cl-rut.ts` — `validateRUT(rut: string): boolean`
- `src/lib/validators/index.ts` — Barrel export + `TaxIdConfig` type

Cada validador:

1. Limpia caracteres no numéricos (guiones, puntos)
2. Valida longitud y formato básico
3. Aplica algoritmo Módulo 11
4. Compara contra dígito verificador

> Los validadores son funciones puras, testeables con Vitest sin necesidad de DuckDB.

### Paso 2: Validación en DuckDB (JavaScript UDFs vs hybrid approach)

**Decisión de implementación**: DuckDB WASM's JavaScript UDFs (`LANGUAGE javascript`) tienen bugs conocidos con Emscripten (`_setThrew is not defined`). Se usó un approach híbrido:

1. Cargar el CSV en DuckDB (ventajas: detección de tipos, queries SQL rápidas)
2. Extraer los datos con `SELECT * FROM tabla`
3. Validar en JavaScript puro usando las mismas funciones de validación individual
4. Mostrar resultados con el status `tax_id_valido`

**Archivo**: `src/lib/duckdb/udf.ts`

```typescript
export async function validateWithUDF(
  conn: DuckDBConnection,
  tableName: string,
  columnName: string,
  validator: (value: string) => boolean
): Promise<{
  rows: Record<string, unknown>[]
  validCount: number
  errorCount: number
  columns: string[]
}> {
  const columns = await getColumns(conn, tableName)
  const result = await executeQuery(conn, `SELECT * FROM ${tableName}`)

  const rows = result.rows.map((row) => ({
    ...row,
    tax_id_valido: validator(String(row[columnName] ?? '')),
  }))

  const validCount = rows.filter((r) => r.tax_id_valido).length
  const errorCount = rows.length - validCount

  return { rows, validCount, errorCount, columns }
}
```

**Query resultante**:

```sql
SELECT * FROM uploaded_data  -- DuckDB carga los datos
-- Luego en JavaScript:
-- rows.map(row => ({ ...row, tax_id_valido: validator(row[column]) }))
```

### Paso 3: UI del Tax ID Validator

**Ruta**: `/tax-id-validator`

**Componentes**:

- `src/components/tax-id-validator/tax-id-validator.tsx` — Tabs: "Validate Code" / "Validate File"
- `src/components/tax-id-validator/single-validator.tsx` — Input + resultado instantáneo (solo TS)
- `src/components/tax-id-validator/file-validator.tsx` — Upload → columna → validación DuckDB
- `src/components/tax-id-validator/validation-results.tsx` — Métricas + tabla errores + export

**Flujo individual**: Input → `validateCUIT()`/`validateRUT()` → badge verde/rojo

**Flujo masivo**: Upload CSV → `loadCSVFile()` → `DESCRIBE` → usuario selecciona columna → `registerTaxIdUDFs()` → query con UDF → resultados

2. Exportar la lista para que la UI la use como opciones de un dropdown.

---

### Paso 2: Configuración del usuario en la UI

**Archivos a crear/modificar**:

- `src/components/tax-processor/tax-id-validator.tsx` — Componente de configuración y validación.
- `src/app/(products)/tax-processor/page.tsx` — Integrar el validator.

**Implementación paso a paso**:

1. **Selector de columna**: Después de que el usuario carga un CSV, la app conoce los headers (DuckDB puede hacer `DESCRIBE uploaded_data`). Mostrar un dropdown con los nombres de columnas disponibles.

2. **Selector de país**: Dropdown con las opciones del diccionario `TAX_ID_PATTERNS`.

3. **UI del componente `tax-id-validator.tsx`**:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TAX_ID_PATTERNS, type TaxIdPattern } from '@/lib/tax-id-patterns'
import { getDuckDB } from '@/lib/duckdb'

interface TaxIdValidatorProps {
  isDataLoaded: boolean
  onValidationComplete: (result: ValidationResult) => void
}

export function TaxIdValidator({ isDataLoaded, onValidationComplete }: TaxIdValidatorProps) {
  const [selectedColumn, setSelectedColumn] = useState<string>('')
  const [selectedPattern, setSelectedPattern] = useState<TaxIdPattern | null>(null)
  const [columns, setColumns] = useState<string[]>([])
  const [isValidating, setIsValidating] = useState(false)

  // Cargar columnas cuando se monta el CSV
  useEffect(() => {
    if (isDataLoaded) {
      loadColumns()
    }
  }, [isDataLoaded])

  async function loadColumns() {
    const db = await getDuckDB()
    const result = await db.query('DESCRIBE uploaded_data')
    const rows = await result.toArray()
    setColumns(rows.map((r: any) => r.column_name))
  }

  async function handleValidate() {
    if (!selectedColumn || !selectedPattern) return

    setIsValidating(true)
    const db = await getDuckDB()

    const sql = `
      SELECT *,
        CASE
          WHEN regexp_matches("${selectedColumn}", '${selectedPattern.regex}')
          THEN 'OK'
          ELSE 'ERROR'
        END AS estado_validacion
      FROM uploaded_data
    `

    const result = await db.query(sql)
    const rows = await result.toArray()

    const errors = rows.filter((r: any) => r.estado_validacion === 'ERROR')
    const valid = rows.filter((r: any) => r.estado_validacion === 'OK')

    onValidationComplete({
      total: rows.length,
      valid: valid.length,
      errors: errors.length,
      data: rows,
    })

    setIsValidating(false)
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border p-6">
      <h3 className="text-lg font-semibold">Tax ID Validator</h3>

      {/* Selector de columna */}
      <div>
        <label className="text-sm text-muted-foreground">Columna con Tax IDs</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {selectedColumn || 'Seleccionar columna...'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {columns.map((col) => (
              <DropdownMenuItem key={col} onClick={() => setSelectedColumn(col)}>
                {col}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Selector de país/patrón */}
      <div>
        <label className="text-sm text-muted-foreground">Formato de Tax ID</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {selectedPattern ? `${selectedPattern.country} (${selectedPattern.label})` : 'Seleccionar país...'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {TAX_ID_PATTERNS.map((p) => (
              <DropdownMenuItem key={p.countryCode} onClick={() => setSelectedPattern(p)}>
                {p.country} — {p.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedPattern && (
        <p className="text-xs text-muted-foreground">
          Formato: <code>{selectedPattern.regex}</code> — {selectedPattern.description}
        </p>
      )}

      <Button
        onClick={handleValidate}
        disabled={!selectedColumn || !selectedPattern || isValidating}
      >
        {isValidating ? 'Validando...' : 'Validar'}
      </Button>
    </div>
  )
}
```

---

### Paso 3: Escaneo vectorizado con DuckDB

**Qué se hace**: Ejecutar la consulta SQL que valida cada fila en paralelo usando los múltiples cores del CPU del cliente.

**Detalle técnico**:

1. DuckDB-WASM ejecuta `regexp_matches()` de forma vectorizada: procesa bloques de filas en paralelo usando Web Workers internamente.

2. La consulta generada es:

```sql
SELECT *,
  CASE
    WHEN regexp_matches("cuit", '^\d{2}-\d{8}-\d{1}$')
    THEN 'OK'
    ELSE 'ERROR'
  END AS estado_validacion
FROM uploaded_data;
```

3. Para 2 millones de filas, DuckDB procesa esto en ~50-200ms dependiendo del dispositivo. No es bloqueante, pero sí se debe mostrar un loading state.

4. **Optimización**: Si el usuario solo quiere ver errores, agregar un `WHERE`:

```sql
SELECT *
FROM uploaded_data
WHERE NOT regexp_matches("cuit", '^\d{2}-\d{8}-\d{1}$');
```

Esto reduce el volumen de datos transferidos del WASM al JS.

---

### Paso 4: Reporte de errores y exportación

**Archivos a crear/modificar**:

- `src/components/tax-processor/validation-results.tsx` — Muestra el resumen y la tabla de errores.
- `src/app/(products)/tax-processor/page.tsx` — Integrar resultados.

**Implementación paso a paso**:

1. **Resumen**: Mostrar un card con estadísticas:

```typescript
interface ValidationResult {
  total: number
  valid: number
  errors: number
  data: Record<string, unknown>[]
}
```

```tsx
<div className="grid grid-cols-3 gap-4">
  <div className="rounded-lg border p-4 text-center">
    <p className="text-2xl font-bold">{result.total.toLocaleString()}</p>
    <p className="text-muted-foreground text-sm">Total filas</p>
  </div>
  <div className="rounded-lg border p-4 text-center">
    <p className="text-2xl font-bold text-emerald-600">{result.valid.toLocaleString()}</p>
    <p className="text-muted-foreground text-sm">Válidos</p>
  </div>
  <div className="rounded-lg border p-4 text-center">
    <p className="text-2xl font-bold text-red-600">{result.errors.toLocaleString()}</p>
    <p className="text-muted-foreground text-sm">Con errores</p>
  </div>
</div>
```

2. **Badges de estado**: En la tabla de resultados, cada fila tiene un badge:

```tsx
<span
  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
    row.estado_validacion === 'OK' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
  }`}
>
  {row.estado_validacion}
</span>
```

3. **Filtrar errores**: Un botón que filtre solo las filas con `estado_validacion === 'ERROR'` y las muestre en la tabla:

```typescript
const errorRows = result.data.filter((row) => row.estado_validacion === 'ERROR')
```

4. **Exportar solo errores**: Reusar la función `exportToCSV` del Paso 4 de la Feature 1, pero pasándole solo `errorRows`. El contador descarga un CSV limpio con las ~50 filas que necesita corregir.

5. **Filtrar y re-validar**: El usuario puede cambiar el patrón de regex y re-validar sin recargar el archivo, ya que la tabla sigue montada en DuckDB.

---

### Flujo completo — Diagrama de secuencia

```
Usuario                    Browser (React)              DuckDB-WASM
  |                              |                              |
  |-- drag & drop archivo ------>|                              |
  |<-- tabla cargada ------------|                              |
  |                              |                              |
  |-- selecciona columna "CUIT" ->|                              |
  |-- selecciona país "Argentina"->|                              |
  |-- clickea "Validar" -------->|                              |
  |                              |-- SELECT *, CASE WHEN ------>|
  |                              |   regexp_matches(...)        |
  |                              |<-- rows + estado_validacion -|
  |                              |                              |
  |<-- resumen (ok/errores) -----|                              |
  |<-- tabla con badges -------->|                              |
  |                              |                              |
  |-- clickea "Filtrar Errores"->|                              |
  |<-- solo filas con ERROR -----|                              |
  |                              |                              |
  |-- clickea "Exportar CSV" --->|                              |
  |<-- archivo descargado -------|                              |
```

---

## 3. Evaluación de viabilidad y dificultad

### Feature 1: Tax Reports Processor

| Aspecto                 | Evaluación                                                                                                                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Viabilidad**          | **Alta.** DuckDB-WASM es una tecnología probada, bien documentada y con soporte activo. La File API es nativa del browser. La virtualización con `@tanstack/react-virtual` es estándar en la industria.            |
| **Dificultad técnica**  | **Media.** Los bloques individuales (File API, DuckDB, virtualización) son moderados. El desafío real está en integrarlos bien y manejar edge cases (encoding de CSV, headers inconsistentes, archivos corruptos). |
| **Tiempo estimado**     | **2-3 semanas** para un MVP funcional (una persona, dedicación parcial).                                                                                                                                           |
| **Riesgos principales** | 1) DuckDB-WASM bundle grande (~30 MB) puede afectar Lighthouse score. 2) `read_csv_auto` puede fallar con CSVs mal formateados. 3) El WASM puede fallar en Safari (probar bien).                                   |
| **Lo que ya tenés**     | La página `tax-processor/page.tsx` ya tiene el mockup del drag & drop y la UI estática. Solo falta conectar la lógica real.                                                                                        |

### Feature 2: Validador Masivo de Tax IDs

| Aspecto                 | Evaluación                                                                                                                                                                                                                                                                        |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Viabilidad**          | **Muy alta.** Esto es literalmente una query SQL con `CASE WHEN` + `regexp_matches`. DuckDB ya hace todo el trabajo pesado. La parte difícil es definir los regex correctos (y eso ya lo tenés).                                                                                  |
| **Dificultad técnica**  | **Baja-Media.** La lógica de negocio es simple: aplicar regex a una columna. Los regex de formatos de tax IDs son conocidos y estandarizados.                                                                                                                                     |
| **Tiempo estimado**     | **3-5 días** para un MVP funcional (una persona, dedicación parcial).                                                                                                                                                                                                             |
| **Riesgos principales** | 1) Algunos países tienen formatos que cambian (ej: Mexico RFC cambió recientemente). 2) Los regex de formato puro no validan dígito verificador (checksum). Eso requiere lógica adicional en JS. 3) Performance del regex en 2M de filas puede variar (pero ~200ms es aceptable). |
| **Lo que ya tenés**     | DuckDB-WASM será dependency de la Feature 1. Esta feature se construye encima de la misma infraestructura.                                                                                                                                                                        |

### Dependencia entre features

La Feature 2 depende de la Feature 1. No tiene sentido construir el validador de tax IDs sin antes tener el motor de carga de archivos y DuckDB-WASM funcionando. El orden de implementación recomendado es:

```
Feature 1 (Tax Reports Processor)
  └── Feature 2 (Validador de Tax IDs)
```

La Feature 1 establece:

- La infraestructura de DuckDB-WASM (`src/lib/duckdb.ts`)
- El componente de carga de archivos (`FileUploader`)
- La tabla virtualizada (`DataTable`)
- El patrón de estado compartido

La Feature 2 solo agrega:

- El diccionario de regex (`tax-id-patterns.ts`)
- El componente de configuración (`TaxIdValidator`)
- La consulta SQL con `regexp_matches`
- El componente de resultados con badges

### Resumen de dificultad

| Feature               | Dificultad | Tiempo      | ¿Se puede hacer sin IA?                     |
| --------------------- | ---------- | ----------- | ------------------------------------------- |
| Tax Reports Processor | Media      | 2-3 semanas | Sí, con documentación de DuckDB-WASM a mano |
| Validador de Tax IDs  | Baja-Media | 3-5 días    | Sí, es básicamente una query SQL            |

**Veredicto final**: Ambas features son perfectamente viables de implementar a mano sin asistencia de IA. La documentación oficial de DuckDB-WASM es buena y hay tutoriales. La parte más tricky es el setup inicial de DuckDB-WASM con Next.js (configuración de WASM loading), pero una vez que eso funciona, todo lo demás es CRUD + SQL básico.

> **Consejo**: Empezar con la Feature 1, hacer que funcione con un CSV de prueba de 10k filas, y una vez que el pipeline completo esté andando (carga → DuckDB → query → tabla virtualizada), escalar a 2M de filas y agregar la Feature 2.
