# Compatibility label verification

Before: `11cab0c341b74ce3b8b9418088c6cc8e6a1c5380` (PR #14).
Initial after source: `218cbef05d7f6c87098833cdcf5d0cdc1bb1eecc`.
Captured on 3 November 2026 with local Chrome at 1440 × 1000. External artwork and live telemetry requests were disabled for both captures; the site's cover fallbacks remain visible. The additional mobile capture uses 390 × 844.

| State | Route | Before | After |
| --- | --- | --- | --- |
| Five-label catalogue | `/games/` | [Before](before-catalogue.png) | [After](after-catalogue.png) |
| PixelPort verified | `/games/palworld/` | [Before](before-verified.png) | [After](after-verified.png) |
| Player-tested | `/games/dishonored/` | [Before](before-player-tested.png) | [After](after-player-tested.png) |
| Issues reported | `/games/chained-together/` | [Before](before-issues.png) | [After](after-issues.png) |
| Untested, available to try | `/games/cs2/` | [Before](before-untested.png) | [After](after-untested.png) |
| Blocked | `/games/apex-legends/` | [Before](before-blocked.png) | [After](after-blocked.png) |

The same five games pass generated-page checks on `/mac/` as well. `npm test` runs 41 checks including all 11 shared provenance cases and 25 label cases. `npm run test:pages` runs 24 generated-page checks, including the review regressions below. `ASTRO_TELEMETRY_DISABLED=1 npm run build` produces 5,557 pages. The baseline and updated build have identical HTML route sets.

Local browser checks exercised all five catalogue filters, a deep-linked Issues reported filter, and Counter-Strike 2 search. They confirmed the actual card labels and separate Available to try message. Nine catalogue, game, Mac and stats routes had no horizontal overflow at 390 px, and no browser runtime errors occurred.

The initial full HTML audit at `d1b854cf` parsed structured data and checked 225,418 internal links/anchors across 5,557 HTML files. It found 6,731 existing missing-page link occurrences in the 45 A–Z directory pages; every occurrence is also present in the baseline. There are no newly broken links or anchors. The existing `/download` Pages Function is outside static-file resolution. No production catalogue refresh or post-merge production check was run.

[The planned Wiki update](wiki-update.md) prepares the one-line update to **Recipes and compatibility → Compatibility labels**. It adds the website to the consumers of the shared rule and fixtures. Publish it only after the source PR merges.

## Review corrections

Source: `cfdab4a264bf02b35b4817c45e63e49cd2318138`. [Review findings](https://github.com/PixelPort-gg/pixelport-web/pull/16#pullrequestreview-5750045594).

Ten new generated-page regressions failed on `d1b854cf` and pass after the corrections. They check the visible and structured native answers for all seven reported Untested guides, the setup FAQs for Battlefield 6 and Modern Warfare II, and both catalogue hubs' labels and counts. Native-platform facts are separate from the contract assessment; Valheim's native Mac listing was also confirmed against [Steam's current system requirements](https://store.steampowered.com/app/892970/Valheim/).

The upstream fixture was verified through GitHub at app revision `b3d0c8b928b031fdea779be442b4d7c4ec5e901c`, blob `50f0d39f34d3a2455b19aad167b959541bf4e46a`. Both unit tests and builds run the offline digest guard. A negative test confirms that even a one-byte edit is rejected.

The updated build passed with 5,557 pages. All 41 unit tests and 24 generated-page tests passed. The 15 corrected game/hub pages passed structured-data parsing and all 581 internal links/anchors. Five corrected routes had no mobile overflow at 390 px or browser runtime errors. No catalogue data or route set changed. The full-audit directory gaps above remain inherited limits.

Additional captures use the same local Chrome settings as the initial evidence; before is `d1b854cf`, after is the corrected source above.

| Corrected surface | Before | After |
| --- | --- | --- |
| Lethal Company native FAQ | [Before](review-corrections/before-native-faq.png) | [After](review-corrections/after-native-faq.png) |
| Valheim native masthead | [Before](review-corrections/before-native-masthead.png) | [After](review-corrections/after-native-masthead.png) |
| Battlefield 6 FAQ | [Before](review-corrections/before-untested-faq.png) | [After](review-corrections/after-untested-faq.png) |
| Verified hub | [Before](review-corrections/before-verified-hub.png) | [After](review-corrections/after-verified-hub.png) |
| Anti-cheat hub | [Before](review-corrections/before-anti-cheat-hub.png) | [After](review-corrections/after-anti-cheat-hub.png) |
