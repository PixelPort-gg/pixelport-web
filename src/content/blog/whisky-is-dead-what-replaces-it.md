---
title: "Whisky is dead. Here's what actually replaces it in 2026"
description: "Whisky was discontinued in April 2025. Fifteen months on, an honest comparison of ways to run Windows games on an Apple Silicon Mac."
date: 2026-07-08
---

In April 2025, Whisky (an app many people used to run Windows games on a Mac)
was discontinued. Its developer was honest about why: keeping a Wine frontend working,
alone, against every macOS update and every new game engine is a treadmill that burns
people out. The prebuilt runtimes it depended on started going offline one by one
not long after.

Fifteen months later, "just use Whisky" still tops old Reddit threads, and the people
who land on them have four real options. Here they are, honestly, including where ours
falls short.

## CrossOver: you still do the work

CrossOver is the commercial face of Wine, and it's good software with a real
compatibility team behind it. It still hands you the hard part: you create "bottles,"
pick Windows versions, toggle
D3DMetal vs DXMT vs DXVK, and debug the black screen yourself when a setting is wrong.
If you enjoy that, CrossOver is a fine tool. Most people don't enjoy that.

## Sikarugir: powerful and proudly manual

Sikarugir (formerly Kegworks, descended from Wineskin) is a community
power-user option, and we're glad it exists. It gives you every knob: engine versions,
graphics backends, per-app wrappers. That's also the catch: *you* are the
compatibility team. It's the right choice if you like building things; it is not
one-click, and it doesn't tell you whether your game will work before you spend an
evening finding out.

## Game Porting Toolkit: for developers, not players

Apple's GPTK (now in its fourth major version) is genuinely impressive translation
technology, but it ships as a developer tool: Homebrew, Terminal, no game library, no
per-game configuration. The projects that wrapped it nicely have mostly stalled or
gone commercial. If you're a developer evaluating a port, use it. If you want to play
Lethal Company tonight, it's the long way around.

## Pixel Port: what we built instead

We rebuilt the thing that actually died with Whisky: a **modern, maintained Mac
runtime** (Wine with DirectX-to-Metal translation, running on Apple Silicon) and
then added the part every tool above is missing: **the answer before the download.**

Every game in our catalogue carries an honest tier. *Verified* means it ran on a real
Apple Silicon Mac, ours or the network's, and we publish what we measured.
*Unsupported* means it will never work (kernel anti-cheat, mostly) and we say so
instead of taking the download. One click: connect Steam, press Install & Play, and
the setup (runtime, graphics backend, launch flags) is composed for that specific
game. No bottles. No settings to guess.

The honest caveats, because they're the point: Pixel Port is in beta and has rough
edges. It's Apple Silicon only (M1 or newer, macOS 14+), so no Intel Macs. You need to
own your games: it runs the Steam copy you already own, and it doesn't sell, bundle,
or pirate anything. And yes, it's Wine underneath, standing on the same open-source
shoulders as everything else on this list. What you're choosing between is who does
the configuration work: you, or the software.

Pixel Port is built for the long term, with a maintained runtime and a compatibility
catalogue that improves from real launches. Your games remain your Steam copies either
way.

[See what runs on your Mac →](/mac/)
