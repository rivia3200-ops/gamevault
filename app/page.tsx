import type { Metadata } from 'next'
import {
  getFeaturedGames,
  getHotGames,
  getNewGames,
  getAllCategories,
  getGamesByCategory,
  getAllGames,
} from '@/lib/games'
import GameRow        from '@/components/games/GameRow'
import GameGrid       from '@/components/games/GameGrid'
import CategoryTabs   from '@/components/games/CategoryTabs'
import SearchBar      from '@/components/ui/SearchBar'
import AdSlot         from '@/components/ui/AdSlot'

export const metadata: Metadata = {
  title: 'GameVault — Play Free Online Games',
  description:
    'Play 50+ free online HTML5 games instantly. Action, puzzle, racing, io games and more. No download, no login required.',
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gamevault.vercel.app'

function HomepageJsonLd({ gameCount }: { gameCount: number }) {
  const website = {
    '@context':      'https://schema.org',
    '@type':         'WebSite',
    name:            'GameVault',
    url:             siteUrl,
    description:     'Play free online HTML5 games instantly in your browser. No download, no login required.',
    potentialAction: {
      '@type':       'SearchAction',
      target:        { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }

  const organization = {
    '@context': 'https://schema.org',
    '@type':    'Organization',
    name:       'GameVault',
    url:        siteUrl,
    logo:       `${siteUrl}/android-chrome-192x192.png`,
    sameAs:     [],
    contactPoint: {
      '@type':             'ContactPoint',
      email:               'hello@gamevault.com',
      contactType:         'customer support',
      availableLanguage:   'English',
    },
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  )
}

const POPULAR_TAGS = [
  { label: '⚔️ Action',      q: 'action'      },
  { label: '🏎️ Racing',      q: 'racing'      },
  { label: '🧩 Puzzle',      q: 'puzzle'      },
  { label: '🌐 .io Games',   q: 'io'          },
  { label: '⚡ Hypercasual', q: 'hypercasual' },
  { label: '🔫 Shooting',    q: 'shooting'    },
]

export default function HomePage() {
  // ── Data (all synchronous, no await needed) ──────────────────────────────
  const featured   = getFeaturedGames(10)
  const hot        = getHotGames(12)
  const newGames   = getNewGames(12)
  const categories = getAllCategories()
  const action     = getGamesByCategory('action',    8)
  const puzzle     = getGamesByCategory('puzzle',    8)
  const racing     = getGamesByCategory('racing',    6)
  const ioGames    = getGamesByCategory('io-games',  6)
  const totalGames = getAllGames().length

  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c]))

  return (
    <>
      <HomepageJsonLd gameCount={totalGames} />
      {/* ══════════════════════════════════════════════════════
          SECTION 1 — HERO
         ══════════════════════════════════════════════════════ */}
      <section className="hero-bg relative overflow-hidden flex flex-col items-center justify-center text-center px-4 py-14 md:py-20 min-h-[300px]">
        {/* Subtle dot-grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(#6c63ff 1px, transparent 1px)',
            backgroundSize:  '32px 32px',
          }}
          aria-hidden
        />

        <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center gap-6">
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
            Play Free Online{' '}
            <span className="gradient-text">Games</span>
          </h1>
          <p className="text-secondary text-base sm:text-lg max-w-md">
            50+ games · No download · No login required
          </p>

          <SearchBar variant="hero" />

          {/* Popular tag chips */}
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_TAGS.map(({ label, q }) => (
              <a
                key={q}
                href={`/search?q=${encodeURIComponent(q)}`}
                className="px-4 py-1.5 rounded-full text-sm font-medium bg-white/10 text-white/80 border border-white/15 hover:bg-accent hover:border-accent hover:text-white transition-all duration-150"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 2 — CATEGORY TABS (sticky under navbar)
         ══════════════════════════════════════════════════════ */}
      <div className="sticky top-[64px] z-40 bg-background/95 backdrop-blur-sm border-b border-border/40">
        <CategoryTabs />
      </div>

      {/* ══════════════════════════════════════════════════════
          CONTENT SECTIONS
         ══════════════════════════════════════════════════════ */}
      <div className="py-8 space-y-12">

        {/* ── Featured Games (large horizontal scroll) ── */}
        <GameRow
          games={featured}
          title="⭐ Featured Games"
          showViewAll="/popular"
          cardSize="lg"
        />

        {/* ── Ad slot ── */}
        <div className="flex justify-center px-4 md:px-6">
          <AdSlot format="leaderboard" />
        </div>

        {/* ── New Games ── */}
        <GameGrid
          games={newGames}
          title="⚡ New Games"
          showViewAll="/new-games"
        />

        {/* ── Hot Right Now ── */}
        <GameGrid
          games={hot}
          title="🔥 Hot Right Now"
          showViewAll="/popular"
        />

        {/* ── Action Games ── */}
        {action.length > 0 && (
          <GameRow
            games={action}
            title={`${catMap['action']?.icon ?? '⚔️'} Action Games`}
            showViewAll="/category/action"
          />
        )}

        {/* ── Puzzle Games ── */}
        {puzzle.length > 0 && (
          <GameRow
            games={puzzle}
            title={`${catMap['puzzle']?.icon ?? '🧩'} Puzzle Games`}
            showViewAll="/category/puzzle"
          />
        )}

        {/* ── Ad slot (between category rows) ── */}
        <div className="flex justify-center px-4 md:px-6">
          <AdSlot format="leaderboard" />
        </div>

        {/* ── Racing Games ── */}
        {racing.length > 0 && (
          <GameRow
            games={racing}
            title={`${catMap['racing']?.icon ?? '🏎️'} Racing Games`}
            showViewAll="/category/racing"
          />
        )}

        {/* ── IO Games ── */}
        {ioGames.length > 0 && (
          <GameRow
            games={ioGames}
            title={`${catMap['io-games']?.icon ?? '🌐'} IO Games`}
            showViewAll="/category/io-games"
          />
        )}

        {/* ══════════════════════════════════════════════════════
            SECTION 8 — STATS BAR
           ══════════════════════════════════════════════════════ */}
        <section
          className="mx-4 md:mx-6 rounded-2xl border border-border/60 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #13131a 0%, #1a1030 100%)' }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-20 px-8 py-10">
            {[
              { icon: '🎮', stat: '50+',       sub: 'Free Games'        },
              { icon: '🌐', stat: 'Instant',   sub: 'No Download'       },
              { icon: '🆓', stat: 'Always',    sub: 'Free to Play'      },
            ].map(({ icon, stat, sub }) => (
              <div key={stat + sub} className="flex flex-col items-center gap-1 text-center">
                <span className="text-4xl mb-1 select-none" aria-hidden>{icon}</span>
                <span className="font-display font-bold text-2xl text-primary">{stat}</span>
                <span className="text-sm text-muted">{sub}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  )
}
