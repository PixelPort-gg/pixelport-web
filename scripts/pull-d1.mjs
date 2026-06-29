// Pull the live compatibility signals from D1 (mgp-db) into committed data files:
//   scripts/d1-verified.json   appids the server has flipped to verified
//   scripts/popularity.json    appid -> popularity (top 25k), for ranking
//
// Needs Cloudflare auth: wrangler OAuth locally, or CLOUDFLARE_API_TOKEN in CI.
// We borrow ONLY verified + popularity from D1 — tiers stay from the bundled,
// anti-cheat-aware base (D1 mislabels popular anti-cheat games as playable).
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID || 'ebafb6b37e9a9231f36a635f8378c987';

function d1(sql) {
  const out = execSync(`npx wrangler d1 execute mgp-db --remote --json --command ${JSON.stringify(sql)}`, {
    env: { ...process.env, CLOUDFLARE_ACCOUNT_ID: ACCOUNT },
    encoding: 'utf8',
    maxBuffer: 128 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  const j = JSON.parse(out);
  return (Array.isArray(j) ? j[0] : j.result?.[0]).results;
}

const verified = d1("SELECT appid FROM games WHERE tier='verified'")
  .map((r) => +r.appid)
  .sort((a, b) => a - b);
writeFileSync(join(here, 'd1-verified.json'), JSON.stringify(verified));

// D1's column is still named `popularity` but the values are SteamSpy owner
// estimates — we save them as owners.json. (TODO: rename the D1 column to
// estimated_owners in the import pipeline.)
const own = d1('SELECT appid, popularity FROM games WHERE popularity IS NOT NULL ORDER BY popularity DESC LIMIT 25000');
const map = {};
for (const r of own) map[r.appid] = r.popularity;
writeFileSync(join(here, 'owners.json'), JSON.stringify(map));

console.log('pulled D1 — verified:', verified.length, '| owner estimates:', Object.keys(map).length);
