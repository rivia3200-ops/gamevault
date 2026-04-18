import type { Metadata } from 'next'
import Link              from 'next/link'
import { getPopularGames, getRandomGame, formatPlayCount } from '@/lib/games'

export const metadata: Metadata = { title: '404 — Page Not Found' }

// ─── 404 Page ─────────────────────────────────────────────────────────────────

export default function NotFound() {
  const suggestions = getPopularGames(6)
  const randomGame  = getRandomGame()

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-16 text-center">

      {/* ── Illustration ─────────────────────────────────────────────── */}
      <div className="relative mb-8 select-none">
        <div
          className="text-[120px] md:text-[160px] leading-none font-display font-black opacity-10 text-primary"
          aria-hidden
        >
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-7xl md:text-9xl animate-bounce-subtle" aria-hidden>
            🕹️
          </span>
        </div>
      </div>

      {/* ── Copy ──────────────────────────────────────────────────────── */}
      <h1 className="font-display font-bold text-3xl md:text-4xl text-primary mb-3">
        Game Over — Page Not Found
      </h1>
      <p className="text-secondary text-base md:text-lg max-w-md mb-8 leading-relaxed">
        Looks like this page respawned somewhere else. The URL may be broken or
        the game may have been removed.
      </p>

      {/* ── Actions ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-14">
        <Link href="/" className="btn btn-primary btn-md px-6">
          🏠 Back to Home
        </Link>
        <Link
          href={`/game/${randomGame.slug}`}
          className="btn btn-secondary btn-md px-6"
        >
          🎲 Play Random Game
        </Link>
      </div>

      {/* ── Popular games grid ────────────────────────────────────────── */}
      <div className="w-full max-w-2xl">
        <h2 className="font-display font-bold text-lg text-primary mb-5 text-left">
          Popular Games to Try
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {suggestions.map((game) => (
            <Link
              key={game.id}
              href={`/game/${game.slug}`}
              className="group flex flex-col bg-surface rounded-xl border border-border/60 overflow-hidden hover:border-accent/40 hover:shadow-card transition-all duration-200 text-left"
            >
              <div className="relative aspect-game-card bg-gradient-to-br from-accent/10 to-surface-hover overflow-hidden">
                <img
                  src={game.thumbnailUrl}
                  alt={game.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-2.5">
                <p className="text-xs font-semibold text-secondary group-hover:text-primary transition-colors truncate">
                  {game.title}
                </p>
                <p className="text-[10px] text-muted mt-0.5">
                  {formatPlayCount(game.plays)} plays
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
