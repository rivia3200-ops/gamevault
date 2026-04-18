const MAX_RECENT = 5
const KEY        = 'gv_recent_searches'

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[]
  } catch { return [] }
}

export function addRecentSearch(query: string): void {
  if (!query.trim() || typeof window === 'undefined') return
  const searches = getRecentSearches().filter((s) => s !== query)
  searches.unshift(query)
  try {
    localStorage.setItem(KEY, JSON.stringify(searches.slice(0, MAX_RECENT)))
  } catch { /* noop */ }
}

export function removeRecentSearch(query: string): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(getRecentSearches().filter((s) => s !== query)))
  } catch { /* noop */ }
}

export function clearRecentSearches(): void {
  try { localStorage.removeItem(KEY) } catch { /* noop */ }
}
