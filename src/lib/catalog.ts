// Shared catalogue helpers so the games index and game pages stay in sync.

import { compatibilityMeta, compatibilityLabel, assessmentSummary } from './compatibility.mjs';
export type Tier = 'pixelport_verified' | 'player_tested' | 'issues_reported' | 'untested' | 'blocked';
export const tierMeta = compatibilityMeta;
export const nativeMacMeta = {
  label: 'Native Mac build', text: 'text-verified', badge: 'text-verified bg-verified/15 ring-verified/35',
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
// contract-based compatibility copy generated from its compat facts.
export function generate(e: any) {
  const base = {
    slug: e.slug, title: e.title, appid: e.appid, tier: e.tier, label: compatibilityLabel(e), verified_by: e.verified_by, unsupported_reason: e.unsupported_reason, verified_on: e.verified_on, verified_conditions: e.verified_conditions, genre: null,
    // Ownership leads the list on purpose. Pixel Port distributes nothing — Steam
    // delivers the build to the player's own account — and every game page has to
    // say so, not just the hand-written ones.
    requirements: [`${e.title}, owned on your own Steam account`, 'Apple Silicon (M1 or newer)', 'macOS 14.0+'],
    engine: e.engine, d3d: e.d3d, antiCheat: e.antiCheat, graphics: e.graphics,
    nativeMac: !!e.nativeMac, _cat: true,
  };
  if (base.label === 'blocked') return { ...base, summary: assessmentSummary(e, e.title) };
  // Already ships a Mac build → the useful answer is "use that", not our pitch.
  // We keep the page (it is what people search for) but it must not open by
  // selling a download nobody here needs.
  if (base.nativeMac) {
    const tierWord = compatibilityMeta[base.label].label;
    return {
      ...base,
      // Deliberately hedged: Steam advertising a Mac build does not prove the
      // build still runs. Plenty of pre-2019 Mac ports were never updated past
      // 32-bit and died at Catalina (Borderlands 2 is our documented case). We
      // can say what Steam lists; we cannot promise it launches.
      summary: `Steam lists a native Mac version of ${e.title}, and your Steam purchase includes it — install that first. It needs no compatibility layer at all, which makes it the simplest path by far.`,
      requirements: [`${e.title}, owned on your own Steam account`, 'A Mac — Steam serves the native build automatically'],
      steps: [
        {
          title: 'Install it from Steam',
          body: `Open Steam on your Mac and install ${e.title} as normal. Steam serves the macOS build automatically. No compatibility layer, and nothing else to set up.`,
        },
        {
          title: 'If the native build does not run',
          body: `Some older Mac ports were never updated past 32-bit and stopped working at macOS Catalina. If that turns out to be the case here — or you need the Windows build for Windows-only mods — the Windows version has the PixelPort label ${tierWord}. Read its current assessment before trying it.`,
        },
      ],
    };
  }
  const summary = assessmentSummary(e, e.title);
  return {
    ...base,
    summary,
    steps: [
      { title: 'Install Pixel Port', body: 'Download Pixel Port, move it to Applications, and follow its sign-in and runtime setup prompts.' },
      // "Pixel Port fetches it" used to live here, and it read as though we shipped
      // the game. Steam downloads the build, to the player's own account; we
      // configure and launch what Steam delivered.
      { title: `Install ${e.title}`, body: `Sign in to the Steam account that owns ${e.title}. For the normal Steam route, choose Install and let downloading and preparation finish. Follow any warning for your Mac or selected runtime.` },
      { title: 'Play', body: 'Start the game from your Library in Pixel Port using the launch action for the selected copy, such as Play via Steam or Launch Game. This applies its per-game launch settings.' },
    ],
  };
}

// Portrait cover (2:3), matching the app's cover treatment: Pixel Port's mirror first (it serves
// games whose Steam art only exists under the newer hashed paths, where the legacy URL 404s), then
// Steam's legacy library art as the single fallback these consumers walk.
export function coverUrl(appid: number | null): string | null {
  return appid ? `https://mgp-api.macgameport.workers.dev/art/${appid}.jpg` : null;
}
export function coverFallbackUrl(appid: number | null): string | null {
  return appid ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_600x900.jpg` : null;
}
