---
title: "How Pixel Port works"
description: "Game copies, runtime choices, graphics, and the limits of compatibility evidence."
order: 2
---

Pixel Port prepares supported Windows Steam games for Apple Silicon Macs.
Start with [installation and setup](/docs/getting-started/), then check your
[game's catalogue page](/games/) for its current availability and caveats.

## Prism and game preparation

Prism supplies the components that run Windows games on macOS. Pixel Port's
Synthesis Engine uses a game's recipe to prepare dependencies, graphics, and
launch settings. Preparation can fail, and a completed installation does not
prove that a game reaches playable gameplay.

App updates, runtime updates, and game preparation are separate. Updating the
app does not mean every runtime or game configuration has changed.

## Runtime, graphics, and installed copy

These choices describe different parts of a launch:

- **Runtime:** **Legacy Prism (Recommended)** is the normal starting point.
  **Apple D3DMetal (Experimental)** is an optional route for compatible games.
  **Prism Next (Upcoming)** cannot be selected or downloaded.
- **Graphics backend:** controls graphics translation. DXMT and D3DMetal are
  different choices; selecting a runtime does not make every graphics backend
  available for every game.
- **Installed copy:** identifies which installation Pixel Port starts. A Steam,
  Depot, or native Mac copy can have different files, saves, and launch requirements.

Use a game's **Launch settings** for the choices it offers. Follow the app's
readiness messages rather than copying another game's settings. Optional
[D3DMetal setup](/docs/getting-started/#optional-apple-d3dmetal-setup) checks the
runtime; **Ready** does not guarantee that a particular game works.

## Steam and optional routes

The normal Windows Steam route uses Pixel Port's Windows Steam client. Start
the game from Pixel Port so its preparation and launch settings are applied.
If Pixel Port asks you to close your Mac Steam app, finish any running game
and follow that prompt.

Native Mac Steam games and the experimental D3DMetal hosting route use your
own Mac Steam app instead. Leave it available for those routes. D3DMetal
hosting still has game-specific limits: for Grim Dawn, use **Legacy Prism
with DXMT**, as described in the [0.5.0 release notes](https://github.com/PixelPort-gg/pixelport-dist/releases/tag/v0.5.0).

Under **Settings → Prism Runtime → Labs**, you can opt in to launching
installed native Mac Steam games and discovering supported Mac games already
installed by Epic, Battle.net, GOG, or the Mac App Store. This does not import
every uninstalled purchase or provide general Windows-game installation from
those stores. A listed native Mac build can still have limits on your macOS version.

Depot is another Windows-game installation route. It downloads game files
without starting Windows Steam, but Steam credentials and download rights can
still be required. Depot copies are not automatically synchronized with Steam Cloud.

## Reading compatibility information

The website currently displays **Verified**, **Playable**, **Needs attention**,
and **Unsupported**. Read the game's caveats alongside its label. A catalogue
label is not a guarantee for every Mac, game update, runtime, or mode.

Availability, ownership, installation, runtime readiness, and gameplay results
are separate. Unlocking a game lets you try it; it does not establish that it
works. A successful launch or a visible menu also does not prove playable gameplay.

If your result differs, [report the conditions and what happened](/docs/support/).
Optional diagnostics and telemetry can help investigate a failure; they do not
replace a gameplay report.
