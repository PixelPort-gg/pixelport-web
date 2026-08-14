---
title: "Steam is native on Apple Silicon now. Your games aren't."
description: "Valve shipped a native Apple Silicon Steam client in 2026, but the client was never the problem. Most of the library is still Windows-only. Here's the missing half."
date: 2026-07-08
---

Valve finally did it: the Steam client runs natively on Apple Silicon. It launches
fast, it stopped chewing battery through Rosetta, and it feels like it belongs on the
machine. Genuinely good news.

It also changes almost nothing about what you can play.

The client was never the bottleneck. The library is. Open your Steam library on a Mac
and count the grey "Windows only" entries: for most people it's the majority of
everything they own. Lethal Company. Megabonk. Sekiro. Sons of the Forest. The Steam
client now being native doesn't move a single one of those games across the line,
because the games themselves are still compiled for a different operating system and a
different graphics API.

## The missing half

Running a Windows game on Apple Silicon means translating three things at once: the
processor instructions (Rosetta handles this), the operating system calls (Wine
handles this), and DirectX graphics into Metal (the hard part: a modern
Direct3D-to-Metal layer handles this). All three exist as open technology. What
stopped existing in 2025, when Whisky was discontinued and the prebuilt runtimes
went offline, was a maintained, ready-to-use assembly of them.

That's the half we rebuilt. Pixel Port ships a runtime (Wine + DirectX-to-Metal,
assembled for Apple Silicon) and wraps it in the thing the old tools never had: per-game
answers. Connect Steam, and your library shows an honest tier for every game:
*Verified* (ran on real Apple Silicon hardware, measurements published), *Playable*
(strong evidence, not yet hand-verified), or *Unsupported* (kernel anti-cheat, which will
not work in any translation tool, whatever anyone claims, and we'd rather tell you
than waste your evening). One click installs and launches the games that work.

## What this looks like in practice

Portal 2's Mac port died with Catalina in 2019; it runs again, using about 340 MB of
memory. A brand-new Unreal Engine 5.6 multiplayer game, MECCHA CHAMELEON, joined a
live server and played a full match on the same stack. Neither needed a bottle,
a graphics-backend menu, or a Terminal command.

The honest fine print: Pixel Port is in beta, with rough edges we're fixing daily.
Apple Silicon only (M1+, macOS 14+). You need to own your games: it runs the Steam
copy you already own; it doesn't sell, bundle, or pirate games.

Your Steam client is native now. Here's the other half:
[check which of your games run →](/mac/)
