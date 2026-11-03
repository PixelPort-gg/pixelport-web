// compatibility-labels/1. Label reader from pixelport-app b3d0c8b9.
// Keep in step with server/contracts/compatibility and its shared fixtures.
const POSITIVE_TIERS = new Set(['verified', 'playable', 'beta']);
export const PROVENANCE_HEADS = new Map([
  // PixelPort ran its own gameplay checks, or confirmed an accepted problem itself.
  ["pixelport", "pixelport"], ["first-party", "pixelport"], ["firstparty", "pixelport"],
  ["human", "pixelport"], ["curated", "pixelport"], ["bench", "pixelport"],
  // Fleet telemetry. Launch health only: it never supports a gameplay claim.
  ["field", "field"], ["fleet", "field"], ["telemetry", "field"],
  // An accepted first-hand player report.
  ["community", "community"], ["player", "community"], ["player-tested", "community"],
  ["community-verified", "community"],
  // Synthesized or template-derived. No evidence either way.
  ["ai", "ai"], ["synth", "ai"], ["synthesized", "ai"], ["synthesised", "ai"], ["template", "ai"],
]);

/// Split a raw `verified_by` into its canonical head and optional attribution tail.
/// Returns `{ head: null, tail: "" }` for blank or unrecognised values: they support no claim.
export function parseProvenance(raw) {
  if (typeof raw !== "string") return { head: null, tail: "" };
  const trimmed = raw.trim();
  const cut = trimmed.search(/[:/]/);
  const headRaw = (cut < 0 ? trimmed : trimmed.slice(0, cut)).trim().toLowerCase();
  const tail = cut < 0 ? "" : trimmed.slice(cut + 1).trim();
  return { head: PROVENANCE_HEADS.get(headRaw) ?? null, tail };
}

function normalizedTier(tier) {
  return typeof tier === "string" ? tier.trim() : "";
}

/// The public label for a stored assessment `{tier, verified_by, unsupported_reason}`.
///
/// A positive tier alone proves nothing: unlocks, signatures, templates, launch success and
/// telemetry can all leave one behind. A gameplay claim therefore needs the provenance that earns it,
/// so an importer or aggregator that restores a bare `verified`/`playable`/`beta` cannot restore a
/// claim.
export function compatibilityLabel(row = {}) {
  const reason = row.unsupported_reason;
  if (typeof reason === "string" && reason.trim()) return "blocked";
  const tier = normalizedTier(row.tier);
  const { head } = parseProvenance(row.verified_by);
  if (tier === "regressed") {
    // An accepted problem names who accepted it, or keeps the earlier test's provenance.
    return head === "pixelport" || head === "community" ? "issues_reported" : "untested";
  }
  if (tier === "verified" && head === "pixelport") return "pixelport_verified";
  if (POSITIVE_TIERS.has(tier) && head === "community") return "player_tested";
  // A PixelPort staff member's first-hand gameplay report, short of the full qualification.
  if (tier === "playable" && head === "pixelport") return "player_tested";
  return "untested";
}


export const labelOrder = ['pixelport_verified', 'player_tested', 'issues_reported', 'untested', 'blocked'];
export const compatibilityMeta = {
  pixelport_verified: { label: 'PixelPort verified', tone: 'verified', icon: '✓', description: "PixelPort's gameplay qualification checks passed on a recorded configuration." },
  player_tested: { label: 'Player-tested', tone: 'playable', icon: '◐', description: 'An accepted first-hand report confirms gameplay through PixelPort, with conditions and date.' },
  issues_reported: { label: 'Issues reported', tone: 'attention', icon: '!', description: 'An accepted relevant problem, with the affected configuration or mode. Earlier test history is kept.' },
  untested: { label: 'Untested', tone: 'muted', icon: '?', description: 'No substantiated gameplay claim for this game.' },
  blocked: { label: 'Blocked', tone: 'blocked', icon: '×', description: 'An established limitation prevents the stated use.' },
};
const appearance = {
  verified: { text: 'text-verified', badge: 'text-verified bg-verified/15 ring-verified/35', dot: 'bg-verified' },
  playable: { text: 'text-playable', badge: 'text-playable bg-playable/15 ring-playable/35', dot: 'bg-playable' },
  attention: { text: 'text-attention', badge: 'text-attention bg-attention/15 ring-attention/35', dot: 'bg-attention' },
  muted: { text: 'text-muted', badge: 'text-muted bg-surface-2/70 ring-line', dot: 'bg-muted' },
  blocked: { text: 'text-blocked', badge: 'text-blocked bg-blocked/15 ring-blocked/35', dot: 'bg-blocked' },
};
for (const meta of Object.values(compatibilityMeta)) Object.assign(meta, appearance[meta.tone], { short: meta.label });

// Whitelist public assessment fields; recipe and report content stay at their source.
export function assessmentFields(row = {}) {
  const text = key => typeof row[key] === 'string' ? row[key] : null;
  return { tier: text('tier'), verified_by: text('verified_by'), unsupported_reason: text('unsupported_reason'), verified_on: text('verified_on'), verified_conditions: text('verified_conditions') };
}
export function withCompatibility(row) {
  return { ...row, label: compatibilityLabel(row) };
}
export const isTested = row => ['pixelport_verified', 'player_tested'].includes(compatibilityLabel(row));

export function assessmentSummary(row, title) {
  const label = compatibilityLabel(row);
  const meta = compatibilityMeta[label];
  const detail = label === 'blocked' ? ` ${publicBlockReason(row.unsupported_reason)}` : '';
  return `${title}: ${meta.label}. ${meta.description}${detail}`;
}

// Some historical imports put recipe metadata in the reason. Keep the raw
// contract field for the label, but do not present machine data as a known cause.
export function publicBlockReason(reason) {
  if (typeof reason !== 'string') return '';
  if (/archetype|auto-imported|source PCGW|\|/i.test(reason)) return 'The recorded limitation needs a public explanation; its cause is not established here.';
  return reason.trim();
}
