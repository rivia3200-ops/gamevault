'use client'

import Link        from 'next/link'
import { usePathname } from 'next/navigation'
import categoriesData  from '@/data/categories.json'
import type { Category } from '@/lib/types'

const categories = categoriesData as Category[]

export interface CategoryTabsProps {
  activeCategory?: string
}

export default function CategoryTabs({ activeCategory }: CategoryTabsProps) {
  const pathname = usePathname()
  const allActive = !activeCategory && pathname === '/'

  const pillBase = 'flex-none flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150 select-none'
  const pillInactive = 'bg-surface border border-border/60 text-secondary hover:text-primary hover:bg-surface-hover'
  const pillActive   = 'text-white shadow-accent'

  return (
    <div
      className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 md:px-6 py-3"
      role="navigation"
      aria-label="Browse by category"
    >
      {/* All Games */}
      <Link
        href="/"
        className={`${pillBase} ${allActive ? `bg-accent ${pillActive}` : pillInactive}`}
      >
        🎮 All Games
      </Link>

      {categories.map((cat) => {
        const active = activeCategory === cat.slug
        return (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className={`${pillBase} ${active ? pillActive : pillInactive}`}
            style={active ? { backgroundColor: cat.color } : {}}
            aria-current={active ? 'page' : undefined}
          >
            <span aria-hidden>{cat.icon}</span>
            {cat.name}
          </Link>
        )
      })}
    </div>
  )
}
