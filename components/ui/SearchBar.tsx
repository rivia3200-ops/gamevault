'use client'

import {
  useState, useRef, useEffect, useCallback,
} from 'react'
import { useRouter } from 'next/navigation'
import type { Game }   from '@/lib/types'
import gamesData       from '@/data/games.json'
import SearchOverlay   from './SearchOverlay'
import {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
} from '@/lib/search-history'

const ALL_GAMES  = gamesData as Game[]
const POPULAR    = [...ALL_GAMES].sort((a, b) => b.plays - a.plays).slice(0, 6)

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${Math.round(n / 1_000)}K`
  return String(n)
}

// ─── Highlight ─────────────────────────────────────────────────────────────────

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-accent/30 text-accent rounded-[2px] not-italic">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

// ─── Inline Dropdown (hero variant only) ──────────────────────────────────────

interface InlineDropdownProps {
  query:          string
  results:        Game[]
  recent:         string[]
  highlighted:    number
  onGame:         (slug: string) => void
  onSearch:       (q: string) => void
  onRemoveRecent: (q: string, e: React.MouseEvent) => void
}

function InlineDropdown({
  query, results, recent, highlighted, onGame, onSearch, onRemoveRecent,
}: InlineDropdownProps) {
  const base = 'absolute left-0 right-0 top-[calc(100%+8px)] bg-surface border border-border rounded-2xl shadow-card-hover z-[70] overflow-hidden animate-scale-in'

  if (query.trim()) {
    if (!results.length) {
      return (
        <div className={base}>
          <div className="px-5 py-5 text-center">
            <p className="text-sm text-secondary">
              No results for <strong className="text-primary">"{query}"</strong>
            </p>
          </div>
        </div>
      )
    }
    return (
      <div className={base}>
        <div className="px-4 pt-3 pb-1">
          <span className="text-2xs font-bold uppercase tracking-wider text-muted">Games</span>
        </div>
        {results.map((game, i) => (
          <button
            key={game.id}
            onClick={() => onGame(game.slug)}
            className={[
              'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
              i === highlighted ? 'bg-surface-hover' : 'hover:bg-surface-hover',
            ].join(' ')}
          >
            <div className="w-9 h-9 rounded-lg bg-border flex-shrink-0 flex items-center justify-center text-sm font-bold text-muted">
              {game.title.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-primary truncate">
                <Highlight text={game.title} query={query} />
              </p>
              <p className="text-2xs text-muted capitalize">{game.category.replace(/-/g, ' ')}</p>
            </div>
            {game.isHot && <span className="text-xs flex-shrink-0">🔥</span>}
          </button>
        ))}
        <button
          onClick={() => onSearch(query)}
          className="w-full flex items-center gap-2.5 px-4 py-3 border-t border-border/60 text-sm text-accent hover:bg-surface-hover transition-colors font-medium"
        >
          🔍 <span>See all results for &ldquo;<strong>{query}</strong>&rdquo;</span>
        </button>
      </div>
    )
  }

  const hasRecent  = recent.length > 0
  const hasPopular = POPULAR.length > 0
  if (!hasRecent && !hasPopular) return null

  return (
    <div className={base}>
      {hasRecent && (
        <div>
          <div className="px-4 pt-3 pb-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-muted">Recent</span>
          </div>
          {recent.map((q) => (
            <div key={q} className="flex items-center px-4 hover:bg-surface-hover transition-colors group/item">
              <button
                onClick={() => onSearch(q)}
                className="flex items-center gap-3 flex-1 py-2.5 text-left min-w-0"
              >
                <span className="text-muted text-sm flex-shrink-0">🕐</span>
                <span className="text-sm text-secondary group-hover/item:text-primary truncate">{q}</span>
              </button>
              <button
                onClick={(e) => onRemoveRecent(q, e)}
                aria-label={`Remove "${q}"`}
                className="w-6 h-6 flex items-center justify-center text-muted hover:text-primary rounded transition-colors text-xs flex-shrink-0"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      {hasPopular && (
        <div className={hasRecent ? 'border-t border-border/60' : ''}>
          <div className="px-4 pt-3 pb-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-muted">Popular Now</span>
          </div>
          {POPULAR.slice(0, 4).map((game) => (
            <button
              key={game.id}
              onClick={() => onGame(game.slug)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-hover transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-border flex-shrink-0 flex items-center justify-center text-sm font-bold text-muted">
                {game.title.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-primary truncate">{game.title}</p>
                <p className="text-2xs text-muted capitalize">{game.category.replace(/-/g, ' ')}</p>
              </div>
              <span className="text-2xs text-muted flex-shrink-0">🔥 {fmt(game.plays)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface SearchBarProps {
  variant: 'navbar' | 'hero'
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SearchBar({ variant }: SearchBarProps) {
  const router  = useRouter()
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // ── Navbar: open the full-screen overlay ──────────────────────────────────
  const [overlayOpen, setOverlayOpen] = useState(false)

  // Hero variant state
  const [query,       setQuery]       = useState('')
  const [focused,     setFocused]     = useState(false)
  const [results,     setResults]     = useState<Game[]>([])
  const [recent,      setRecent]      = useState<string[]>([])
  const [highlighted, setHighlighted] = useState(-1)

  // Ctrl+K → open overlay (or focus hero)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        if (variant === 'navbar') {
          setOverlayOpen(true)
        } else {
          inputRef.current?.focus()
          setFocused(true)
        }
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [variant])

  // Hero: click outside → close
  useEffect(() => {
    if (variant !== 'hero') return
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [variant])

  // Hero: load recent on focus
  useEffect(() => {
    if (focused && variant === 'hero') {
      setRecent(getRecentSearches())
    }
  }, [focused, variant])

  // Hero: debounced search
  useEffect(() => {
    if (variant !== 'hero') return
    if (!query.trim()) { setResults([]); setHighlighted(-1); return }
    const t = setTimeout(() => {
      const q = query.toLowerCase()
      setResults(
        ALL_GAMES.filter((g) =>
          g.title.toLowerCase().includes(q) ||
          g.tags.some((tag) => tag.includes(q)) ||
          g.category.includes(q),
        ).slice(0, 8),
      )
      setHighlighted(-1)
    }, 300)
    return () => clearTimeout(t)
  }, [query, variant])

  const doSearch = useCallback((q: string) => {
    if (!q.trim()) return
    addRecentSearch(q.trim())
    router.push(`/search?q=${encodeURIComponent(q.trim())}`)
    setFocused(false)
    setQuery('')
  }, [router])

  const goGame = useCallback((slug: string) => {
    router.push(`/game/${slug}`)
    setFocused(false)
    setQuery('')
  }, [router])

  const removeRecent = useCallback((q: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    removeRecentSearch(q)
    setRecent(getRecentSearches())
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if      (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted((p) => Math.min(p + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp'  ) { e.preventDefault(); setHighlighted((p) => Math.max(p - 1, -1)) }
    else if (e.key === 'Enter'    ) { e.preventDefault(); if (highlighted >= 0 && results[highlighted]) goGame(results[highlighted].slug); else doSearch(query) }
    else if (e.key === 'Escape'   ) { setFocused(false); inputRef.current?.blur() }
  }, [results, highlighted, query, goGame, doSearch])

  const showDropdown = focused && (query.trim().length > 0 || recent.length > 0)

  // ── Navbar variant — just a click trigger for the overlay ─────────────────
  if (variant === 'navbar') {
    return (
      <>
        <button
          type="button"
          onClick={() => setOverlayOpen(true)}
          aria-label="Open search"
          aria-haspopup="dialog"
          className="flex items-center h-[38px] w-full rounded-xl border border-border bg-surface/60 hover:border-border/80 transition-all duration-200 px-3 gap-2 text-left group"
        >
          <span className="text-secondary text-sm flex-shrink-0 group-hover:text-primary transition-colors" aria-hidden>🔍</span>
          <span className="flex-1 text-sm text-muted truncate">Search games…</span>
          <kbd className="hidden sm:flex items-center px-1.5 py-0.5 rounded border border-border/80 text-2xs font-mono text-muted bg-background/80 flex-shrink-0 pointer-events-none">
            ⌘K
          </kbd>
        </button>

        <SearchOverlay
          isOpen={overlayOpen}
          onClose={() => setOverlayOpen(false)}
        />
      </>
    )
  }

  // ── Hero variant — inline dropdown ────────────────────────────────────────
  return (
    <div ref={wrapRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={(e) => { e.preventDefault(); doSearch(query) }}>
        <div className={[
          'flex items-center h-14 rounded-full border-2 transition-all duration-200 overflow-hidden',
          focused
            ? 'border-accent shadow-glow bg-surface'
            : 'border-white/20 hover:border-white/30 bg-surface/70 backdrop-blur-sm',
        ].join(' ')}>
          <span className="pl-5 text-xl flex-shrink-0 select-none" aria-hidden>🔍</span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a game…"
            autoComplete="off"
            spellCheck={false}
            aria-label="Search games"
            className="flex-1 px-4 bg-transparent text-base text-primary placeholder:text-secondary focus:outline-none"
          />
          <button
            type="submit"
            className="h-full px-7 bg-accent hover:bg-accent-hover text-white font-semibold text-sm flex-shrink-0 transition-colors"
          >
            Search
          </button>
        </div>
      </form>
      {showDropdown && (
        <InlineDropdown
          query={query}
          results={results}
          recent={recent}
          highlighted={highlighted}
          onGame={goGame}
          onSearch={doSearch}
          onRemoveRecent={removeRecent}
        />
      )}
    </div>
  )
}
