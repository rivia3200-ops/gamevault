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
        <Sk className="h-2.5 w-2/3" />
      </div>
    </div>
  )
}

export default function CategoryLoading() {
  return (
    <div className="flex flex-col min-h-full animate-pulse">

      {/* Banner */}
      <div className="h-[200px] bg-surface-hover relative overflow-hidden">
        <div className="absolute inset-0 skeleton-shimmer opacity-40" />
        <div className="relative px-4 md:px-6 py-8 flex items-center gap-4">
          <Sk className="w-14 h-14 rounded-xl" />
          <div className="flex flex-col gap-2">
            <Sk className="h-3 w-24" />
            <Sk className="h-8 w-52" />
            <Sk className="h-3 w-72" />
          </div>
        </div>
      </div>

      {/* Sort bar */}
      <div className="border-b border-border/40 px-4 md:px-6 py-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <Sk className="h-4 w-36" />
          <div className="flex gap-2">
            {[80, 90, 72, 56].map((w) => (
              <Sk key={w} className="h-8 rounded-lg" style={{ width: w }} />
            ))}
          </div>
        </div>
        {/* Tag pills */}
        <div className="flex gap-2 overflow-hidden">
          {[60, 80, 70, 90, 65, 75].map((w, i) => (
            <Sk key={i} className="h-7 rounded-full flex-shrink-0" style={{ width: w }} />
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 md:px-6 py-6">
        <div className="game-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
