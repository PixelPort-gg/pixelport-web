---
title: "Frequently asked questions"
description: "Requirements, Steam, saves, compatibility, controllers, and where to get help."
order: 4
---

## Which Macs does Pixel Port support?

Pixel Port 0.5.1 supports Apple Silicon Macs, M1 or newer, on macOS 14 or
later. Intel Macs are not supported. A game can require a newer macOS version;
optional Apple D3DMetal requires macOS 15 or later and Rosetta 2.
See [installation and setup](/docs/getting-started/).

## Do I need Windows or to buy my Steam games again?

Pixel Port's Windows-game routes use compatibility components on macOS, without
a Windows installation or license. Use the Steam account that owns the game.
Pixel Port does not include paid games or bypass Steam download rights.

## Should I leave my Mac Steam app open?

It depends on the route. Legacy Prism uses a Windows Steam client and may
need Mac Steam closed. Native Mac Steam games and Apple D3DMetal hosting use
your own Mac Steam app. Follow Pixel Port's prompt for that game, and start
the game from Pixel Port so its launch configuration is applied.

## What do the compatibility labels mean for my Mac?

The website displays **Verified**, **Playable**, **Needs attention**, and
**Unsupported**. Read the game's notes as well as its label. Results depend
on the Mac, macOS version, game version, runtime, and mode. Being available
to install or reaching a menu is not proof of playable gameplay.
See [compatibility information](/docs/how-it-works/#reading-compatibility-information).

## Can I launch games from other stores?

The optional **Settings → Prism Runtime → Labs** controls can discover
supported Mac games already installed through Epic, Battle.net, GOG, and
the Mac App Store, and launch installed native Mac Steam games. They do not
sync every purchase or provide general Windows Epic/GOG installation.

## Are my saves synchronized or kept when I reinstall?

Steam copies can use Steam Cloud for games that support it. Depot copies
are not automatically synchronized. Different installed copies can have
different saves. Game removal keeps saves by default, with a separate option
to delete them. Back up saves before changing copies, removing game data,
or resetting a Windows setup.

## Does D3DMetal replace Prism or work with every game?

D3DMetal is an optional experimental route with its own setup and game-specific
limits. Runtime, graphics backend, and installed copy are separate choices.
**Ready** means setup checks passed, not that every game works. **Prism Next**
remains **Upcoming**. Use the [runtime guide](/docs/how-it-works/) to choose a route.

## Will my controller work?

Support depends on the controller, game, connection, and runtime route.
Connecting it successfully to macOS does not prove that the game can use it.
See the [controller checks](/docs/known-issues/#my-controller-is-not-detected)
and include your exact model when reporting a problem.

## How do I report a problem or request a game?

Use the game's **Report a problem** action to send evidence. In-app reports
do not receive replies. For answers, choose **Help** in
[Discord](https://discord.gg/2eQah8DjK6). Use **Game reports** for a first-hand
gameplay result, and **Game requests** for a game you want to try. Include the
game and your versions and conditions. See
[reporting and support](/docs/support/) for the steps and how to check an
in-app send succeeded.

## Does a report or request guarantee that a game will work?

No. A game's **Request** action records interest without promising support,
a date, or a personal notification. Unlocking lets you try a game; it does
not prove gameplay compatibility. A gameplay report describes the conditions
you tested and does not guarantee a compatibility-label change.

A diagnostic preview, when offered, is a separate choice to send technical
information. Diagnostic uploads also do not receive replies.
