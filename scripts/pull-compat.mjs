// pull-compat.mjs — refresh the committed snapshot behind the /mac/ compat pages.
//
// Reads ONLY the public mgp-api and writes src/data/compat.json with a strict
// field whitelist: appid, name, tier, reason, popularity. Recipe fields
// (engine/d3d/graphics/hashes/launch details) are never copied — the /mac/
// pages must stay tier-and-verdict only.
//
// Run manually with `npm run refresh:compat`, review the diff, and commit it.
// Builds always render from the committed snapshot so they stay reproducible.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const API = 'https://mgp-api.macgameport.workers.dev';
// Cloudflare Bot Fight Mode 403s library UAs — identify as a real browser.
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const SLEEP_MS = 200; // be polite to the worker

// Curated honest-no set: big-name games people search for that the catalogue
// flags with an unsupported_reason (almost always kernel anti-cheat). Games
// whose API record carries no reason are rendered by their real tier instead —
// we never fabricate a "no" any more than we fabricate a "yes".
const BLOCKER_APPIDS = [
  3932890, // Escape from Tarkov (Steam release — trending 2026-07; BattlEye kernel)
  236390, // War Thunder
  252490, // Rust
  1172470, // Apex Legends
  271590, // Grand Theft Auto V
  1085660, // Destiny 2
  578080, // PUBG: BATTLEGROUNDS
  359550, // Rainbow Six Siege X
  1245620, // Elden Ring
  381210, // Dead by Daylight
  1517290, // Battlefield 2042
  1203220, // NARAKA: BLADEPOINT
  1599340, // Lost Ark
  1063730, // New World: Aeternum
  594650, // Hunt: Showdown 1896
  1097150, // Fall Guys
  221100, // DayZ
  1240440, // Halo Infinite
  1811260, // EA SPORTS FIFA 23
  1938090, // Call of Duty: Modern Warfare II
  2669320, // EA SPORTS FC 25
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(path) {
  const res = await fetch(`${API}${path}`, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
}

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'game';

// Map raw catalogue tiers onto the four honest page tiers. Unknown tiers fall
// DOWN to untested — a compat claim is never upgraded here.
function pageTier(raw, reason) {
  if (reason) return 'unsupported';
  if (raw === 'verified') return 'verified';
  if (raw === 'beta' || raw === 'playable') return 'playable';
  return 'untested'; // candidate / catalogued / anything else
}

// Import-pipeline records sometimes stuff machine metadata into the reason
// field. That text is not a human verdict (and leaks catalogue internals), so
// any game carrying one is dropped from the honest-no set entirely.
const isMachineReason = (r) =>
  /archetype|auto-imported|source PCGW/i.test(r) || r.includes('|');

// Reasons are rendered verbatim, except clauses that describe renderer/DX
// specifics of our runtime — the public page states the anti-cheat verdict
// only. If trimming would empty the reason, the original is kept untouched.
function publicReason(r) {
  const kept = r
    .split(';')
    .map((c) => c.trim())
    .filter((c) => c && !/\b(dx\s?\d+|d3d\d*|directx|renderer)\b/i.test(c));
  if (!kept.length) return r;
  const joined = kept.join('; ');
  return /[.!?]$/.test(joined) ? joined : `${joined}.`;
}

async function main() {
  const featured = await getJson('/v1/featured');
  const unlocked = featured.unlocked ?? [];
  const appids = [...new Set([...unlocked, ...BLOCKER_APPIDS])];
  console.log(`Fetching ${appids.length} games (${unlocked.length} unlocked + curated blockers)…`);

  const games = [];
  for (const appid of appids) {
    await sleep(SLEEP_MS);
    let detail;
    try {
      detail = await getJson(`/v1/game/${appid}`);
    } catch (e) {
      console.warn(`  skip ${appid}: ${e.message}`);
      continue;
    }
    const g = detail.game;
    if (!g?.name) continue;

    let reason = g.unsupported_reason || null;
    if (reason && isMachineReason(reason)) {
      if (BLOCKER_APPIDS.includes(appid)) {
        console.warn(`  drop ${appid} (${g.name}): machine-generated reason`);
        continue;
      }
      reason = null; // unlocked game with junk metadata — keep it, on its real tier
    }
    if (reason) reason = publicReason(reason);

    // STRICT WHITELIST — nothing else from the API response is persisted.
    games.push({
      appid: g.appid,
      slug: slugify(g.name),
      name: g.name,
      tier: pageTier(g.tier, reason),
      reason,
      popularity: g.popularity ?? 0,
    });
    process.stdout.write('.');
  }
  console.log();

  games.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
  const out = {
    fetched_at: new Date().toISOString().slice(0, 10),
    source: `${API} (public catalogue API)`,
    games,
  };
  const file = join(dirname(fileURLToPath(import.meta.url)), '../src/data/compat.json');
  writeFileSync(file, JSON.stringify(out, null, 1) + '\n');
  const counts = games.reduce((m, g) => ((m[g.tier] = (m[g.tier] || 0) + 1), m), {});
  console.log(`Wrote ${games.length} games to src/data/compat.json`, counts);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
