'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getDuckDB, getConnection } from './connection'
import type { DuckDBInstance, DuckDBConnection } from './types'

interface DuckDBContextValue {
  db: DuckDBInstance
  conn: DuckDBConnection
  isReady: boolean
}

const DuckDBContext = createContext<DuckDBContextValue | null>(null)

export function DuckDBProvider({ children }: { children: ReactNode }) {
  const [context, setContext] = useState<DuckDBContextValue | null>(null)

  useEffect(() => {
    let cancelled = false

    async function init() {
      const db = await getDuckDB()
      const conn = await getConnection()
      if (!cancelled) {
        setContext({ db, conn, isReady: true })
      }
    }

    init()

    return () => {
      cancelled = true
    }
  }, [])

  if (!context) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground text-sm">Loading DuckDB...</div>
      </div>
    )
  }

  return <DuckDBContext.Provider value={context}>{children}</DuckDBContext.Provider>
}

export function useDuckDB(): DuckDBContextValue {
  const ctx = useContext(DuckDBContext)
  if (!ctx) {
    throw new Error('useDuckDB must be used within a DuckDBProvider')
  }
  return ctx
}
