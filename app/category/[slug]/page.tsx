import type { Metadata } from 'next'
import { notFound }      from 'next/navigation'
import Link              from 'next/link'
import { Suspense }      from 'react'
import {
  getCategoryBySlug,
  getGamesByCategory,
  getAllCategories,
} from '@/lib/games'
import CategoryGames from '@/components/games/CategoryGames'
import type { SortOption } from '@/components/games/SortBar'

// ─── Static params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ slug: c.slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug)
  if (!category) return { title: 'Category Not Found' }
  return {
    title:       `Free ${category.name} Games — Play Online | GameVault`,
    description: `Play the best free ${category.name.toLowerCase()} games online. ${category.description} No download required.`,
    openGraph: {
      title:       `Free ${category.name} Games Online`,
      description: category.description,
    },
    alternates: { canonical: `https://gamevault.io/category/${category.slug}` },
  }
}

// ─── Category Header ──────────────────────────────────────────────────────────

function CategoryHeader({
  category,
  gameCount,
}: {
  category: ReturnType<typeof getCategoryBySlug> & {}
  gameCount: number
}) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ minHeight: 200 }}
    >
      {/* Gradient banner background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${category.color}33 0%, ${category.color}11 50%, transparent 100%)`,
        }}
        aria-hidden
      />
      {/* Subtle dot overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${category.color} 1px, transparent 1px)`,
          backgroundSize:  '28px 28px',
        }}
        aria-hidden
      />

      <div className="relative px-4 md:px-6 py-8 flex items-center justify-between gap-6">
        {/* Left */}
        <div className="flex flex-col gap-2">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-xs text-muted mb-3">
              <li><Link href="/" className="hover:text-secondary transition-colors">Home</Link></li>
              <li aria-hidden className="text-muted/40">›</li>
              <li className="text-secondary">{category.name}</li>
            </ol>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-[56px] leading-none select-none" aria-hidden>
              {category.icon}
            </span>
            <div>
              <h1 className="font-display font-black text-4xl text-white leading-tight">
                {category.name} Games
              </h1>
              <p className="text-secondary text-sm mt-1 max-w-lg">{category.description}</p>
            </div>
          </div>
        </div>

        {/* Right — big faint number */}
        <div className="hidden md:flex flex-col items-end flex-shrink-0 select-none" aria-hidden>
          <span
            className="font-display font-black leading-none opacity-10"
            style={{ fontSize: 100, color: category.color }}
          >
            {gameCount}
          </span>
          <span className="text-xs text-muted -mt-2">games available</span>
        </div>
      </div>
    </div>
  )
}

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gamevault.vercel.app'

function CategoryJsonLd({
  category,
  games,
}: {
  category: NonNullable<ReturnType<typeof getCategoryBySlug>>
  games:    ReturnType<typeof getGamesByCategory>
}) {
  const itemList = {
    '@context':     'https://schema.org',
    '@type':        'ItemList',
    name:           `Free ${category.name} Games`,
    description:    category.description,
    url:            `${siteUrl}/category/${category.slug}`,
    numberOfItems:  games.length,
    itemListElement: games.slice(0, 20).map((game, i) => ({
      '@type':    'ListItem',
      position:   i + 1,
      url:        `${siteUrl}/game/${game.slug}`,
      name:       game.title,
      image:      game.thumbnailUrl,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
    />
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CategoryPage({
  params,
  searchParams,
}: {
  params:       { slug: string }
  searchParams: { sort?: string; tag?: string }
}) {
  const category = getCategoryBySlug(params.slug)
  if (!category) notFound()

  const games       = getGamesByCategory(params.slug)
  const initialSort = (searchParams.sort as SortOption | undefined) ?? 'popular'
  const initialTag  = searchParams.tag ?? null

  return (
    <div className="flex flex-col min-h-full">
      <CategoryJsonLd category={category} games={games} />
      <CategoryHeader category={category} gameCount={games.length} />

      <Suspense fallback={<div className="flex-1" />}>
        <CategoryGames
          games={games}
          category={category}
          initialSort={initialSort}
          initialTag={initialTag}
        />
      </Suspense>
    </div>
  )
}
