import type React from 'react'

function Sk({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`skeleton-shimmer rounded ${className}`} style={style} />
}

function CardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-border/40">
      <Sk className="aspect-game-card w-full" />
      <div className="p-3 space-y-2">
        <Sk className="h-3.5 w-4/5" />
        <Sk className="h-2.5 w-1/2" />
        <Sk className="h-2.5 w-2/3" />
      </div>
    </div>
  )
}

export default function PopularLoading() {
  return (
    <div className="flex flex-col min-h-full animate-pulse">

      {/* Header */}
      <div className="px-4 md:px-6 pt-6 pb-4 border-b border-border/40 flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <Sk className="h-9 w-72" />
          <Sk className="h-4 w-40" />
        </div>
        <div className="flex flex-col gap-1 items-end">
          <Sk className="h-7 w-24" />
          <Sk className="h-3 w-32" />
        </div>
      </div>

      {/* Podium skeleton */}
      <div className="hidden md:flex items-end justify-center gap-4 px-4 md:px-6 pb-8 pt-6">
        {[240, 280, 220].map((h, i) => (
          <div key={i} className={`flex-1 max-w-[220px] rounded-2xl overflow-hidden border border-border/40 order-${i === 0 ? 2 : i === 1 ? 1 : 3}`}>
            <Sk className="w-full" style={{ height: h }} />
            <div className="p-3 space-y-1.5">
              <Sk className="h-4 w-3/4" />
              <Sk className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="border-b border-border/40 px-4 md:px-6 py-3 flex gap-2">
        {[90, 80, 78, 85, 90].map((w, i) => (
          <Sk key={i} className="h-9 rounded-lg flex-shrink-0" style={{ width: w }} />
        ))}
      </div>

      {/* Grid */}
      <div className="px-4 md:px-6 py-6">
        <div className="game-grid">
          {Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  )
}
