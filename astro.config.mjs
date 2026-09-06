// @ts-check
import { readFileSync, readdirSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const SITE = 'https://pixelport.gg';
const readJson = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));

// A game with both a /games/<slug>/ guide and a /mac/<slug>-<appid>/ verdict page
// canonicalises to the guide (see src/pages/mac/[slug].astro), so only the guide
// belongs in the sitemap. Same appid ⇒ same game.
const guideAppids = new Set(
  [...readJson('./src/data/games.resolved.json'), ...readJson('./src/data/catalogue.json')]
    .map((g) => g.appid)
    .filter(Boolean),
);
const duplicateMacPaths = new Set(
  readJson('./src/data/compat.json')
    .games.filter((g) => guideAppids.has(g.appid))
    .map((g) => `${SITE}/mac/${g.slug}-${g.appid}/`),
);

// Real last-modified dates only. A sitemap whose lastmod is always "now" gets
// ignored, so pages without a genuine date simply omit it.
const lastmod = new Map();
for (const g of readJson('./src/data/games.resolved.json')) {
  if (g.slug && g.lastTested) lastmod.set(`${SITE}/games/${g.slug}/`, g.lastTested);
}
for (const file of readdirSync(new URL('./src/content/blog', import.meta.url))) {
  const src = readFileSync(new URL(`./src/content/blog/${file}`, import.meta.url), 'utf8');
  const date = src.match(/^updated:\s*["']?(\d{4}-\d{2}-\d{2})/m) ?? src.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})/m);
  if (date) lastmod.set(`${SITE}/blog/${file.replace(/\.mdx?$/, '')}/`, date[1]);
}

// https://astro.build/config
export default defineConfig({
  site: SITE,
  // Every page builds to <path>/index.html, which Cloudflare Pages serves at
  // <path>/ (and 308-redirects <path> to it). Linking the slashed form everywhere
  // keeps crawlers and link equity off the redirect; 'always' makes dev fail
  // loudly on a link that misses it.
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !duplicateMacPaths.has(page),
      serialize: (item) => {
        const date = lastmod.get(item.url);
        return date ? { ...item, lastmod: date } : item;
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
