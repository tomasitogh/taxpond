import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 text-center">
        <span className="border-border bg-muted text-muted-foreground mb-4 rounded-full border px-3 py-1 text-xs font-medium">
          Now available in 12 countries
        </span>
        <h1 className="text-foreground text-4xl font-semibold tracking-tight sm:text-6xl">
          Tax reporting,
          <br />
          simplified.
        </h1>
        <p className="text-muted-foreground mt-6 max-w-md text-lg">
          Upload your financial data, get instant tax reports, and stay compliant without the
          complexity. Built for businesses that move fast.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/tax-processor"
            className="inline-flex items-center gap-2 rounded-full bg-[#FFD600] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#e6c000]"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/company"
            className="border-border text-foreground hover:bg-muted inline-flex items-center rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
          >
            Learn more
          </Link>
        </div>
      </section>

      {/* Stats Section */}
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
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
            Features
          </p>
          <h2 className="text-foreground mt-2 text-3xl font-semibold tracking-tight">
            Everything you need to stay compliant
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg">
            From automated categorization to real-time reporting, Taxpond handles the heavy lifting
            so you can focus on growing your business.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: 'Smart Upload',
                desc: 'Drag and drop CSV, Excel, or PDF files. Our parser handles any format automatically.',
              },
              {
                title: 'Real-time Analytics',
                desc: 'Track your tax obligations as they evolve throughout the fiscal year.',
              },
              {
                title: 'Multi-country Support',
                desc: 'Tax regulations across 12 countries, always up to date with the latest changes.',
              },
              {
                title: 'Audit Trail',
                desc: 'Every action is logged. Full transparency for your accounting team and auditors.',
              },
            ].map((feature) => (
              <div key={feature.title} className="border-border rounded-xl border p-6">
                <h3 className="text-foreground text-base font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-border border-t px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-foreground text-3xl font-semibold tracking-tight">
            Ready to simplify your taxes?
          </h2>
          <p className="text-muted-foreground mt-3">
            Join thousands of businesses that trust Taxpond to handle their tax reporting. No credit
            card required.
          </p>
          <Link
            href="/tax-processor"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FFD600] px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#e6c000]"
          >
            Start for free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
