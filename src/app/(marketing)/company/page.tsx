export default function CompanyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      {/* Header */}
      <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
        About us
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        We believe tax reporting
        <br />
        should be effortless.
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        Taxpond was founded in 2023 by a team of accountants and engineers
        who were tired of watching businesses struggle with outdated tax
        tools. We set out to build something different: a platform that
        combines deep regulatory knowledge with modern software design.
      </p>

      {/* Mission */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Our Mission
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          We exist to remove the friction from tax compliance. Every business,
          regardless of size or geography, deserves access to accurate,
          real-time tax insights. We build tools that turn complex regulations
          into clear, actionable data.
        </p>
      </div>

      {/* Values */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Our Values
        </h2>
        <div className="mt-6 space-y-6">
          {[
            {
              title: "Accuracy above all",
              desc: "Tax data is unforgiving. We invest heavily in validation, testing, and edge-case handling to ensure every number is correct.",
            },
            {
              title: "Radical transparency",
              desc: "We show our work. Every calculation, every source, every audit trail is visible to our users. No black boxes.",
            },
            {
              title: "Builder mindset",
              desc: "We ship fast, iterate often, and listen to our users. The best product wins, not the best pitch deck.",
            },
          ].map((value) => (
            <div key={value.title} className="rounded-xl border border-border p-6">
              <h3 className="text-base font-semibold text-foreground">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {value.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          The Team
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          We are a remote-first team of 2 people spread across Buenos Aires. Our backgrounds span Big Four accounting firms,
          fintech startups, and open-source maintainers.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { name: "Tomás González Humphreys", role: "CEO & Co-Founder" },
            { name: "Luciana Pirruccio", role: "Head of Product" },
          ].map((person) => (
            <div
              key={person.name}
              className="rounded-xl border border-border p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                {person.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <p className="mt-3 text-sm font-medium text-foreground">
                {person.name}
              </p>
              <p className="text-xs text-muted-foreground">{person.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="mt-16 rounded-xl border border-border p-8">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Get in touch
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Have a question, partnership inquiry, or just want to say hello?
          Reach us at{" "}
          <span className="font-medium text-foreground">
            hello@taxpond.com
          </span>
        </p>
      </div>
    </div>
  )
}
