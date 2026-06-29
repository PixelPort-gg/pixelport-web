// Auto-announce newly verified games as blog posts ("X is now verified on Mac").
//
// Diffs the live verified set (scripts/d1-verified.json) against the games we've
// already announced (scripts/announced-verified.json). On the FIRST run it just
// seeds the baseline (no posts), so only genuine, future verified flips publish.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const read = (p, f) => {
  try {
    return JSON.parse(readFileSync(join(root, p), 'utf8'));
  } catch {
    return f;
  }
};

const base = read('scripts/catalogue-base.json', []);
const curated = read('src/data/games.json', []);
const d1Verified = read('scripts/d1-verified.json', []);
const announcedPath = join(root, 'scripts/announced-verified.json');

// appid -> { title, slug } for everything that has (or will have) a detail page.
const meta = new Map();
for (const g of base) if (g.appid) meta.set(g.appid, { title: g.title, slug: g.id });
for (const g of curated) if (g.appid) meta.set(g.appid, { title: g.title, slug: g.slug }); // curated slug wins

const current = d1Verified.filter((a) => meta.has(a)); // only linkable games

if (!existsSync(announcedPath)) {
  writeFileSync(announcedPath, JSON.stringify(current));
  console.log('announce: seeded baseline of', current.length, 'verified games (no posts on first run)');
  process.exit(0);
}

const prev = new Set(read('scripts/announced-verified.json', []));
const fresh = current.filter((a) => !prev.has(a));
const date = process.env.POST_DATE || new Date().toISOString().slice(0, 10);
const q = (s) => s.replace(/"/g, '\\"');

let made = 0;
for (const appid of fresh) {
  const { title, slug } = meta.get(appid);
  const file = join(root, 'src/content/blog', `${slug}-now-verified.md`);
  if (existsSync(file)) continue;
  writeFileSync(
    file,
    `---
title: "${q(title)} is now verified on Mac"
description: "${q(title)} is verified to run on Apple Silicon through Pixel Port. Here is what that means."
date: ${date}
---

${title} just reached our top compatibility tier: **verified**.

Verified is the highest grade in our honest compatibility map, and it is earned rather than assumed. It means a real Mac ran ${title} end to end on Pixel Port's free runtime. Not a guess, not a community report, a confirmed play on Apple Silicon.

Every game on Pixel Port carries a tier so you always know what to expect before you install: verified (a Mac ran it end to end), playable (graded but not yet hand-verified), needs attention (runs with caveats), and unsupported (a hard blocker like kernel anti-cheat). ${title} just moved to the top of that list.

Want to play it? See [how to play ${title} on Mac](/games/${slug}), or [download Pixel Port](/download) and try it in one click.
`,
  );
  made++;
}

writeFileSync(announcedPath, JSON.stringify(current));
console.log(`announce: ${made} new verified post(s); tracking ${current.length} verified games`);
