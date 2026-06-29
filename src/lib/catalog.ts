// Shared catalogue helpers so the games index and game pages stay in sync.

export type Tier = 'verified' | 'playable' | 'needs-attention' | 'unsupported';

export const tierMeta: Record<Tier, { label: string; text: string; badge: string }> = {
  verified: { label: 'Verified', text: 'text-verified', badge: 'text-verified bg-verified/15 ring-verified/35' },
  playable: { label: 'Playable', text: 'text-playable', badge: 'text-playable bg-playable/15 ring-playable/35' },
  'needs-attention': { label: 'Needs attention', text: 'text-attention', badge: 'text-attention bg-attention/15 ring-attention/35' },
  unsupported: { label: 'Unsupported', text: 'text-blocked', badge: 'text-blocked bg-blocked/15 ring-blocked/35' },
};

// Steam's portrait library art (2:3), matching the app's cover treatment.
export function coverUrl(appid: number | null): string | null {
  return appid ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_600x900.jpg` : null;
}
export function coverFallbackUrl(appid: number | null): string | null {
  return appid ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg` : null;
}
