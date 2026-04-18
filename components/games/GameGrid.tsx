'use client'

import { useState, useCallback } from 'react'
import Link      from 'next/link'
import type { Game } from '@/lib/types'
import GameCard  from './GameCard'

export interface GameGridProps {
  games:          Game[]
  title?:         string
  showViewAll?:   string
  cols?:          4 | 6 | 8
  showRanks?:     boolean
  // Load-more mode
  showLoadMore?:  boolean
  initialCount?:  number
}

const GRID_COLS: Record<4 | 6 | 8, string> = {
  4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
  6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
  8: 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8',
}

const PER_PAGE = 24

export default function GameGrid({
  games,
  title,
  showViewAll,
  cols = 6,
  showRanks = false,
  showLoadMore = false,
  initialCount,
}: GameGridProps) {
  const startCount = initialCount ?? (showLoadMore ? PER_PAGE : games.length)
  const [displayCount, setDisplayCount] = useState(startCount)
  const [loading,      setLoading]      = useState(false)

  const visibleGames = games.slice(0, displayCount)
  const hasMore      = showLoadMore && displayCount < games.length
  const remaining    = games.length - displayCount

  const handleLoadMore = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      setDisplayCount((n) => n + PER_PAGE)
      setLoading(false)
    }, 300)
  }, [])

  return (
    <section>
      {/* Section header */}
      {(title || showViewAll) && (
        <div className="flex items-center justify-between mb-4 px-4 md:px-6">
          {title && (
            <h2 className="font-display font-bold text-xl text-primary">{title}</h2>
          )}
          {showViewAll && (
            <Link
              href={showViewAll}
              className="text-sm text-accent hover:text-accent-hover font-medium transition-colors"
            >
              View All →
            </Link>
          )}
        </div>
      )}

      {visibleGames.length > 0 ? (
        <>
          <div className={`grid ${GRID_COLS[cols]} gap-3 px-4 md:px-6`}>
            {visibleGames.map((game, i) => (
              <GameCard
                key={game.id}
                game={game}
                size="md"
                rank={showRanks ? i + 1 : undefined}
              />
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="flex justify-center mt-8 px-4">
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
                ) : (
                  `Load More Games (${remaining} remaining)`
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <span className="text-5xl mb-4 select-none">🎮</span>
          <p className="text-secondary text-sm">No games found</p>
        </div>
      )}
    </section>
  )
}
