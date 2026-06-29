# Pixel Port — website

Marketing + catalogue + docs for Pixel Port (https://pixelport.gg). Deploys to Cloudflare Pages.
Separate from the macOS app repo. Brand: Deep Amethyst (amethyst #9268FF / teal #3FD6CE on deep violet-black).

## Stack
Astro 7 + Tailwind v4 + MDX + sitemap. Static output (zero-JS pages → fast + SEO).

## Develop
```
npm install
npm run dev      # local dev
npm run build    # static build -> dist/
npm run preview  # serve the build
```

## Structure
- `/`              landing (animated mark hero, honest-compat pitch, download)
- `/games`         catalogue index  ·  `/games/[slug]` per-game "play X on Mac" guide (JSON-LD)
- `/docs`          how the runtime/recipes/tiers work (content collection)
- `/blog`          updates (content collection)
- `/stats`         porting stats
- `src/data/games.json`  the game-page source (wire to the live catalogue later)
