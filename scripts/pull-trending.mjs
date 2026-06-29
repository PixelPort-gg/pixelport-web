// Pull the live "most played" list (current concurrent players) from Steam's
// public charts API → scripts/trending.json (appid -> current players).
//
// This is the TRENDING signal — what people are actually playing right now, the
// best proxy for current search demand. It complements estimated owners
// (scripts/owners.json), which measures how many people own a copy.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const URL = 'https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/';

const res = await fetch(URL, { headers: { 'User-Agent': 'pixelport.gg' } });
if (!res.ok) {
  console.error('pull-trending: Steam API returned', res.status);
  process.exit(1);
}
const json = await res.json();
const ranks = json?.response?.ranks || [];

const map = {};
for (const r of ranks) {
  if (r.appid) map[r.appid] = r.concurrent_in_game ?? r.peak_in_game ?? 0;
}
writeFileSync(join(here, 'trending.json'), JSON.stringify(map));
console.log('trending (current players):', Object.keys(map).length, 'games; #1', ranks[0]?.appid, ranks[0]?.concurrent_in_game);
