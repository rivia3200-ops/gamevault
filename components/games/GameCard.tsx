'use client'

import Link  from 'next/link'
import { useState } from 'react'
import type { Game } from '@/lib/types'

// Static colour lookup — avoids importing the full categories JSON in every card
const CAT_COLORS: Record<string, string> = {
  action:       '#ef4444',
  puzzle:       '#8b5cf6',
  racing:       '#f97316',
  shooting:     '#06b6d4',
  sports:       '#22c55e',
  'io-games':   '#6366f1',
  hypercasual:  '#ec4899',
  '2-player':   '#f59e0b',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${Math.round(n / 1_000)}K`
  return String(n)
}

function Stars({ rating }: { rating: number }) {
  const full  = Math.floor(rating)
  const half  = rating - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <div className="flex items-center gap-px" title={`${rating} / 5`} aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: full  }).map((_, i) => <span key={`f${i}`} className="text-warning text-2xs leading-none">★</span>)}
      {half                                      && <span             className="text-warning/50 text-2xs leading-none">★</span>}
      {Array.from({ length: empty }).map((_, i) => <span key={`e${i}`} className="text-muted    text-2xs leading-none">★</span>)}
      <span className="text-2xs text-muted ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface GameCardProps {
  game:  Game
  size?: 'sm' | 'md' | 'lg'
  rank?: number
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GameCard({ game, size = 'md', rank }: GameCardProps) {
  const [imgErr,    setImgErr]    = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const color    = CAT_COLORS[game.category] ?? '#6c63ff'
  const catLabel = game.category.replace(/-/g, ' ')
  const isThumbio = game.thumbnailUrl.includes('thum.io')

  // Badge: rank medals take priority, then NEW, then HOT
  const badge =
    rank === 1 ? { text: '🥇', cls: ''                              } :
    rank === 2 ? { text: '🥈', cls: ''                              } :
    rank === 3 ? { text: '🥉', cls: ''                              } :
    game.isNew ? { text: 'NEW', cls: 'bg-success text-white'        } :
    game.isHot ? { text: '🔥 HOT', cls: 'bg-danger/90 text-white'  } :
    null

  // Prefetch thum.io image on hover so it's cached by click time
  const prefetchThumbio = () => {
    if (isThumbio && !imgLoaded && !imgErr) {
      const img = new window.Image()
      img.src = game.thumbnailUrl
    }
  }

  // ── Gradient fallback when image fails ────────────────────────────────────
  const Fallback = () => (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${color}44 0%, ${color}18 100%)` }}
    >
      <span
        className="text-4xl font-black select-none"
        style={{ color, opacity: 0.6 }}
      >
        {game.title.charAt(0).toUpperCase()}
      </span>
    </div>
  )

  // ── Small (horizontal) variant — used in related/sidebar lists ────────────
  if (size === 'sm') {
    return (
      <Link
        href={`/game/${game.slug}`}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-hover transition-colors duration-150 group"
        onMouseEnter={prefetchThumbio}
      >
        <div className="relative w-16 h-12 rounded-md overflow-hidden flex-shrink-0">
          {!imgLoaded && !imgErr && (
            <div className="absolute inset-0 skeleton rounded-md" />
          )}
          {!imgErr ? (
            <img
              src={game.thumbnailUrl}
              alt={game.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgErr(true)}
              loading="lazy"
            />
          ) : <Fallback />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-primary truncate group-hover:text-accent transition-colors">{game.title}</p>
          <p className="text-2xs text-muted capitalize">{catLabel}</p>
        </div>
      </Link>
    )
  }

  // ── Default & large (vertical) variants ───────────────────────────────────
  return (
    <Link
      href={`/game/${game.slug}`}
      className="game-card group block bg-surface rounded-xl overflow-hidden border border-border/60 hover:border-accent/40 focus-visible:border-accent"
      onMouseEnter={prefetchThumbio}
    >
      {/* ── Thumbnail — 3 : 2 aspect ratio ── */}
      <div className="relative" style={{ paddingTop: '66.67%' }}>
        <div className="absolute inset-0">
          {/* Skeleton shown while image loads */}
          {!imgLoaded && !imgErr && (
            <div className="absolute inset-0 skeleton" />
          )}
          {!imgErr ? (
            <img
              src={game.thumbnailUrl}
              alt={game.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgErr(true)}
              loading="lazy"
            />
          ) : <Fallback />}
        </div>

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200 flex items-center justify-center pointer-events-none">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-white text-black font-bold text-sm px-5 py-2 rounded-full shadow-xl">
            ▶ PLAY
          </span>
        </div>

        {/* Top-left badge */}
        {badge && (
          <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-2xs font-bold shadow ${badge.cls}`}>
            {badge.text}
          </span>
        )}

        {/* Top-right category colour dot */}
        <span
          className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full ring-1 ring-black/40 shadow"
          style={{ backgroundColor: color }}
          title={catLabel}
          aria-hidden
        />
      </div>

      {/* ── Info strip ── */}
      <div className={`p-3 ${size === 'lg' ? 'p-4' : ''}`}>
        <p className={`font-semibold text-primary truncate group-hover:text-accent transition-colors duration-150 ${size === 'lg' ? 'text-base' : 'text-sm'}`}>
          {game.title}
        </p>
        <div className="flex items-center justify-between mt-1.5 gap-2 min-w-0">
          <span
            className="text-2xs font-medium px-2 py-0.5 rounded-full capitalize truncate max-w-[90px] flex-shrink-0"
            style={{ backgroundColor: `${color}28`, color }}
          >
            {catLabel}
          </span>
          <span className="text-2xs text-muted flex-shrink-0 flex items-center gap-1">
            <span aria-hidden>👁</span> {fmt(game.plays)}
          </span>
        </div>
        <div className="mt-1.5">
          <Stars rating={game.rating} />
        </div>
      </div>
    </Link>
  )
}
