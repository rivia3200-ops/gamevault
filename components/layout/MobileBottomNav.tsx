'use client'

import Link        from 'next/link'
import { usePathname } from 'next/navigation'

// ─── Icons ────────────────────────────────────────────────────────────────────

function HomeIcon({ filled }: { filled?: boolean }) {
  return filled ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
      <path d="M11.03 2.59a1.5 1.5 0 0 1 1.94 0l7.5 6.363A1.5 1.5 0 0 1 21 10.097V19.5a1.5 1.5 0 0 1-1.5 1.5h-5a1.5 1.5 0 0 1-1.5-1.5v-4h-2v4a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 3 19.5v-9.403a1.5 1.5 0 0 1 .53-1.144l7.5-6.363z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden>
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <polyline points="9 21 9 12 15 12 15 21" />
    </svg>
  )
}

function GridIcon({ filled }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? 0 : 2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden>
      <rect x="3"  y="3"  width="7" height="7" rx="1" />
      <rect x="14" y="3"  width="7" height="7" rx="1" />
      <rect x="3"  y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function SearchIcon({ filled }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={filled ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function ZapIcon({ filled }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? 0 : 2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function FireIcon({ filled }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? 0 : 2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden>
      <path d="M8.5 14.5A4.5 4.5 0 0 0 12 19.5a4.5 4.5 0 0 0 3.5-7.5C14 10.5 12 8 12 8s-3.5 3-3.5 6.5z" />
      <path d="M12 8C10 5.5 9 3 9 3s5 2 6 7c1 4.5-2 7-3 9" />
    </svg>
  )
}

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: '/',          label: 'Home',       Icon: HomeIcon   },
  { href: '/category',  label: 'Categories', Icon: GridIcon   },
  { href: '/search',    label: 'Search',     Icon: SearchIcon },
  { href: '/new-games', label: 'New',        Icon: ZapIcon    },
  { href: '/popular',   label: 'Popular',    Icon: FireIcon   },
] as const

// ─── Component ────────────────────────────────────────────────────────────────

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Mobile navigation"
      className={[
        'fixed bottom-0 left-0 right-0 z-[50]',
        'h-[60px]',
        'bg-surface/95 backdrop-blur-md',
        'border-t border-border/60',
        'flex items-center',
        // Only show on mobile
        'lg:hidden',
        // Safe area for notched phones
        'pb-[env(safe-area-inset-bottom,0px)]',
      ].join(' ')}
    >
      <div className="flex items-center justify-around w-full px-1">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              aria-label={label}
              className={[
                'flex flex-col items-center justify-center gap-1',
                'flex-1 h-[52px] rounded-xl text-center',
                'transition-all duration-150 active:scale-90',
                isActive
                  ? 'text-accent'
                  : 'text-muted hover:text-secondary',
              ].join(' ')}
            >
              <span className="relative">
                <Icon filled={isActive} />
                {/* Active dot */}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                )}
              </span>
              <span className={['text-2xs font-medium', isActive ? 'text-accent' : ''].join(' ')}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
