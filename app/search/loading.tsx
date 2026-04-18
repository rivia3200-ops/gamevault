function Sk({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`skeleton-shimmer rounded ${className}`} style={style} />
}

import type React from 'react'

function CardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-border/40">
      <Sk className="aspect-game-card w-full" />
      <div className="p-3 space-y-2">
        <Sk className="h-3.5 w-4/5" />
        <Sk className="h-2.5 w-1/2" />
      </div>
    </div>
  )
}

export default function SearchLoading() {
  return (
    <div className="flex flex-col min-h-full animate-pulse">

      {/* Header */}
      <div className="px-4 md:px-6 pt-6 pb-4">
        <Sk className="h-8 w-64 mb-2" />
        <Sk className="h-4 w-32" />
      </div>

      {/* Filter + sort bar */}
      <div className="px-4 md:px-6 py-4 flex flex-col gap-3">
        <div className="flex gap-2 overflow-hidden">
          {[60, 90, 80, 85, 70, 75].map((w, i) => (
            <Sk key={i} className="h-8 rounded-full flex-shrink-0" style={{ width: w }} />
          ))}
        </div>
        <div className="flex gap-2">
          {[90, 85, 90, 72].map((w, i) => (
            <Sk key={i} className="h-8 rounded-lg" style={{ width: w }} />
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 md:px-6 pb-8">
        <Sk className="h-4 w-40 mb-5" />
        <div className="game-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
