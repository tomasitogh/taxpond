'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import {
  Globe,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  BarChart3,
  ArrowRight,
  Sparkles,
  FileSearch,
  Check,
  type LucideIcon,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLanguage } from '@/lib/i18n/context'

type ProductBadge = {
  label: string
  color: 'purple' | 'green' | 'yellow' | 'black' | 'gray'
}

type Product = {
  title: string
  href: string
  icon: LucideIcon
  badge: ProductBadge
}

const ICONS: Record<string, LucideIcon> = {
  taxProcessor: BarChart3,
  taxValidator: Check,
  aiConciliation: Sparkles,
  smartAudits: FileSearch,
  taxCalendar: BarChart3,
}

const BADGE_STYLES: Record<ProductBadge['color'], { bg: string; text: string }> = {
  green: {
    bg: 'bg-green-light',
    text: 'text-green',
  },
  purple: {
    bg: 'bg-purple-light',
    text: 'text-purple',
  },
  yellow: {
    bg: 'bg-yellow/10',
    text: 'text-yellow',
  },
  black: {
    bg: 'bg-yellow/10',
    text: 'text-black',
  },
  gray: {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
  },
}

const PRODUCT_KEYS = [
  'taxProcessor',
  'taxValidator',
  'aiConciliation',
  'smartAudits',
  'taxCalendar',
] as const
const BADGE_KEYS = ['tryFree', 'tryFree', 'notAvailable', 'notAvailable', 'notAvailable'] as const
const BADGE_COLORS: Record<string, ProductBadge['color']> = {
  tryFree: 'green',
  aiPowered: 'purple',
  dontMiss: 'black',
  notAvailable: 'gray',
}
const PRODUCT_HREFS: Record<string, string> = {
  taxProcessor: '/tax-processor',
  taxValidator: '/tax-id-validator',
  aiConciliation: '/conciliation',
  smartAudits: '/audits',
  taxCalendar: '/calendar',
}

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { lang, setLang, t } = useLanguage()
  const [mounted, setMounted] = React.useState(false)
  const [productsOpen, setProductsOpen] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [mobileProductsOpen, setMobileProductsOpen] = React.useState(false)
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

  // Se pone el badge y descripcion de un producto, por el orden.
  const products: Product[] = PRODUCT_KEYS.map((key) => ({
    title: t.nav.productsList[key],
    href: PRODUCT_HREFS[key],
    icon: ICONS[key],
    badge: {
      label: t.nav.badges[BADGE_KEYS[PRODUCT_KEYS.indexOf(key)] || 'tryFree'],
      color: BADGE_COLORS[BADGE_KEYS[PRODUCT_KEYS.indexOf(key)] || 'tryFree'],
    },
  }))

  return (
    <header className="border-border bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-md">
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
            <button className="text-foreground hover:bg-muted flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors">
              {t.nav.products}
              <ChevronDown className="text-muted-foreground h-3.5 w-3.5" />
            </button>

            {/* Products Dropdown Modal */}
            {productsOpen && (
              <div
                className="border-border bg-popover absolute top-full left-1/2 z-50 mt-2 w-80 -translate-x-1/2 rounded-xl border p-2 shadow-lg"
                onMouseEnter={handleProductsEnter}
                onMouseLeave={handleProductsLeave}
              >
                {products.map((product) => {
                  const styles = BADGE_STYLES[product.badge.color]
                  const Icon = product.icon
                  return (
                    <Link
                      key={product.href}
                      href={product.href}
                      className="group hover:bg-accent flex items-center gap-3 rounded-lg p-3 transition-colors"
                      onClick={() => setProductsOpen(false)}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${styles.bg}`}
                      >
                        <Icon className={`h-5 w-5 ${styles.text}`} />
                      </div>
                      <div className="flex-1">
                        <div className="text-foreground text-sm font-medium">{product.title}</div>
                        <div className={`text-xs ${styles.text}`}>{product.badge.label}</div>
                      </div>
                      <ArrowRight className="text-muted-foreground h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Company Link */}
          <Link
            href="/company"
            className="text-foreground hover:bg-muted rounded-full px-4 py-2 text-sm font-medium transition-colors"
          >
            {t.nav.company}
          </Link>
        </nav>

        {/* Right: Language Selector + Theme Toggle + Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger className="border-border text-foreground hover:bg-muted flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors">
              <Globe className="h-4 w-4" />
              <span>{lang}</span>
              <ChevronDown className="text-muted-foreground h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => setLang('EN')}>
                <span className={lang === 'EN' ? 'font-medium' : ''}>EN</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang('ES')}>
                <span className={lang === 'ES' ? 'font-medium' : ''}>ES</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="border-border text-foreground hover:bg-muted flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
            aria-label="Toggle theme"
          >
            {mounted ? (
              theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="border-border text-foreground hover:bg-muted flex h-9 w-9 items-center justify-center rounded-full border transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-border bg-background/95 border-t backdrop-blur-md md:hidden">
          <nav className="mx-auto max-w-7xl px-6 py-4">
            {/* Products Section */}
            <div>
              <button
                onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                className="text-foreground hover:bg-muted flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              >
                {t.nav.products}
                <ChevronRight
                  className={`text-muted-foreground h-4 w-4 transition-transform ${
                    mobileProductsOpen ? 'rotate-90' : ''
                  }`}
                />
              </button>
              {mobileProductsOpen && (
                <div className="mt-1 space-y-1 pl-3">
                  {products.map((product) => {
                    const styles = BADGE_STYLES[product.badge.color]
                    const Icon = product.icon
                    return (
                      <Link
                        key={product.href}
                        href={product.href}
                        className="hover:bg-accent flex items-center gap-3 rounded-lg p-3 transition-colors"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          setMobileProductsOpen(false)
                        }}
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${styles.bg}`}
                        >
                          <Icon className={`h-4 w-4 ${styles.text}`} />
                        </div>
                        <div className="flex-1">
                          <div className="text-foreground text-sm font-medium">{product.title}</div>
                          <div className={`text-xs ${styles.text}`}>{product.badge.label}</div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Company Link */}
            <Link
              href="/company"
              className="text-foreground hover:bg-muted mt-1 block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.company}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
