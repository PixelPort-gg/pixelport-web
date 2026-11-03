// Shared helpers for the /mac/ "does it run?" pages. These pages render
// the five shared compatibility labels without recipe or launch internals.

import { compatibilityLabel, compatibilityMeta, assessmentSummary } from './compatibility.mjs';
export type CompatTier = 'pixelport_verified' | 'player_tested' | 'issues_reported' | 'untested' | 'blocked';
export interface CompatGame {
  appid: number; slug: string; name: string; tier: string; label: CompatTier;
  verified_by: string | null; unsupported_reason: string | null;
  verified_on: string | null; verified_conditions: string | null;
  reason: string | null; popularity: number;
}
export const compatMeta = compatibilityMeta;

// A game that already ships a macOS build gets a separate native-build answer. Its Windows compatibility label stays visible.
export const nativeCompatMeta = {
  label: 'Native Mac build',
  badge: 'text-verified bg-verified/15 ring-verified/35',
  dot: 'bg-verified',
  short: 'Runs natively — you do not need us',
};

export function nativeVerdict(g: CompatGame): { headline: string; body: string } {
  return {
    headline: `Yes — ${g.name} has a native Mac version.`,
    body: `Start there, not with us: Steam lists a macOS build of ${g.name} and your Steam purchase includes it, so install that first. We would rather tell you that than sell you a compatibility layer you have no use for. If the native build turns out to be an old one that no longer runs on modern macOS, read the Windows version's current compatibility label before trying it through PixelPort.`,
  };
}

export function nativeMetaDescription(g: CompatGame): string {
  return `Yes — ${g.name} has a native Mac version included with your Steam purchase, so install that first. You do not need Pixel Port or any compatibility layer for it.`;
}

export function verdict(g: CompatGame): { headline: string; body: string } {
  const label = compatibilityLabel(g);
  const meta = compatMeta[label];
  return { headline: `${meta.label}: ${g.name} on Mac.`, body: assessmentSummary(g, g.name) };
}
export function metaDescription(g: CompatGame): string { return assessmentSummary(g, g.name); }

export const pagePath = (g: CompatGame) => `/mac/${g.slug}-${g.appid}/`;

// Portrait art: Pixel Port's mirrored art first, then Steam's CDN. The inline
// onerror handler walks this fallback list, so a 404 anywhere degrades to the
// styled title placeholder instead of a broken image.
export const artChain = (appid: number) => ({
  src: `https://mgp-api.macgameport.workers.dev/art/${appid}.jpg`,
  fallbacks: [
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_600x900.jpg`,
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`,
  ].join('|'),
});

// Landscape Steam header — reliable CDN, right shape for OpenGraph cards.
export const ogImage = (appid: number) =>
  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`;

export const ART_ONERROR =
  "var f=(this.dataset.fb||'').split('|').filter(Boolean);if(f.length){this.src=f.shift();this.dataset.fb=f.join('|')}else{this.remove()}";
