Spike: Proyectos con DuckDB WASM en producción

Los más relevantes para nosotros:

1. duckbook.ai (https://duckbook.ai) — SQL notebook con duckdb-wasm-kit. El autor creó la librería duckdb-wasm-kit que resuelve exactamente el patrón useDuckDb() que necesitamos en React. Evaluar si usarla.
2. duckbase.studio (https://duckbase.studio) — Data warehouse in-browser completo. Upload CSV/Parquet, SQL queries, Chart.js para gráficos, IA para sugerir queries. Open source, Next.js + TypeScript.
3. duckviz.com (https://duckviz.com) — Dashboard builder con AI, embeddable via npm (@duckviz/explorer). Si queremos construir rápido, podemos embeber sus componentes en vez de desde cero.
4. data-duck-lab.vercel.app (https://data-duck-lab.vercel.app) — SQL workbench, auto-chart, profiling. Deploy estático en Vercel (mismo stack que nosotros).
5. app.honeycomb.place (https://app.honeycomb.place) — Usa parquet range queries para datos geográficos.

Insights clave del spike:

- duckdb-wasm-kit es la librería más madura para React con DuckDB-WASM
- Arrow IPC es 10-100x más rápido que CSV para cargar datos
- CSP headers pueden romper DuckDB-WASM (necesita Worker loading)
- Static deploy funciona perfecto (Vercel, GitHub Pages)
- La discusión duckdb/duckdb-wasm#1359 (https://github.com/duckdb/duckdb-wasm/discussions/1359) tiene 15+ ejemplos de la comunidad
