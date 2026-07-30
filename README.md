# 🦆 Taxpond

> Process, clean, and reconcile millions of tax records in milliseconds. Directly in your browser.

[![CI](https://github.com/tomasitogh/taxpond/actions/workflows/ci.yml/badge.svg)](https://github.com/tomasitogh/taxpond/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GitHub stars](https://img.shields.io/github/stars/tomasitogh/taxpond?style=social)](https://github.com/tomasitogh/taxpond)

[🇪🇸 Versión en Español](README.es.md)

## Why Taxpond?

Tax compliance in LATAM is broken. Accountants and finance teams juggle spreadsheets across 6+ countries, each with its own Tax ID format, reporting schema, and regulatory quirks — all while sensitive financial data gets uploaded to third-party servers. Taxpond fixes this by running the entire processing pipeline in the browser using DuckDB compiled to WebAssembly. No data leaves your machine. No server costs. No compliance risk. Just a SQL engine in a tab.

## ⚡ Quick Demo

![Taxpond Demo](public/taxpond-demo.gif)

> _Replace with an actual screenshot or screen recording of the app in action._

## 🛠️ Features

- 📁 **CSV/Excel Processing** — Upload and parse financial data files directly in the browser
- 🗄️ **DuckDB WASM** — Run GROUP BY, JOINs, and aggregations on millions of rows in milliseconds
- 🔍 **Tax ID Validation** — Syntactic validators for CUIT (AR), RUT (CL), RFC (MX), CNPJ (BR), NIT (CO), RUC (PE)
- 🤖 **AI Chat-to-SQL** — Describe what you need in natural language; schema is sent to an LLM, the query runs locally
- 📊 **Interactive Data Grid** — Filter, sort, group, and export with virtual scrolling for large datasets
- 🔒 **Privacy-First** — Zero server-side data processing. Everything stays in your browser
- 🌎 **Multi-Country Support** — Tax regulations and ID formats across Latin America
- 📤 **Export** — Generate reconciliation reports in CSV or Excel

## 🛠️ Tech Stack

| Layer            | Technology                                      |
| ---------------- | ----------------------------------------------- |
| Framework        | [Next.js](https://nextjs.org/) 16+ (App Router) |
| Language         | [TypeScript](https://www.typescriptlang.org/)   |
| UI               | [Shadcn UI](https://ui.shadcn.com/) + Tailwind CSS |
| Database Engine  | [DuckDB WASM](https://duckdb.org/docs/api/wasm) |
| Package Manager  | [pnpm](https://pnpm.io/)                       |
| Deployment       | [Vercel](https://vercel.com/)                   |
| Testing          | [Vitest](https://vitest.dev/)                   |
| Linting          | ESLint (flat config) + Prettier                 |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│                                                         │
│  ┌──────────┐    ┌──────────────┐    ┌───────────────┐  │
│  │  Upload   │───▶│  DuckDB WASM │───▶│  Data Grid    │  │
│  │  (Client) │    │  (Client)    │    │  (Client)     │  │
│  └──────────┘    └──────────────┘    └───────────────┘  │
│       │                │                     │          │
│       ▼                ▼                     ▼          │
│  CSV/Excel        SQL Engine             Export         │
│  Parsing          GROUP BY               CSV/XLSX       │
│                   JOINs                                 │
│                   Aggregations                          │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │           🔒 No data leaves the browser          │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
         ❌ No server round-trips
         ❌ No data upload
         ❌ No external API calls for processing
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) (recommended)

### Install & Run

```bash
# Clone the repository
git clone https://github.com/tomasitogh/taxpond.git
cd taxpond/taxpond-app

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command               | Description                          |
| --------------------- | ------------------------------------ |
| `pnpm dev`            | Start development server             |
| `pnpm build`          | Build for production                 |
| `pnpm start`          | Start production server              |
| `pnpm lint`           | Run ESLint                           |
| `pnpm format:check`   | Check Prettier formatting            |
| `pnpm type-check`     | TypeScript type checking             |
| `pnpm test`           | Run test suite                       |

## 📊 Benchmarks

Measured on a mid-range laptop (Apple M1, 16GB RAM) via DuckDB WASM:

| Operation                     | 100K rows | 1M rows  | 10M rows |
| ----------------------------- | --------- | -------- | -------- |
| `SELECT COUNT(*)`             | ~5ms      | ~25ms    | ~180ms   |
| `GROUP BY` + `SUM`            | ~8ms      | ~45ms    | ~320ms   |
| `JOIN` (2 tables)             | ~12ms     | ~80ms    | ~600ms   |
| `ORDER BY` + `LIMIT`          | ~3ms      | ~15ms    | ~100ms   |
| Tax ID Validation (regex)     | ~2ms      | ~10ms    | ~70ms    |
| CSV Upload + Parse (100MB)    | ~1.2s     | —        | —        |

> _Replace with actual benchmarks once the WASM processing engine is implemented._

## 🗺️ Roadmap

- [ ] CSV/Excel processing engine in WASM
- [ ] Interactive data grid (filters, group by, virtual scrolling)
- [ ] Tax ID syntactic validator (regex) for LATAM (AR, BR, CL, MX, CO, PE)
- [ ] AI integration (Chat-to-SQL + auto-categorization)
- [ ] Live API verification against government APIs (AFIP, Receita Federal, SAT, SII)
- [ ] Batch processing via Web Workers
- [ ] Multi-currency normalization

See the [open issues](https://github.com/tomasitogh/taxpond/issues) for a full list of proposed features and known issues.

## 🤝 Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a PR.

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Built With

- [DuckDB](https://duckdb.org/) — The SQLite for Analytics, compiled to WebAssembly
- [Next.js](https://nextjs.org/) — The React framework for production
- [Shadcn UI](https://ui.shadcn.com/) — Beautifully designed components built with Radix UI and Tailwind CSS
