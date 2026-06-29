// Pull AreWeAntiCheatYet (AWACY) → scripts/awacy.json, the authoritative source
// for which games' anti-cheat blocks macOS/Wine. We use it to give honest
// "unsupported" pages to popular anti-cheat games the catalogue doesn't cover.
//
// Status vocab: Supported/Running (works) · Denied/Broken (BLOCKED) · Planned.
// We keep only Denied + Broken (the hard walls).
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const SRC = 'https://raw.githubusercontent.com/AreWeAntiCheatYet/AreWeAntiCheatYet/HEAD/games.json';
const BLOCKED = new Set(['Denied', 'Broken']);

const res = await fetch(SRC, { headers: { 'User-Agent': 'pixelport.gg' } });
if (!res.ok) {
  console.error('pull-awacy: AWACY returned', res.status);
  process.exit(1);
}
const games = await res.json();

const out = {};
for (const g of games) {
  if (!BLOCKED.has(g.status)) continue;
  const appid = g.storeIds?.steam;
  if (!appid) continue;
  out[appid] = { anticheats: g.anticheats || [], status: g.status, name: g.name };
}
writeFileSync(join(here, 'awacy.json'), JSON.stringify(out));
console.log('awacy blocked w/ steam appid:', Object.keys(out).length);
