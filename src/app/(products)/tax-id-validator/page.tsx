'use client'

import dynamic from 'next/dynamic'
import { DuckDBProvider } from '@/lib/duckdb'

const TaxIdValidator = dynamic(
  () =>
    import('@/components/tax-id-validator').then((mod) => mod.TaxIdValidator),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-muted-foreground">
          Loading validator...
        </div>
      </div>
    ),
  },
)

export default function TaxIdValidatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Product
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Tax ID Validator
      </h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        Validate individual tax IDs or upload a CSV file for bulk validation.
        Supports CUIT (Argentina) and RUT (Chile).
      </p>

      <section className="mt-8">
        <DuckDBProvider>
          <TaxIdValidator />
        </DuckDBProvider>
      </section>
    </div>
  )
}
