'use client'

import * as React from 'react'
import { Upload, ArrowRight, ArrowDown, FileText, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'

export default function TaxProcessorPage() {
  const [isDragOver, setIsDragOver] = React.useState(false)
  const { t, lang } = useLanguage()

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Page Header */}
      <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
        {t.taxProcessor.product}
      </p>
      <h1 className="text-foreground mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        {t.taxProcessor.title}
      </h1>
      <p className="text-muted-foreground mt-3 max-w-lg">{t.taxProcessor.description}</p>

      {/* Pipeline Section */}
      <section className="border-border mt-12 rounded-xl border p-8">
        <h2 className="text-foreground text-lg font-semibold">{t.taxProcessor.howItWorks}</h2>
        <p className="text-muted-foreground mt-1 text-sm">{t.taxProcessor.threeSteps}</p>

        <div className="mt-8 flex flex-col items-center gap-6">
          {/* Step 1: Upload */}
          <div className="flex flex-col items-center gap-3">
            <button
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragOver(true)
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragOver(false)
              }}
              className={`flex h-40 w-72 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors ${
                isDragOver
                  ? 'border-[#FFD600] bg-[#FFD600]/5'
                  : 'border-border bg-card hover:border-muted-foreground/30'
              }`}
            >
              <Upload className="text-muted-foreground h-8 w-8" />
              <span className="text-foreground text-sm font-medium">
                {t.taxProcessor.steps.uploadFile}
              </span>
              <span className="text-muted-foreground text-xs">{t.taxProcessor.steps.dragDrop}</span>
            </button>
            <span className="text-muted-foreground text-xs">{t.taxProcessor.steps.step1}</span>
          </div>

          {/* Arrow */}
          <ArrowDown className="text-muted-foreground h-8 w-8 shrink-0" />

          {/* Step 2: Configure */}
          <div className="flex flex-col items-center gap-3">
            <div className="border-border bg-card flex h-40 w-72 flex-col justify-between rounded-xl border p-4 text-left">
              <div className="space-y-4">
                {/* Column 1: String type + Group By */}
                <div className="border-border/50 flex items-center justify-between border-b pb-2">
                  <div className="flex flex-col">
                    <span className="text-foreground text-xs font-semibold">Category</span>
                    <span className="text-muted-foreground text-[10px] font-medium">String</span>
                  </div>
                  <span className="rounded-full bg-[#FFD600] px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-black uppercase">
                    GROUP BY
                  </span>
                </div>
                {/* Column 2: Number type + SUM */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-foreground text-xs font-semibold">Amount</span>
                    <span className="text-muted-foreground text-[10px] font-medium">Number</span>
                  </div>
                  <span className="rounded-full bg-[#FFD600] px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-black uppercase">
                    SUM
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground mt-2 text-center text-[10px] italic">
                {t.taxProcessor.steps.configHelp}
              </p>
            </div>
            <span className="text-muted-foreground text-xs">{t.taxProcessor.steps.step2}</span>
          </div>

          {/* Arrow */}
          <ArrowDown className="text-muted-foreground h-8 w-8 shrink-0" />

          {/* Step 3: Table Preview */}
          <div className="flex flex-col items-center gap-3">
            <div className="border-border bg-card h-40 w-72 overflow-hidden rounded-xl border p-3">
              <div className="border-border flex items-center gap-2 border-b pb-2">
                <div className="border-border h-3 w-3 rounded border" />
                <span className="text-muted-foreground text-[10px] font-medium">Category</span>
                <span className="text-muted-foreground text-[10px] font-medium">SUM(Amount)</span>
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="border-border h-3 w-3 rounded border" />
                  <span className="text-foreground text-[10px]">Consulting</span>
                  <span className="text-foreground text-[10px]">$32M</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="border-border h-3 w-3 rounded border" />
                  <span className="text-foreground text-[10px]">Software</span>
                  <span className="text-foreground text-[10px]">$18M</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="border-border h-3 w-3 rounded border" />
                  <span className="text-foreground text-[10px]">Hardware</span>
                  <span className="text-foreground text-[10px]">$5M</span>
                </div>
              </div>
            </div>
            <span className="text-muted-foreground text-xs">{t.taxProcessor.steps.step3}</span>
          </div>
        </div>
      </section>

      {/* Recent Reports */}
      <section className="border-border mt-8 rounded-xl border p-8">
        <h2 className="text-foreground text-lg font-semibold">
          {t.taxProcessor.recentReports.title}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {t.taxProcessor.recentReports.description}
        </p>
        <div className="mt-6 space-y-3">
          {[
            {
              name: 'Q2_2025_Tax_Report.pdf',
              date: 'Jul 15, 2025',
            },
            {
              name: 'Annual_Summary_2024.xlsx',
              date: 'Jan 10, 2025',
            },
            {
              name: 'Q1_2025_VAT_Return.csv',
              date: 'Apr 5, 2025',
            },
          ].map((report) => (
            <div
              key={report.name}
              className="border-border flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-3">
                <FileText className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-foreground text-sm font-medium">{report.name}</p>
                  <p className="text-muted-foreground text-xs">{report.date}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {t.taxProcessor.recentReports.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Formats */}
      <section className="border-border mt-8 rounded-xl border p-8">
        <h2 className="text-foreground text-lg font-semibold">
          {t.taxProcessor.supportedFormats.title}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {t.taxProcessor.supportedFormats.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {['CSV', 'XLSX', 'XLS', 'PDF', 'OFX', 'QIF'].map((fmt) => {
            const isAvailable = fmt === 'CSV'
            return (
              <span
                key={fmt}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-opacity ${
                  isAvailable
                    ? 'border-border text-foreground'
                    : 'border-border/40 text-muted-foreground/40 line-through select-none'
                }`}
              >
                <FileText
                  className={`h-3 w-3 ${isAvailable ? 'text-muted-foreground' : 'text-muted-foreground/30'}`}
                />
                {fmt}
              </span>
            )
          })}
        </div>
        <p className="text-muted-foreground/50 mt-4 text-xs italic">
          {t.taxProcessor.supportedFormats.comingSoon}
        </p>
      </section>

      {/* Try out */}
      <section className="flex min-h-[calc(60vh-4rem)] flex-col items-center justify-center text-center">
        <h1 className="text-foreground text-4xl font-semibold tracking-tight sm:text-6xl">
          {t.taxProcessor.tryNow.title}
          <br />
          {lang === 'EN' ? 'for ' : ''}
          <span className="text-green">{t.taxProcessor.tryNow.free}</span>.
        </h1>
        <p className="text-muted-foreground mt-6 max-w-md text-lg">
          {t.taxProcessor.tryNow.description}
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/tax-processor/try"
            className="inline-flex items-center gap-2 rounded-full bg-[#FFD600] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#e6c000]"
          >
            {t.taxProcessor.tryNow.button}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/company"
            className="border-border text-foreground hover:bg-muted inline-flex items-center rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
          >
            {t.taxProcessor.tryNow.aboutUs}
          </Link>
        </div>
      </section>
    </div>
  )
}
