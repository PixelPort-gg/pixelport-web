// Builds the website catalogue from the app's bundled, honestly-graded catalogue,
// ranked by live D1 popularity, with the verified set synced from the server.
//
// Sources:
//   ~/MacGamePort/.../catalogue.json   honest tiers + compat facts (anti-cheat aware)
//   scripts/popularity.json            appid -> popularity (exported from D1 `games`)
//   scripts/d1-verified.json           appids the live server has flipped to verified
//
// Why this split: D1's own tier column mislabels popular anti-cheat games as
// "candidate" (playable), so we trust the bundled catalogue for tiers/anti-cheat
// and only borrow D1's popularity (ranking) and verified set (the trustworthy flip).
//
// Outputs:
//   public/catalogue-grid.json  every game {slug,title,appid,tier,pop,p} for the
//                               client-rendered, popularity-sorted browse grid.
//   src/data/catalogue.json     the games that GET a detail page (popular ∪ the
//                               distinctive tiers), with compat facts.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const readJSON = (p, fallback) => {
  try {
    return JSON.parse(readFileSync(join(root, p), 'utf8'));
  } catch {
    return fallback;
  }
};

const entries = readJSON('scripts/catalogue-base.json', []);
const curated = readJSON('src/data/games.json', []);
const owners = readJSON('scripts/owners.json', {}); // estimated owners (SteamSpy via D1) — "how many own it"
const trending = readJSON('scripts/trending.json', {}); // current players (Steam most-played) — "what's hot now"
const d1Verified = new Set(readJSON('scripts/d1-verified.json', [])); // [appid]
// Games that ALREADY ship a macOS build. Their page sends the player to that build
// instead of pitching us — see scripts/pull-native-mac.mjs for why and where from.
const nativeMacSet = new Set(Object.keys(readJSON('scripts/native-mac.json', {})).map(Number));
const isNativeMac = (appid) => appid != null && nativeMacSet.has(appid);

const curatedAppids = new Set(curated.map((g) => g.appid).filter((a) => a != null));
const curatedSlugs = new Set(curated.map((g) => g.slug));

const mapTier = (t) => (t === 'needsAttention' ? 'needs-attention' : t);
const DISTINCTIVE = new Set(['verified', 'needs-attention', 'unsupported']);
// Rank by what's TRENDING first (current players), then by estimated owners for
// the long tail. Any trending game outranks any owner-only game.
const TREND_BOOST = 1e9;
const score = (appid) => {
  if (appid == null) return 0;
  const t = trending[appid];
  return t ? TREND_BOOST + t : owners[appid] || 0;
};

const seen = new Set(curatedSlugs);
const seenAppids = new Set(curatedAppids);
const pages = []; // non-curated games that get a detail page
const gridExtra = [];

for (const e of entries) {
  const slug = e.id;
  if (!slug || seen.has(slug)) continue;
  if (e.appid != null && curatedAppids.has(e.appid)) continue;
  seen.add(slug);
  if (e.appid != null) seenAppids.add(e.appid);

  let tier = mapTier(e.tier);
  // Sync verified from the live server — but never claim verified for a game the
  // bundled catalogue knows is anti-cheat-blocked.
  if (e.appid != null && d1Verified.has(e.appid) && tier !== 'unsupported') tier = 'verified';

  const p = score(e.appid);
  const nativeMac = isNativeMac(e.appid);
  // Pages for the popular games (real SEO value) + the distinctive tiers.
  const hasPage = p > 0 || DISTINCTIVE.has(tier);
  gridExtra.push({ slug, title: e.title, appid: e.appid ?? null, tier, pop: p, p: hasPage ? 1 : 0, ...(nativeMac ? { n: 1 } : {}) });
  if (hasPage) {
    pages.push({
      slug,
      title: e.title,
      appid: e.appid ?? null,
      tier,
      engine: e.engine ?? null,
      d3d: e.d3d ?? null,
      antiCheat: e.antiCheat ?? null,
      graphics: e.graphics ?? null,
      ...(nativeMac ? { nativeMac: true } : {}),
    });
  }
}

// Merge AWACY-blocked games the catalogue doesn't cover, as honest unsupported
// pages with accurate anti-cheat from AreWeAntiCheatYet (popular "can I play X on
// Mac" titles like Battlefield, Conan Exiles, CoD MW...).
const awacy = readJSON('scripts/awacy.json', {});
const slugify = (s) =>
  (s || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
let awacyAdded = 0;
for (const [appidStr, info] of Object.entries(awacy)) {
  const appid = +appidStr;
  if (seenAppids.has(appid)) continue;
  let slug = slugify(info.name) || `game-${appid}`;
  if (seen.has(slug)) slug = `${slug}-${appid}`;
  if (seen.has(slug)) continue;
  seen.add(slug);
  seenAppids.add(appid);
  const antiCheat = (info.anticheats || []).filter(Boolean).join(' + ') || 'kernel-level anti-cheat';
  pages.push({ slug, title: info.name, appid, tier: 'unsupported', engine: null, d3d: null, antiCheat, graphics: null });
  gridExtra.push({ slug, title: info.name, appid, tier: 'unsupported', pop: score(appid), p: 1 });
  awacyAdded++;
}

// Curated games inherit verified from the live server too (rich content unchanged),
// and pick up the native-Mac flag unless the entry overrides it. The override
// exists because a native build is not automatically the better one: Subnautica's
// is Intel-only and abandoned, Portal 2's is a dead 32-bit build, and Palworld's is
// a separate App Store purchase your Steam copy does not unlock.
const resolvedCurated = curated.map((g) => {
  const out = g.appid != null && d1Verified.has(g.appid) && g.tier !== 'unsupported' ? { ...g, tier: 'verified' } : { ...g };
  if (isNativeMac(g.appid) && g.nativeMacVerdict !== 'ours-is-better') out.nativeMac = true;
  return out;
});
writeFileSync(join(root, 'src/data/games.resolved.json'), JSON.stringify(resolvedCurated));

const grid = [
  ...resolvedCurated.map((g) => ({ slug: g.slug, title: g.title, appid: g.appid ?? null, tier: g.tier, pop: score(g.appid), p: 1, ...(g.nativeMac ? { n: 1 } : {}) })),
  ...gridExtra,
];
// Runnable tiers lead the browse grid (by trending), with unsupported demoted to
// the tail — still fully searchable and filterable, just not the first thing you
// see. Keeps the default view positive without hiding the honest "no" answers.
const sinks = (t) => (t === 'unsupported' ? 1 : 0);
grid.sort(
  (a, b) => sinks(a.tier) - sinks(b.tier) || b.pop - a.pop || a.title.localeCompare(b.title),
);

writeFileSync(join(root, 'public/catalogue-grid.json'), JSON.stringify(grid));
writeFileSync(join(root, 'src/data/catalogue.json'), JSON.stringify(pages));
// The /mac/ "does it run?" pages need the same flag, and they read a different
// data file — publish the set into src/data so both templates import it cleanly.
writeFileSync(join(root, 'src/data/native-mac.json'), JSON.stringify([...nativeMacSet]));

const byTier = grid.reduce((m, g) => ((m[g.tier] = (m[g.tier] || 0) + 1), m), {});
console.log('grid total:', grid.length, byTier);
console.log('native-Mac (told to use the native build):', grid.filter((g) => g.n).length, 'of', grid.length);
console.log('detail pages:', pages.length, 'generated +', curated.length, 'curated =', pages.length + curated.length);
console.log('owners:', Object.keys(owners).length, '| trending:', Object.keys(trending).length, '| d1 verified:', d1Verified.size, '| awacy added:', awacyAdded);
