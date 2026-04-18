import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gamesPath = path.join(__dirname, '../data/games.json');

const games = JSON.parse(readFileSync(gamesPath, 'utf-8'));

const THUM = 'https://image.thum.io/get/width/800/height/450/crop/450';

// High-quality banners for featured games specifically
const FEATURED_BANNERS = {
  'minecraft-classic':      `${THUM}/https://classic.minecraft.net`,
  'slither-io':             `${THUM}/https://slither.io`,
  'cookie-clicker':         'https://cdn.cloudflare.steamstatic.com/steam/apps/1454400/capsule_616x353.jpg',
  'krunker-io':             `${THUM}/https://krunker.io`,
  'among-us-online':        `${THUM}/https://www.crazygames.com/game/among-us-online-edition`,
  'friday-night-funkin':    `${THUM}/https://www.crazygames.com/game/friday-night-funkin`,
  'smash-karts':            `${THUM}/https://www.crazygames.com/game/smash-karts`,
  'fireboy-and-watergirl':  `${THUM}/https://www.crazygames.com/game/fireboy-and-watergirl-in-the-forest-temple`,
  'retro-bowl':             `${THUM}/https://retrobowl.me`,
  'moto-x3m':               `${THUM}/https://www.crazygames.com/game/moto-x3m`,
  'bloons-tower-defense-5': 'https://cdn.cloudflare.steamstatic.com/steam/apps/306020/capsule_616x353.jpg',
  'super-smash-flash-2':    `${THUM}/https://www.crazygames.com/game/super-smash-flash-2`,
  'wordle':                 `${THUM}/https://wordplay.com`,
  '2048':                   `${THUM}/https://gabrielecirulli.github.io/2048/`,
  'subway-surfers':         `${THUM}/https://www.crazygames.com/game/subway-surfers`,
  'temple-run-2':           `${THUM}/https://www.crazygames.com/game/temple-run-2`,
  'geometry-dash-lite':     'https://cdn.cloudflare.steamstatic.com/steam/apps/322170/capsule_616x353.jpg',
  'agar-io':                `${THUM}/https://agar.io`,
  'paper-io-2':             `${THUM}/https://paper-io.com`,
  'shell-shockers':         `${THUM}/https://shellshock.io`,
  'skribbl-io':             `${THUM}/https://skribbl.io`,
  'gartic-phone':           `${THUM}/https://garticphone.com`,
};

const updated = games.map(game => ({
  ...game,
  bannerUrl: FEATURED_BANNERS[game.slug] ?? game.bannerUrl,
}));

writeFileSync(gamesPath, JSON.stringify(updated, null, 2));

const overridden = updated.filter(g => FEATURED_BANNERS[g.slug]).length;
console.log(`✓ Updated ${overridden} featured banners`);
updated
  .filter(g => FEATURED_BANNERS[g.slug])
  .forEach(g => console.log(`  ${g.title}`));
