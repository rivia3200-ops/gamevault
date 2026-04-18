'use client'

import {
  useState, useEffect, useRef, useCallback,
} from 'react'
import { useRouter } from 'next/navigation'
import type { Game } from '@/lib/types'
import gamesData from '@/data/games.json'
import {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
} from '@/lib/search-history'

const ALL_GAMES = gamesData as Game[]
const POPULAR   = [...ALL_GAMES].sort((a, b) => b.plays - a.plays).slice(0, 6)

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${Math.round(n / 1_000)}K`
  return String(n)
}

const TRENDING = [
  { label: '⚔️ Action',     q: 'action'     },
  { label: '🏎️ Racing',     q: 'racing'     },
  { label: '🧩 Puzzle',     q: 'puzzle'     },
  { label: '🌐 .io Games',  q: 'io'         },
  { label: '🎯 Shooting',   q: 'shooting'   },
  { label: '⚽ Sports',     q: 'sports'     },
]

// ─── Highlight ────────────────────────────────────────────────────────────────

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-accent/20 text-accent rounded-[2px] not-italic">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface SearchOverlayProps {
  isOpen:        boolean
  onClose:       () => void
  initialQuery?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SearchOverlay({ isOpen, onClose, initialQuery = '' }: SearchOverlayProps) {
  const router   = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const [query,         setQuery]         = useState(initialQuery)
  const [results,       setResults]       = useState<Game[]>([])
  const [recent,        setRecent]        = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)

  // Load recent on open
  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery)
      setRecent(getRecentSearches())
      setSelectedIndex(-1)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen, initialQuery])

  // Debounce search
  useEffect(() => {
    if (!query.trim()) { setResults([]); setSelectedIndex(-1); return }
    const t = setTimeout(() => {
      const q = query.toLowerCase()
      setResults(
        ALL_GAMES.filter((g) =>
          g.title.toLowerCase().includes(q) ||
          g.tags.some((tag) => tag.includes(q)) ||
          g.category.includes(q),
        ).slice(0, 10),
      )
      setSelectedIndex(-1)
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }

      const items = query.trim() ? results : POPULAR
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((p) => Math.min(p + 1, items.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((p) => Math.max(p - 1, -1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (selectedIndex >= 0 && items[selectedIndex]) {
          navigateToGame(items[selectedIndex].slug)
        } else {
          doSearch(query)
        }
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, query, results, selectedIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  const navigateToGame = useCallback((slug: string) => {
    router.push(`/game/${slug}`)
    onClose()
    setQuery('')
  }, [router, onClose])

  const doSearch = useCallback((q: string) => {
    if (!q.trim()) return
    addRecentSearch(q.trim())
    router.push(`/search?q=${encodeURIComponent(q.trim())}`)
    onClose()
    setQuery('')
  }, [router, onClose])

  const handleRemoveRecent = useCallback((q: string, e: React.MouseEvent) => {
    e.stopPropagation()
    removeRecentSearch(q)
    setRecent(getRecentSearches())
  }, [])

  const handleClearAll = useCallback(() => {
    clearRecentSearches()
    setRecent([])
  }, [])

  if (!isOpen) return null

  const showResults = query.trim().length >= 2
  const displayItems = showResults ? results : []

  return (
    <div className="fixed inset-0 z-[200]" role="dialog" aria-modal aria-label="Search">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden
      />

      {/* Search panel */}
      <div className="relative z-10 flex justify-center px-4 pt-4">
        <div
          className="w-full bg-surface rounded-2xl shadow-2xl border border-border overflow-hidden animate-scale-in"
          style={{ maxWidth: 640 }}
        >
          {/* Input */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/60">
            <span className="text-muted text-lg flex-shrink-0 select-none" aria-hidden>🔍</span>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); doSearch(query) }
              }}
              placeholder="Search for a game…"
              autoComplete="off"
              spellCheck={false}
              aria-label="Search games"
              className="flex-1 bg-transparent text-[18px] text-primary placeholder:text-muted focus:outline-none min-w-0"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear"
                className="flex-shrink-0 text-muted hover:text-primary transition-colors text-sm"
              >
                ✕
              </button>
            )}
            <kbd
              className="flex-shrink-0 hidden sm:flex items-center px-2 py-1 rounded border border-border/80 text-2xs font-mono text-muted bg-background/60 cursor-pointer"
              onClick={onClose}
              role="button"
              aria-label="Close search"
            >
              ESC
            </kbd>
          </div>

          {/* Results panel */}
          <div className="max-h-[70vh] overflow-y-auto scrollbar-hide">

            {/* ── Live search results ────────────────────────────── */}
            {showResults && (
              <div>
                {displayItems.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm text-secondary mb-1">
                      No results for <strong className="text-primary">"{query}"</strong>
                    </p>
                    <p className="text-xs text-muted">Try another keyword</p>
                  </div>
                ) : (
                  <>
                    <div className="px-4 pt-3 pb-1">
                      <span className="text-2xs font-bold uppercase tracking-wider text-muted">Games</span>
                    </div>
                    {displayItems.map((game, i) => (
                      <button
                        key={game.id}
                        onClick={() => navigateToGame(game.slug)}
                        className={[
                          'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                          i === selectedIndex ? 'bg-surface-hover' : 'hover:bg-surface-hover',
                        ].join(' ')}
                      >
                        <div className="relative w-12 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-border">
                          <img
                            src={game.thumbnailUrl}
                            alt={game.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-primary truncate">
                            <Highlight text={game.title} query={query} />
                          </p>
                          <p className="text-2xs text-muted capitalize">{game.category.replace(/-/g, ' ')}</p>
                        </div>
                        <span className="text-2xs text-muted flex-shrink-0">{fmt(game.plays)} plays</span>
                      </button>
                    ))}
                    <button
                      onClick={() => doSearch(query)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 border-t border-border/60 text-sm text-accent hover:bg-surface-hover transition-colors font-medium"
                    >
                      See all {results.length}+ results for &ldquo;{query}&rdquo; →
                    </button>
                  </>
                )}
              </div>
            )}

            {/* ── Default state ──────────────────────────────────── */}
            {!showResults && (
              <>
                {/* Recent searches */}
                {recent.length > 0 && (
                  <div>
                    <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                      <span className="text-2xs font-bold uppercase tracking-wider text-muted">Recent Searches</span>
                      <button
                        onClick={handleClearAll}
                        className="text-2xs text-muted hover:text-secondary transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                    {recent.map((q) => (
                      <div
                        key={q}
                        className="flex items-center px-4 hover:bg-surface-hover transition-colors group/item"
                      >
                        <button
                          onClick={() => doSearch(q)}
                          className="flex items-center gap-3 flex-1 py-2.5 text-left min-w-0"
                        >
                          <span className="text-muted text-sm flex-shrink-0 select-none" aria-hidden>🕐</span>
                          <span className="text-sm text-secondary group-hover/item:text-primary truncate">{q}</span>
                        </button>
                        <button
                          onClick={(e) => handleRemoveRecent(q, e)}
                          aria-label={`Remove "${q}"`}
                          className="w-6 h-6 flex items-center justify-center text-muted hover:text-primary rounded transition-colors text-xs flex-shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Trending */}
                <div className={recent.length > 0 ? 'border-t border-border/60' : ''}>
                  <div className="px-4 pt-3 pb-2">
                    <span className="text-2xs font-bold uppercase tracking-wider text-muted">Trending</span>
                  </div>
                  <div className="px-4 pb-3 flex flex-wrap gap-2">
                    {TRENDING.map(({ label, q }) => (
                      <button
                        key={q}
                        onClick={() => doSearch(q)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-surface-hover border border-border/60 text-secondary hover:text-primary hover:border-accent/40 transition-all"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular games */}
                <div className="border-t border-border/60">
                  <div className="px-4 pt-3 pb-1">
                    <span className="text-2xs font-bold uppercase tracking-wider text-muted">Popular Games</span>
                  </div>
                  {POPULAR.map((game, i) => (
                    <button
                      key={game.id}
                      onClick={() => navigateToGame(game.slug)}
                      className={[
                        'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                        i === selectedIndex ? 'bg-surface-hover' : 'hover:bg-surface-hover',
                      ].join(' ')}
                    >
                      <div className="relative w-10 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-border">
                        <img
                          src={game.thumbnailUrl}
                          alt={game.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-primary truncate">{game.title}</p>
                        <p className="text-2xs text-muted capitalize">{game.category.replace(/-/g, ' ')}</p>
                      </div>
                      <span className="text-2xs text-muted flex-shrink-0">🔥 {fmt(game.plays)}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
