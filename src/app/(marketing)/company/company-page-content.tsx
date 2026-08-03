'use client'

import { useLanguage } from '@/lib/i18n/context'

export function CompanyPageContent() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      {/* Header */}
      <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
        {t.company.label}
      </p>
      <h1 className="text-foreground mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
        {t.company.title}
      </h1>
      <p className="text-muted-foreground mt-6 text-lg leading-relaxed">{t.company.story}</p>

      {/* Mission */}
      <div className="mt-16">
        <h2 className="text-foreground text-2xl font-semibold tracking-tight">
          {t.company.mission.title}
        </h2>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          {t.company.mission.description}
        </p>
      </div>

      {/* Values */}
      <div className="mt-16">
        <h2 className="text-foreground text-2xl font-semibold tracking-tight">
          {t.company.values.title}
        </h2>
        <div className="mt-6 space-y-6">
          {t.company.values.items.map((value: { title: string; desc: string }, index: number) => (
            <div key={index} className="border-border rounded-xl border p-6">
              <h3 className="text-foreground text-base font-semibold">{value.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mt-16">
        <h2 className="text-foreground text-2xl font-semibold tracking-tight">
          {t.company.team.title}
        </h2>
        <p className="text-muted-foreground mt-3 leading-relaxed">{t.company.team.description}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {t.company.team.members.map((person: { name: string; role: string }) => (
            <div key={person.name} className="border-border rounded-xl border p-4">
              <div className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold">
                {person.name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')}
              </div>
              <p className="text-foreground mt-3 text-sm font-medium">{person.name}</p>
              <p className="text-muted-foreground text-xs">{person.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="border-border mt-16 rounded-xl border p-8">
        <h2 className="text-foreground text-xl font-semibold tracking-tight">
          {t.company.contact.title}
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          {t.company.contact.description}{' '}
          <span className="text-foreground font-medium">hello@taxpond.com</span>
        </p>
      </div>
    </div>
  )
}
