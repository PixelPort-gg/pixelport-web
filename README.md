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

## Compatibility labels

The website implements [compatibility-labels/1](https://github.com/PixelPort-gg/pixelport-app/blob/b3d0c8b9/server/contracts/compatibility/README.md). `src/lib/compatibility.mjs` resolves `tier`, `verified_by` and `unsupported_reason` into Untested, Player-tested, PixelPort verified, Issues reported or Blocked. Availability remains separate.

`pull-d1.mjs` saves complete assessments to `scripts/catalogue-assessments.json`; `pull-compat.mjs` preserves the same public fields for `/mac` pages. `build-catalogue.mjs` applies the complete assessment to both page families, including explicit nulls that clear old claims or reasons. The committed seed uses the app's bundled catalogue and reviewed migration assessments at `b3d0c8b9`; the next normal sync replaces it with D1. `refresh-base.mjs [path-to-app-catalogue.json]` also preserves the assessment fields. The former verified-only ID list retains old page URLs and never earns a label.

Run `npm test` for every shared provenance and label fixture, plus website regressions. After `npm run build`, run `npm run test:pages` for the five representative labels, availability, structured data, help and historical announcements. Fixtures in `tests/fixtures/compatibility.json` are copied unchanged from app `b3d0c8b928b031fdea779be442b4d7c4ec5e901c`. Both `npm test` and `npm run build` check their Git blob digest against upstream `50f0d39f34d3a2455b19aad167b959541bf4e46a`, pinned in `scripts/check-contract-fixtures.mjs`. The check is offline and fails on any byte drift. It deliberately targets that contract revision rather than following app `main`. To adopt a newer contract, verify its upstream blob and update the reader, fixtures and source pin together.
