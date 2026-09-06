---
title: "How Pixel Port works"
description: "The infrastructure that turns a Windows game into one click on your Mac."
order: 1
---

## The problem

Apple Silicon Macs are fast, but games are built for Windows and DirectX, not macOS
and Metal. Bridging that gap has always meant manual, fragile setup: [compatibility layers](/free-crossover-alternative/), hand-built Wine bottles,
[virtual machines](/parallels-alternative/), partitions. It
works sometimes, if you are willing to spend an evening on it.

Pixel Port does that work for you, automatically, and proves the result.

## Prism, the runtime

Prism is our runtime. It pairs a modern Wine build with DXMT, which translates
a game's DirectX calls straight to Metal on Apple Silicon. Most games never notice
they left Windows. There is no bottle to maintain.

## The Synthesis Engine

Every game is different. The Synthesis Engine inspects a game and works out how it
should run on your Mac: which graphics path to take, which dependencies it needs,
and how to launch it. It produces a launch plan automatically, so installing a game
is a single click rather than an afternoon of configuration.

## The Distributed Validation Network

Pixel Port gets more reliable the more people use it. Every install and launch
produces a signal about what worked and what did not. The Distributed Validation
Network aggregates those signals across the whole community, so when one Mac proves
a game runs, that knowledge benefits everyone. A game's status is earned from real
launches on real hardware, not a guess.

## Honest tiers

We grade every game honestly:

- [**Verified**](/games/verified/): a human confirmed it end to end on a real Mac.
- **Playable**: auto-tested or community-confirmed, not yet human-verified.
- **Needs attention**: runs with caveats or a known workaround.
- **Unsupported**: a hard blocker, such as [kernel-level anti-cheat](/games/anti-cheat/).

Browse the [full catalogue](/games/) to see how a specific game is graded, or read
[every way to play Windows games on a Mac](/how-to-play-windows-games-on-mac/) for how
Pixel Port compares with CrossOver, Parallels, and Apple's toolkit. What changed in each
version is in the [release notes](/releases/).
