'use client'

import { useState, useMemo } from 'react'
import Link    from 'next/link'
import {
  getPopularGames,
  getAllCategories,
  formatPlayCount,
  formatRating,
  getTotalPlayCount,
} from '@/lib/games'
import GameCard from '@/components/games/GameCard'
import AdSlot   from '@/components/ui/AdSlot'

const ALL_GAMES  = getPopularGames()
const CATEGORIES = getAllCategories()
const TOP3       = ALL_GAMES.slice(0, 3)
const PER_PAGE   = 24

const PODIUM_STYLES = [
  {   // 1st
    border: 'border-yellow-400/50',
    glow:   '0 0 24px rgba(250,204,21,0.35)',
    label:  '🥇',
    accent: '#facc15',
    rank:   'order-2',
    height: 'md:h-72',
  },
  {   // 2nd
    border: 'border-slate-400/50',
    glow:   '0 0 20px rgba(148,163,184,0.3)',
    label:  '🥈',
    accent: '#94a3b8',
    rank:   'order-1',
    height: 'md:h-60',
  },
  {   // 3rd
    border: 'border-orange-700/40',
    glow:   '0 0 20px rgba(194,120,62,0.3)',
    label:  '🥉',
    accent: '#c2783e',
    rank:   'order-3',
    height: 'md:h-56',
  },
]

const CATEGORY_TABS = [
  { slug: 'all',        label: '🏆 All Time'  },
  { slug: 'action',     label: '⚔️ Action'    },
  { slug: 'puzzle',     label: '🧩 Puzzle'    },
  { slug: 'racing',     label: '🏎️ Racing'    },
  { slug: 'io-games',   label: '🌐 IO Games'  },
]

// ─── Podium (top-3 showcase) ──────────────────────────────────────────────────

function Podium({ games }: { games: typeof TOP3 }) {
  return (
    <div className="hidden md:flex items-end justify-center gap-4 px-4 md:px-6 pb-8">
      {games.map((game, i) => {
        const s = PODIUM_STYLES[i]
        return (
          <Link
            key={game.id}
            href={`/game/${game.slug}`}
            className={[
              s.rank,
              'group flex flex-col flex-1 max-w-[220px] rounded-2xl border-2 overflow-hidden',
              'bg-surface hover:bg-surface-hover transition-all duration-200',
              s.border,
              s.height,
            ].join(' ')}
            style={{ boxShadow: s.glow }}
          >
            <div className="relative flex-1 overflow-hidden">
              <img
                src={game.thumbnailUrl}
                alt={game.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <span className="absolute top-2 left-2 text-2xl select-none" aria-hidden>
                {s.label}
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
            <div className="p-3">
              <p className="text-sm font-bold text-primary truncate group-hover:text-accent transition-colors">
                {game.title}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-semibold" style={{ color: s.accent }}>
                  {formatPlayCount(game.plays)} plays
                </span>
                <span className="text-2xs text-warning">★ {formatRating(game.rating)}</span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PopularPage() {
  const [activeTab,    setActiveTab]    = useState('all')
  const [displayCount, setDisplayCount] = useState(PER_PAGE)
  const [loading,      setLoading]      = useState(false)

  const filteredGames = useMemo(() => {
    if (activeTab === 'all') return ALL_GAMES
    return ALL_GAMES.filter((g) => g.category === activeTab)
  }, [activeTab])

  const visibleGames = filteredGames.slice(0, displayCount)
  const hasMore      = displayCount < filteredGames.length

  const handleTabChange = (slug: string) => {
    setActiveTab(slug)
    setDisplayCount(PER_PAGE)
  }

  const handleLoadMore = () => {
    setLoading(true)
    setTimeout(() => {
      setDisplayCount((n) => n + PER_PAGE)
      setLoading(false)
    }, 300)
  }

  return (
    <div className="flex flex-col min-h-full">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="px-4 md:px-6 pt-6 pb-4 border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-primary flex items-center gap-3">
              <span aria-hidden>🏆</span> Most Popular Games
            </h1>
            <p className="text-secondary text-sm mt-1">Ranked by total plays</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-display font-bold text-accent">
              {formatPlayCount(getTotalPlayCount())}
            </p>
            <p className="text-xs text-muted">total plays across all games</p>
          </div>
        </div>
      </div>

      {/* ── Podium (desktop only) ───────────────────────────────────── */}
      {activeTab === 'all' && <Podium games={TOP3} />}

      {/* ── Category filter tabs ─────────────────────────────────────── */}
      <div className="sticky top-[64px] z-30 bg-background/95 backdrop-blur-sm border-b border-border/40 px-4 md:px-6 py-3">
        <div
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar"
          role="tablist"
          aria-label="Filter by category"
        >
          {CATEGORY_TABS.map(({ slug, label }) => (
            <button
              key={slug}
              role="tab"
              aria-selected={activeTab === slug}
              onClick={() => handleTabChange(slug)}
              className={[
                'flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap',
                activeTab === slug
                  ? 'bg-accent text-white'
                  : 'bg-surface border border-border/60 text-secondary hover:text-primary hover:border-accent/40',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Games grid ──────────────────────────────────────────────── */}
      <div className="px-4 md:px-6 py-6 flex-1">
        <div className="game-grid">
          {visibleGames.map((game, i) => (
            <GameCard
              key={game.id}
              game={game}
              size="md"
              rank={i + 1}
            />
          ))}
        </div>

        {/* Ad slot mid-page */}
        {displayCount >= PER_PAGE && (
          <div className="flex justify-center my-8">
            <AdSlot format="leaderboard" />
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div className="flex justify-center mt-6">
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
              ) : `Load More (${filteredGames.length - displayCount} remaining)`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
