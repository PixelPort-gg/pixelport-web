// Pull complete public assessments and ranking from D1. No tier-only promotions.
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID || 'ebafb6b37e9a9231f36a635f8378c987';

function d1(sql) {
  const out = execFileSync('npx', ['wrangler', 'd1', 'execute', 'mgp-db', '--remote', '--json', '--command', sql], {
    env: { ...process.env, CLOUDFLARE_ACCOUNT_ID: ACCOUNT },
    encoding: 'utf8',
    maxBuffer: 128 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  const j = JSON.parse(out);
  return (Array.isArray(j) ? j[0] : j.result?.[0]).results;
}

const games = d1('SELECT appid, tier, verified_by, unsupported_reason, verified_on, verified_conditions FROM games ORDER BY appid');
writeFileSync(join(here, 'catalogue-assessments.json'), JSON.stringify({ source: 'D1 games', games }) + '\n');

// D1's column is still named `popularity` but the values are SteamSpy owner
// estimates — we save them as owners.json. (TODO: rename the D1 column to
// estimated_owners in the import pipeline.)
const own = d1('SELECT appid, popularity FROM games WHERE popularity IS NOT NULL ORDER BY popularity DESC LIMIT 25000');
const map = {};
for (const r of own) map[r.appid] = r.popularity;
writeFileSync(join(here, 'owners.json'), JSON.stringify(map));

console.log('pulled D1 — assessments:', games.length, '| owner estimates:', Object.keys(map).length);
