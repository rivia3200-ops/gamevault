'use client'

export type SortOption = 'popular' | 'rating' | 'newest' | 'az'

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popular', label: '🔥 Popular' },
  { value: 'rating',  label: '⭐ Top Rated' },
  { value: 'newest',  label: '⚡ Newest' },
  { value: 'az',      label: '🔤 A-Z' },
]

interface SortBarProps {
  value:     SortOption
  onChange:  (v: SortOption) => void
  count:     number
  total:     number
  className?: string
}

export default function SortBar({ value, onChange, count, total, className = '' }: SortBarProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}>
      <p className="text-sm text-muted flex-shrink-0">
        Showing{' '}
        <span className="text-primary font-semibold">{count}</span>
        {' '}of{' '}
        <span className="text-primary font-semibold">{total}</span>
        {' '}games
      </p>

      <div
        className="flex items-center gap-1 flex-wrap"
        role="group"
        aria-label="Sort options"
      >
        <span className="text-xs text-muted mr-1 hidden sm:inline">Sort by:</span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={[
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap',
              value === opt.value
                ? 'bg-accent text-white'
                : 'bg-surface border border-border/60 text-secondary hover:text-primary hover:border-accent/40',
            ].join(' ')}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
