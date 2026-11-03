// Announce only linkable PixelPort verified assessments; tiers alone earn no post.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { compatibilityLabel } from '../src/lib/compatibility.mjs';

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

const grid = read('public/catalogue-grid.json', []);
const compat = read('src/data/compat.json', { games: [] }).games;
const announcedPath = join(root, 'scripts/announced-verified.json');
const meta = new Map();
for (const g of compat) meta.set(g.appid, { ...g, title: g.name, postSlug: g.slug, href: `/mac/${g.slug}-${g.appid}/` });
for (const g of grid.filter(g => g.p)) meta.set(g.appid, { ...g, postSlug: g.slug, href: `/games/${g.slug}/` });
const current = [...meta.values()].filter(g => compatibilityLabel(g) === 'pixelport_verified').map(g => g.appid);

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
title: "${q(title)} is now PixelPort verified on Mac"
description: "${q(title)} has passed PixelPort gameplay qualification on a recorded configuration."
date: ${date}
---

${title} has the compatibility label **PixelPort verified**: PixelPort's gameplay qualification checks passed on a recorded configuration. Read its current game page for the evidence and conditions.

Every game has one of five labels: **Untested**, **Player-tested**, **PixelPort verified**, **Issues reported** or **Blocked**. Availability is separate, and an unlock or launch report does not earn a gameplay claim.

Want to play it? See [how to play ${title} on Mac](${href}), or [download Pixel Port](/download) and try it in one click.
`,
  );
  made++;
}

// Persist the UNION, not just `current`. The tracking file answers "what have we
// already announced", and an announcement cannot be un-published. Writing only
// `current` made the file shrinkable: a partial snapshot (a partial D1
// result, a game briefly re-tiered) would silently drop announced appids, and
// they would re-announce later. `existsSync` on the post file was the only
// thing standing between that and duplicate posts.
const tracked = [...new Set([...prev, ...current])].sort((a, b) => a - b);
write(announcedPath, JSON.stringify(tracked));
console.log(`announce:${DRY ? ' [dry-run]' : ''} ${made} new verified post(s); tracking ${tracked.length} verified games`);
