// Shared helpers for the /mac/ "does it run?" pages. These pages render
// exactly four honest verdicts and NOTHING about how the runtime does it —
// no engine, graphics-backend, dll, or launch detail ever appears here.

export type CompatTier = 'verified' | 'playable' | 'untested' | 'unsupported';

export interface CompatGame {
  appid: number;
  slug: string;
  name: string;
  tier: CompatTier;
  reason: string | null;
  popularity: number;
}

export const compatMeta: Record<
  CompatTier,
  { label: string; badge: string; dot: string; short: string }
> = {
  verified: {
    label: 'Verified',
    badge: 'text-verified bg-verified/15 ring-verified/35',
    dot: 'bg-verified',
    short: 'Runs — verified on real Macs',
  },
  playable: {
    label: 'Playable',
    // Amber, matching the app's playable tint and the /games catalogue badges.
    badge: 'text-playable bg-playable/15 ring-playable/35',
    dot: 'bg-playable',
    short: 'Playable — community & template confidence',
  },
  untested: {
    label: 'Untested',
    badge: 'text-muted bg-surface-2/70 ring-line',
    dot: 'bg-muted/60',
    short: 'Untested — try it and help grade it',
  },
  unsupported: {
    label: 'Not supported',
    badge: 'text-blocked bg-blocked/15 ring-blocked/35',
    dot: 'bg-blocked',
    short: 'Does not run — honest no',
  },
};

// A game that already ships a macOS build gets a different answer entirely. "Yes,
// it runs through Pixel Port" is true and useless when Steam will hand the player
// a native version for free — so we lead with that instead of with ourselves.
export const nativeCompatMeta = {
  label: 'Native Mac build',
  badge: 'text-verified bg-verified/15 ring-verified/35',
  dot: 'bg-verified',
  short: 'Runs natively — you do not need us',
};

export function nativeVerdict(g: CompatGame): { headline: string; body: string } {
  return {
    headline: `Yes — ${g.name} has a native Mac version.`,
    body: `You do not need Pixel Port for this one. ${g.name} ships a macOS build, and your Steam purchase includes it — install it straight from Steam on your Mac and play. We would rather tell you that than sell you a compatibility layer you have no use for.`,
  };
}

export function nativeMetaDescription(g: CompatGame): string {
  return `Yes — ${g.name} has a native Mac version included with your Steam purchase. Install it straight from Steam; you do not need Pixel Port or any compatibility layer for it.`;
}

export function verdict(g: CompatGame): { headline: string; body: string } {
  switch (g.tier) {
    case 'verified':
      return {
        headline: `Yes — ${g.name} runs on Mac.`,
        body: `Verified on real Apple Silicon hardware: a real Mac took ${g.name} end to end through Pixel Port's runtime — install, launch, and in-game. You need to own ${g.name} on Steam, which is where it downloads from. No Boot Camp, no Windows license, no setup.`,
      };
    case 'playable':
      return {
        headline: `Yes — ${g.name} is playable on Mac.`,
        body: `${g.name} is graded playable on Apple Silicon from community reports and how the game is built. It hasn't been hand-verified on our own Macs yet, so expect an occasional rough edge — and tell us how your run goes. You need to own ${g.name} on Steam; Pixel Port runs the copy Steam delivers.`,
      };
    case 'untested':
      return {
        headline: `Untested — nobody has confirmed ${g.name} on Mac yet.`,
        body: `${g.name} is in the Pixel Port catalogue, but no one has confirmed a full run on Apple Silicon so far. We only claim what we've seen. If you own it on Steam, try it — your result helps grade it for everyone.`,
      };
    case 'unsupported':
      return {
        headline: `No — ${g.name} doesn't run on Mac right now.`,
        body: `We're not going to pretend otherwise: ${g.name} is blocked on Apple Silicon, and it's not something Pixel Port — or any compatibility tool — can honestly work around today.`,
      };
  }
}

export function metaDescription(g: CompatGame): string {
  switch (g.tier) {
    case 'verified':
      return `Yes — ${g.name} runs on Apple Silicon Macs, verified end to end on real hardware through Pixel Port's runtime. One-click install of the Steam copy you own, no Boot Camp.`;
    case 'playable':
      return `Yes — ${g.name} is playable on Apple Silicon Macs through Pixel Port, graded from community and catalogue confidence. One-click install of the Steam copy you own.`;
    case 'untested':
      return `${g.name} is untested on Apple Silicon so far. It's in the Pixel Port catalogue — try it on your Mac and help grade it for everyone.`;
    case 'unsupported':
      return `Honest answer: no — ${g.name} doesn't run on Apple Silicon Macs right now, and we won't pretend otherwise. Here's the real reason, plus verified games that do run.`;
  }
}

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
