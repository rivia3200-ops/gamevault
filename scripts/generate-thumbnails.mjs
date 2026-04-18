import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gamesPath = path.join(__dirname, '../data/games.json');

const games = JSON.parse(readFileSync(gamesPath, 'utf-8'));

const THUM_THUMB  = 'https://image.thum.io/get/width/540/height/360/crop/360';
const THUM_BANNER = 'https://image.thum.io/get/width/800/height/450/crop/450';

// ── Manual overrides — Wikipedia / official art ──────────────────────────────
const MANUAL_THUMBNAILS = {
  'minecraft-classic':     'https://upload.wikimedia.org/wikipedia/en/b/b2/Minecraft_Classic_screenshot.png',
  'subway-surfers':        'https://upload.wikimedia.org/wikipedia/en/4/43/Subway_Surfers_promotional_art.png',
  'temple-run-2':          'https://upload.wikimedia.org/wikipedia/en/a/a8/Temple_Run_2_logo.png',
  'flappy-bird':           'https://upload.wikimedia.org/wikipedia/en/5/52/Flappy_Bird_gameplay.png',
  'dino-game':             'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_Chrome_Dinosaur_Game_Screenshot.png/320px-Google_Chrome_Dinosaur_Game_Screenshot.png',
  'among-us-online':       'https://upload.wikimedia.org/wikipedia/en/9/9a/Among_Us_cover_art.jpg',
  'friday-night-funkin':   'https://upload.wikimedia.org/wikipedia/en/f/f3/Friday_Night_Funkin%27_Logo.png',
  'candy-crush-saga':      'https://upload.wikimedia.org/wikipedia/en/1/1e/Candy_Crush_saga_game_logo.png',
  'tetris':                'https://upload.wikimedia.org/wikipedia/en/7/7c/Tetris_Neo.png',
  'pac-man':               'https://upload.wikimedia.org/wikipedia/en/5/59/Pac-man.png',
  'wordle':                'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Wordle_196_example.svg/300px-Wordle_196_example.svg.png',
  'connections':           'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Connections_%28NYT%29_logo.png/250px-Connections_%28NYT%29_logo.png',
  'roblox':                'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Roblox_player_icon_black.svg/240px-Roblox_player_icon_black.svg.png',
};

// ── Steam CDN headers (460×215) ───────────────────────────────────────────────
const STEAM_IDS = {
  'geometry-dash-lite':        '322170',
  'cookie-clicker':            '1454400',
  'bloons-tower-defense-5':    '306020',
  'age-of-war':                '1017090',
  'super-mario-bros':          '1147890',
};

// ── Games where thum.io won't get a good shot (login walls, loading screens) ─
const SKIP_THUMIO = new Set([
  'roblox', 'minecraft-classic', 'subway-surfers', 'temple-run-2',
  'flappy-bird', 'dino-game', 'among-us-online', 'friday-night-funkin',
  'candy-crush-saga', 'tetris', 'pac-man', 'wordle', 'connections',
]);

function getThumbnail(game) {
  if (MANUAL_THUMBNAILS[game.slug]) return MANUAL_THUMBNAILS[game.slug];
  if (STEAM_IDS[game.slug])
    return `https://cdn.cloudflare.steamstatic.com/steam/apps/${STEAM_IDS[game.slug]}/header.jpg`;
  return `${THUM_THUMB}/${game.embedUrl}`;
}

function getBanner(game) {
  if (MANUAL_THUMBNAILS[game.slug]) return MANUAL_THUMBNAILS[game.slug];
  if (STEAM_IDS[game.slug])
    return `https://cdn.cloudflare.steamstatic.com/steam/apps/${STEAM_IDS[game.slug]}/capsule_616x353.jpg`;
  return `${THUM_BANNER}/${game.embedUrl}`;
}

const updated = games.map(game => ({
  ...game,
  thumbnailUrl: getThumbnail(game),
  bannerUrl:    getBanner(game),
}));

writeFileSync(gamesPath, JSON.stringify(updated, null, 2));

const thumioCount  = updated.filter(g => g.thumbnailUrl.includes('thum.io')).length;
const steamCount   = updated.filter(g => g.thumbnailUrl.includes('steamstatic')).length;
const manualCount  = updated.filter(g => g.thumbnailUrl.includes('wikimedia') || g.thumbnailUrl.includes('wikipedia')).length;

console.log(`✓ Updated thumbnails for ${updated.length} games`);
console.log(`  thum.io screenshots : ${thumioCount}`);
console.log(`  Steam CDN           : ${steamCount}`);
console.log(`  Wikipedia/manual    : ${manualCount}`);
console.log('\nSample (first 10):');
updated.slice(0, 10).forEach(g => {
  const src = g.thumbnailUrl.includes('thum.io') ? 'thum.io'
            : g.thumbnailUrl.includes('steamstatic') ? 'Steam'
            : g.thumbnailUrl.includes('wikimedia') ? 'Wikipedia'
            : 'other';
  console.log(`  [${src.padEnd(9)}] ${g.title}`);
});
