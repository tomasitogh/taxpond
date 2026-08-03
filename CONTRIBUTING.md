# Contributing to Taxpond

Thanks for your interest in contributing! Taxpond is an open source project aimed at making tax compliance simpler and more private for businesses across Latin America. Every contribution matters — whether it's fixing a typo, adding a validator for a new country, or improving performance.

## Prerequisites

- **Node.js** 20 or later
- **pnpm** (the project's package manager)
- **Git**

## Development Setup

```bash
# Fork the repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/taxpond.git
cd taxpond/taxpond-app

# Install dependencies
pnpm install

# Start the dev server (opens at http://localhost:3000)
pnpm dev

# In a separate terminal, run linting and type checks
pnpm lint
pnpm type-check
```

## Project Structure

```
taxpond-app/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── (marketing)/      # Landing page, company info
│   │   └── (products)/       # Product pages (tax-processor)
│   ├── components/           # Shared React components
│   │   └── ui/               # Shadcn UI primitives
│   └── lib/                  # Utilities, validators, DuckDB helpers
├── public/                   # Static assets
├── docs/                     # Design decisions, feature specs
├── eslint.config.mjs         # ESLint flat config
├── tailwind.config.ts        # Tailwind configuration
└── package.json
```

## How to Contribute

### 1. Find Something to Work On

- Check [open issues](https://github.com/tomasitogh/taxpond/issues) for tasks
- Look for the [`good first issue`](https://github.com/tomasitogh/taxpond/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) label for beginner-friendly tasks
- Feel free to open a new issue to propose a feature or report a bug

### 2. Fork, Branch, Commit, PR

```bash
# Create a descriptive branch
git checkout -b feat/add-colombia-nit-validator

# Make your changes, then commit with a conventional commit message
git commit -m "feat: add NIT validator for Colombia"

# Push and open a PR
git push origin feat/add-colombia-nit-validator
```

#### Branch Naming

| Prefix  | Use Case            |
| ------- | ------------------- |
| `feat/` | New feature         |
| `fix/`  | Bug fix             |
| `docs/` | Documentation       |
| `test/` | Adding/fixing tests |

#### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add RUT validator for Chile
fix: correct CUIT checksum calculation
docs: update README with benchmark data
chore: upgrade duckdb to 0.10.0
test: add unit tests for RFC validator
```

### 3. Code Standards

- **TypeScript strict mode** — no `any` types unless absolutely necessary (and with a comment explaining why)
- **Lint before you commit:**

```bash
pnpm lint          # ESLint
pnpm format:check  # Prettier
pnpm type-check    # TypeScript
```

- **Components** — use Shadcn UI conventions. Place new primitives in `src/components/ui/`
- **Tests** — write tests for any new validator or core logic. Use Vitest:

```bash
pnpm test
```

### 4. Pull Request Process

1. Fill out the PR description completely — what changed, why, and how to test it
2. Ensure CI passes (lint, type-check, tests, build)
3. Keep PRs small and focused — one feature or fix per PR
4. Request a review from a maintainer
5. Address review feedback promptly

## Adding a New Tax ID Validator

This is the most common contribution. Here's a step-by-step guide:

### Step 1: Research the Format

Look up the official format for the country's tax ID:

| Country | ID   | Format                                                                 |
| ------- | ---- | ---------------------------------------------------------------------- |
| AR      | CUIT | XX-XXXXXXXX-X (11 digits, check digit algorithm)                       |
| BR      | CNPJ | XX.XXX.XXX/XXXX-XX (14 digits, weighted sum)                           |
| CL      | RUT  | X.XXX.XXX-X or XXXXXXXX-X (7-8 digits + check digit)                   |
| MX      | RFC  | 4 letters + 6 digits (individuals) or 3 letters + 6 digits (companies) |
| CO      | NIT  | X.XXX.XXX-X (9-10 digits with check digit)                             |
| PE      | RUC  | 11 digits (same format as DNI)                                         |

### Step 2: Create the Validator

Add a new file in `src/lib/validators/`:

```typescript
// src/lib/validators/cl-rut.ts

export function validateRUT(rut: string): boolean {
  // Strip dots and hyphens
  const cleaned = rut.replace(/[.\-]/g, '')
  if (!/^\d{7,8}[0-9K]$/i.test(cleaned)) return false

  // Compute check digit
  const body = cleaned.slice(0, -1)
  const expectedCheck = cleaned.slice(-1).toUpperCase()
  const computed = computeCheckDigit(body)

  return computed === expectedCheck
}

function computeCheckDigit(body: string): string {
  let sum = 0
  let multiplier = 2
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]!, 10) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }
  const remainder = 11 - (sum % 11)
  if (remainder === 11) return '0'
  if (remainder === 10) return 'K'
  return String(remainder)
}
```

### Step 3: Write Tests

```typescript
// src/lib/validators/__tests__/cl-rut.test.ts
import { describe, it, expect } from 'vitest'
import { validateRUT } from '../cl-rut'

describe('validateRUT', () => {
  it('accepts valid RUTs', () => {
    expect(validateRUT('12.345.678-5')).toBe(true)
    expect(validateRUT('12345678-5')).toBe(true)
  })

  it('rejects invalid check digits', () => {
    expect(validateRUT('12.345.678-0')).toBe(false)
  })

  it('rejects malformed input', () => {
    expect(validateRUT('1234')).toBe(false)
    expect(validateRUT('')).toBe(false)
  })
})
```

### Step 4: Export and Register

Add the validator to `src/lib/validators/index.ts` and integrate it into the UI.

### Step 5: Open a PR

Use the branch prefix `feat/` and commit with `feat: add [country] [ID type] validator`.

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you agree to uphold its standards.

## Questions?

Open a [GitHub Discussion](https://github.com/tomasitogh/taxpond/discussions) — we're happy to help.
