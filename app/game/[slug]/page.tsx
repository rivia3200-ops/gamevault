import type { Metadata } from 'next'
import { notFound }      from 'next/navigation'
import Link              from 'next/link'

import {
  getGameBySlug,
  getRelatedGames,
  getAllGames,
  getCategoryBySlug,
  formatPlayCount,
  formatRating,
  getStarRating,
} from '@/lib/games'
import GamePlayer from '@/components/game/GamePlayer'
import AdSlot     from '@/components/ui/AdSlot'

// ─── Static params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllGames().map((g) => ({ slug: g.slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const game = getGameBySlug(params.slug)
  if (!game) return { title: 'Game Not Found' }

  const title       = `Play ${game.title} — Free Online Game`
  const description = game.shortDescription || game.description

  return {
    title,
    description,
    keywords: [game.title, ...game.tags, game.category, 'free online game', 'browser game', 'html5 game'],
    openGraph: {
      title,
      description,
      type:       'website',
      images: [{ url: game.thumbnailUrl, width: 640, height: 480, alt: game.title }],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      [game.thumbnailUrl],
    },
    alternates: {
      canonical: `https://gamevault.io/game/${game.slug}`,
    },
  }
}

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

function JsonLd({ game }: { game: ReturnType<typeof getGameBySlug> }) {
  if (!game) return null

  const schema = {
    '@context':            'https://schema.org',
    '@type':               'VideoGame',
    name:                  game.title,
    description:           game.description,
    url:                   `https://gamevault.io/game/${game.slug}`,
    image:                 game.thumbnailUrl,
    genre:                 game.category,
    keywords:              game.tags.join(', '),
    applicationCategory:   'Game',
    operatingSystem:       'Any',
    offers: {
      '@type':      'Offer',
      price:        '0',
      priceCurrency:'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: game.ratingCount > 0
      ? {
          '@type':       'AggregateRating',
          ratingValue:   game.rating,
          ratingCount:   game.ratingCount,
          bestRating:    5,
          worstRating:   1,
        }
      : undefined,
    author: game.developer
      ? { '@type': 'Organization', name: game.developer }
      : undefined,
    datePublished: game.addedAt,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ─── Related Game Card (server) ───────────────────────────────────────────────

function RelatedCard({ game }: { game: NonNullable<ReturnType<typeof getGameBySlug>> }) {
  return (
    <Link
      href={`/game/${game.slug}`}
      className="group flex flex-col bg-surface rounded-xl border border-border/60 overflow-hidden hover:border-accent/40 hover:shadow-card transition-all duration-200"
    >
      <div className="relative aspect-game-card bg-gradient-to-br from-accent/10 to-surface-hover overflow-hidden">
        <img
          src={game.thumbnailUrl}
          alt={game.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {game.isHot && (
          <span className="absolute top-1.5 left-1.5 badge-hot text-[10px]">🔥 Hot</span>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-xs font-semibold text-secondary group-hover:text-primary transition-colors truncate">
          {game.title}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-warning text-[10px]">★</span>
          <span className="text-[10px] text-muted">{formatRating(game.rating)}</span>
          <span className="text-[10px] text-muted ml-auto">{formatPlayCount(game.plays)}</span>
        </div>
      </div>
    </Link>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GamePage({ params }: { params: { slug: string } }) {
  const game = getGameBySlug(params.slug)
  if (!game) notFound()

  const related  = getRelatedGames(game, 8)
  const category = getCategoryBySlug(game.category)
  const stars    = getStarRating(game.rating)

  return (
    <>
      <JsonLd game={game} />

      <div className="flex flex-col min-h-full">

        {/* ── Breadcrumb ───────────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="px-4 md:px-6 pt-4 pb-2">
          <ol className="flex items-center gap-1.5 text-xs text-muted flex-wrap">
            <li>
              <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            </li>
            <li aria-hidden className="text-muted/40">›</li>
            <li>
              <Link
                href={`/category/${game.category}`}
                className="hover:text-secondary transition-colors"
              >
                {category?.icon && <span aria-hidden className="mr-1">{category.icon}</span>}
                {category?.name ?? game.category.replace(/-/g, ' ')}
              </Link>
            </li>
            <li aria-hidden className="text-muted/40">›</li>
            <li className="text-secondary font-medium truncate max-w-[180px] sm:max-w-xs">
              {game.title}
            </li>
          </ol>
        </nav>

        {/* ── Main layout: 75% player / 25% sidebar ────────────────────── */}
        <div className="px-4 md:px-6 pb-8">
          <div className="flex flex-col xl:flex-row gap-6">

            {/* ── Left column (75%) ────────────────────────────────────── */}
            <div className="flex-1 min-w-0">

              {/* Game title + badges (above player) */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h1 className="font-display font-bold text-xl md:text-2xl text-primary leading-tight">
                    {game.title}
                  </h1>
                  {game.developer && (
                    <p className="text-xs text-muted mt-0.5">by {game.developer}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                  {game.isNew && (
                    <span className="badge-new hidden sm:inline-flex">New</span>
                  )}
                  {game.isHot && (
                    <span className="badge-hot hidden sm:inline-flex">🔥 Hot</span>
                  )}
                  <div className="flex items-center gap-1">
                    <span className="text-warning text-base leading-none">★</span>
                    <span className="font-semibold text-sm text-primary">{formatRating(game.rating)}</span>
                    <span className="text-xs text-muted">({game.ratingCount.toLocaleString()})</span>
                  </div>
                </div>
              </div>

              {/* GamePlayer (client component) */}
              <GamePlayer game={game} />

            </div>

            {/* ── Right column (25%) — sidebar ─────────────────────────── */}
            <div className="xl:w-[300px] flex-shrink-0 flex flex-col gap-6">

              {/* Ad */}
              <div className="hidden xl:block">
                <AdSlot format="skyscraper" />
              </div>

              {/* Game stats card */}
              <div className="bg-surface rounded-xl border border-border/60 p-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">
                  Game Info
                </h2>
                <dl className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <dt className="text-muted">Category</dt>
                    <dd>
                      <Link
                        href={`/category/${game.category}`}
                        className="text-accent hover:underline font-medium"
                      >
                        {category?.icon} {category?.name ?? game.category}
                      </Link>
                    </dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-muted">Plays</dt>
                    <dd className="text-primary font-semibold">{formatPlayCount(game.plays)}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-muted">Rating</dt>
                    <dd className="flex items-center gap-1.5">
                      <div className="flex gap-px">
                        {Array.from({ length: stars.full  }).map((_, i) => <span key={`f${i}`} className="text-warning text-xs">★</span>)}
                        {stars.half && <span className="text-warning/60 text-xs">★</span>}
                        {Array.from({ length: stars.empty }).map((_, i) => <span key={`e${i}`} className="text-muted text-xs">☆</span>)}
                      </div>
                      <span className="text-primary text-xs font-semibold">{formatRating(game.rating)}/5</span>
                    </dd>
                  </div>
                  {game.developer && (
                    <div className="flex justify-between text-sm">
                      <dt className="text-muted">Developer</dt>
                      <dd className="text-secondary">{game.developer}</dd>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <dt className="text-muted">Platform</dt>
                    <dd className="text-secondary">Browser (HTML5)</dd>
                  </div>
                  {game.controls?.touch && (
                    <div className="flex justify-between text-sm">
                      <dt className="text-muted">Mobile</dt>
                      <dd className="text-success text-xs font-medium">✓ Supported</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Tags */}
              {game.tags.length > 0 && (
                <div className="bg-surface rounded-xl border border-border/60 p-4">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-muted mb-3">
                    Tags
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {game.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/search?q=${encodeURIComponent(tag)}`}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface-hover border border-border/60 text-secondary hover:text-primary hover:border-accent/40 transition-all duration-150"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile ad */}
              <div className="xl:hidden flex justify-center">
                <AdSlot format="rectangle" />
              </div>
            </div>
          </div>

          {/* ── Related Games ───────────────────────────────────────────── */}
          {related.length > 0 && (
            <section className="mt-10" aria-labelledby="related-heading">
              <div className="flex items-center justify-between mb-4">
                <h2
                  id="related-heading"
                  className="font-display font-bold text-xl text-primary"
                >
                  You May Also Like
                </h2>
                <Link
                  href={`/category/${game.category}`}
                  className="text-sm text-accent hover:underline"
                >
                  More {category?.name ?? game.category} games →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-3">
                {related.map((g) => (
                  <RelatedCard key={g.id} game={g} />
                ))}
              </div>
            </section>
          )}

          {/* ── Bottom leaderboard ad ────────────────────────────────────── */}
          <div className="flex justify-center mt-10">
            <AdSlot format="leaderboard" />
          </div>
        </div>
      </div>
    </>
  )
}
