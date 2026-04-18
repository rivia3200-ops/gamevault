import { writeFileSync } from 'fs';

const SID      = '2476U';
const BASE_URL = `https://feeds.gamepix.com/v2/json?sid=${SID}&pagination=96`;

const CATEGORY_MAP = {
  'action':      'action',
  'adventure':   'action',
  'arcade':      'action',
  'boys':        'action',
  'girls':       'hypercasual',
  'kids':        'hypercasual',
  'racing':      'racing',
  'sports':      'sports',
  'puzzle':      'puzzle',
  'shooting':    'shooting',
  'multiplayer': 'io-games',
  'io':          'io-games',
  'casual':      'hypercasual',
  'hypercasual': 'hypercasual',
  'clicker':     'hypercasual',
  'skill':       'action',
  'strategy':    'puzzle',
  'board':       'puzzle',
  'card':        'puzzle',
  'music':       'hypercasual',
  'dress-up':    'hypercasual',
  'cooking':     'hypercasual',
  'simulation':  'hypercasual',
};

function mapCategory(gpCategory) {
  if (!gpCategory) return 'action';
  const lower = gpCategory.toLowerCase();
  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(key)) return val;
  }
  return 'action';
}

function makeSlug(namespace, id) {
  return (namespace || String(id))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function formatPlays(qualityScore, publishedDate) {
  const age        = Date.now() - new Date(publishedDate).getTime();
  const ageMonths  = age / (1000 * 60 * 60 * 24 * 30);
  const base       = Math.floor((qualityScore || 0.5) * 5000000);
  const ageFactor  = Math.min(ageMonths * 50000, 3000000);
  return Math.floor(base + ageFactor);
}

async function fetchAllGames() {
  const allGames = [];
  let page = 1;

  console.log('Fetching games from GamePix API...\n');

  while (page <= 10) {
    const url = `${BASE_URL}&page=${page}`;
    console.log(`  Page ${page}: ${url}`);

    try {
      const res = await fetch(url);
      if (!res.ok) { console.error(`  HTTP ${res.status}`); break; }

      const data = await res.json();

      if (!data.items || data.items.length === 0) {
        console.log(`  No items on page ${page} — stopping.`);
        break;
      }

      console.log(`  Got ${data.items.length} games`);
      allGames.push(...data.items);

      if (!data.next_url || data.items.length < 96) break;
      page++;
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.error(`  Error: ${err.message}`);
      break;
    }
  }

  return allGames;
}

function transformGame(gpGame, index) {
  const slug     = makeSlug(gpGame.namespace, gpGame.id);
  const category = mapCategory(gpGame.category);
  const plays    = formatPlays(gpGame.quality_score, gpGame.date_published);
  const rating   = Math.round((3.5 + (gpGame.quality_score || 0.5) * 1.5) * 10) / 10;

  return {
    id:               `gp_${gpGame.id}`,
    title:            gpGame.title || 'Unknown Game',
    slug,
    description:      gpGame.description || `Play ${gpGame.title} free online in your browser.`,
    shortDescription: (gpGame.description || `Play ${gpGame.title} free online.`).slice(0, 100),
    category,
    tags: [
      gpGame.category?.toLowerCase() || 'game',
      category,
      gpGame.orientation === 'portrait' ? 'mobile-style' : 'desktop',
    ].filter(Boolean),
    thumbnailUrl: gpGame.image        || `https://placehold.co/270x180/1a1040/6c63ff?text=${encodeURIComponent(gpGame.title || 'Game')}`,
    bannerUrl:    gpGame.banner_image || gpGame.image || `https://placehold.co/800x450/1a1040/6c63ff?text=${encodeURIComponent(gpGame.title || 'Game')}`,
    embedUrl:     gpGame.url,
    embedType:    'iframe',
    width:        gpGame.width  || 960,
    height:       gpGame.height || 540,
    developer:    'GamePix',
    plays,
    rating,
    ratingCount:  Math.floor(plays / 100),
    featured:     index < 12 && (gpGame.quality_score || 0) > 0.7,
    isNew:        new Date(gpGame.date_published) > new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    isHot:        (gpGame.quality_score || 0) > 0.8,
    addedAt:      gpGame.date_published
                    ? new Date(gpGame.date_published).toISOString().split('T')[0]
                    : '2024-01-01',
    instructions: `Play ${gpGame.title} directly in your browser. No download or login required.`,
    controls: {
      keyboard: gpGame.orientation === 'portrait' ? 'Touch controls optimized' : 'Keyboard and mouse controls',
      mouse:    'Mouse or touch controls supported',
      touch:    'Touch controls supported on mobile',
    },
  };
}

async function main() {
  const rawGames = await fetchAllGames();
  console.log(`\nTotal raw games fetched: ${rawGames.length}`);

  if (rawGames.length === 0) {
    console.error('No games fetched! Check SID and internet connection.');
    process.exit(1);
  }

  // Print sample raw game so we can verify field names
  console.log('\nSample raw game (first item):');
  console.log(JSON.stringify(rawGames[0], null, 2));

  const qualityGames = rawGames.filter(g => (g.quality_score || 0) >= 0.3);
  console.log(`\nAfter quality filter (>=0.3): ${qualityGames.length}`);

  qualityGames.sort((a, b) => (b.quality_score || 0) - (a.quality_score || 0));

  const games  = qualityGames.map((g, i) => transformGame(g, i));
  const seen   = new Set();
  const unique = games.filter(g => {
    if (seen.has(g.slug)) return false;
    seen.add(g.slug);
    return true;
  });

  console.log(`Final unique game count: ${unique.length}`);
  writeFileSync('./data/games.json', JSON.stringify(unique, null, 2));
  console.log('✓ Saved to data/games.json');

  // Category breakdown
  const catCounts = {};
  unique.forEach(g => { catCounts[g.category] = (catCounts[g.category] || 0) + 1; });
  console.log('\nGames per category:');
  Object.entries(catCounts).sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => console.log(`  ${cat}: ${count}`));

  // Sample embed URLs
  console.log('\nFirst 5 embed URLs:');
  unique.slice(0, 5).forEach(g => console.log(`  [${g.title}] ${g.embedUrl}`));
}

main();
