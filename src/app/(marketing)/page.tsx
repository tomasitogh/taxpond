import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          Now available in 12 countries
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
          Tax reporting,
          <br />
          simplified.
        </h1>
        <p className="mt-6 max-w-md text-lg text-muted-foreground">
          Upload your financial data, get instant tax reports, and stay
          compliant without the complexity. Built for businesses that move
          fast.
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
            className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Learn more
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-border bg-muted/30 px-6 py-20">
        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
          <div className="text-center">
            <p className="font-data text-4xl font-bold tabular-nums text-foreground">
              2,400+
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Businesses onboarded
            </p>
          </div>
          <div className="text-center">
            <p className="font-data text-4xl font-bold tabular-nums text-foreground">
              $18M
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Taxes processed
            </p>
          </div>
          <div className="text-center">
            <p className="font-data text-4xl font-bold tabular-nums text-foreground">
              99.7%
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Accuracy rate
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Features
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Everything you need to stay compliant
          </h2>
          <p className="mt-3 max-w-lg text-muted-foreground">
            From automated categorization to real-time reporting, Taxpond
            handles the heavy lifting so you can focus on growing your
            business.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Smart Upload",
                desc: "Drag and drop CSV, Excel, or PDF files. Our parser handles any format automatically.",
              },
              {
                title: "Real-time Analytics",
                desc: "Track your tax obligations as they evolve throughout the fiscal year.",
              },
              {
                title: "Multi-country Support",
                desc: "Tax regulations across 12 countries, always up to date with the latest changes.",
              },
              {
                title: "Audit Trail",
                desc: "Every action is logged. Full transparency for your accounting team and auditors.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border p-6"
              >
                <h3 className="text-base font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            Ready to simplify your taxes?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Join thousands of businesses that trust Taxpond to handle their
            tax reporting. No credit card required.
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
