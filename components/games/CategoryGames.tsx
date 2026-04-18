'use client'

import {
  useState, useMemo, useCallback, useEffect, useRef,
} from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import type { Game, Category } from '@/lib/types'
import GameCard  from './GameCard'
import SortBar, { type SortOption } from './SortBar'
import FilterBar from './FilterBar'
import AdSlot    from '@/components/ui/AdSlot'
import { Analytics } from '@/lib/analytics'

const PER_PAGE = 24

interface CategoryGamesProps {
  games:        Game[]
  category:     Category
  initialSort?: SortOption
  initialTag?:  string | null
}

export default function CategoryGames({
  games,
  category,
  initialSort = 'popular',
  initialTag  = null,
}: CategoryGamesProps) {
  const router   = useRouter()
  const pathname = usePathname()

  const [sortBy,        setSortBy]        = useState<SortOption>(initialSort)
  const [activeTag,     setActiveTag]     = useState<string | null>(initialTag)
  const [searchWithin,  setSearchWithin]  = useState('')
  const [displayCount,  setDisplayCount]  = useState(PER_PAGE)
  const [loadingMore,   setLoadingMore]   = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [debouncedQ,    setDebouncedQ]    = useState('')

  // Track category view on mount
  useEffect(() => {
    Analytics.categoryView(category.slug)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Debounce search-within
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDebouncedQ(searchWithin), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [searchWithin])

  // Reset display count when filters change
  useEffect(() => { setDisplayCount(PER_PAGE) }, [sortBy, activeTag, debouncedQ])

  // Sync to URL
  const syncUrl = useCallback((sort: SortOption, tag: string | null) => {
    const params = new URLSearchParams()
    if (sort !== 'popular') params.set('sort', sort)
    if (tag)                params.set('tag', tag)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [router, pathname])

  const handleSortChange = useCallback((v: SortOption) => {
    setSortBy(v)
    syncUrl(v, activeTag)
  }, [activeTag, syncUrl])

  const handleTagChange = useCallback((tag: string | null) => {
    setActiveTag(tag)
    syncUrl(sortBy, tag)
  }, [sortBy, syncUrl])

  // Build tag counts from all category games
  const tagCounts = useMemo(() => {
    const map = new Map<string, number>()
    games.forEach((g) => g.tags.forEach((t) => map.set(t, (map.get(t) ?? 0) + 1)))
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([tag, count]) => ({ tag, count }))
  }, [games])

  // Filtered + sorted games
  const filteredGames = useMemo(() => {
    let result = [...games]

    if (activeTag) {
      result = result.filter((g) => g.tags.includes(activeTag))
    }

    if (debouncedQ.trim()) {
      const q = debouncedQ.toLowerCase()
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }

    switch (sortBy) {
      case 'popular': result.sort((a, b) => b.plays  - a.plays);                                     break
      case 'rating':  result.sort((a, b) => b.rating - a.rating);                                    break
      case 'newest':  result.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()); break
      case 'az':      result.sort((a, b) => a.title.localeCompare(b.title));                         break
    }

    return result
  }, [games, activeTag, debouncedQ, sortBy])

  const visibleGames = filteredGames.slice(0, displayCount)
  const hasMore      = displayCount < filteredGames.length
  const remaining    = filteredGames.length - displayCount

  const handleLoadMore = useCallback(() => {
    setLoadingMore(true)
    setTimeout(() => {
      setDisplayCount((n) => n + PER_PAGE)
      setLoadingMore(false)
    }, 300)
  }, [])

  const clearFilters = useCallback(() => {
    setActiveTag(null)
    setSearchWithin('')
    setSortBy('popular')
    syncUrl('popular', null)
  }, [syncUrl])

  const isEmpty = filteredGames.length === 0

  return (
    <div>
      {/* ── Sticky control bar ─────────────────────────────────────────── */}
      <div className="sticky top-[64px] z-30 bg-background/95 backdrop-blur-sm border-b border-border/40 py-3 px-4 md:px-6">
        <SortBar
          value={sortBy}
          onChange={handleSortChange}
          count={visibleGames.length}
          total={filteredGames.length}
        />

        <div className="mt-2.5 flex flex-col sm:flex-row gap-2.5">
          {/* Search within */}
          <div className="relative flex-shrink-0 sm:w-56">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs" aria-hidden>🔍</span>
            <input
              type="search"
              value={searchWithin}
              onChange={(e) => setSearchWithin(e.target.value)}
              placeholder={`Search in ${category.name}…`}
              aria-label={`Search within ${category.name} games`}
              className="w-full bg-surface border border-border/60 rounded-lg pl-8 pr-3 py-1.5 text-xs text-primary placeholder:text-muted focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all"
            />
          </div>

          {/* Tag filter */}
          <FilterBar
            tags={tagCounts}
            activeTag={activeTag}
            onChange={handleTagChange}
            className="flex-1"
          />
        </div>
      </div>

      {/* ── Games grid ─────────────────────────────────────────────────── */}
      <div className="px-4 md:px-6 py-6">
        {isEmpty ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <span className="text-6xl select-none">🎮</span>
            <p className="font-display font-bold text-xl text-primary">No games found</p>
            <p className="text-sm text-secondary">Try a different filter or search term</p>
            <button
              onClick={clearFilters}
              className="btn btn-secondary btn-sm mt-2"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="game-grid">
              {visibleGames.map((game, i) => (
                <>
                  {/* Ad slot after row 3 (index 17 = end of 3rd row in a 6-col grid ≈ index 17) */}
                  {i === 18 && (
                    <div key="ad-slot" className="col-span-full flex justify-center my-2">
                      <AdSlot format="leaderboard" />
                    </div>
                  )}
                  <GameCard
                    key={game.id}
                    game={game}
                    size="md"
                    rank={sortBy === 'popular' ? i + 1 : undefined}
                  />
                </>
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-accent/50 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <>
                      <span className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                      Loading…
                    </>
                  ) : (
                    <>Load More Games ({remaining} remaining)</>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
