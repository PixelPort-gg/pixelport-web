// Refresh the committed base catalogue from the app's bundled, anti-cheat-aware
// catalogue. Run on the dev machine whenever the app catalogue changes:
//   node scripts/refresh-base.mjs
// The output (scripts/catalogue-base.json) is committed, so the sync pipeline can
// run anywhere (CI) without the app repo present.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const APP = join(process.env.HOME, 'MacGamePort/App/Sources/PortingEngine/Catalogue/catalogue.json');

const app = JSON.parse(readFileSync(APP, 'utf8'));
const games = (app.games || app).map((g) => ({
  id: g.id,
  title: g.title,
  appid: g.appid ?? null,
  tier: g.tier,
  engine: g.engine ?? null,
  d3d: g.d3d ?? null,
  antiCheat: g.antiCheat ?? null,
  graphics: g.recommendedGraphics ?? null,
}));

writeFileSync(join(here, 'catalogue-base.json'), JSON.stringify(games));
console.log('catalogue-base.json:', games.length, 'games');
