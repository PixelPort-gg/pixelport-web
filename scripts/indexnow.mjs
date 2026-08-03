// Submits every sitemap URL to IndexNow after a deploy. Bing, DuckDuckGo,
// Seznam, Yandex and others index from these pings within minutes — a search
// discovery channel fully independent of Google. Run AFTER the deploy is live
// (the key file must be reachable): node scripts/indexnow.mjs
const KEY = '2127b7d03b7c2e6ca8e443ae772c269c';
const HOST = 'pixelport.gg';

const sitemapIndex = await (await fetch(`https://${HOST}/sitemap-index.xml`)).text();
const sitemaps = [...sitemapIndex.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
const urls = [];
for (const sm of sitemaps) {
  const xml = await (await fetch(sm)).text();
  urls.push(...[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]));
}
console.log(`Submitting ${urls.length} URLs from ${sitemaps.length} sitemap(s)`);

// IndexNow accepts up to 10,000 URLs per POST.
for (let i = 0; i < urls.length; i += 10000) {
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList: urls.slice(i, i + 10000),
    }),
  });
  console.log(`Batch ${i / 10000 + 1}: HTTP ${res.status}`);
}
