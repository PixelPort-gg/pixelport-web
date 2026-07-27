// Optional "a native Mac build exists elsewhere" callout, keyed by Steam appid.
// Deliberately a standalone file, not folded into compat.json/games.json — those
// two are machine-synced snapshots (see scripts/pull-compat.mjs,
// scripts/build-catalogue.mjs) and get overwritten wholesale on refresh. This
// file is hand-curated and untouched by that pipeline.
//
// Scope: only real, official storefront links (App Store, publisher site, etc).
// Never a recipe/runtime detail — this is a trust/comparison callout, not a how-it-works.
import data from '../data/native-alternatives.json';

export interface NativeAlternative {
  platform: string; // e.g. "Mac App Store"
  note: string; // honest, factual comparison — separate purchase, separate saves
  url: string; // official store link only
}

const alternatives = data as Record<string, NativeAlternative>;

export function nativeAlternative(appid: number | null | undefined): NativeAlternative | null {
  if (appid == null) return null;
  return alternatives[String(appid)] ?? null;
}
