"use client"

import * as React from "react"
import { Upload, ArrowRight, FileText, CheckCircle2 } from "lucide-react"

export default function TaxProcessorPage() {
  const [isDragOver, setIsDragOver] = React.useState(false)

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Page Header */}
      <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Product
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Tax Reports Processor
      </h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        Upload your financial data and instantly generate compliant tax
        reports. Supports CSV, Excel, and PDF formats.
      </p>

      {/* Pipeline Section */}
      <section className="mt-12 rounded-xl border border-border p-8">
        <h2 className="text-lg font-semibold text-foreground">
          How it works
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Three steps to your tax report
        </p>

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
                  ? "border-[#FFD600] bg-[#FFD600]/5"
                  : "border-border bg-card hover:border-muted-foreground/30"
              }`}
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Upload file
              </span>
              <span className="text-xs text-muted-foreground">
                Drag & drop or click
              </span>
            </button>
            <span className="text-xs text-muted-foreground">
              Step 1 — Upload
            </span>
          </div>

          {/* Arrow */}
          <ArrowRight className="h-10 w-10 shrink-0 text-muted-foreground" />

          {/* Step 2: Table Preview */}
          <div className="flex flex-col items-center gap-3">
            <div className="h-40 w-72 overflow-hidden rounded-xl border border-border bg-card p-3">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <div className="h-3 w-3 rounded border border-border" />
                <span className="text-[10px] font-medium text-muted-foreground">
                  Tax Id
                </span>
                <span className="text-[10px] font-medium text-muted-foreground">
                  Amount
                </span>
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded border border-border" />
                  <span className="text-[10px] text-foreground">AEFR43</span>
                  <span className="text-[10px] text-foreground">$32M</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded border border-border" />
                  <span className="text-[10px] text-foreground">ADS2213</span>
                  <span className="text-[10px] text-foreground">$18M</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded border border-border" />
                  <span className="text-[10px] text-foreground">ASDAS33</span>
                  <span className="text-[10px] text-foreground">$5M</span>
                </div>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              Step 2 — Visualize
            </span>
          </div>
        </div>
      </section>

      {/* Recent Reports */}
      <section className="mt-8 rounded-xl border border-border p-8">
        <h2 className="text-lg font-semibold text-foreground">
          Recent reports
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your latest generated tax reports
        </p>
        <div className="mt-6 space-y-3">
          {[
            {
              name: "Q2_2025_Tax_Report.pdf",
              date: "Jul 15, 2025",
              status: "Completed",
            },
            {
              name: "Annual_Summary_2024.xlsx",
              date: "Jan 10, 2025",
              status: "Completed",
            },
            {
              name: "Q1_2025_VAT_Return.csv",
              date: "Apr 5, 2025",
              status: "Completed",
            },
          ].map((report) => (
            <div
              key={report.name}
              className="flex items-center justify-between rounded-lg border border-border p-4"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {report.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {report.date}
                  </p>
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
      <section className="mt-8 rounded-xl border border-border p-8">
        <h2 className="text-lg font-semibold text-foreground">
          Supported formats
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          We accept the most common financial data formats
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {["CSV", "XLSX", "XLS", "PDF", "OFX", "QIF"].map((fmt) => (
            <span
              key={fmt}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground"
            >
              <FileText className="h-3 w-3 text-muted-foreground" />
              {fmt}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
