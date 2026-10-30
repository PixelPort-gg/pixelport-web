---
title: "Install and set up Pixel Port"
description: "Install the app, prepare Prism, choose a game, and set up optional Apple D3DMetal."
order: 1
---

These instructions cover Pixel Port **0.5.1**, the public app release.
Pixel Port requires an **Apple Silicon Mac (M1 or newer)** with **macOS 14.0
or later**. Individual games can require a newer macOS version. The optional
Apple D3DMetal route requires **macOS 15 or later and Rosetta 2**.

## Install or update the app

1. [Download Pixel Port](/download). Open the disk image and drag Pixel Port
   into **Applications**.
2. Open Pixel Port from Applications and complete the privacy review and
   account sign-in shown by the app. Pixel Port sign-in and Steam sign-in
   are separate.
3. Follow the runtime setup prompts before installing or playing a Windows
   game. Browsing the catalogue does not mean runtime setup is complete.

If Pixel Port is already installed, choose **Pixel Port → Check for Updates**.
Update it in place to keep existing games, libraries, and saves. The public
app and disk image are signed and notarized. If macOS refuses to open a fresh
download, record the exact warning and [ask for help](/docs/support/).

## Install and play a game

1. Find the game in the [catalogue](/games/) and read its compatibility notes.
   You need Steam access to download it; Pixel Port does not supply paid games.
2. Sign in to the Steam account that owns the game when prompted. Follow any
   instruction about closing or opening your Mac Steam app for that route.
3. Choose the installation location and use the game's install action. Keep
   external drives connected while downloading or playing games stored there.
4. Let downloading and preparation finish. Start the game with **Play** in
   Pixel Port so its per-game configuration is applied.

Keep **runtime files on your Mac**, even when game libraries use external
drives. If setup, installation, or launch fails, use the
[recovery guide](/docs/known-issues/) before removing files.

## Optional Apple D3DMetal setup

D3DMetal is experimental and is not required for every game. Start with
**Legacy Prism (Recommended)** unless a game's instructions call for another
route. **Prism Next (Upcoming)** is not available to select or download.

On macOS 15 or later with Rosetta 2 installed:

1. Choose **Set up D3DMetal** on the welcome screen, or open your account
   menu at the bottom left → **Settings → Prism Runtime**.
2. If offered, choose **Set up engine**. Pixel Port downloads and verifies
   its compatible engine.
3. Choose **Get from Apple**. Sign in to
   [Apple's developer downloads](https://developer.apple.com/download/all/?q=game+porting+toolkit),
   accept Apple's terms, and download the **Game Porting Toolkit 3.0** disk
   image. Choose **3.0 specifically**.
4. Return to Pixel Port and choose **I already downloaded it**, or use the
   detected file from Downloads. Select Apple's **.dmg** directly. Pixel Port
   imports it and checks Direct3D 11 and 12 before showing **Ready**.
5. For a compatible game, open **Launch settings**, choose **Apple D3DMetal
   (Experimental)** as the runtime, and choose **D3DMetal** as the graphics
   backend where offered.

You obtain Apple's files under Apple's terms and import them locally. An
existing setup marked **Ready** can be reused. To postpone setup, choose
**Continue** or **Maybe later** where offered. If setup fails, follow the
[D3DMetal recovery steps](/docs/known-issues/#d3dmetal-setup-does-not-reach-ready).

Read [how runtime, graphics, and installed copies differ](/docs/how-it-works/)
before changing routes. Runtime readiness is separate from game compatibility.
