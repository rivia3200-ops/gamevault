'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useRouter, usePathname }  from 'next/navigation'
import Link        from 'next/link'
import type { Game, Category } from '@/lib/types'
import GameCard    from '@/components/games/GameCard'
import SortBar     from '@/components/games/SortBar'
import type { SortOption } from '@/components/games/SortBar'
import AdSlot      from '@/components/ui/AdSlot'
import { Analytics } from '@/lib/analytics'

const PER_PAGE = 24

// ─── Highlight ────────────────────────────────────────────────────────────────

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part)
          ? <mark key={i} className="bg-transparent text-accent font-semibold not-italic">{part}</mark>
          : part,
      )}
    </>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface SearchResultsProps {
  games:             Game[]
  query:             string
  categories:        Category[]
  initialCategory?:  string
  initialSort?:      string
}

const SORT_OPTIONS_WITH_RELEVANT: { value: SortOption | 'relevant'; label: string }[] = [
  { value: 'relevant', label: '🎯 Relevant' },
  { value: 'popular',  label: '🔥 Popular'  },
  { value: 'rating',   label: '⭐ Top Rated' },
  { value: 'newest',   label: '⚡ Newest'   },
]

const SUGGESTIONS = ['action', 'puzzle', 'racing', 'shooting', 'sports', 'io']

export default function SearchResults({
  games,
  query,
  categories,
  initialCategory,
  initialSort,
}: SearchResultsProps) {
  const router   = useRouter()
  const pathname = usePathname()

  type ExtSort = SortOption | 'relevant'
  const defaultSort: ExtSort = query ? 'relevant' : 'popular'

  const [categoryFilter, setCategoryFilter] = useState(initialCategory ?? 'all')
  const [sortBy,         setSortBy]         = useState<ExtSort>((initialSort as ExtSort) ?? defaultSort)
  const [displayCount,   setDisplayCount]   = useState(PER_PAGE)
  const [loading,        setLoading]        = useState(false)

  // Track search query on mount/query change
  useEffect(() => {
    if (query) Analytics.searchQuery(query, games.length)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  // Reset display count when filters change
  useEffect(() => { setDisplayCount(PER_PAGE) }, [categoryFilter, sortBy])

  // Build per-category counts for the filter bar
  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>()
    games.forEach((g) => map.set(g.category, (map.get(g.category) ?? 0) + 1))
    return map
  }, [games])

  // Filtered + sorted games
  const filteredGames = useMemo(() => {
    let result = [...games]

    if (categoryFilter !== 'all') {
      result = result.filter((g) => g.category === categoryFilter)
    }

    if (sortBy !== 'relevant') {
      switch (sortBy) {
        case 'popular': result.sort((a, b) => b.plays  - a.plays);                                         break
        case 'rating':  result.sort((a, b) => b.rating - a.rating);                                        break
        case 'newest':  result.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()); break
        case 'az':      result.sort((a, b) => a.title.localeCompare(b.title));                              break
      }
    }

    return result
  }, [games, categoryFilter, sortBy])

  const visibleGames = filteredGames.slice(0, displayCount)
  const hasMore      = displayCount < filteredGames.length
  const remaining    = filteredGames.length - displayCount

  const syncUrl = useCallback((cat: string, sort: string) => {
    const params = new URLSearchParams()
    if (query)        params.set('q', query)
    if (cat !== 'all') params.set('category', cat)
    if (sort !== defaultSort) params.set('sort', sort)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [router, pathname, query, defaultSort])

  const handleCategory = useCallback((slug: string) => {
    setCategoryFilter(slug)
    syncUrl(slug, sortBy)
  }, [sortBy, syncUrl])

  const handleSort = useCallback((s: SortOption) => {
    setSortBy(s)
    syncUrl(categoryFilter, s)
  }, [categoryFilter, syncUrl])

  const handleLoadMore = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      setDisplayCount((n) => n + PER_PAGE)
      setLoading(false)
    }, 300)
  }, [])

  // Categories that actually have results
  const activeCats = categories.filter((c) => (categoryCounts.get(c.slug) ?? 0) > 0)

  return (
    <div>
      {/* ── Filter bar ───────────────────────────────────────────────── */}
      <div className="px-4 md:px-6 py-4 flex flex-col gap-3">

        {/* Category pills */}
        {activeCats.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <button
              onClick={() => handleCategory('all')}
              aria-pressed={categoryFilter === 'all'}
              className={[
                'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150',
                categoryFilter === 'all'
                  ? 'bg-accent text-white'
                  : 'bg-surface border border-border/60 text-secondary hover:text-primary hover:border-accent/40',
              ].join(' ')}
            >
              All ({games.length})
            </button>
            {activeCats.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategory(cat.slug)}
                aria-pressed={categoryFilter === cat.slug}
                className={[
                  'flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150',
                  categoryFilter === cat.slug
                    ? 'bg-accent text-white'
                    : 'bg-surface border border-border/60 text-secondary hover:text-primary hover:border-accent/40',
                ].join(' ')}
              >
                <span aria-hidden>{cat.icon}</span>
                {cat.name} ({categoryCounts.get(cat.slug)})
              </button>
            ))}
          </div>
        )}

        {/* Sort bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted mr-1">Sort:</span>
          {SORT_OPTIONS_WITH_RELEVANT
            .filter((o) => o.value !== 'relevant' || query)
            .map((opt) => (
              <button
                key={opt.value}
                onClick={() => opt.value !== 'relevant' && handleSort(opt.value as SortOption)}
                aria-pressed={sortBy === opt.value}
                className={[
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
                  sortBy === opt.value
                    ? 'bg-accent text-white'
                    : 'bg-surface border border-border/60 text-secondary hover:text-primary hover:border-accent/40',
                ].join(' ')}
              >
                {opt.label}
              </button>
            ))}
        </div>
      </div>

      {/* ── Results ──────────────────────────────────────────────────── */}
      <div className="px-4 md:px-6 pb-10">
        {filteredGames.length === 0 ? (
          /* No results */
          <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
            <span className="text-6xl select-none">🔍</span>
            <div>
              <p className="font-display font-bold text-xl text-primary mb-1">
                {query ? `No results for "${query}"` : 'No games found'}
              </p>
              <p className="text-sm text-secondary">Try a different search or browse a category</p>
            </div>

            {query && (
              <div>
                <p className="text-xs text-muted mb-3">Try searching for:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTIONS.map((s) => (
                    <a
                      key={s}
                      href={`/search?q=${s}`}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-surface border border-border/60 text-secondary hover:text-primary hover:border-accent/40 transition-all capitalize"
                    >
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Count line */}
            <p className="text-sm text-muted mb-5">
              {query ? (
                <>
                  <span className="text-primary font-semibold">{filteredGames.length}</span> game{filteredGames.length !== 1 ? 's' : ''} found for{' '}
                  <span className="text-accent font-semibold">"{query}"</span>
                </>
              ) : (
                <>Showing <span className="text-primary font-semibold">{filteredGames.length}</span> games</>
              )}
            </p>

            <div className="game-grid">
              {visibleGames.map((game) => (
                <Link
                  key={game.id}
                  href={`/game/${game.slug}`}
                  className="game-card group block bg-surface rounded-xl overflow-hidden border border-border/60 hover:border-accent/40"
                >
                  <div className="relative" style={{ paddingTop: '66.67%' }}>
                    <div className="absolute inset-0">
                      <img
                        src={game.thumbnailUrl}
                        alt={game.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center pointer-events-none">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black font-bold text-xs px-4 py-1.5 rounded-full">
                        ▶ PLAY
                      </span>
                    </div>
                    {game.isNew && (
                      <span className="absolute top-2 left-2 badge-new text-[10px]">NEW</span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-primary group-hover:text-accent transition-colors truncate">
                      {query ? <HighlightMatch text={game.title} query={query} /> : game.title}
                    </p>
                    <p className="text-2xs text-muted mt-0.5 capitalize">{game.category.replace(/-/g, ' ')}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-accent/50 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-200 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                      Loading…
                    </>
                  ) : `Load More (${remaining} remaining)`}
                </button>
              </div>
            )}

            {/* Ad slot */}
            <div className="flex justify-center mt-10">
              <AdSlot format="leaderboard" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
