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
const popularity = readJSON('scripts/popularity.json', {}); // { appid: score }
const d1Verified = new Set(readJSON('scripts/d1-verified.json', [])); // [appid]

const curatedAppids = new Set(curated.map((g) => g.appid).filter((a) => a != null));
const curatedSlugs = new Set(curated.map((g) => g.slug));

const mapTier = (t) => (t === 'needsAttention' ? 'needs-attention' : t);
const DISTINCTIVE = new Set(['verified', 'needs-attention', 'unsupported']);
const pop = (appid) => (appid != null && popularity[appid]) || 0;

const seen = new Set(curatedSlugs);
const pages = []; // non-curated games that get a detail page
const gridExtra = [];

for (const e of entries) {
  const slug = e.id;
  if (!slug || seen.has(slug)) continue;
  if (e.appid != null && curatedAppids.has(e.appid)) continue;
  seen.add(slug);

  let tier = mapTier(e.tier);
  // Sync verified from the live server — but never claim verified for a game the
  // bundled catalogue knows is anti-cheat-blocked.
  if (e.appid != null && d1Verified.has(e.appid) && tier !== 'unsupported') tier = 'verified';

  const p = pop(e.appid);
  // Pages for the popular games (real SEO value) + the distinctive tiers.
  const hasPage = p > 0 || DISTINCTIVE.has(tier);
  gridExtra.push({ slug, title: e.title, appid: e.appid ?? null, tier, pop: p, p: hasPage ? 1 : 0 });
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
    });
  }
}

// Curated games inherit verified from the live server too (rich content unchanged).
const resolvedCurated = curated.map((g) =>
  g.appid != null && d1Verified.has(g.appid) && g.tier !== 'unsupported' ? { ...g, tier: 'verified' } : g,
);
writeFileSync(join(root, 'src/data/games.resolved.json'), JSON.stringify(resolvedCurated));

const grid = [
  ...resolvedCurated.map((g) => ({ slug: g.slug, title: g.title, appid: g.appid ?? null, tier: g.tier, pop: pop(g.appid), p: 1 })),
  ...gridExtra,
];
// Popularity-sorted so the browse grid leads with games people recognise.
grid.sort((a, b) => b.pop - a.pop || a.title.localeCompare(b.title));

writeFileSync(join(root, 'public/catalogue-grid.json'), JSON.stringify(grid));
writeFileSync(join(root, 'src/data/catalogue.json'), JSON.stringify(pages));

const byTier = grid.reduce((m, g) => ((m[g.tier] = (m[g.tier] || 0) + 1), m), {});
console.log('grid total:', grid.length, byTier);
console.log('detail pages:', pages.length, 'generated +', curated.length, 'curated =', pages.length + curated.length);
console.log('popularity entries:', Object.keys(popularity).length, '| d1 verified:', d1Verified.size);
