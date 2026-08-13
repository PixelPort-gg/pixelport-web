---
title: "DSS 2: War Industry is now verified on Mac (and Party Jousting comes along)"
description: "DSS 2: War Industry is verified to run on Apple Silicon through Pixel Port, tested end to end with keys from its developer. Party Jousting, from the same developer, is playable too."
date: 2026-08-13T12:00:00
---

DSS 2: War Industry just reached our top compatibility tier: **verified**. And because its developer turned out to be a pleasure to work with, the couch classic Party Jousting came along for the ride — it is on Pixel Port too.

DSS 2 is a real-time grand strategy game: you command armies, build cities, and run a dynamic economy with automated supply routes feeding your war machine. It ships for Windows and Linux, with no Mac build. Until now, Mac players were out of luck — and two of you had already requested it through Pixel Port before we ever spoke to the developer.

## What we tested

A real Mac ran it. We started with the free demo, which launched and played with a single click — nothing to configure, no flags, no workarounds. Then Fabian, the developer, sent us keys, and we validated the full game the same way. It runs cleanly on its OpenGL path on Apple Silicon, straight out of the box.

One honest caveat: DSS 2 has a 64-player multiplayer update arriving later in August. We have not tested it, because it is not out yet. A retest is scheduled for when it ships, and if multiplayer misbehaves on Mac we will say so here.

## The developer story

This port started as a conversation. Fabian Viking has been shipping games solo for a decade — the engine literally carries the Viking name — and when we offered to check DSS 2 on Mac, Fabian did what good developers do: sent a key, answered questions, and asked "want to do Party Jousting too?"

[Party Jousting](/games/party-jousting) is a free one-button party game for 2 to 16 players sharing a keyboard or controllers. It is ten years old, it is brilliant in the way only one-button games can be, and it now runs on Apple Silicon.

It also gave us the most useful kind of failure. The build on Steam dates from years back and ships without the .NET runtime it expects, so on first launch it stopped before drawing a window. We diagnosed it, fixed it on our side, and told Fabian exactly what we found — and an updated build is already in the works that removes the problem for every player on every platform, not just Mac. That is why Party Jousting sits at **playable** rather than verified for now: the tier moves up when the clean build lands.

This is the loop we want with every developer. We port for free, we report what we find, and the fixes flow back into the game itself. Fabian is already planning further updates, including a graphics-backend refresh that would make Mac support even more natural.

## What the tiers mean

Every game on Pixel Port carries a tier so you know what to expect before you install: verified (a Mac ran it end to end), playable (it runs, with a caveat we tell you about), needs attention (runs with caveats), and unsupported (a hard blocker such as kernel anti-cheat). We do not tell people a game is runnable when it is not — that is the whole point.

Want to play? See [how to play DSS 2: War Industry on Mac](/games/dss-2-war-industry) and [how to play Party Jousting on Mac](/games/party-jousting), or [download Pixel Port](/download) and try the DSS 2 demo in one click.
