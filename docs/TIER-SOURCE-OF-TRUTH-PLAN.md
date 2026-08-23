# One source of truth: the served D1 tier

Goal: a tier shown anywhere on pixelport.gg is exactly the tier the API serves at build time. One record, one mapping, no site-side overrides.

## Principle

D1 (via the public API) is the single tier authority. The site becomes a renderer. Anything the bundled app catalogue knows that D1 does not (heuristic grades, anti-cheat facts) gets imported INTO D1 — never patched on top by the site. Site edits can change words, never verdicts.

## Step 0 — Now (pull-list stopgap, no new infra)

1. Fix the 22 named mismatches from the parity audit: flip or downgrade the 15 verified-vs-beta games (verify on-device or edit D1, then re-pull), and re-tier the 7 reason-carrying "Playable" games.
2. Re-run the existing pull scripts in order before every deploy: `refresh-base.mjs` → `pull-d1.mjs` → `pull-compat.mjs` → `build-catalogue.mjs`. Commit the diff. This is the pull-list: a checklist in the deploy runbook until Step 2 automates it.
3. Reconcile Dead by Daylight across /games and /mac to the served record.

## Step 1 — Server: one bulk export endpoint

Add `GET /v1/export/compat` to the worker: `{generated_at, rows:[{appid, tier, unsupported_reason, verified_by, popularity}]}` for the full site universe (one gzipped JSON, edge-cached 15 min). This kills both the 11k per-game fetch problem and the wrangler dependency (`pull-d1.mjs` goes away). Where the bundled catalogue's heuristic grade is the honest one, run a one-time import so D1 carries it — with a distinct tier value (e.g. `expected`) so "tested playable" and "heuristic playable" never share a badge.

## Step 2 — Site: build pulls the export at deploy

1. `npm run prebuild` fetches `/v1/export/compat` → writes `src/data/tiers.json` (committed for reproducibility, refreshed every build in CI).
2. Every lane joins onto `tiers.json` by appid for tier + reason: the grid builder, the curated `[slug].astro` pages, and the /mac pages. Delete tier fields from `games.json`; keep only prose and steps there. Tier-dependent prose ("fully playable", "a real Mac ran it end to end") becomes template copy keyed by the served tier — hardcoded claim strings are what let Portal 2 stay "verified" for months.
3. One mapping function, defined once and shared: `verified→Verified`, `playable→Playable`, `beta→Beta (early)`, `expected/candidate→Untested or Expected-to-run`, `catalogued→Untested`, any `unsupported_reason→Unsupported` with the reason. The grid stops calling candidates Playable.
4. Weekly scheduled deploy (GitHub Actions cron → existing wrangler deploy) so the site re-pulls even with no code commits.

## Step 3 — Guards

1. **Staleness guard**: build fails if `generated_at` is older than 48 h or the fetch fails, with an explicit `ALLOW_STALE=1` escape hatch that stamps a visible "compat data as of <date>" notice in the site footer.
2. **Parity gate in CI**: after build, a script re-fetches the export and diffs every rendered tier against it. Any page above its served tier fails the deploy. This is the regression lock for exactly the drift this audit found.
3. **Downgrade honesty**: removing a Verified badge happens by flipping D1, never by editing the site — so the app, the API, and the site can never disagree again.

## Order and cost

Step 0 today (an hour, restores honesty). Step 1 is a small worker route + one import script. Step 2 is mostly deletion — three pull scripts collapse into one fetch. Step 3 is ~50 lines of CI. End state: one number of games at each tier, and it is the server's number.