'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { Game } from '@/lib/types'
import GameCard from './GameCard'

// ─── Arrow icons ──────────────────────────────────────────────────────────────

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface GameRowProps {
  games:        Game[]
  title:        string
  showViewAll?: string
  cardSize?:    'md' | 'lg'
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GameRow({ games, title, showViewAll, cardSize = 'md' }: GameRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canLeft,  setCanLeft]  = useState(false)
  const [canRight, setCanRight] = useState(true)

  const sync = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    sync()
    el.addEventListener('scroll', sync, { passive: true })
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', sync)
      ro.disconnect()
    }
  }, [sync, games])

  const scroll = (dir: 'left' | 'right') =>
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -620 : 620, behavior: 'smooth' })

  const cardW = cardSize === 'lg' ? 280 : 200

  const arrowBase = [
    'absolute top-1/2 -translate-y-1/2 z-10',
    'w-9 h-9 rounded-full',
    'bg-background/95 border border-border/70 shadow-card',
    'flex items-center justify-center',
    'text-secondary hover:text-primary hover:bg-surface',
    'transition-all duration-200',
    // visible on desktop hover only
    'hidden md:flex',
    'opacity-0 group-hover/row:opacity-100',
  ].join(' ')

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-4 md:px-6">
        <h2 className="font-display font-bold text-xl text-primary">{title}</h2>
        {showViewAll && (
          <Link href={showViewAll} className="text-sm text-accent hover:text-accent-hover font-medium transition-colors">
            View All →
          </Link>
        )}
      </div>

      {/* Scrollable row */}
      <div className="relative group/row">
        {/* Left arrow */}
        <button
          aria-label="Scroll left"
          onClick={() => scroll('left')}
          className={[arrowBase, 'left-1', !canLeft ? 'invisible pointer-events-none' : ''].join(' ')}
        >
          <ChevronLeft />
        </button>

        {/* Cards container */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto no-scrollbar px-4 md:px-6 pb-1"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {games.map((game) => (
            <div
              key={game.id}
              className="flex-none"
              style={{ width: cardW, scrollSnapAlign: 'start' }}
            >
              <GameCard game={game} size={cardSize} />
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button
          aria-label="Scroll right"
          onClick={() => scroll('right')}
          className={[arrowBase, 'right-1', !canRight ? 'invisible pointer-events-none' : ''].join(' ')}
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  )
}
