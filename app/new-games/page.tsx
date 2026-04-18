'use client'

import { useMemo } from 'react'
import { getAllGames, gamesAddedWithinDays } from '@/lib/games'
import { formatRelativeDate } from '@/lib/utils'
import GameCard from '@/components/games/GameCard'
import AdSlot   from '@/components/ui/AdSlot'
import type { Game } from '@/lib/types'

const ALL_GAMES = getAllGames()
  .slice()
  .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())

// ─── Group label + badge ──────────────────────────────────────────────────────

function GroupHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <h2 className="font-display font-bold text-lg text-primary flex items-center gap-2">
        {label}
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/30">
          {count}
        </span>
      </h2>
      <div className="flex-1 h-px bg-border/60" aria-hidden />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewGamesPage() {
  const groups = useMemo<{ label: string; games: Game[] }[]>(() => {
    const week  = gamesAddedWithinDays(7)
    const weekIds = week.map((g) => g.id)
    const weekSet = new Set<string>(weekIds)
    const month = gamesAddedWithinDays(30).filter((g) => !weekSet.has(g.id))
    const monthIdArr = weekIds.concat(month.map((g) => g.id))
    const monthIds = new Set<string>(monthIdArr)
    const older = ALL_GAMES.filter((g) => !monthIds.has(g.id))

    return [
      { label: '🔥 This Week',  games: week  },
      { label: '📅 This Month', games: month },
      { label: '🗂️ Older',      games: older },
    ].filter((g) => g.games.length > 0)
  }, [])

  return (
    <div className="flex flex-col min-h-full">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="px-4 md:px-6 pt-6 pb-5 border-b border-border/40">
        <div className="flex items-end gap-3">
          <span className="text-4xl select-none" aria-hidden>⚡</span>
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-primary leading-tight">
              New Games
            </h1>
            <p className="text-secondary text-sm mt-1">
              Fresh games added regularly — be the first to play!
            </p>
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="px-4 md:px-6 py-8 space-y-12 flex-1">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4 select-none">⚡</span>
            <p className="text-secondary">No new games yet. Check back soon!</p>
          </div>
        ) : (
          groups.map(({ label, games }, gi) => (
            <section key={label}>
              <GroupHeader label={label} count={games.length} />

              <div className="game-grid">
                {games.map((game) => (
                  <div key={game.id} className="relative">
                    <GameCard game={game} size="md" />
                    {/* Show relative date below card */}
                    <p className="text-[10px] text-muted text-center mt-1.5 truncate px-1">
                      {formatRelativeDate(game.addedAt)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Ad after the second group */}
              {gi === 1 && (
                <div className="flex justify-center mt-8">
                  <AdSlot format="leaderboard" />
                </div>
              )}
            </section>
          ))
        )}
      </div>
    </div>
  )
}
