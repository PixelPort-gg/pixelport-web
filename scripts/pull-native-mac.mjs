// Derive the native-Mac set: which catalogue games ALREADY ship a macOS build.
//
// Why this exists: a player searching "does Stardew Valley run on Mac" should be
// told the truth — it already has a native Mac version and they do not need us.
// Presenting those games as Pixel Port titles is the one thing that makes an
// honest compatibility grade look like marketing. Internal policy already says to
// exclude native-Mac (docs/internal/CATALOGUE-COVERAGE-SPEC.md), the site just
// never had the field.
//
// Source: ci/steam-data/fetch-steam-universe.py in the app repo, which reads the
// store search rows' own `platform_img mac` markup — 100 games a request, no API
// key. Run that first (it is resumable and caches pages), then this.
//
// Dev-machine only, like refresh-base.mjs: the output is committed so the sync
// pipeline and CI never need the app repo present.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const APP = join(process.env.HOME, 'MacGamePort');
const UNIVERSE = join(APP, 'ci/steam-data/steam-universe.json');
const TSV = join(APP, 'steam-platforms.tsv');

if (!existsSync(UNIVERSE)) {
  console.error(`missing ${UNIVERSE}\nrun: python3 ${join(APP, 'ci/steam-data/fetch-steam-universe.py')}`);
  process.exit(1);
}

const readJSON = (p, fallback) => {
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch {
    return fallback;
  }
};

// Only keep flags for games we actually render — the full Steam native-Mac set is
// ~21k appids and most of them are not in our catalogue.
const ours = new Set();
for (const g of readJSON(join(root, 'scripts/catalogue-base.json'), [])) if (g.appid != null) ours.add(+g.appid);
for (const g of readJSON(join(root, 'src/data/games.json'), [])) if (g.appid != null) ours.add(+g.appid);
// compat.json wraps its rows: { generated, games: [...] }
for (const g of readJSON(join(root, 'src/data/compat.json'), {}).games ?? []) if (g.appid != null) ours.add(+g.appid);

const universe = readJSON(UNIVERSE, {});
const native = {};
let seen = 0;
for (const [appidStr, row] of Object.entries(universe)) {
  const appid = +appidStr;
  if (!ours.has(appid)) continue;
  seen++;
  if (row.mac) native[appid] = 1;
}

// Cross-check against the hand-run platform table before trusting the scrape. A
// disagreement means the store markup changed shape and the regex is now lying.
const conflicts = [];
if (existsSync(TSV)) {
  const rows = readFileSync(TSV, 'utf8').trim().split('\n').slice(1);
  for (const line of rows) {
    const c = line.split('\t');
    const appid = +c[2];
    if (!Number.isFinite(appid) || !ours.has(appid) || !(appid in universe)) continue;
    const tsvMac = c[4] === 'true';
    const scrapeMac = !!native[appid];
    if (tsvMac !== scrapeMac) conflicts.push(`${appid} ${c[1]}: tsv=${tsvMac} scrape=${scrapeMac}`);
  }
}

writeFileSync(join(root, 'scripts/native-mac.json'), JSON.stringify(native));
console.log(
  'universe rows:', Object.keys(universe).length,
  '| ours covered:', seen, 'of', ours.size,
  '| native-Mac:', Object.keys(native).length,
);
if (conflicts.length) {
  console.log(`\nWARNING — ${conflicts.length} disagree with steam-platforms.tsv:`);
  for (const c of conflicts.slice(0, 20)) console.log('  ', c);
}
