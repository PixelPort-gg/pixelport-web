// Build reproducible site data from committed metadata and complete assessments.
// The D1 snapshot owns current assessments; no availability or recipe heuristic
// can promote a game. Missing provenance deliberately reads as Untested.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { assessmentFields, withCompatibility, publicBlockReason } from '../src/lib/compatibility.mjs';

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
const assessments = new Map(readJSON('scripts/catalogue-assessments.json', { games: [] }).games.map(g => [g.appid, assessmentFields(g)]));
const legacyReasons = new Map(readJSON('scripts/served-unsupported.json', { blocked: [] }).blocked.map(g => [g.appid, g.reason]));
const assess = g => {
  const fallback = { ...g, unsupported_reason: g.unsupported_reason ?? legacyReasons.get(g.appid) ?? null };
  return withCompatibility({ ...g, ...assessmentFields(assessments.get(g.appid) ?? fallback) });
};
const enabled = new Set(readJSON('scripts/enabled.json', [])); // [appid]
// Games that ALREADY ship a macOS build. Their page sends the player to that build
// instead of pitching us — see scripts/pull-native-mac.mjs for why and where from.
const nativeMacSet = new Set(Object.keys(readJSON('scripts/native-mac.json', {})).map(Number));
const isNativeMac = (appid) => appid != null && nativeMacSet.has(appid);

const curatedAppids = new Set(curated.map((g) => g.appid).filter((a) => a != null));
const curatedSlugs = new Set(curated.map((g) => g.slug));

// Former verified-only snapshots preserve URLs, never compatibility claims.
const legacyPageAppids = new Set(readJSON('scripts/legacy-verified-page-appids.json', []));
const DISTINCTIVE = new Set(['pixelport_verified', 'player_tested', 'issues_reported', 'blocked']);
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

  const assessment = assess(e);
  const { tier, verified_by, unsupported_reason, verified_on, verified_conditions, label } = assessment;
  const fields = { tier, verified_by, unsupported_reason, verified_on, verified_conditions, label };
  const p = score(e.appid);
  const nativeMac = isNativeMac(e.appid);
  // Pages for the popular games (real SEO value) + the distinctive tiers.
  // Preserve existing detail routes even when their old claim is withdrawn.
  const hasPage = p > 0 || DISTINCTIVE.has(label) || legacyPageAppids.has(e.appid) || legacyReasons.has(e.appid) || ['verified', 'needsAttention', 'needs-attention', 'unsupported'].includes(e.tier);
  gridExtra.push({ slug, title: e.title, appid: e.appid ?? null, ...fields, pop: p, p: hasPage ? 1 : 0, ...(enabled.has(e.appid) ? { e: 1 } : {}), ...(nativeMac ? { n: 1 } : {}) });
  if (hasPage) {
    pages.push({
      slug,
      title: e.title,
      appid: e.appid ?? null,
      ...fields,
      engine: e.engine ?? null,
      d3d: e.d3d ?? null,
      antiCheat: e.antiCheat ?? null,
      graphics: e.graphics ?? null,
      ...(nativeMac ? { nativeMac: true } : {}),
    });
  }
}

// Preserve external-report routes without converting an external outcome into a
// PixelPort block cause. Only a catalogue assessment can establish its label.
const awacy = readJSON('scripts/awacy.json', {});
const slugify = s => (s || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
for (const [id, info] of Object.entries(awacy)) {
  const appid = Number(id);
  if (seenAppids.has(appid)) continue;
  let slug = slugify(info.name) || `game-${appid}`;
  if (seen.has(slug)) slug = `${slug}-${appid}`;
  if (seen.has(slug)) continue;
  seen.add(slug); seenAppids.add(appid);
  const row = assess({ slug, title: info.name, appid, tier: 'candidate' });
  pages.push({ ...row, engine: null, d3d: null, antiCheat: (info.anticheats || []).filter(Boolean).join(' + ') || null, graphics: null });
  gridExtra.push({ ...row, pop: score(appid), p: 1, ...(enabled.has(appid) ? { e: 1 } : {}) });
}

// Native-Mac overrides remain editorial, independently of compatibility.
const resolvedCurated = curated.map((g) => {
  const out = assess({ ...g, unsupported_reason: g.unsupported_reason ?? (g.tier === 'unsupported' ? g.blocker?.status ?? null : null) });
  if (isNativeMac(g.appid) && g.nativeMacVerdict !== 'ours-is-better') out.nativeMac = true;
  return out;
});
writeFileSync(join(root, 'src/data/games.resolved.json'), JSON.stringify(resolvedCurated));

const grid = [
  ...resolvedCurated.map((g) => ({ slug: g.slug, title: g.title, appid: g.appid ?? null, ...assessmentFields(g), label: g.label, pop: score(g.appid), p: 1, ...(enabled.has(g.appid) ? { e: 1 } : {}), ...(g.nativeMac ? { n: 1 } : {}) })),
  ...gridExtra,
];
// Runnable tiers lead the browse grid (by trending), with unsupported demoted to
// the tail — still fully searchable and filterable, just not the first thing you
// see. Keeps the default view positive without hiding the honest "no" answers.
const sinks = (t) => (t === 'blocked' ? 1 : 0);
grid.sort(
  (a, b) => sinks(a.label) - sinks(b.label) || b.pop - a.pop || a.title.localeCompare(b.title),
);

writeFileSync(join(root, 'public/catalogue-grid.json'), JSON.stringify(grid));
writeFileSync(join(root, 'src/data/catalogue.json'), JSON.stringify(pages));
// The /mac/ "does it run?" pages need the same flag, and they read a different
// data file — publish the set into src/data so both templates import it cleanly.
writeFileSync(join(root, 'src/data/native-mac.json'), JSON.stringify([...nativeMacSet]));

const byTier = grid.reduce((m, g) => ((m[g.label] = (m[g.label] || 0) + 1), m), {});
console.log('grid total:', grid.length, byTier);
console.log('native-Mac (told to use the native build):', grid.filter((g) => g.n).length, 'of', grid.length);
console.log('enabled in beta:', grid.filter((g) => g.e).length, 'of', grid.length);
console.log('detail pages:', pages.length, 'generated +', curated.length, 'curated =', pages.length + curated.length);
console.log('owners:', Object.keys(owners).length, '| trending:', Object.keys(trending).length, '| assessments:', assessments.size);

// Both route families consume the same assessment snapshot. A D1 row with null
// fields clears an earlier claim or limitation rather than reviving a fallback.
const compat = readJSON('src/data/compat.json', { games: [] });
compat.games = compat.games.map(g => { const row = assess(g); return { ...row, reason: publicBlockReason(row.unsupported_reason) }; });
writeFileSync(join(root, 'src/data/compat.json'), JSON.stringify(compat, null, 1) + '\n');
