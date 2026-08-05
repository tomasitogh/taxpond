'use client'

import * as React from 'react'
import { Upload, ArrowRight, FileText, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function TaxProcessorPage() {
  const [isDragOver, setIsDragOver] = React.useState(false)

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Page Header */}
      <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase">Product</p>
      <h1 className="text-foreground mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        Tax Reports Processor
      </h1>
      <p className="text-muted-foreground mt-3 max-w-lg">
        Upload your financial data and instantly generate compliant tax reports. Supports CSV files
        — more formats coming soon.
      </p>

      {/* Pipeline Section */}
      <section className="border-border mt-12 rounded-xl border p-8">
        <h2 className="text-foreground text-lg font-semibold">How it works</h2>
        <p className="text-muted-foreground mt-1 text-sm">Three steps to your tax report</p>

        <div className="mt-8 flex flex-col items-center gap-8 md:flex-row md:gap-12">
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
              <span className="text-foreground text-sm font-medium">Upload file</span>
              <span className="text-muted-foreground text-xs">Drag & drop or click</span>
            </button>
            <span className="text-muted-foreground text-xs">Step 1 — Upload</span>
          </div>

          {/* Arrow */}
          <ArrowRight className="text-muted-foreground h-10 w-10 shrink-0" />

          {/* Step 2: Table Preview */}
          <div className="flex flex-col items-center gap-3">
            <div className="border-border bg-card h-40 w-72 overflow-hidden rounded-xl border p-3">
              <div className="border-border flex items-center gap-2 border-b pb-2">
                <div className="border-border h-3 w-3 rounded border" />
                <span className="text-muted-foreground text-[10px] font-medium">Tax Id</span>
                <span className="text-muted-foreground text-[10px] font-medium">Amount</span>
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="border-border h-3 w-3 rounded border" />
                  <span className="text-foreground text-[10px]">AEFR43</span>
                  <span className="text-foreground text-[10px]">$32M</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="border-border h-3 w-3 rounded border" />
                  <span className="text-foreground text-[10px]">ADS2213</span>
                  <span className="text-foreground text-[10px]">$18M</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="border-border h-3 w-3 rounded border" />
                  <span className="text-foreground text-[10px]">ASDAS33</span>
                  <span className="text-foreground text-[10px]">$5M</span>
                </div>
              </div>
            </div>
            <span className="text-muted-foreground text-xs">Step 2 — Visualize</span>
          </div>
        </div>
      </section>

      {/* Recent Reports */}
      <section className="border-border mt-8 rounded-xl border p-8">
        <h2 className="text-foreground text-lg font-semibold">Recent reports</h2>
        <p className="text-muted-foreground mt-1 text-sm">Your latest generated tax reports</p>
        <div className="mt-6 space-y-3">
          {[
            {
              name: 'Q2_2025_Tax_Report.pdf',
              date: 'Jul 15, 2025',
              status: 'Completed',
            },
            {
              name: 'Annual_Summary_2024.xlsx',
              date: 'Jan 10, 2025',
              status: 'Completed',
            },
            {
              name: 'Q1_2025_VAT_Return.csv',
              date: 'Apr 5, 2025',
              status: 'Completed',
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
                {report.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Formats */}
      <section className="border-border mt-8 rounded-xl border p-8">
        <h2 className="text-foreground text-lg font-semibold">Supported formats</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          We accept the most common financial data formats
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {['CSV', 'XLSX', 'XLS', 'PDF', 'OFX', 'QIF'].map((fmt) => (
            <span
              key={fmt}
              className="border-border text-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
            >
              <FileText className="text-muted-foreground h-3 w-3" />
              {fmt}
            </span>
          ))}
        </div>
      </section>

      {/* Try out */}
      <section className="flex min-h-[calc(60vh-4rem)] flex-col items-center justify-center text-center">
        <h1 className="text-foreground text-4xl font-semibold tracking-tight sm:text-6xl">
          Try now,
          <br />
          for <span className="text-green">free</span>.
        </h1>
        <p className="text-muted-foreground mt-6 max-w-md text-lg">
          Upload any data, see how it works. You&apos;ll like it.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/tax-processor/try"
            className="inline-flex items-center gap-2 rounded-full bg-[#FFD600] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#e6c000]"
          >
            Try now!
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/company"
            className="border-border text-foreground hover:bg-muted inline-flex items-center rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
          >
            About us
          </Link>
        </div>
      </section>
    </div>
  )
}
