'use client'

interface TagCount {
  tag:   string
  count: number
}

interface FilterBarProps {
  tags:       TagCount[]
  activeTag:  string | null
  onChange:   (tag: string | null) => void
  className?: string
}

export default function FilterBar({ tags, activeTag, onChange, className = '' }: FilterBarProps) {
  if (tags.length === 0) return null

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs text-muted flex-shrink-0 hidden sm:inline">Filter:</span>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 flex-1">
        {/* All pill */}
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-pressed={activeTag === null}
          className={[
            'flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap',
            activeTag === null
              ? 'bg-accent text-white'
              : 'bg-surface border border-border/60 text-secondary hover:text-primary hover:border-accent/40',
          ].join(' ')}
        >
          All
        </button>

        {tags.map(({ tag, count }) => (
          <button
            key={tag}
            type="button"
            onClick={() => onChange(activeTag === tag ? null : tag)}
            aria-pressed={activeTag === tag}
            className={[
              'flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap capitalize',
              activeTag === tag
                ? 'bg-accent/20 border border-accent/60 text-accent'
                : 'bg-surface border border-border/60 text-secondary hover:text-primary hover:border-accent/40',
            ].join(' ')}
          >
            {tag} <span className="opacity-60">({count})</span>
          </button>
        ))}
      </div>
    </div>
  )
}
