// ─── Game ─────────────────────────────────────────────────────────────────────

export interface Game {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  category: string
  tags: string[]
  thumbnailUrl: string
  bannerUrl: string
  embedUrl: string
  embedType: 'iframe' | 'html5'
  width: number
  height: number
  developer: string
  plays: number
  rating: number
  ratingCount: number
  featured: boolean
  isNew: boolean
  isHot: boolean
  addedAt: string
  instructions: string
  controls: {
    keyboard?: string
    mouse?: string
    touch?: string
  }
}

// ─── Category ─────────────────────────────────────────────────────────────────

export interface Category {
  id: string
  slug: string
  name: string
  icon: string
  description: string
  gameCount: number
  color: string
}

// ─── Search ───────────────────────────────────────────────────────────────────

export interface SearchFilters {
  query?: string
  category?: string
  tags?: string[]
  sortBy?: 'popular' | 'new' | 'rating' | 'name'
  page?: number
  perPage?: number
}

export interface PaginatedGames {
  games: Game[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  icon?: string
  badge?: string | number
  isExternal?: boolean
}

// ─── Ad Slot ──────────────────────────────────────────────────────────────────

export type AdSlotSize =
  | 'banner'        // 728×90
  | 'leaderboard'   // 970×90
  | 'rectangle'     // 300×250
  | 'skyscraper'    // 160×600
  | 'mobile-banner' // 320×50

export interface AdSlotProps {
  slot: string
  size: AdSlotSize
  className?: string
}
