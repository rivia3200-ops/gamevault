import gamesData      from '@/data/games.json'
import categoriesData from '@/data/categories.json'
import type { Category, Game, PaginatedGames, SearchFilters } from '@/lib/types'

const games:      Game[]     = gamesData      as Game[]
const categories: Category[] = categoriesData as Category[]

// ─── Game queries ──────────────────────────────────────────────────────────────

export function getAllGames(): Game[] {
  return games
}

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug)
}

export function getGamesByCategory(category: string, limit?: number): Game[] {
  const filtered = games.filter((g) => g.category === category)
  return limit ? filtered.slice(0, limit) : filtered
}

export function getFeaturedGames(limit = 8): Game[] {
  return games.filter((g) => g.featured).slice(0, limit)
}

export function getNewGames(limit?: number): Game[] {
  const sorted = [...games]
    .filter((g) => g.isNew)
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
  return limit ? sorted.slice(0, limit) : sorted
}

export function getHotGames(limit?: number): Game[] {
  const filtered = games.filter((g) => g.isHot)
  return limit ? filtered.slice(0, limit) : filtered
}

export function getPopularGames(limit?: number): Game[] {
  const sorted = [...games].sort((a, b) => b.plays - a.plays)
  return limit ? sorted.slice(0, limit) : sorted
}

export function getRelatedGames(game: Game, limit = 6): Game[] {
  return games
    .filter(
      (g) =>
        g.id !== game.id &&
        (g.category === game.category || g.tags.some((t) => game.tags.includes(t))),
    )
    .sort((a, b) => b.plays - a.plays)
    .slice(0, limit)
}

export function getRecentGames(limit?: number): Game[] {
  const sorted = [...games].sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
  )
  return limit ? sorted.slice(0, limit) : sorted
}

export function getGamesByTag(tag: string, limit?: number): Game[] {
  const filtered = games.filter((g) => g.tags.includes(tag))
  return limit ? filtered.slice(0, limit) : filtered
}

export function getRandomGame(): Game {
  return games[Math.floor(Math.random() * games.length)]
}

export function searchGames(filters: SearchFilters): PaginatedGames {
  const { query = '', category, tags, sortBy = 'popular', page = 1, perPage = 20 } = filters

  let results = [...games]

  if (query.trim()) {
    const q = query.toLowerCase().trim()
    results = results.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }

  if (category) {
    results = results.filter((g) => g.category === category)
  }

  if (tags && tags.length > 0) {
    results = results.filter((g) => tags.some((t) => g.tags.includes(t)))
  }

  switch (sortBy) {
    case 'popular':
      results.sort((a, b) => b.plays - a.plays)
      break
    case 'new':
      results.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
      break
    case 'rating':
      results.sort((a, b) => b.rating - a.rating)
      break
    case 'name':
      results.sort((a, b) => a.title.localeCompare(b.title))
      break
  }

  const total      = results.length
  const totalPages = Math.ceil(total / perPage)
  const offset     = (page - 1) * perPage
  const paged      = results.slice(offset, offset + perPage)

  return { games: paged, total, page, perPage, totalPages }
}

// ─── Category queries ──────────────────────────────────────────────────────────

export function getAllCategories(): Category[] {
  return categories
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

// ─── Utility ──────────────────────────────────────────────────────────────────

export function formatPlayCount(plays: number): string {
  if (plays >= 1_000_000) return `${(plays / 1_000_000).toFixed(1)}M`
  if (plays >= 1_000)     return `${(plays / 1_000).toFixed(0)}K`
  return String(plays)
}

export function getTotalPlayCount(): number {
  return games.reduce((sum, g) => sum + g.plays, 0)
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function gamesAddedWithinDays(days: number): Game[] {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return getAllGames()
    .filter((g) => new Date(g.addedAt) >= cutoff)
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
}

export function getStarRating(rating: number): { full: number; half: boolean; empty: number } {
  const full  = Math.floor(rating)
  const half  = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return { full, half, empty }
}
