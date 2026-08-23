# PixelPort site-vs-server tier parity audit (2026-08-22)

Method: crawled https://pixelport.gg (UA `Mozilla/5.0 pixelport-parity-audit`) — home, /games/verified, /games/all/1, game detail pages, /mac pages, and /catalogue-grid.json (the data behind every browse badge: 11,049 games — 10,596 Playable, 58 Verified, 308 Unsupported, 87 Needs attention). Checked 1,020 appids against https://mgp-api.macgameport.workers.dev/v1/game/<appid>: all 58 Verified, top-300 Playable by popularity, 650 long-tail Playable, and the 21 curated anticheat blocker appids. Raw responses: scratchpad/results.tsv + r2.tsv.

## Headline

| Class | Sampled | Mismatch | Extrapolated |
|---|---|---|---|
| Advertised **Playable**, served `candidate` (untested) | 950 | **909 (95.7%)** | ~10,000 of 10,596 |
| Advertised **Verified**, served `beta` | 58 | **15 (26%)** | exact (full set checked) |
| Advertised **Playable**, served with `unsupported_reason` | 950 | **7** | dozens likely in the unchecked tail |
| Advertised Playable, served `beta` | 950 | 31 | site maps beta→Playable by design; borderline |
| Advertised game returns `not_found` | 1,020 | **0** | none found; 2 grid rows have null appid |

Only **3 of 950** sampled advertised-Playable games are served exactly `playable` (Dark Souls PtDE, Skyrim SE, Dwarf Fortress). 43 of 58 Verified match.

## 1. Site VERIFIED, server serves beta (15 games — full list)

| Appid | Game | Site | Served | Source of the site claim | Action |
|---|---|---|---|---|---|
| 2379780 | Balatro | verified ("a real Mac ran it end to end") | beta | stale d1-verified build snapshot | Flip D1 to verified if the evidence exists, else downgrade page |
| 322330 | Don't Starve Together | verified | beta | stale d1-verified snapshot | same |
| 427520 | Factorio | verified | beta | stale d1-verified snapshot | same |
| 632470 | Disco Elysium - The Final Cut | verified | beta | stale d1-verified snapshot | same |
| 220 | Half-Life 2 | verified | beta | hardcoded src/data/games.json | Re-verify on-device or downgrade; stop hardcoding |
| 620 | Portal 2 | verified | beta | hardcoded games.json | same |
| 814380 | Sekiro: Shadows Die Twice | verified | beta | hardcoded games.json | same |
| 570940 | Dark Souls: Remastered | verified | beta (recipe ac=other) | hardcoded games.json | same; anticheat note |
| 1326470 | Sons of the Forest | verified | beta | hardcoded games.json | same |
| 1966720 | Lethal Company | verified | beta | hardcoded games.json | same |
| 632360 | Risk of Rain 2 | verified | beta | hardcoded games.json | same |
| 753640 | Outer Wilds | verified | beta | hardcoded games.json | same |
| 1057090 | Ori and the Will of the Wisps | verified | beta | hardcoded games.json | same |
| 387290 | Ori and the Blind Forest: DE | verified | beta | hardcoded games.json | same |
| 1366540 | Dyson Sphere Program | verified | beta | in CURRENT local d1-verified.json but server now serves beta — server flipped back after the pull | same; shows why upgrade-only sync rots |

Note: only 1 of the 15 is in the current local `scripts/d1-verified.json` (49 appids). The deployed build used an even older snapshot, and curated hardcodes never re-check. Verified claims on the site outlive the server's own verdict.

## 2. Advertised Playable, server carries an unsupported_reason (7 found in sample)

| Appid | Game | Site | Served tier | Served reason | Action |
|---|---|---|---|---|---|
| 268420 | Aura Kingdom | playable | candidate | Blocked by Unknown (Custom) anti-cheat — cannot play | Show Unsupported |
| 389430 | Knight Online | playable | candidate | Blocked by X-Trap, PunkBuster, XIGNCODE3 | Show Unsupported |
| 555570 | Infestation: The New Z | playable | candidate | Blocked by Fredaikis Anti-Cheat | Show Unsupported |
| 755790 | Ring of Elysium | playable | candidate | Blocked by TenProtect | Show Unsupported |
| 1692070 | CROWZ | playable | candidate | Blocked by XIGNCODE3 | Show Unsupported |
| 45500 | Clickr | playable | candidate | Blocked by VAC | Show Unsupported |
| 8930 | Sid Meier's Civilization V | playable | beta | Pre-D3D DirectShow page fault at startup (known not-recipe-fixable) | Show Unsupported / needs-attention |

These ship a "Playable on Mac" page for games the server says cannot run. Direct r/macgaming credibility risk.

## 3. Dead by Daylight (381210): three answers on one site

| Surface | Claim |
|---|---|
| /games/dead-by-daylight + browse grid | "Playable on Mac ... graded playable" |
| /mac/dead-by-daylight-381210 | "Does not run · honest no" (from compat.json snapshot of 2026-08-12) |
| Served /v1/game/381210 | tier=beta, unsupported_reason=null, recipe antiCheat=eac-usermode |

The server record changed after 08-12 (a dxvk recipe shipped at beta). Both site lanes are stale in opposite directions. Action: reconcile both pages to the served record; decide the public wording for eac-usermode online play (solo vs online caveat) once, server-side.

## 4. Systemic: "Playable" badge vs served `candidate` (~10,000 games)

The browse grid and every long-tail detail page grade games from the app's bundled catalogue, which marks ~10.5k games playable by heuristic. D1 serves `candidate` for 95.7% of the sample. The site's own /mac lane maps `candidate` → "untested" — so the same game is "Playable" in /games and "untested" in /mac. Action: one of two honest fixes — (1) relabel the heuristic grade on the site ("Expected to run", distinct badge), or (2) import the bundled-catalogue grading into D1 so the server serves the claim the site makes. Not both lanes disagreeing.

## 5. not_found: clean

All 1,020 checked appids exist on the server (HTTP 200). No advertised game 404s in the sample. Two grid rows carry null appids (cosmetic).

## 6. Mechanism (how tiers reach the site)

All static, build-time, manually refreshed, committed snapshots in /Users/seanellul/Code/Web/pixelport-web:

| Lane | Pages | Tier source | Refresh |
|---|---|---|---|
| Browse grid + catalogue pages | /games/all/N, /games/<slug> (long tail) | `scripts/catalogue-base.json` = copy of the APP's bundled catalogue (`refresh-base.mjs` reads ~/MacGamePort/App/Sources/PortingEngine/Catalogue/catalogue.json) via `build-catalogue.mjs` → public/catalogue-grid.json + src/data/catalogue.json | manual |
| Curated pages | 40 rich /games/<slug> pages | `src/data/games.json` — tiers AND prose hardcoded; d1-verified.json can only upgrade to verified | manual, never downgrades |
| /mac compat pages | /mac/<slug>-<appid> | `src/data/compat.json` pulled from the public API by `pull-compat.mjs` | manual; committed snapshot fetched_at **2026-08-12** (10 days stale) |

D1 is consulted only for the verified set + popularity (`pull-d1.mjs`, wrangler). `build-catalogue.mjs` documents the choice: "D1's own tier column mislabels popular anti-cheat games as candidate... we trust the bundled catalogue for tiers." There is no deploy-time pull, no staleness guard, and no parity check between the three lanes or against the server.