// GET /download
//
// Serves the latest Pixel Port DMG from pixelport.gg itself. It pulls the newest
// release from GitHub (via the public Sparkle appcast) and streams the binary back
// through our domain, so the user never gets bounced to github.com. The versioned
// asset is cached at Cloudflare's edge, so only the first request per release hits
// GitHub.
const APPCAST = 'https://github.com/seanellul/pixelport-dist/releases/latest/download/appcast.xml';
const FALLBACK = 'https://github.com/seanellul/pixelport-dist/releases/latest';

export async function onRequest(context) {
  const { request } = context;
  try {
    const xml = await fetch(APPCAST, { cf: { cacheTtl: 300 } }).then((r) => r.text());

    // The appcast lists items newest-first; grab the first .dmg enclosure URL.
    const match = xml.match(/url="([^"]+\.dmg)"/i);
    if (!match) return Response.redirect(FALLBACK, 302);
    const assetUrl = match[1];
    const filename = assetUrl.split('/').pop();

    // Serve from the edge cache when we already have this exact (versioned) build.
    const cache = caches.default;
    const cacheKey = new Request(assetUrl, request);
    let response = await cache.match(cacheKey);

    if (!response) {
      const upstream = await fetch(assetUrl, { cf: { cacheEverything: true, cacheTtl: 86400 } });
      if (!upstream.ok) return Response.redirect(FALLBACK, 302);

      response = new Response(upstream.body, upstream);
      response.headers.set('Content-Type', 'application/x-apple-diskimage');
      response.headers.set('Content-Disposition', `attachment; filename="${filename}"`);
      response.headers.set('Cache-Control', 'public, max-age=86400');
      context.waitUntil(cache.put(cacheKey, response.clone()));
    }

    return response;
  } catch {
    return Response.redirect(FALLBACK, 302);
  }
}
