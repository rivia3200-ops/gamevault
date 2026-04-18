import { readFileSync, writeFileSync } from 'fs';

const games = JSON.parse(readFileSync('./data/games.json', 'utf-8'));

const BROKEN_DOMAINS = [
  'crazygames.com',
  'games.gamepix.com',
  'html5.gamepix.com',
  'thum.io',
];

const ALLOWED_NON_GAMEPIX = [
  'gabrielecirulli.github.io',
  'slither.io',
  'krunker.io',
  'shellshock.io',
  'orteil.dashnet.org',
  'classic.minecraft.net',
  'skribbl.io',
  'garticphone.com',
  'diep.io',
  'wormate.io',
  'surviv.io',
  'zombsroyale.io',
  'territorial.io',
  'slope-game.github.io',
  'playsnake.org',
  'chromedino.com',
  'flappybird.io',
  'minesweeper.online',
  'retrobowl.me',
  'driftboss.io',
  'drifthunters.io',
];

const clean = games.filter(game => {
  const url = game.embedUrl || '';
  if (url.includes('play.gamepix.com')) return true;
  if (ALLOWED_NON_GAMEPIX.some(d => url.includes(d))) return true;
  if (BROKEN_DOMAINS.some(d => url.includes(d))) {
    console.log(`REMOVING: ${game.title} (${url})`);
    return false;
  }
  if (url.includes('placehold.co')) {
    console.log(`REMOVING placeholder embed: ${game.title}`);
    return false;
  }
  return true;
});

console.log(`\nBefore: ${games.length} games`);
console.log(`After:  ${clean.length} games`);
console.log(`Removed: ${games.length - clean.length} broken games`);

const cats = {};
clean.forEach(g => { cats[g.category] = (cats[g.category] || 0) + 1; });
console.log('\nFinal category counts:');
Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([c, n]) =>
  console.log(`  ${c}: ${n}`)
);

writeFileSync('./data/games.json', JSON.stringify(clean, null, 2));
console.log('\n✓ Saved clean games.json');
