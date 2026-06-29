---
title: "How Pixel Port works"
description: "The runtime, the recipes, and the honest compatibility tiers."
order: 1
---

## The runtime

Pixel Port ships a free runtime: a modern Wine build plus DXMT (DirectX to Metal)
and MoltenVK. Most games never see Windows; their DirectX calls are translated
straight to Metal on Apple Silicon.

## Recipes

Each game gets a recipe: the graphics backend, any winetricks, DLL overrides, and
the launch command. Curated recipes are hand-verified; the rest are synthesized
from the game's own files at install time.

## Honest tiers

- **Verified** (green): a human confirmed it end-to-end on a real Mac.
- **Playable** (amber): auto-tested or community-confirmed, not yet human-verified.
- **Needs attention** / **Unsupported**: known issues or hard blockers (e.g. kernel anti-cheat).
