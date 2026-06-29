// Builds the website catalogue from the app's bundled, honestly-graded catalogue.
//
// Outputs:
//   public/catalogue-grid.json  — every game (minimal: slug,title,appid,tier,p)
//                                  for the client-rendered browse grid. p=1 means
//                                  it has a dedicated detail page.
//   src/data/catalogue.json     — the non-curated games that GET a detail page
//                                  (verified / needs-attention / unsupported), with
//                                  the compat facts used to render an honest page.
//
// The curated rich games (src/data/games.json) stay the source of truth for their
// own slugs; we never duplicate them here.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const APP_CATALOGUE = join(
  process.env.HOME,
  'MacGamePort/App/Sources/PortingEngine/Catalogue/catalogue.json',
);

const app = JSON.parse(readFileSync(APP_CATALOGUE, 'utf8'));
const entries = Array.isArray(app) ? app : app.entries || app.games || [];
const curated = JSON.parse(readFileSync(join(root, 'src/data/games.json'), 'utf8'));

const curatedAppids = new Set(curated.map((g) => g.appid).filter((a) => a != null));
const curatedSlugs = new Set(curated.map((g) => g.slug));

const mapTier = (t) => (t === 'needsAttention' ? 'needs-attention' : t);
// Distinctive tiers earn a generated detail page; the 10.6k "playable" long tail
// is browse-only for now (avoids mass thin pages — see SEO notes).
const PAGE_TIERS = new Set(['verified', 'needs-attention', 'unsupported']);

const seen = new Set(curatedSlugs);
const pages = []; // non-curated games that get a detail page
const gridExtra = []; // every non-curated game, for the grid

for (const e of entries) {
  const slug = e.id;
  if (!slug || seen.has(slug)) continue;
  if (e.appid != null && curatedAppids.has(e.appid)) continue;
  seen.add(slug);
  const tier = mapTier(e.tier);
  const hasPage = PAGE_TIERS.has(tier);
  gridExtra.push({ slug, title: e.title, appid: e.appid ?? null, tier, p: hasPage ? 1 : 0 });
  if (hasPage) {
    pages.push({
      slug,
      title: e.title,
      appid: e.appid ?? null,
      tier,
      engine: e.engine ?? null,
      d3d: e.d3d ?? null,
      antiCheat: e.antiCheat ?? null,
      graphics: e.recommendedGraphics ?? null,
    });
  }
}

// The grid = curated (all have pages) + every catalogue game.
const grid = [
  ...curated.map((g) => ({ slug: g.slug, title: g.title, appid: g.appid ?? null, tier: g.tier, p: 1 })),
  ...gridExtra,
];

writeFileSync(join(root, 'public/catalogue-grid.json'), JSON.stringify(grid));
writeFileSync(join(root, 'src/data/catalogue.json'), JSON.stringify(pages, null, 0));

const byTier = grid.reduce((m, g) => ((m[g.tier] = (m[g.tier] || 0) + 1), m), {});
console.log('grid total:', grid.length, byTier);
console.log('detail pages (non-curated):', pages.length, '+ curated', curated.length);
