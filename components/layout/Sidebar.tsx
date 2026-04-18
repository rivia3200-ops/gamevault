'use client'

import { useCallback, useEffect }  from 'react'
import Link                         from 'next/link'
import { usePathname, useRouter }   from 'next/navigation'

import { useSidebar }   from '@/contexts/SidebarContext'
import categoriesData   from '@/data/categories.json'
import gamesData        from '@/data/games.json'
import type { Category, Game } from '@/lib/types'

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <polyline points="9 21 9 12 15 12 15 21" />
    </svg>
  )
}

function FireIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8.5 14.5A4.5 4.5 0 0 0 12 19.5a4.5 4.5 0 0 0 3.5-7.5C14 10.5 12 8 12 8s-3.5 3-3.5 6.5z" />
      <path d="M12 8C10 5.5 9 3 9 3s5 2 6 7c1 4.5-2 7-3 9" />
    </svg>
  )
}

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function DiceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="3" />
      <circle cx="8"  cy="8"  r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="8"  r="1.2" fill="currentColor" stroke="none" />
      <circle cx="8"  cy="16" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

// ─── Nav Link ─────────────────────────────────────────────────────────────────

interface NavLinkProps {
  href: string
  label: string
  icon: React.ReactNode
  badge?: string
  onClick?: () => void
}

function SidebarNavLink({ href, label, icon, badge, onClick }: NavLinkProps) {
  const pathname  = usePathname()
  const isActive  = pathname === href

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={[
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
        'transition-all duration-150 group relative',
        isActive
          ? 'bg-accent/15 text-accent'
          : 'text-secondary hover:text-primary hover:bg-surface-hover',
      ].join(' ')}
    >
      {/* Active indicator bar */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-r-full" />
      )}

      <span className={[
        'flex-shrink-0 w-5 h-5 transition-colors duration-150',
        isActive ? 'text-accent' : 'text-muted group-hover:text-secondary',
      ].join(' ')}>
        {icon}
      </span>

      <span className="flex-1 truncate">{label}</span>

      {badge && (
        <span className={[
          'flex-shrink-0 px-1.5 py-0.5 rounded-full text-2xs font-bold',
          isActive
            ? 'bg-accent/20 text-accent'
            : 'bg-surface-hover text-muted group-hover:bg-border',
        ].join(' ')}>
          {badge}
        </span>
      )}
    </Link>
  )
}

// ─── Category Link ────────────────────────────────────────────────────────────

function CategoryLink({
  category,
  onClick,
}: {
  category: Category
  onClick?: () => void
}) {
  const pathname = usePathname()
  const isActive = pathname === `/category/${category.slug}`

  return (
    <Link
      href={`/category/${category.slug}`}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={[
        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm',
        'transition-all duration-150 group',
        isActive
          ? 'bg-surface-hover text-primary'
          : 'text-secondary hover:text-primary hover:bg-surface-hover',
      ].join(' ')}
    >
      {/* Coloured dot accent */}
      <span
        className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-base leading-none"
        aria-hidden
      >
        {category.icon}
      </span>

      <span className="flex-1 truncate font-medium">{category.name}</span>

      {/* Game count badge */}
      <span className={[
        'flex-shrink-0 min-w-[1.75rem] px-1.5 py-0.5 rounded-md text-2xs font-semibold text-center',
        'transition-colors duration-150',
        isActive
          ? 'bg-accent/20 text-accent'
          : 'bg-border/80 text-muted group-hover:bg-border group-hover:text-secondary',
      ].join(' ')}>
        {category.gameCount >= 100
          ? `${Math.floor(category.gameCount / 100) * 100}+`
          : category.gameCount}
      </span>

      <ChevronRightIcon className={[
        'flex-shrink-0 w-3 h-3 transition-all duration-150',
        isActive ? 'opacity-70' : 'opacity-0 group-hover:opacity-50',
      ].join(' ')} />
    </Link>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const { isOpen, close } = useSidebar()
  const router            = useRouter()
  const pathname          = usePathname()

  // Close sidebar on route change (mobile)
  useEffect(() => {
    close()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const goRandomGame = useCallback(() => {
    const games = gamesData as Game[]
    if (!games.length) return
    const game = games[Math.floor(Math.random() * games.length)]
    router.push(`/game/${game.slug}`)
    close()
  }, [router, close])

  const categories = categoriesData as Category[]

  // Total game count across all categories
  const totalGames = categories.reduce((sum, c) => sum + c.gameCount, 0)

  return (
    <>
      {/*
        ── Mobile overlay backdrop ──────────────────────────────────────────
        Only rendered on small screens when sidebar is open
      */}
      {isOpen && (
        <div
          aria-hidden
          onClick={close}
          className="fixed inset-0 z-[45] bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
        />
      )}

      {/*
        ── Sidebar panel ────────────────────────────────────────────────────
        Desktop: always visible, fixed to left edge below navbar
        Mobile:  slides in as a drawer, sits over the backdrop
      */}
      <aside
        id="sidebar"
        aria-label="Site navigation"
        className={[
          // Positioning & size
          'fixed left-0 top-[64px] bottom-0 w-[240px]',
          // Visual
          'bg-gradient-sidebar border-r border-border/60',
          // Stacking
          'z-[40]',
          // Scroll
          'overflow-y-auto overflow-x-hidden',
          'no-scrollbar',
          // Desktop: always show
          'lg:translate-x-0 lg:opacity-100',
          // Mobile: animate in/out
          'transition-sidebar',
          isOpen
            ? 'translate-x-0 opacity-100'
            : '-translate-x-full opacity-0 lg:translate-x-0 lg:opacity-100',
        ].join(' ')}
      >
        <nav className="flex flex-col gap-1 p-3 pb-8">

          {/* ── Primary navigation ──────────────────────────────────────────── */}
          <SidebarNavLink
            href="/"
            label="Home"
            icon={<HomeIcon className="w-full h-full" />}
            onClick={close}
          />
          <SidebarNavLink
            href="/popular"
            label="Popular"
            icon={<FireIcon className="w-full h-full" />}
            badge="Hot"
            onClick={close}
          />
          <SidebarNavLink
            href="/new-games"
            label="New Games"
            icon={<ZapIcon className="w-full h-full" />}
            onClick={close}
          />

          {/* Random game button — styled same as nav links */}
          <button
            type="button"
            onClick={goRandomGame}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-surface-hover transition-all duration-150 group w-full text-left"
          >
            <span className="flex-shrink-0 w-5 h-5 text-muted group-hover:text-secondary transition-colors">
              <DiceIcon className="w-full h-full" />
            </span>
            <span className="flex-1">Random Game</span>
            <span className="flex-shrink-0 text-muted group-hover:text-secondary transition-colors text-lg leading-none">
              🎲
            </span>
          </button>

          {/* ── Divider ────────────────────────────────────────────────────── */}
          <div className="my-2 h-px bg-border/60" role="separator" />

          {/* ── Categories header ───────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-3 py-1.5">
            <span className="text-2xs font-bold uppercase tracking-widest text-muted">
              Categories
            </span>
            <span className="text-2xs text-muted">
              {totalGames.toLocaleString()} games
            </span>
          </div>

          {/* ── Category list ───────────────────────────────────────────────── */}
          <div className="flex flex-col gap-0.5">
            {categories.map((cat) => (
              <CategoryLink
                key={cat.id}
                category={cat}
                onClick={close}
              />
            ))}
          </div>

          {/* ── Divider ────────────────────────────────────────────────────── */}
          <div className="my-2 h-px bg-border/60" role="separator" />

          {/* ── Footer links ────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-0.5">
            {[
              { href: '/submit-game',    label: 'Submit a Game'  },
              { href: '/privacy-policy', label: 'Privacy Policy' },
              { href: '/terms',          label: 'Terms of Service' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                className="px-3 py-1.5 text-xs text-muted hover:text-secondary rounded-lg hover:bg-surface-hover transition-all duration-150"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* ── Version / branding watermark ────────────────────────────────── */}
          <div className="mt-4 px-3">
            <div className="rounded-xl bg-accent/8 border border-accent/15 p-3 text-center">
              <p className="text-xs font-display font-semibold text-accent/80">
                🎮 GameVault
              </p>
              <p className="text-2xs text-muted mt-0.5">
                {totalGames.toLocaleString()}+ free games
              </p>
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}
