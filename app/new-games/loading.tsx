function Sk({ className = '' }: { className?: string }) {
  return <div className={`skeleton-shimmer rounded ${className}`} />
}

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

function SectionSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <section className="space-y-5">
      {/* Section header */}
      <div className="flex items-center gap-4">
        <Sk className="h-6 w-36" />
        <div className="flex-1 h-px bg-border/40" />
      </div>
      {/* Grid */}
      <div className="game-grid">
        {Array.from({ length: cols }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    </section>
  )
}

export default function NewGamesLoading() {
  return (
    <div className="flex flex-col min-h-full animate-pulse">

      {/* Header */}
      <div className="px-4 md:px-6 pt-6 pb-5 border-b border-border/40 flex items-end gap-3">
        <Sk className="w-10 h-10 rounded-xl" />
        <div className="flex flex-col gap-2">
          <Sk className="h-9 w-44" />
          <Sk className="h-3.5 w-56" />
        </div>
      </div>

      {/* Sections */}
      <div className="px-4 md:px-6 py-8 space-y-12">
        <SectionSkeleton cols={6} />
        <SectionSkeleton cols={8} />
      </div>
    </div>
  )
}
