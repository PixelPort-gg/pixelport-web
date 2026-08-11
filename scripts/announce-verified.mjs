// Auto-announce newly verified games as blog posts ("X is now verified on Mac").
//
// Diffs the live verified set (scripts/d1-verified.json) against the games we've
// already announced (scripts/announced-verified.json). On the FIRST run it just
// seeds the baseline (no posts), so only genuine, future verified flips publish.
//
// WHERE THE LINK COMES FROM. A game can only be announced if we can send the
// reader somewhere real, so `meta` is built from every source that produces a
// page, best link first:
//
//   src/data/games.json      -> /games/<slug>          curated, richest page
//   scripts/catalogue-base.json -> /games/<id>         generated detail page
//   src/data/compat.json     -> /mac/<slug>-<appid>    honest tier-and-verdict page
//
// That third source is the fix for a silent, self-perpetuating stall. `meta`
// used to come from the first two only, and catalogue-base.json is regenerated
// by refresh-base.mjs, which reads the APP REPO off a dev machine and therefore
// cannot run in CI. It has been frozen since 2026-06-29 while d1-verified.json
// refreshed daily. Four games verified in that window (631890 Heartbound Demo,
// 1419170 My Singing Monsters, 1529790 Dead Estate Demo, 4248000 How Many
// Dudes? Demo) were dropped by the filter every single run, and — because the
// tracking file was written from the FILTERED list — they were never recorded
// either, so nothing would ever have picked them up.
//
// compat.json is the right source for this: pull-compat.mjs refreshes it from
// the public API on every sync, sync.yml commits it, and /mac/[slug].astro
// already builds a page for every game in it. So the link is guaranteed to
// resolve, and it stays honest — compat.json carries tier and verdict only, no
// recipe internals.
//
// Usage:
//   node scripts/announce-verified.mjs              # write posts + tracking file
//   node scripts/announce-verified.mjs --dry-run    # report only, touch nothing
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const DRY = process.argv.includes('--dry-run') || process.env.DRY_RUN === '1';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const read = (p, f) => {
  try {
    return JSON.parse(readFileSync(join(root, p), 'utf8'));
  } catch {
    return f;
  }
};
const write = (p, contents) => {
  if (DRY) return;
  writeFileSync(p, contents);
};

const base = read('scripts/catalogue-base.json', []);
const curated = read('src/data/games.json', []);
const compat = read('src/data/compat.json', { games: [] }).games ?? [];
const d1Verified = read('scripts/d1-verified.json', []);
const announcedPath = join(root, 'scripts/announced-verified.json');

// appid -> { title, postSlug, href }. `postSlug` names the blog post; `href` is
// where the post sends the reader. They differ for compat-sourced games: the
// page lives at /mac/<slug>-<appid> but the post keeps the clean slug so the
// blog URL stays readable.
const meta = new Map();
// Weakest source first — later writes win, so curated always beats generated.
for (const g of compat) {
  if (g.appid) meta.set(g.appid, { title: g.name, postSlug: g.slug, href: `/mac/${g.slug}-${g.appid}/` });
}
for (const g of base) if (g.appid) meta.set(g.appid, { title: g.title, postSlug: g.id, href: `/games/${g.id}` });
for (const g of curated) if (g.appid) meta.set(g.appid, { title: g.title, postSlug: g.slug, href: `/games/${g.slug}` });

const current = d1Verified.filter((a) => meta.has(a)); // only linkable games
const unlinkable = d1Verified.filter((a) => !meta.has(a));
if (unlinkable.length) {
  // No longer silent. If a verified game has no page in ANY source, that is a
  // gap in the data pipeline, not a thing to swallow.
  console.warn(`announce: ${unlinkable.length} verified game(s) have no page anywhere — not announced:`, unlinkable.join(', '));
}

if (!existsSync(announcedPath)) {
  write(announcedPath, JSON.stringify(current));
  console.log('announce: seeded baseline of', current.length, 'verified games (no posts on first run)');
  process.exit(0);
}

const prev = new Set(read('scripts/announced-verified.json', []));
const fresh = current.filter((a) => !prev.has(a));
const date = process.env.POST_DATE || new Date().toISOString().slice(0, 10);
const q = (s) => s.replace(/"/g, '\\"');

// Two compat-sourced games could slugify to the same clean name. First one
// keeps it; the rest disambiguate with the appid rather than colliding on disk.
const takenSlug = new Map();

let made = 0;
for (const appid of fresh) {
  const { title, href } = meta.get(appid);
  let { postSlug } = meta.get(appid);
  if (takenSlug.has(postSlug) && takenSlug.get(postSlug) !== appid) postSlug = `${postSlug}-${appid}`;
  takenSlug.set(postSlug, appid);

  const file = join(root, 'src/content/blog', `${postSlug}-now-verified.md`);
  if (existsSync(file)) continue;
  if (DRY) {
    console.log(`  [dry-run] would write src/content/blog/${postSlug}-now-verified.md → ${href}  (${title})`);
    made++;
    continue;
  }
  write(
    file,
    `---
title: "${q(title)} is now verified on Mac"
description: "${q(title)} is verified to run on Apple Silicon through Pixel Port. Here is what that means."
date: ${date}
---

${title} just reached our top compatibility tier: **verified**.

Verified is the highest grade in our honest compatibility map, and it is earned rather than assumed. It means a real Mac ran ${title} end to end on Pixel Port's free runtime. Not a guess, not a community report, a confirmed play on Apple Silicon.

Every game on Pixel Port carries a tier so you always know what to expect before you install: verified (a Mac ran it end to end), playable (graded but not yet hand-verified), needs attention (runs with caveats), and unsupported (a hard blocker like kernel anti-cheat). ${title} just moved to the top of that list.

Want to play it? See [how to play ${title} on Mac](${href}), or [download Pixel Port](/download) and try it in one click.
`,
  );
  made++;
}

// Persist the UNION, not just `current`. The tracking file answers "what have we
// already announced", and an announcement cannot be un-published. Writing only
// `current` made the file shrinkable: one short d1-verified.json (a partial D1
// result, a game briefly re-tiered) would silently drop announced appids, and
// they would re-announce later. `existsSync` on the post file was the only
// thing standing between that and duplicate posts.
const tracked = [...new Set([...prev, ...current])].sort((a, b) => a - b);
write(announcedPath, JSON.stringify(tracked));
console.log(
  `announce:${DRY ? ' [dry-run]' : ''} ${made} new verified post(s); tracking ${tracked.length} verified games` +
    (unlinkable.length ? ` (${unlinkable.length} unlinkable)` : ''),
);
