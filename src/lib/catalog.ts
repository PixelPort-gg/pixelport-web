// Shared catalogue helpers so the games index and game pages stay in sync.

export type Tier = 'verified' | 'playable' | 'needs-attention' | 'unsupported';

// Games that already ship a macOS build. Not a tier — it sits alongside one,
// because "it runs under Pixel Port" and "you don't need Pixel Port" can both be
// true at once, and the second is the more useful answer.
export const nativeMacMeta = {
  label: 'Native Mac build',
  text: 'text-verified',
  badge: 'text-verified bg-verified/15 ring-verified/35',
};

export const tierMeta: Record<Tier, { label: string; text: string; badge: string }> = {
  verified: { label: 'Verified', text: 'text-verified', badge: 'text-verified bg-verified/15 ring-verified/35' },
  playable: { label: 'Playable', text: 'text-playable', badge: 'text-playable bg-playable/15 ring-playable/35' },
  'needs-attention': { label: 'Needs attention', text: 'text-attention', badge: 'text-attention bg-attention/15 ring-attention/35' },
  unsupported: { label: 'Unsupported', text: 'text-blocked', badge: 'text-blocked bg-blocked/15 ring-blocked/35' },
};

const ENGINE: Record<string, string> = {
  unity: 'Unity', unreal: 'Unreal Engine', godot: 'Godot', gamemaker: 'GameMaker',
  source: 'Source', source2: 'Source 2', renpy: "Ren'Py", rpgmaker: 'RPG Maker',
  electron: 'Electron', java: 'Java', custom: 'Custom engine', native: 'Native',
};
export const engineLabel = (e: string | null) =>
  e ? ENGINE[e] ?? e.charAt(0).toUpperCase() + e.slice(1) : null;

const AC: Record<string, string> = {
  none: 'None', eac: 'Easy Anti-Cheat', 'eac-kernel': 'Easy Anti-Cheat (kernel)',
  battleye: 'BattlEye', vanguard: 'Riot Vanguard', gameguard: 'GameGuard',
  xigncode: 'XIGNCODE3', vac: 'VAC', denuvo: 'Denuvo Anti-Cheat',
};
export const prettyAC = (ac: string | null) => (!ac ? 'None' : AC[ac] ?? ac);

// Turn a bare catalogue entry into a complete, render-ready game object with
// honest, tier-appropriate copy generated from its compat facts.
export function generate(e: any) {
  const base = {
    slug: e.slug, title: e.title, appid: e.appid, tier: e.tier, genre: null,
    // Ownership leads the list on purpose. Pixel Port distributes nothing — Steam
    // delivers the build to the player's own account — and every game page has to
    // say so, not just the hand-written ones.
    requirements: [`${e.title}, owned on your own Steam account`, 'Apple Silicon (M1 or newer)', 'macOS 14+'],
    engine: e.engine, d3d: e.d3d, antiCheat: e.antiCheat, graphics: e.graphics,
    nativeMac: !!e.nativeMac, _cat: true,
  };
  if (e.tier === 'unsupported') {
    const ac = prettyAC(e.antiCheat);
    return {
      ...base,
      summary: `${e.title} does not run on Mac through Pixel Port, and the blocker is its anti-cheat, not its graphics.`,
      blocker: {
        antiCheat: ac === 'None' ? 'kernel-level anti-cheat' : ac,
        whoDecides: 'the publisher',
        status: `${e.title} ships anti-cheat that does not run on macOS. Whether it ever will is a decision for the publisher to make, not something Pixel Port can work around.`,
      },
    };
  }
  // Already ships a Mac build → the useful answer is "use that", not our pitch.
  // We keep the page (it is what people search for) but it must not open by
  // selling a download nobody here needs.
  if (base.nativeMac) {
    const tierWord = e.tier === 'verified' ? 'verified' : e.tier === 'needs-attention' ? 'graded needs attention' : 'graded playable';
    return {
      ...base,
      summary: `${e.title} already has a native Mac version, and your Steam purchase includes it. Install that from Steam and play — you do not need Pixel Port for this one.`,
      requirements: [`${e.title}, owned on your own Steam account`, 'A Mac — Steam serves the native build automatically'],
      steps: [
        {
          title: 'Install it from Steam',
          body: `Open Steam on your Mac and install ${e.title} as normal. Steam serves the macOS build automatically. No compatibility layer, and nothing else to set up.`,
        },
        {
          title: 'Only if you need the Windows build',
          body: `Some players want the Windows version anyway — Windows-only mods are the usual reason. Pixel Port runs it, ${tierWord} on Apple Silicon. That is the only reason to use us for ${e.title}.`,
        },
      ],
    };
  }
  const summary =
    e.tier === 'verified'
      ? `${e.title} is verified on Apple Silicon: a real Mac ran it end to end through Pixel Port's runtime.`
      : e.tier === 'needs-attention'
        ? `${e.title} runs on Pixel Port's runtime with some caveats, so we have it marked needs attention while we smooth it out.`
        : `${e.title} is graded playable on Apple Silicon through Pixel Port's runtime.`;
  return {
    ...base,
    summary,
    steps: [
      { title: 'Install Pixel Port', body: 'Download Pixel Port and let it set up the runtime on first launch.' },
      // "Pixel Port fetches it" used to live here, and it read as though we shipped
      // the game. Steam downloads the build, to the player's own account; we
      // configure and launch what Steam delivered.
      { title: `Add ${e.title}`, body: `Sign in to your Steam account and click Install & Play. Steam downloads the Windows build you already own, and Pixel Port configures it for your Mac automatically.` },
      { title: 'Play', body: 'Launch it from your Library. No bottles, no winetricks, no terminal.' },
    ],
  };
}

// Steam's portrait library art (2:3), matching the app's cover treatment.
export function coverUrl(appid: number | null): string | null {
  return appid ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_600x900.jpg` : null;
}
export function coverFallbackUrl(appid: number | null): string | null {
  return appid ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg` : null;
}
