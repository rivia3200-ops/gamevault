import type React from 'react'

// ─── Game Page Skeleton ───────────────────────────────────────────────────────

function Sk({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`skeleton-shimmer rounded ${className ?? ''}`} style={style} />
}

export default function GamePageLoading() {
  return (
    <div className="flex flex-col min-h-full animate-pulse">

      {/* Breadcrumb */}
      <div className="px-4 md:px-6 pt-4 pb-2 flex items-center gap-2">
        <Sk className="h-3 w-10" />
        <Sk className="h-3 w-2"  />
        <Sk className="h-3 w-16" />
        <Sk className="h-3 w-2"  />
        <Sk className="h-3 w-32" />
      </div>

      <div className="px-4 md:px-6 pb-8">
        <div className="flex flex-col xl:flex-row gap-6">

          {/* Left column */}
          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex flex-col gap-2">
                <Sk className="h-7 w-48 md:w-64" />
                <Sk className="h-3 w-24" />
              </div>
              <Sk className="h-6 w-20 rounded-full" />
            </div>

            {/* Player area */}
            <Sk className="w-full rounded-xl" style={{ paddingBottom: '56.25%', height: 0 } as React.CSSProperties} />

            {/* Action bar */}
            <div className="flex items-center gap-2 mt-3">
              <Sk className="h-9 w-20 rounded-lg" />
              <Sk className="h-9 w-20 rounded-lg" />
              <Sk className="h-9 w-20 rounded-lg ml-auto" />
            </div>

            {/* Rating row */}
            <Sk className="h-24 w-full rounded-xl mt-4" />

            {/* Tab nav */}
            <div className="flex gap-2 mt-4 border-b border-border/40 pb-2">
              <Sk className="h-8 w-16 rounded" />
              <Sk className="h-8 w-24 rounded" />
              <Sk className="h-8 w-20 rounded" />
            </div>

            {/* Tab content */}
            <div className="mt-4 space-y-2">
              <Sk className="h-4 w-full" />
              <Sk className="h-4 w-5/6" />
              <Sk className="h-4 w-4/6" />
            </div>
          </div>

          {/* Right sidebar */}
          <div className="xl:w-[300px] flex-shrink-0 flex flex-col gap-4">
            <Sk className="h-64 w-full rounded-xl" />
            <Sk className="h-40 w-full rounded-xl" />
          </div>
        </div>

        {/* Related games */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <Sk className="h-6 w-40" />
            <Sk className="h-4 w-24" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col rounded-xl overflow-hidden border border-border/40">
                <Sk className="aspect-game-card w-full" />
                <div className="p-2.5 space-y-1.5">
                  <Sk className="h-3 w-3/4" />
                  <Sk className="h-2.5 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
