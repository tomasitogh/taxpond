# Implementation Roadmap — CSV Processing con DuckDB WASM

> Fecha: 31 de Julio de 2026
> Stack: Next.js 16, React 19, shadcn UI (base-nova), DuckDB-WASM, TypeScript
> Estado: Plan de implementación — pre-desarrollo

---

## Tabla de contenidos

1. [Resumen ejecutivo](#1-resumen-ejecutivo)
2. [Fase 1: Infraestructura DuckDB WASM](#2-fase-1-infraestructura-duckdb-wasm)
3. [Fase 2: File Upload + Carga en DuckDB](#3-fase-2-file-upload--carga-en-duckdb)
4. [Fase 3: Query Builder + Controles UI](#4-fase-3-query-builder--controles-ui)
5. [Fase 4: Tabla Virtualizada + Paginación](#5-fase-4-tabla-virtualizada--paginación)
6. [Fase 5: Agrupación, Filtrado y Casting](#6-fase-5-agrupación-filtrado-y-casting)
7. [Fase 6: UX y Optimización](#7-fase-6-ux-y-optimización)
8. [Fase 7: XLSX/XLSM (futuro)](#8-fase-7-xlsxxlsm-futuro)
9. [Dependencias entre fases](#9-dependencias-entre-fases)
10. [Fuentes y referencias](#10-fuentes-y-referencias)

---

## 1. Resumen ejecutivo

El usuario sube un archivo CSV pesado (hasta 100 MB / ~2 millones de filas), la app lo carga en memoria del navegador usando la File API, DuckDB-WASM lo monta como tabla relacional, y el usuario puede interactuar con ella (filtrar, agrupar, ordenar, castear tipos) ejecutando consultas SQL en el cliente sin necesidad de servidor ni conexión a internet.

**Prototipo UI**: Ver `/tax-processor/try` (mock data, sin DuckDB WASM aún).
**Specs detalladas**: Ver `docs/feature-specs.md`.

---

## 2. Fase 1: Infraestructura DuckDB WASM

**Objetivo**: Que DuckDB WASM cargue y conecte correctamente en el browser.

| Paso | Descripción | Archivos |
|------|-------------|----------|
| 1.1 | Instalar `@duckdb/duckdb-wasm` y `@duckdb/duckdb-wasm-binding` | `package.json` |
| 1.2 | Configurar `next.config.ts` con `experiments.asyncWebAssembly = true` en webpack | `next.config.ts` |
| 1.3 | Crear singleton `getDuckDB()` con lazy loading via `dynamic import()` (~30 MB WASM bundle) | `src/lib/duckdb.ts` |
| 1.4 | Verificar carga en browser (Chrome, Firefox, Safari). Testear que `db.query('SELECT 1')` funcione | Manual testing |

**Riesgos**:
- El bundle WASM de ~30 MB puede afectar Lighthouse. Solución: lazy loading, no incluir en chunk principal.
- Safari puede tener issues con WASM. Probar exhaustivamente.

---

## 3. Fase 2: File Upload + Carga en DuckDB

**Objetivo**: El usuario sube un CSV y DuckDB lo monta como tabla queryable.

| Paso | Descripción | Archivos |
|------|-------------|----------|
| 2.1 | Crear componente `FileUploader` con drag & drop + click. Usar `file.text()` para leer contenido. Validar extensión `.csv`, rechazar >200MB con toast | `src/components/tax-processor/file-uploader.tsx` |
| 2.2 | Crear `loadCSV(db, csvContent, tableName)`: usar `registerFileBuffer()` + `read_csv_auto()` para montar como tabla virtual | `src/lib/duckdb.ts` |
| 2.3 | Para archivos >10MB: usar `ReadableStream` + `TextDecoderStream` para no bloquear el hilo principal | `src/components/tax-processor/file-uploader.tsx` |
| 2.4 | Manejar encoding: probar UTF-8 y Latin-1. Usar opción `ENCODING='latin1'` de DuckDB si es necesario | `src/lib/duckdb.ts` |

**Estado de React propuesto**:
```typescript
interface FileState {
  fileName: string
  rawCSV: string
  isLoading: boolean
  error: string | null
}
```

---

## 4. Fase 3: Query Builder + Controles UI

**Objetivo**: Generar SQL dinámico a partir de acciones del usuario en la UI.

| Paso | Descripción | Archivos |
|------|-------------|----------|
| 3.1 | Crear `buildQuery(tableName, options)` que genere SQL con SELECT, WHERE, GROUP BY, ORDER BY, LIMIT | `src/lib/query-builder.ts` |
| 3.2 | Crear componente `DataControls` con: selector de columnas, Filter by dropdown, Group by toggle, selector de tipo de dato por columna | `src/components/tax-processor/data-controls.tsx` |
| 3.3 | Integrar "Apply Query": al hacer click, `buildQuery()` genera SQL → `db.query()` ejecuta → resultado se guarda en estado | `src/app/(products)/tax-processor/page.tsx` |
| 3.4 | Manejo de errores SQL: catch y mostrar en toast (columna inexistente, tipo inválido) | `src/app/(products)/tax-processor/page.tsx` |

**Interface del query builder**:
```typescript
interface QueryOptions {
  select?: string[]
  groupBy?: string[]
  aggregates?: { column: string; fn: 'SUM' | 'COUNT' | 'AVG' | 'MIN' | 'MAX' }[]
  orderBy?: string
  orderDirection?: 'ASC' | 'DESC'
  where?: string
  limit?: number
}
```

---

## 5. Fase 4: Tabla Virtualizada + Paginación

**Objetivo**: Mostrar resultados de queries sin colapsar el DOM con millones de filas.

| Paso | Descripción | Archivos |
|------|-------------|----------|
| 4.1 | Instalar `@tanstack/react-virtual` | `package.json` |
| 4.2 | Crear `DataTable` con `useVirtualizer` (overscan: 20, estimateSize: 35px) | `src/components/tax-processor/data-table.tsx` |
| 4.3 | Paginación real con DuckDB: usar `LIMIT` + `OFFSET` en queries. No traer todo a memoria | `src/lib/query-builder.ts` |
| 4.4 | Skeleton/spinner mientras DuckDB ejecuta (<50ms para 2M filas, pero varía en dispositivos lentos) | `src/components/tax-processor/data-table.tsx` |

---

## 6. Fase 5: Agrupación, Filtrado y Casting

**Objetivo**: Habilitar la funcionalidad completa de la barra de controles del prototipo.

| Paso | Descripción | Archivos |
|------|-------------|----------|
| 5.1 | **Group By**: Al activar toggle, generar `SELECT col, COUNT(*) FROM ... GROUP BY col`. Permitir seleccionar función de agregación (COUNT, SUM, AVG, etc.) | `src/lib/query-builder.ts`, `src/components/tax-processor/data-controls.tsx` |
| 5.2 | **Filter by**: Dropdown genera `WHERE col = 'valor'`. Para filtros compuestos, considerar mini-formulario (BETWEEN, ILIKE, etc.) | `src/lib/query-builder.ts`, `src/components/tax-processor/data-controls.tsx` |
| 5.3 | **Cambio de tipo**: Selector ejecuta `CAST(col AS TYPE)`. Tipos: VARCHAR, INTEGER, DOUBLE, DATE, BOOLEAN | `src/lib/query-builder.ts`, `src/components/tax-processor/data-controls.tsx` |

---

## 7. Fase 6: UX y Optimización

**Objetivo**: Pulir la experiencia de usuario y optimizar performance.

| Paso | Descripción | Archivos |
|------|-------------|----------|
| 6.1 | Loading states: skeleton en tabla, spinner en botón "Apply Query" | Componentes UI |
| 6.2 | Error handling: catch de errores SQL, mostrar en toast de shadcn | `src/app/(products)/tax-processor/page.tsx` |
| 6.3 | Exportar resultados: botón "Export CSV" que convierta `queryResult` a CSV y descargue via `URL.createObjectURL` | `src/components/tax-processor/data-table.tsx` |
| 6.4 | Lazy loading del WASM: no cargar DuckDB hasta que el usuario suba un archivo | `src/lib/duckdb.ts` |

---

## 8. Fase 7: XLSX/XLSM (futuro)

**Objetivo**: Soportar archivos Excel leyendo el ZIP interno con XML.

| Paso | Descripción | Archivos |
|------|-------------|----------|
| 7.1 | Investigar: XLSX son archivos ZIP con XML. Usar `fflate` o `jszip` para descomprimir | Por definir |
| 7.2 | Parsear `xl/worksheets/sheet1.xml` y `xl/sharedStrings.xml` para extraer datos | Por definir |
| 7.3 | Convertir a CSV y pasar por el mismo pipeline de DuckDB | Por definir |
| 7.4 | Unificar flujo: `FileUploader` acepta `.xlsx` y `.xlsm` además de `.csv` | `src/components/tax-processor/file-uploader.tsx` |

**Nota**: Esta fase es posterior al MVP. DuckDB tiene `read_xlsx()` en desarrollo pero aún no es estable en WASM.

---

## 9. Dependencias entre fases

```
Fase 1 (Infraestructura DuckDB WASM)
  └── Fase 2 (File Upload + Carga)
        └── Fase 3 (Query Builder + Controles UI)
              ├── Fase 4 (Tabla Virtualizada + Paginación)
              └── Fase 5 (Agrupación, Filtrado y Casting)
                    └── Fase 6 (UX y Optimización)

Fase 7 (XLSX/XLSM) — independiente, puede hacerse en paralelo después del MVP
```

**MVP = Fase 1 + 2 + 3 + 4** (pipeline completo: carga → DuckDB → query → tabla).

---

## 10. Fuentes y referencias

### Documentación oficial

| Recurso | URL | Notas |
|---------|-----|-------|
| DuckDB-WASM docs | https://duckdb.org/docs/api/wasm/overview | Doc oficial de DuckDB para WASM |
| DuckDB-WASM GitHub | https://github.com/duckdb/duckdb-wasm | Repo oficial, issues, ejemplos |
| DuckDB read_csv_auto | https://duckdb.org/docs/data/csv.html | Documentación de la función de lectura CSV |
| @duckdb/duckdb-wasm npm | https://www.npmjs.com/package/@duckdb/duckdb-wasm | Paquete npm con ejemplos de uso |
| File API (MDN) | https://developer.mozilla.org/en-US/docs/Web/API/File_API | API nativa del browser para leer archivos |
| ReadableStream (MDN) | https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream | Para streaming de archivos grandes |
| @tanstack/react-virtual | https://tanstack.com/virtual | Virtualización de tablas |

### Artículos y tutoriales

| Recurso | URL | Notas |
|---------|-----|-------|
| "DuckDB-WASM in the Browser" (DuckDB blog) | https://duckdb.org/2024/11/22/duckdb-wasm.html | Blog post oficial sobre DuckDB-WASM |
| "Building a Data App with DuckDB-WASM" | https://duckdb.org/docs/guides/data_apps/duckdb-wasm | Tutorial de data apps |
| "Next.js + WASM" | https://nextjs.org/docs/app/api-reference/next-config-js/experimental#webassembly | Config de WASM en Next.js |

### Proyectos de referencia (ver spike completo abajo)

| Proyecto | URL | Qué usar |
|----------|-----|----------|
| QuackQL (quackql.com) | https://github.com/nicholasgriffintn/quackql | DuckDB-WASM en browser, playground interactivo |
| DuckDB-WASM demo oficial | https://duckdb.org/docs/api/wasm/shell | Shell de DuckDB en el browser |
| Observable notebooks | https://observablehq.com/@observable/duckdb-wasm | Ejemplos de DuckDB-WASM en Observable |

### Dependencias del proyecto

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `@duckdb/duckdb-wasm` | latest | Motor DuckDB compilado a WASM |
| `@duckdb/duckdb-wasm-binding` | latest | Bindings WebGL para DuckDB-WASM |
| `@tanstack/react-virtual` | latest | Virtualización de tablas |
| `fflate` o `jszip` | latest | Descompresión de ZIP (para XLSX futuro) |

---

## Spike: Proyectos open source y productos con DuckDB WASM en producción

### Apps live — usarlas como referencia

| Proyecto | URL | Descripción | Tech relevante |
|----------|-----|-------------|----------------|
| **Duckbase** | [duckbase.studio](https://duckbase.studio) / [GitHub](https://github.com/Saadain23/duckbase) | Data warehouse in-browser. Upload CSV/Parquet, SQL queries, gráficos con Chart.js, IA para sugerir queries | DuckDB-WASM + Chart.js + XLSX.js, TypeScript, Next.js |
| **DuckViz** | [duckviz.com](https://duckviz.com) / [app.duckviz.com](https://app.duckviz.com) | Dashboard builder con AI. Drop a file, AI crea visualizaciones. Embeddable via npm (`@duckviz/explorer`, `@duckviz/dashboard`) | DuckDB-WASM + IndexedDB persistence + React components embebibles |
| **DataDuck** | [data-duck-lab.vercel.app](https://data-duck-lab.vercel.app) / [GitHub](https://github.com/pradhankukiran/data-duck) | SQL workbench in-browser. CSV/Parquet/JSON, auto-chart, profiling, dashboard tiles. IA con Groq (BYOK) | DuckDB-WASM + Avalonia 12 WebAssembly + .NET, static Vercel deploy |
| **QueryVeil** | [queryveil.com](https://www.queryveil.com) | Análisis de datos con AI. Schema-only AI layer (la IA ve columnas pero no datos). Demo live | DuckDB-WASM + AI schema layer |
| **Honeycomb** | [app.honeycomb.place](https://app.honeycomb.place) | Búsqueda de población por lugar usando parquet range queries de DuckDB | DuckDB-WASM + Parquet range queries |
| **GALH** | [galh.eu](https://galh.eu) | Atlas de datos, dynamic queries en-browser. Datos pre-procesados en Arrow IPC | DuckDB-WASM + Apache Arrow IPC |
| **DataGuard Analytics** | [dataguard-analytics-xd.vercel.app](https://dataguard-analytics-xd.vercel.app) | Query CSV/Parquet/JSON localmente en el browser. Zero server | DuckDB-WASM, deploy estático |
| **NBA Win Predictor** | [nbawin.onrender.com](https://nbawin.onrender.com) | Motor de predicción NBA entirely in-browser. Parquet + D3 charts | DuckDB-WASM + Next.js + D3.js |
| **Real-Time BTC Analytics** | [GitHub](https://github.com/srnarasim/rt-duckdb-coinbase) / [Demo](https://srnarasim.github.io/rt-duckdb-coinbase/) | Data en tiempo real con WebSocket, DuckDB-WASM para analytics, Observable Plot para charts | Rust+WASM + DuckDB-WASM + Observable Plot |

### Librerías y herramientas open source

| Proyecto | URL | Descripción |
|----------|-----|-------------|
| **duckdb-wasm-kit** | [GitHub](https://github.com/holdenmatt/duckdb-wasm-kit) / [npm](https://www.npmjs.com/package/duckdb-wasm-kit) | Hooks de React para DuckDB-WASM. `useDuckDb()`, `useDuckDbQuery()`. Incluye preload, manejo de `.duckdb` files. Creador: [duckbook.ai](https://duckbook.ai) |
| **stratum-duckdb** | [GitHub](https://github.com/stratum-toolkit/stratum-duckdb) | Wrapper simple `open()`/`query()` sobre DuckDB-WASM. Soporta Parquet, CSV, JSON. Self-hosted o npm |
| **@duck_ui/embed** | [GitHub](https://github.com/caioricciuti/duck-ui-embed) | Componentes React + Web Components para dashboards con DuckDB-WASM. CDN-ready. DataTable con pagination y sorting |
| **duckdb-wasm-examples** | [GitHub org](https://github.com/duckdb-wasm-examples) | Org con ejemplos: Vite, React, Svelte, SvelteKit, Observable Plot. Buenas referencias de setup |

### Artículos técnicos clave

| Artículo | URL | Qué aporta |
|----------|-----|------------|
| "Building a High-Performance Statistical Dashboard with DuckDB-WASM and Apache Arrow" | [Medium](https://medium.com/@ryanaidilp/building-a-high-performance-statistical-dashboard-with-duckdb-wasm-and-apache-arrow-d6178aeaae6d) | Lecciones de producción: Arrow IPC para performance, fallback mechanisms, CSP headers issues |
| "I Replaced a Power BI Report With a Static Web App" | [kepakisan.co.nz](https://kepakisan.co.nz/blog/posts/duckdb-static-webapp.html) | Arquitectura minimalista: S3 + Static Web App + DuckDB-WASM. Costos: ~$15/mo vs $20/seat Power BI |
| "From Cloud to Client: Hyper-Fast In-Browser Analytics" | [Medium](https://sriram-narasim.medium.com/from-cloud-to-client-a-new-architecture-for-hyper-fast-in-browser-analytics-93257b835c42) | Paradigm shift: WASM + DuckDB + Next.js. benchmarks de performance |
| DuckDB-WASM official docs | [duckdb.org/docs/api/wasm](https://duckdb.org/docs/api/wasm/overview) | API reference, limitations, FAQ |

### Discussion oficial de ejemplos

El thread [duckdb/duckdb-wasm#1359](https://github.com/duckdb/duckdb-wasm/discussions/1359) ("Out in the wild / public examples") es el punto central donde la comunidad comparte proyectos en producción. Abril 2026: ~15+ proyectos listados.

### Insights clave del spike

1. **duckdb-wasm-kit** es la librería más madura para React. El `useDuckDb()` hook resuelve el patrón de singleton que necesitamos. **Evaluar si usarla o reimplementar.**
2. **DuckViz** es el producto más completo (AI + dashboard + embed). Su SDK (`@duckviz/explorer`) es embebible — podríamos usarlo directamente en vez de construir desde cero.
3. **Arrow IPC** es significativamente más rápido que CSV para cargar datos. Para nuestro caso de uso (CSV upload), el bottleneck es el parseo del CSV, no DuckDB. Pero值得 considerar para el futuro.
4. **CSP headers** pueden romper DuckDB-WASM en producción (necesita Worker loading). Verificar la config de Next.js.
5. **Static deploy** funciona: Vercel, Azure Static Web Apps, GitHub Pages. No necesitamos backend.

---

> **Siguiente paso**: Ejecutar la Fase 1 (instalar DuckDB-WASM, configurar Next.js, crear singleton) una vez que se apruebe este plan.
