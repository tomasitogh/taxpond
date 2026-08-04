'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'

export function HomePageContent() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex min-h-[calc(75vh-4rem)] flex-col items-center justify-center px-6 text-center">
        {/* <span className="border-border bg-muted text-muted-foreground mb-4 rounded-full border px-3 py-1 text-xs font-medium">
          {t.home.badge}
        </span> */}
        <h1 className="text-foreground text-4xl font-semibold tracking-tight sm:text-6xl">
          {t.home.hero.title}
          <br />
          {t.home.hero.subtitle}
        </h1>
        <p className="text-muted-foreground mt-6 max-w-md text-lg">{t.home.hero.description}</p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/tax-processor"
            className="inline-flex items-center gap-2 rounded-full bg-[#FFD600] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#e6c000]"
          >
            {t.home.cta.button}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/company"
            className="border-border text-foreground hover:bg-muted inline-flex items-center rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
          >
            {t.nav.company}
          </Link>
        </div>
      </section>

      {/* Stats Section 
      <section className="border-border bg-muted/30 border-t px-6 py-20">
        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
          <div className="text-center">
            <p className="font-data text-foreground text-4xl font-bold tabular-nums">2,400+</p>
            <p className="text-muted-foreground mt-1 text-sm">Businesses onboarded</p>
          </div>
          <div className="text-center">
            <p className="font-data text-foreground text-4xl font-bold tabular-nums">$18M</p>
            <p className="text-muted-foreground mt-1 text-sm">Taxes processed</p>
          </div>
          <div className="text-center">
            <p className="font-data text-foreground text-4xl font-bold tabular-nums">99.7%</p>
            <p className="text-muted-foreground mt-1 text-sm">Accuracy rate</p>
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section className="px-6 py-15">
        <div className="mx-auto max-w-4xl">
          <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
            {t.home.features.label}
          </p>
          <h2 className="text-foreground mt-2 text-3xl font-semibold tracking-tight">
            {t.home.features.title}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg">{t.home.features.description}</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {t.home.features.items.map(
              (feature: { title: string; desc: string }, index: number) => (
                <div key={index} className="border-border rounded-xl border p-6">
                  <h3 className="text-foreground text-base font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-border border-t px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-foreground text-3xl font-semibold tracking-tight">
            {t.home.cta.title}
          </h2>
          <p className="text-muted-foreground mt-3">{t.home.cta.description}</p>
          <Link
            href="/tax-processor"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FFD600] px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#e6c000]"
          >
            {t.home.cta.button}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
