'use client'

import dynamic from 'next/dynamic'
import { DuckDBProvider } from '@/lib/duckdb'
import { useLanguage } from '@/lib/i18n/context'

const TaxIdValidator = dynamic(
  () => import('@/components/tax-id-validator').then((mod) => mod.TaxIdValidator),
  {
    ssr: false,
    loading: () => {
      // Dynamic loading component will not have context ready at this exact point if outside LanguageProvider,
      // but DuckDBProvider/LanguageProvider is higher in tree. Let's keep it simple or fallback.
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground text-sm">Loading validator...</div>
        </div>
      )
    },
  }
)

export default function TaxIdValidatorPage() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
        {t.taxIdValidator.product}
      </p>
      <h1 className="text-foreground mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        {t.taxIdValidator.title}
      </h1>
      <p className="text-muted-foreground mt-3 max-w-lg">{t.taxIdValidator.description}</p>

      <section className="mt-8">
        <DuckDBProvider>
          <TaxIdValidator />
        </DuckDBProvider>
      </section>
    </div>
  )
}
