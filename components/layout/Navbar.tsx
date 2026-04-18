'use client'

import { useCallback, useState } from 'react'
import Link          from 'next/link'
import { useRouter } from 'next/navigation'

import { useSidebar } from '@/contexts/SidebarContext'
import SearchBar      from '@/components/ui/SearchBar'
import gamesData      from '@/data/games.json'
import type { Game }  from '@/lib/types'

// ─── Icons ────────────────────────────────────────────────────────────────────

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="3" y1="6"  x2="21" y2="6"  />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6"  y1="6" x2="18" y2="18" />
    </svg>
  )
}

function DiceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="3" ry="3" />
      <circle cx="8"  cy="8"  r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="8"  r="1.2" fill="currentColor" stroke="none" />
      <circle cx="8"  cy="16" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2.5} aria-hidden>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
        strokeLinecap="round" />
    </svg>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export default function Navbar() {
  const router = useRouter()
  const { isOpen: isSidebarOpen, toggle: toggleSidebar } = useSidebar()
  const [isSpinning, setIsSpinning] = useState(false)

  const goRandom = useCallback(() => {
    const games = gamesData as Game[]
    if (!games.length) return
    setIsSpinning(true)
    const game = games[Math.floor(Math.random() * games.length)]
    setTimeout(() => {
      router.push(`/game/${game.slug}`)
      setIsSpinning(false)
    }, 500)
  }, [router])

  return (
    <header
      role="banner"
      className="fixed top-0 left-0 right-0 z-[50] h-[64px] bg-surface/95 backdrop-blur-md border-b border-border/60 flex items-center"
    >
      <div className="flex items-center w-full px-3 md:px-4 gap-2 md:gap-4">

        {/* ── Hamburger (mobile only) + Logo ───────────────────────────── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isSidebarOpen}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-secondary hover:text-primary hover:bg-surface-hover transition-colors duration-150 lg:hidden"
          >
            {isSidebarOpen
              ? <XIcon    className="w-5 h-5" />
              : <MenuIcon className="w-5 h-5" />
            }
          </button>

          <Link href="/" className="flex items-center gap-2 group" aria-label="GameVault — Home">
            <span
              className="text-2xl leading-none select-none group-hover:animate-bounce-subtle"
              aria-hidden
            >
              🎮
            </span>
            <span className="font-display font-bold text-xl text-primary tracking-tight">
              Game<span className="text-gradient-accent">Vault</span>
            </span>
          </Link>
        </div>

        {/* ── Search Bar (centre, desktop) ─────────────────────────────── */}
        <div className="flex-1 max-w-xl mx-auto">
          <SearchBar variant="navbar" />
        </div>

        {/* ── Right actions ────────────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Link
            href="/blog"
            className="hidden md:flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-surface-hover transition-all duration-150"
          >
            Blog
          </Link>
          {/* Random Game */}
          <button
            type="button"
            onClick={goRandom}
            disabled={isSpinning}
            aria-label="Play a random game"
            title="Random Game"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-accent/10 text-accent hover:bg-accent hover:text-white border border-accent/30 hover:border-accent transition-all duration-150 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSpinning
              ? <SpinnerIcon className="w-4 h-4 animate-spin" />
              : <DiceIcon    className="w-4 h-4" />
            }
            <span className="hidden sm:inline text-xs tracking-wide">
              {isSpinning ? 'Finding…' : 'Random'}
            </span>
          </button>
        </div>

      </div>
    </header>
  )
}
