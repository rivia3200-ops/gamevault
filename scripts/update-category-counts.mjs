import { readFileSync, writeFileSync } from 'fs';

const games      = JSON.parse(readFileSync('./data/games.json', 'utf-8'));
const categories = JSON.parse(readFileSync('./data/categories.json', 'utf-8'));

const counts = {};
games.forEach(g => { counts[g.category] = (counts[g.category] || 0) + 1; });

const updated = categories.map(cat => ({ ...cat, gameCount: counts[cat.slug] || 0 }));

updated.forEach(cat => console.log(`${cat.name}: ${cat.gameCount} games`));

writeFileSync('./data/categories.json', JSON.stringify(updated, null, 2));
console.log('\n✓ Updated categories.json with real game counts');
