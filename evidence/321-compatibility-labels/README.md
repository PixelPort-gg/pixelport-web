# Compatibility label verification

Before: `11cab0c341b74ce3b8b9418088c6cc8e6a1c5380` (PR #14).
After source: `218cbef05d7f6c87098833cdcf5d0cdc1bb1eecc`.
Captured on 3 November 2026 with local Chrome at 1440 × 1000. External artwork and live telemetry requests were disabled for both captures; the site's cover fallbacks remain visible. The additional mobile capture uses 390 × 844.

| State | Route | Before | After |
| --- | --- | --- | --- |
| Five-label catalogue | `/games/` | [Before](before-catalogue.png) | [After](after-catalogue.png) |
| PixelPort verified | `/games/palworld/` | [Before](before-verified.png) | [After](after-verified.png) |
| Player-tested | `/games/dishonored/` | [Before](before-player-tested.png) | [After](after-player-tested.png) |
| Issues reported | `/games/chained-together/` | [Before](before-issues.png) | [After](after-issues.png) |
| Untested, available to try | `/games/cs2/` | [Before](before-untested.png) | [After](after-untested.png) |
| Blocked | `/games/apex-legends/` | [Before](before-blocked.png) | [After](after-blocked.png) |

The same five games pass generated-page checks on `/mac/` as well. `npm test` runs 40 checks including all 11 shared provenance cases and 25 label cases. `npm run test:pages` runs 14 generated-page checks. `ASTRO_TELEMETRY_DISABLED=1 npm run build` produces 5,557 pages. The baseline and updated build have identical HTML route sets.

Local browser checks exercised all five catalogue filters, a deep-linked Issues reported filter, and Counter-Strike 2 search. They confirmed the actual card labels and separate Available to try message. Nine catalogue, game, Mac and stats routes had no horizontal overflow at 390 px, and no browser runtime errors occurred.

The full HTML audit parsed structured data and checked 225,418 internal links/anchors across 5,557 HTML files. It found 6,731 existing missing-page link occurrences in the 45 A–Z directory pages; every occurrence is also present in the baseline. There are no newly broken links or anchors. The existing `/download` Pages Function is outside static-file resolution. No production catalogue refresh or post-merge production check was run.

[The planned Wiki update](wiki-update.md) prepares the one-line update to **Recipes and compatibility → Compatibility labels**. It adds the website to the consumers of the shared rule and fixtures. Publish it only after the source PR merges.
