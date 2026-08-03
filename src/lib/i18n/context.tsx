'use client'

import * as React from 'react'
import en from './translations/en'
import es from './translations/es'

type Lang = 'EN' | 'ES'

// Use a simple Record type that works with both translation objects
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const translations: Record<Lang, any> = { EN: en, ES: es }

const LanguageContext = React.createContext<{
  lang: Lang
  setLang: (lang: Lang) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any
}>({
  lang: 'EN',
  setLang: () => {},
  t: en,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = React.useState<Lang>('EN')

  const t = translations[lang]

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = React.useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
