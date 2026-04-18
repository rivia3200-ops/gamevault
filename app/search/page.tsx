import type { Metadata } from 'next'
import { Suspense }      from 'react'
import { searchGames, getPopularGames, getAllCategories } from '@/lib/games'
import SearchResults from '@/components/search/SearchResults'
import SearchBar     from '@/components/ui/SearchBar'

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string }
}): Promise<Metadata> {
  const q = searchParams.q?.trim() ?? ''
  return {
    title: q
      ? `"${q}" — Search Results | GameVault`
      : 'Search Free Online Games | GameVault',
    description: q
      ? `Find free online games matching "${q}". Play instantly in your browser.`
      : 'Search thousands of free online HTML5 games on GameVault.',
    robots: { index: !!q, follow: true },
  }
}

// ─── Search Header ────────────────────────────────────────────────────────────

function SearchHeader({ query, count }: { query: string; count: number }) {
  if (!query) {
    return (
      <div className="px-4 md:px-6 pt-8 pb-6 text-center max-w-2xl mx-auto w-full">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-primary mb-2">
          Search Games
        </h1>
        <p className="text-secondary mb-6">Find your next favourite game</p>
        <SearchBar variant="hero" />
      </div>
    )
  }

  return (
    <div className="px-4 md:px-6 pt-6 pb-2">
      <h1 className="font-display font-bold text-2xl md:text-3xl text-primary">
        {count > 0 ? (
          <>Results for <span className="text-accent">"{query}"</span></>
        ) : (
          <>No results for <span className="text-accent">"{query}"</span></>
        )}
      </h1>
      {count > 0 && (
        <p className="text-sm text-muted mt-1">
          {count} game{count !== 1 ? 's' : ''} found
        </p>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface SearchPageProps {
  searchParams: {
    q?:        string
    category?: string
    sort?:     string
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query      = searchParams.q?.trim() ?? ''
  const categories = getAllCategories()

  // Search or fall back to popular
  const games = query
    ? searchGames({ query }).games
    : getPopularGames(48)

  return (
    <div className="flex flex-col min-h-full">
      <SearchHeader query={query} count={games.length} />

      <Suspense fallback={<div className="flex-1" />}>
        <SearchResults
          games={games}
          query={query}
          categories={categories}
          initialCategory={searchParams.category}
          initialSort={searchParams.sort}
        />
      </Suspense>
    </div>
  )
}
