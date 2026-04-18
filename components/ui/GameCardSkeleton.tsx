export default function GameCardSkeleton() {
  return (
    <div className="bg-surface rounded-xl overflow-hidden border border-border/60">
      {/* Thumbnail — 3:2 ratio */}
      <div className="skeleton-shimmer w-full" style={{ paddingTop: '66.67%' }} />
      {/* Info */}
      <div className="p-3 space-y-2.5">
        <div className="skeleton-shimmer h-4 rounded w-4/5" />
        <div className="flex items-center justify-between gap-2">
          <div className="skeleton-shimmer h-3.5 rounded-full w-1/3" />
          <div className="skeleton-shimmer h-3 rounded w-1/4" />
        </div>
        <div className="skeleton-shimmer h-3 rounded w-2/5" />
      </div>
    </div>
  )
}

// Grid of skeletons — e.g. <GameGridSkeleton count={12} />
export function GameGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 px-4 md:px-6">
      {Array.from({ length: count }).map((_, i) => (
        <GameCardSkeleton key={i} />
      ))}
    </div>
  )
}
