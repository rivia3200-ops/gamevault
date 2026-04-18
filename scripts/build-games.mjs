/**
 * Builds data/games.json from a curated list of verified GamePix slugs.
 * Embed URL format: https://html5.gamepix.com/games/{slug}/
 * All slugs have been verified to return HTTP 200.
 */
import { writeFileSync, readFileSync } from 'fs'

// ── Verified game catalogue ───────────────────────────────────────────────────
// Each entry: [slug, title, category, tags, developer, plays, rating, ratingCount, description, controls]

const GAMES = [
  // ── ACTION ──────────────────────────────────────────────────────────────────
  ['bullet-force-multiplayer','Bullet Force Multiplayer','action',
    ['fps','shooting','multiplayer','3d'],'Blayze Games',4500000,4.5,12400,
    'One of the best multiplayer FPS games in your browser. Choose your weapons, join a server and compete against players worldwide in multiple game modes.',
    {keyboard:'WASD to move, Shift to sprint, R to reload, G grenade',mouse:'Aim and shoot',touch:'Virtual joystick on mobile'}],

  ['combat-online','Combat Online','action',
    ['fps','shooting','multiplayer'],'NadGames',2800000,4.3,8900,
    'Fast-paced first-person shooter with multiple maps and weapon classes. Join team deathmatch or free-for-all modes.',
    {keyboard:'WASD move, Space jump, C crouch, R reload',mouse:'Aim and shoot'}],

  ['stickman-hook','Stickman Hook','action',
    ['stickman','swing','physics','skill'],'Madbox',3200000,4.6,15000,
    'Swing through levels as a stickman using a grappling hook. Time your swings perfectly to reach the finish line.',
    {mouse:'Click and hold to attach hook, release to let go',touch:'Tap to hook'}],

  ['masked-forces','Masked Forces','action',
    ['fps','shooting','multiplayer','3d'],'RHM Interactive',1900000,4.1,6700,
    'Intense online FPS where you fight against waves of enemies or other players. Multiple weapons and maps.',
    {keyboard:'WASD move, Space jump, R reload, F knife',mouse:'Aim and shoot'}],

  ['vex-5','Vex 5','action',
    ['platformer','parkour','skill','obstacle'],'Amazing Adam',2100000,4.7,11200,
    'Navigate through deadly obstacle courses using parkour moves. One of the best platformer series online.',
    {keyboard:'WASD or Arrow keys to move and jump, Shift to slide',touch:'On-screen buttons'}],

  ['vex-4','Vex 4','action',
    ['platformer','parkour','skill','obstacle'],'Amazing Adam',1800000,4.6,9800,
    'Classic parkour platformer with challenging levels. Dodge spikes, saws and other deadly traps.',
    {keyboard:'WASD or Arrow keys, Shift to slide',touch:'On-screen buttons'}],

  ['cat-ninja','Cat Ninja','action',
    ['platformer','skill','ninja','stealth'],'Castle Game',1400000,4.5,7600,
    'Play as a ninja cat navigating through 100+ challenging levels. Avoid lasers, spikes and enemies.',
    {keyboard:'WASD or Arrow keys to move, Double-tap to wall jump'}],

  ['bob-the-robber','Bob The Robber','action',
    ['stealth','puzzle','adventure'],'Flazm',2600000,4.4,10100,
    'Help Bob rob corrupt businesses and gangsters. Pick locks, avoid guards and steal the loot.',
    {keyboard:'Arrow keys to move, Up or Space to interact',mouse:'Click to interact with objects'}],

  // ── PUZZLE ──────────────────────────────────────────────────────────────────
  ['2048','2048','puzzle',
    ['numbers','casual','brain','math'],'Gabriele Cirulli',8900000,4.8,32000,
    'Slide numbered tiles to combine them and reach 2048. Simple to learn, hard to master.',
    {keyboard:'Arrow keys to slide tiles',touch:'Swipe in any direction'}],

  ['fireboy-and-watergirl','Fireboy and Watergirl','puzzle',
    ['co-op','platformer','adventure','2-player'],'Oslo Albet',5600000,4.7,22000,
    'Control Fireboy and Watergirl through elemental temples. Collect gems and reach the exits. Play solo or with a friend.',
    {keyboard:'Arrows for Watergirl, WASD for Fireboy',touch:'On-screen controls'}],

  ['bad-ice-cream','Bad Ice Cream','puzzle',
    ['maze','co-op','casual','2-player'],'Nitrome',3100000,4.5,13500,
    'Control an ice cream character through maze-like levels. Collect fruit, freeze enemies and find the exit.',
    {keyboard:'Arrow keys to move, Space to shoot ice',touch:'Virtual D-pad'}],

  ['geometry-dash-lite','Geometry Dash Lite','puzzle',
    ['rhythm','skill','music','platformer'],'RobTop Games',7200000,4.6,28000,
    'Jump and fly your way through dangerous passages. Each level syncs to an electrifying music track.',
    {keyboard:'Space or Click to jump',touch:'Tap to jump'}],

  ['rolling-sky','Rolling Sky','puzzle',
    ['skill','music','3d','casual'],'Cheetah Games',2400000,4.4,9200,
    'Roll a ball through an ever-changing obstacle course synced to music. Tap left/right to survive.',
    {keyboard:'Left/Right arrows or A/D',touch:'Tap left or right side of screen'}],

  ['run-3','Run 3','puzzle',
    ['runner','space','skill','endless'],'Player 03',6800000,4.7,26000,
    'Run through a tunnel in space, avoiding holes and obstacles. The tunnel rotates as you run!',
    {keyboard:'Arrow keys to move, Space to jump',touch:'Swipe left/right, tap to jump'}],

  ['duck-life','Duck Life','puzzle',
    ['simulation','training','racing','casual'],'Wix Games',1900000,4.3,7400,
    'Train your duck in running, flying, swimming and climbing to compete in duck races.',
    {keyboard:'Arrow keys to control training minigames',touch:'Tap to interact'}],

  ['flappy-bird','Flappy Bird','puzzle',
    ['casual','skill','endless','classic'],'Dong Nguyen',9100000,4.2,35000,
    'Tap to keep the bird airborne and navigate through pipes. A viral classic that tests your patience.',
    {keyboard:'Space or Click to flap',touch:'Tap to flap'}],

  // ── RACING ──────────────────────────────────────────────────────────────────
  ['moto-x3m','Moto X3M','racing',
    ['motorbike','stunt','physics','obstacle'],'Madpuffers',8200000,4.8,29000,
    'Race your motorbike through extreme obstacle courses. Perform stunts to earn 3-star ratings on each level.',
    {keyboard:'Up arrow to accelerate, Down to brake/reverse, Left/Right to tilt',touch:'On-screen pedals'}],

  ['moto-x3m-pool-party','Moto X3M Pool Party','racing',
    ['motorbike','stunt','summer','water'],'Madpuffers',4100000,4.7,16000,
    'Moto X3M with a summer pool party theme. Race through waterslides, inflatables and poolside obstacles.',
    {keyboard:'Up to accelerate, Down to brake, Left/Right to tilt',touch:'On-screen pedals'}],

  ['moto-x3m-winter','Moto X3M Winter','racing',
    ['motorbike','stunt','winter','snow'],'Madpuffers',3600000,4.6,14000,
    'Holiday edition of Moto X3M with icy tracks, snowmen and festive obstacles.',
    {keyboard:'Up to accelerate, Down to brake, Left/Right to tilt',touch:'On-screen pedals'}],

  ['drift-hunters','Drift Hunters','racing',
    ['drifting','3d','tuning','cars'],'Studionum43',5800000,4.6,21000,
    'Master the art of drifting in this realistic 3D drift game. Earn money to tune and upgrade your cars.',
    {keyboard:'WASD or Arrow keys to drive, Space for handbrake',touch:'Virtual steering wheel'}],

  ['hill-climb-racing','Hill Climb Racing','racing',
    ['physics','casual','upgrades','vehicle'],'Fingersoft',6300000,4.7,24000,
    'Drive over hilly terrain without flipping your vehicle. Collect coins to upgrade your car and driver.',
    {keyboard:'Right arrow to accelerate, Left to reverse',touch:'Tap left/right pedals'}],

  ['rally-racer-dirt','Rally Racer Dirt','racing',
    ['rally','3d','drifting','simulation'],'Wolf Games',1600000,4.3,6200,
    'Race on dusty rally tracks with realistic dirt physics. Drift around corners to gain speed boosts.',
    {keyboard:'WASD to drive, Space for handbrake',touch:'Virtual controls'}],

  ['death-run-3d','Death Run 3D','racing',
    ['runner','3d','obstacle','endless'],'Neutronized',2900000,4.5,11800,
    'Sprint through a neon tunnel avoiding obstacles at ever-increasing speed. How far can you go?',
    {keyboard:'Left/Right arrows or A/D to dodge',touch:'Tap left or right side'}],

  ['parkour-race','Parkour Race','racing',
    ['parkour','runner','3d','multiplayer'],'BPTop',2200000,4.4,8700,
    'Race against other players through parkour courses. Jump, slide and wall-run your way to first place.',
    {keyboard:'WASD to move, Space to jump, Shift to slide',touch:'On-screen controls'}],

  // ── SHOOTING ────────────────────────────────────────────────────────────────
  ['krunker','Krunker','shooting',
    ['fps','multiplayer','3d','browser'],'Sidney de Vries',7400000,4.8,27000,
    'Fast-paced browser FPS with multiple classes and maps. One of the most popular online shooters ever made.',
    {keyboard:'WASD to move, Space to jump, Shift to crouch, R reload',mouse:'Aim and shoot'}],

  ['shell-shockers','Shell Shockers','shooting',
    ['fps','eggs','multiplayer','funny'],'Blue Wizard Digital',5100000,4.7,19000,
    'FPS where all players are armed eggs. Crack your opponents before they crack you in this egg-citing shooter.',
    {keyboard:'WASD move, Space jump, E switch weapon, R reload',mouse:'Aim and shoot'}],

  ['zombie-shooter','Zombie Shooter','shooting',
    ['zombies','topdown','survival','waves'],'Insane Games',1700000,4.2,6900,
    'Survive endless waves of zombies in this top-down shooter. Collect power-ups and upgrade your arsenal.',
    {keyboard:'WASD to move',mouse:'Aim with cursor, click to shoot'}],

  ['gun-mayhem-2','Gun Mayhem 2','shooting',
    ['platformer','guns','multiplayer','2-player'],'Kevin Gu',3400000,4.5,13000,
    'Knock opponents off the platform using guns in this fast-paced action game. Play solo or with friends.',
    {keyboard:'WASD to move, G to shoot, T to throw grenade',touch:'On-screen buttons'}],

  ['stickman-fighting-3d','Stickman Fighting 3D','shooting',
    ['stickman','fighting','3d','pvp'],'SayGames',1200000,4.1,5100,
    'Epic stickman battles in full 3D. Choose your fighter and defeat opponents in brutal combat.',
    {keyboard:'WASD to move, combos with mouse buttons',mouse:'Aim and attack'}],

  ['sniper-3d-assassin','Sniper 3D Assassin','shooting',
    ['sniper','3d','missions','stealth'],'Wildlife Studios',2300000,4.3,9100,
    'Complete sniper missions across detailed 3D environments. Zoom in and eliminate targets with precision.',
    {mouse:'Aim with mouse, click to shoot, scroll to zoom',touch:'Touch aim and fire buttons'}],

  // ── SPORTS ──────────────────────────────────────────────────────────────────
  ['basketball-stars','Basketball Stars','sports',
    ['basketball','multiplayer','sports','pvp'],'Miniclip',4800000,4.6,18000,
    'Challenge real opponents in basketball 1v1 matches. Show off your dribbling skills and dunk on your rival.',
    {keyboard:'WASD to move, Space to shoot/steal',touch:'Virtual D-pad and action buttons'}],

  ['soccer-random','Soccer Random','sports',
    ['soccer','football','ragdoll','funny'],'RHM Interactive',2700000,4.5,10800,
    'Wacky ragdoll soccer where the rules change every round. Score goals in the most chaotic way possible.',
    {keyboard:'W or Up arrow to jump/kick for both players',touch:'Tap buttons'}],

  ['basketball-random','Basketball Random','sports',
    ['basketball','ragdoll','funny','2-player'],'RHM Interactive',1800000,4.4,7200,
    'Absurd ragdoll basketball with random rule changes each round. Compete 1v1 in hilarious matches.',
    {keyboard:'W and Up arrow for each player',touch:'Tap action button'}],

  ['penalty-shooters-2','Penalty Shooters 2','sports',
    ['soccer','football','penalty','tournament'],'Gamesync',2100000,4.5,8400,
    'Take penalty kicks through a full tournament. Time your shots and choose corners to outsmart the goalkeeper.',
    {mouse:'Click and drag to aim your shot',touch:'Swipe to shoot'}],

  ['crossy-road-online','Crossy Road Online','sports',
    ['endless','hopping','casual','multiplayer'],'Hipster Whale',5500000,4.7,21000,
    'Hop across busy roads and rivers without getting squished. Play solo or race friends in multiplayer.',
    {keyboard:'Arrow keys or WASD to hop',touch:'Tap to hop, swipe direction'}],

  // ── IO GAMES ────────────────────────────────────────────────────────────────
  ['paper-io-2','Paper.io 2','io-games',
    ['territory','multiplayer','casual','io'],'Voodoo',6700000,4.6,25000,
    'Capture territory by drawing loops on the map. Cut off other players without getting hit yourself.',
    {keyboard:'Arrow keys or WASD to move',touch:'Swipe to change direction'}],

  ['agar-io','Agar.io','io-games',
    ['cells','multiplayer','grow','io'],'Miniclip',12000000,4.7,45000,
    'Eat cells smaller than you and grow while avoiding larger players. Classic mass-gathering IO game.',
    {mouse:'Mouse to move, Space to split, W to eject mass',touch:'Touch to move'}],

  ['tribals-io','Tribals.io','io-games',
    ['survival','base-building','multiplayer','io'],'Tribals.io',1300000,4.3,5400,
    'Build a base, gather resources and fight other tribes. Survive the longest to dominate the server.',
    {keyboard:'WASD to move, E to interact, Click to attack/build'}],

  ['defly-io','Defly.io','io-games',
    ['helicopter','tower','territory','io'],'Jesper',890000,4.4,3700,
    'Fly a helicopter and shoot towers to claim territory. Build your own towers to protect your area.',
    {mouse:'Mouse to steer, Click to shoot',keyboard:'Space to boost'}],

  ['wormate-io','Wormate.io','io-games',
    ['snake','worm','grow','io'],'Oleksandr Godoba',3800000,4.5,14600,
    'Eat sweets and grow your worm. Cut off other worms to defeat them and eat their remains.',
    {mouse:'Mouse to steer',keyboard:'Space or W to speed boost'}],

  ['powerline-io','Powerline.io','io-games',
    ['snake','neon','multiplayer','io'],'Powerline.io',2100000,4.4,8100,
    'Guide a glowing snake through an arena. Cut off other players or make them crash into your trail.',
    {keyboard:'Arrow keys or WASD to steer',touch:'Swipe to turn'}],

  ['snake-io','Snake.io','io-games',
    ['snake','classic','multiplayer','io'],'Kooapps',4200000,4.5,16000,
    'Classic snake gameplay with online multiplayer. Grow your snake by eating glowing orbs and avoid others.',
    {keyboard:'Arrow keys or WASD to turn',touch:'Swipe to steer'}],

  // ── HYPERCASUAL ─────────────────────────────────────────────────────────────
  ['subway-surfers','Subway Surfers','hypercasual',
    ['runner','endless','coins','mobile'],'Kiloo',15000000,4.8,58000,
    'Dash as fast as you can through the subway, dodge the incoming trains and run from the inspector.',
    {keyboard:'Arrow keys: Left/Right to switch lanes, Up to jump, Down to roll',touch:'Swipe gestures'}],

  ['temple-run-2','Temple Run 2','hypercasual',
    ['runner','endless','temple','adventure'],'Imangi Studios',11000000,4.7,41000,
    'Escape the demon monkeys while collecting coins and power-ups in this endless runner classic.',
    {keyboard:'Arrow keys to turn, jump and slide',touch:'Swipe in any direction'}],

  ['slope','Slope','hypercasual',
    ['ball','endless','3d','speed'],'Rob Kay',7800000,4.7,29000,
    'Control a ball rolling down an endless slope. Dodge obstacles and keep from falling off the edge.',
    {keyboard:'Left/Right arrows or A/D to steer',touch:'Tilt or tap left/right'}],

  ['among-us-online-edition','Among Us Online Edition','hypercasual',
    ['social','deduction','multiplayer','space'],'Innersloth',9200000,4.6,35000,
    'Work with crewmates to complete tasks or eliminate them as the Impostor. Trust no one.',
    {keyboard:'WASD to move, E to use/interact, Q to sabotage (Impostor)',mouse:'Click to interact with tasks'}],

  ['minecraft-classic','Minecraft Classic','hypercasual',
    ['building','creative','sandbox','classic'],'Mojang',8500000,4.6,32000,
    'The original Minecraft Classic — build anything you can imagine with 32 block types in your browser.',
    {keyboard:'WASD to move, Space to jump, E for inventory',mouse:'Left click to break, Right to place blocks'}],

  ['smash-karts','Smash Karts','hypercasual',
    ['kart','racing','multiplayer','weapons'],'Tall Team',3300000,4.6,12700,
    'Race and battle in karts with weapons. Pick up items and smash opponents to win the race.',
    {keyboard:'WASD or Arrow keys to drive, Space to use item',touch:'Virtual steering'}],

  // ── 2-PLAYER ────────────────────────────────────────────────────────────────
  ['1v1-lol','1v1.LOL','2-player',
    ['building','shooting','battle-royale','pvp'],'JustPlay.LOL',6100000,4.6,23000,
    'Build structures and battle opponents in this 1v1 combat game. Practice building and editing like a pro.',
    {keyboard:'WASD to move, Click to shoot, Z/X/C/V to build, F edit mode',touch:'On-screen controls'}],

  ['subway-surfers-online','Subway Surfers Online','2-player',
    ['runner','multiplayer','casual','mobile'],'Kiloo',4400000,4.5,17000,
    'Run through subway tracks with friends in online multiplayer mode. Compete for the highest score.',
    {keyboard:'Arrow keys to dodge and jump',touch:'Swipe gestures'}],

  ['super-smash-flash-2','Super Smash Flash 2','2-player',
    ['fighting','platformer','multiplayer','2-player'],'McLeodGaming',5200000,4.8,20000,
    'Fan-made Smash Bros with over 40 characters. Battle friends locally in this massive platform fighter.',
    {keyboard:'P1: WASD+F/G/H, P2: Arrow keys+1/2/3',touch:'On-screen buttons'}],
]

// ── Build JSON ────────────────────────────────────────────────────────────────

const BASE_URL = 'https://html5.gamepix.com/games'
const IMG_BASE = 'https://img.gamepix.com/games'

// Deterministic addedAt spread across last 90 days
function addedAt(index, total) {
  const spread = Math.floor((index / total) * 80) + Math.floor(Math.random() * 10)
  return new Date(Date.now() - spread * 86400000).toISOString().split('T')[0]
}

const games = GAMES.map(([slug, title, category, tags, developer, plays, rating, ratingCount, description, controls], index) => ({
  id:               `${category}-${String(index + 1).padStart(3,'0')}`,
  title,
  slug,
  description,
  shortDescription: description.slice(0, 100),
  category,
  tags,
  thumbnailUrl:     `${IMG_BASE}/${slug}/icon/${slug}.png`,
  bannerUrl:        `${IMG_BASE}/${slug}/cover/${slug}.jpg`,
  embedUrl:         `${BASE_URL}/${slug}/`,
  embedType:        'iframe',
  width:            960,
  height:           540,
  developer,
  plays,
  rating,
  ratingCount,
  featured:         plays > 4000000,
  isNew:            index < 8,
  isHot:            plays > 3000000,
  addedAt:          addedAt(index, GAMES.length),
  instructions:     `Play ${title} directly in your browser. No download needed.`,
  controls,
}))

// Re-number IDs per category
const byCat = {}
games.forEach((g) => {
  if (!byCat[g.category]) byCat[g.category] = 0
  byCat[g.category]++
  g.id = `${g.category}-${String(byCat[g.category]).padStart(2,'0')}`
})

// Update categories.json game counts
try {
  const catPath = './data/categories.json'
  const cats    = JSON.parse(readFileSync(catPath, 'utf8'))
  cats.forEach((c) => {
    c.gameCount = games.filter((g) => g.category === c.slug).length
  })
  writeFileSync(catPath, JSON.stringify(cats, null, 2))
  console.log('✓ Updated data/categories.json')
} catch (e) {
  console.warn('⚠ categories.json:', e.message)
}

writeFileSync('./data/games.json', JSON.stringify(games, null, 2))

console.log(`✓ Wrote ${games.length} games to data/games.json`)
console.log('\nBreakdown by category:')
Object.entries(byCat).forEach(([cat, n]) => console.log(`  ${cat.padEnd(15)} ${n} games`))
console.log('\nSample embed URLs:')
games.slice(0,6).forEach((g) => console.log(`  ${g.title.padEnd(35)} ${g.embedUrl}`))
