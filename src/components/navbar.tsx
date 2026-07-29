"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  Globe,
  Sun,
  Moon,
  ChevronDown,
  BarChart3,
  ArrowRight,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [productsOpen, setProductsOpen] = React.useState(false)
  const [lang, setLang] = React.useState<"EN" | "ES">("EN")
  const productsTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const handleProductsEnter = () => {
    if (productsTimeoutRef.current) clearTimeout(productsTimeoutRef.current)
    setProductsOpen(true)
  }

  const handleProductsLeave = () => {
    productsTimeoutRef.current = setTimeout(() => setProductsOpen(false), 150)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFD600] text-sm font-bold text-black">
            T
          </div>
          <span className="text-lg font-semibold tracking-tight">Taxpond</span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {/* Products Dropdown - hover triggered */}
          <div
            className="relative"
            onMouseEnter={handleProductsEnter}
            onMouseLeave={handleProductsLeave}
          >
            <button className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              Products
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>

            {/* Products Dropdown Modal */}
            {productsOpen && (
              <div
                className="absolute left-1/2 top-full z-50 mt-2 w-80 -translate-x-1/2 rounded-xl border border-border bg-popover p-2 shadow-lg"
                onMouseEnter={handleProductsEnter}
                onMouseLeave={handleProductsLeave}
              >
                <Link
                  href="/tax-processor"
                  className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
                  onClick={() => setProductsOpen(false)}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FFD600]/10">
                    <BarChart3 className="h-5 w-5 text-[#FFD600]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">
                      Tax reports processor
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Try for free!
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Company Link */}
          <Link
            href="/company"
            className="rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Company
          </Link>
        </nav>

        {/* Right: Language Selector + Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              <Globe className="h-4 w-4" />
              <span>{lang}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => setLang("EN")}>
                <span className={lang === "EN" ? "font-medium" : ""}>EN</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang("ES")}>
                <span className={lang === "ES" ? "font-medium" : ""}>ES</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
            aria-label="Toggle theme"
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
