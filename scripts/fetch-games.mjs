import { writeFileSync, readFileSync } from 'fs'

const CATEGORY_MAP = {
  action:      'action',
  puzzle:      'puzzle',
  racing:      'racing',
  shooting:    'shooting',
  sports:      'sports',
  io:          'io-games',
  hypercasual: 'hypercasual',
  multiplayer: '2-player',
}

const CATEGORIES = Object.keys(CATEGORY_MAP)

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function slug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ── Fetch a single category page ─────────────────────────────────────────────

async function fetchCategory(category, pageSize = 20) {
  const url = `https://api.gamepix.com/games?order=plays&pageSize=${pageSize}&category=${category}`
  console.log(`  GET ${url}`)
  const res  = await fetch(url, { headers: { 'Accept': 'application/json' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const body = await res.json()
  // API may wrap in { data: [...] } or return array directly
  return Array.isArray(body) ? body : (body.data ?? body.games ?? [])
}

// ── Map a raw GamePix game object → our schema ────────────────────────────────

function mapGame(raw, category, index, usedSlugs) {
  const gameSlug = raw.id ?? slug(raw.title ?? `game-${Date.now()}`)

  // Avoid duplicates in slug set (caller dedupes by slug anyway, but track here)
  usedSlugs.add(gameSlug)

  const internalCategory = CATEGORY_MAP[category] ?? category

  // sdk_url is the canonical embed URL from GamePix
  const embedUrl =
    raw.sdk_url ??
    raw.sdkUrl  ??
    `https://html5.gamepix.com/games/${gameSlug}/`

  // Thumbnail: prefer icon, fall back to cover/banner
  const thumbnailUrl =
    raw.thumbnail ??
    raw.icon      ??
    raw.cover     ??
    `https://img.gamepix.com/games/${gameSlug}/icon/${gameSlug}.png`

  const bannerUrl =
    raw.banner ??
    raw.cover  ??
    raw.thumbnail ??
    `https://img.gamepix.com/games/${gameSlug}/cover/${gameSlug}.jpg`

  const rating = typeof raw.rating === 'number'
    ? Math.min(5, Math.max(1, raw.rating))
    : parseFloat((4 + Math.random()).toFixed(1))

  const plays = typeof raw.plays === 'number' && raw.plays > 0
    ? raw.plays
    : Math.floor(Math.random() * 900000) + 100000

  const ratingCount = typeof raw.votes === 'number' && raw.votes > 0
    ? raw.votes
    : Math.floor(plays / 100)

  // Random addedAt within last 90 days, earlier for index > 3
  const daysAgo = index < 3
    ? Math.floor(Math.random() * 14)
    : Math.floor(Math.random() * 90)
  const addedAt = new Date(Date.now() - daysAgo * 86400000)
    .toISOString()
    .split('T')[0]

  const tags = Array.isArray(raw.tags) && raw.tags.length > 0
    ? raw.tags
    : [category, internalCategory].filter((t, i, a) => a.indexOf(t) === i)

  return {
    id:               `${internalCategory}-${String(index + 1).padStart(2, '0')}`,
    title:            raw.title ?? gameSlug,
    slug:             gameSlug,
    description:      raw.description ?? `Play ${raw.title ?? gameSlug} free online in your browser. No download required.`,
    shortDescription: (raw.description ?? '').slice(0, 100) || `Play ${raw.title ?? gameSlug} free online.`,
    category:         internalCategory,
    tags,
    thumbnailUrl,
    bannerUrl,
    embedUrl,
    embedType:        'iframe',
    width:            raw.width  ?? 960,
    height:           raw.height ?? 540,
    developer:        raw.developer ?? raw.company ?? 'GamePix',
    plays,
    rating,
    ratingCount,
    featured:         index < 2,
    isNew:            daysAgo < 7,
    isHot:            index < 4,
    addedAt,
    instructions:     raw.instructions ?? `Play ${raw.title ?? gameSlug} directly in your browser. No download needed.`,
    controls: raw.controls ?? {
      keyboard: 'Use keyboard controls',
      mouse:    'Use mouse to interact',
      touch:    'Touch controls supported on mobile',
    },
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const allGames  = []
  const usedSlugs = new Set()

  for (const category of CATEGORIES) {
    console.log(`\nFetching category: ${category}`)
    try {
      const raw = await fetchCategory(category, 20)
      if (!raw.length) {
        console.warn(`  ⚠ No games returned for ${category}`)
      } else {
        const mapped = raw
          .slice(0, 10)
          .map((g, i) => mapGame(g, category, i, usedSlugs))
        allGames.push(...mapped)
        console.log(`  ✓ ${mapped.length} games`)
        mapped.slice(0, 3).forEach((g) => console.log(`    • ${g.title} → ${g.embedUrl}`))
      }
    } catch (err) {
      console.error(`  ✗ ${category}: ${err.message}`)
    }
    await sleep(500)
  }

  // Deduplicate by slug (keep first occurrence)
  const seen   = new Set()
  const unique = allGames.filter((g) => {
    if (seen.has(g.slug)) return false
    seen.add(g.slug)
    return true
  })

  // Re-number IDs per category so they are stable
  const byCat = {}
  unique.forEach((g) => {
    byCat[g.category] = byCat[g.category] ?? []
    byCat[g.category].push(g)
  })
  Object.entries(byCat).forEach(([cat, games]) => {
    games.forEach((g, i) => { g.id = `${cat}-${String(i + 1).padStart(2, '0')}` })
  })

  console.log(`\n✓ Total unique games: ${unique.length}`)

  // ── Update categories.json game counts ──────────────────────────────────────
  try {
    const catPath = './data/categories.json'
    const cats    = JSON.parse(readFileSync(catPath, 'utf8'))
    cats.forEach((c) => {
      c.gameCount = unique.filter((g) => g.category === c.slug).length
    })
    writeFileSync(catPath, JSON.stringify(cats, null, 2))
    console.log('✓ Updated data/categories.json game counts')
  } catch (e) {
    console.warn('⚠ Could not update categories.json:', e.message)
  }

  writeFileSync('./data/games.json', JSON.stringify(unique, null, 2))
  console.log('✓ Saved data/games.json')

  console.log('\nSample embed URLs:')
  unique.slice(0, 8).forEach((g) => console.log(`  ${g.title.padEnd(35)} ${g.embedUrl}`))

  // Warn about any games that still have the old URL pattern
  const bad = unique.filter((g) => g.embedUrl.includes('games.gamepix.com'))
  if (bad.length) {
    console.warn(`\n⚠ ${bad.length} games still use the old games.gamepix.com URL:`)
    bad.forEach((g) => console.warn(`  ${g.title}: ${g.embedUrl}`))
  } else {
    console.log('\n✓ All embed URLs use the correct html5.gamepix.com format')
  }
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
