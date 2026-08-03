'use client'

import dynamic from 'next/dynamic'
import { DuckDBProvider } from '@/lib/duckdb'

const TaxIdValidator = dynamic(
  () => import('@/components/tax-id-validator').then((mod) => mod.TaxIdValidator),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground text-sm">Loading validator...</div>
      </div>
    ),
  }
)

export default function TaxIdValidatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase">Product</p>
      <h1 className="text-foreground mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        Tax ID Validator
      </h1>
      <p className="text-muted-foreground mt-3 max-w-lg">
        Validate individual tax IDs or upload a CSV file for bulk validation. Supports CUIT
        (Argentina) and RUT (Chile).
      </p>

      <section className="mt-8">
        <DuckDBProvider>
          <TaxIdValidator />
        </DuckDBProvider>
      </section>
    </div>
  )
}
