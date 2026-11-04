---
title: "Known issues and recovery"
description: "Choose recovery steps for the failed game, Steam connection, or runtime without losing saves."
order: 3
---

These steps cover Pixel Port 0.5.1. Start with the message shown in the app.
Keep the game name, app and runtime versions, and the exact error for a
[support report](/docs/support/). There is no single fix for every failed launch.

## I press Play and nothing happens

Press **Play** once and check the app's preparation progress and any Steam
window. Dependency setup or a game download may still be running. Wait for that
operation to finish before retrying. Start the game from Pixel Port rather
than from inside the Steam window.

If the game is stuck, use its **Force stop** action before trying again. If
that does not clear the problem, save work in any other running games, then
open your account menu → **Settings → Prism Runtime** and use **Stop all
Windows software, including Steam**. This closes Pixel Port's Windows Steam
client and all its running Windows games, not just the affected game.

If the error mentions missing Windows system files, **Check Windows system
files** in the same pane inspects them first. Review any offered restoration
before proceeding. Do not manually delete runtime or Windows setup folders.

## Steam is stuck connecting or says it is already running

Follow the prompt for the selected route. Legacy Prism uses a separate Windows
Steam connection and may ask you to close Mac Steam. Native Mac games and
Apple D3DMetal hosting need Mac Steam instead; do not close it as a universal fix.

Check whether Steam needs you to sign in. If repeated retries or a network
problem prevent connection, stop retrying and check Steam's message. If your
network permits it, test another connection to distinguish a network problem
from an app problem. A fixed waiting period is not a guaranteed remedy.

## The install fails, but I own the game on Steam

Check that Steam is signed in to the account that owns the game and that the
chosen drive is connected with space for the download. Ownership and game
compatibility are different checks.

For a Windows Steam copy, inspect the download in Pixel Port's Steam window.
Let Steam finish before retrying **Play** from Pixel Port. If installation
still fails, report the error and whether it occurred during downloading,
verification, or game preparation. Installing through another route is not
a guaranteed fix.

## Installation stops with a recipe message

A recipe tells Pixel Port how to prepare a game. Follow the specific message:

- **"This game's recipe isn't available yet. Try again later."** The recipe
  has not been published. Try later; reconnecting or reinstalling Pixel Port
  does not make it available.
- **"This game's recipe couldn't be found. Try again later."** The recipe
  service could not find it. Try later and report the game and exact message
  if it persists.
- **"The recipe service couldn't complete the request. Try again later."**
  The service returned an error. Try later; this message does not mean your
  Mac is offline.
- **"Couldn't read the recipe service's response. Try again later."** Try
  later and include this message in a support report if it persists.
- **"Sign in to Pixel Port to download this game's recipe, then try again."**
  Sign in to Pixel Port and retry. Pixel Port sign-in is separate from Steam sign-in.

If the message specifically says the recipe is unavailable offline, check
your internet connection and retry when connected. If it asks you to update
Pixel Port, update the app before retrying. Do not remove games, saves, or
runtime files to resolve a recipe-service message.

## Runtime setup or repair says a game is running

Pixel Port 0.5.1 protects the runtime files being changed. For Prism install,
update, or repair, a game running in a separate Wine product such as CrossOver
does not by itself block the operation. Close games using the Prism runtime
being changed and let them finish before retrying.

An inspection failure means Pixel Port could not check safely; it does not
confirm that a game is running. If the warning persists with your Prism games
closed, report the operation and exact message, plus any other Wine product
and version in use. Do not delete runtime files or terminate unfamiliar
processes to bypass it.

## D3DMetal setup does not reach Ready

Check the [D3DMetal prerequisites and import steps](/docs/getting-started/#optional-apple-d3dmetal-setup).
Use Apple's **Game Porting Toolkit 3.0** disk image, and let Pixel Port finish
its engine and graphics checks. Keep runtime files on the Mac.

Open **Settings → Prism Runtime** and follow the setup or repair action shown
for D3DMetal. Close games using D3DMetal before replacing or repairing its
files. If setup fails again, report the failed step and its message. Successful
setup does not resolve every game's launch or rendering problem.

## My game folder or external drive is unavailable

Reconnect the drive and check the game's selected copy and location in Pixel
Port. Another installation can use different saves. Avoid starting a replacement
installation until you have checked the original location.

Before removing a copy or changing its Windows setup, back up relevant saves
and configuration. Game removal keeps saves by default, but an explicit
save-deletion choice removes them. A Depot copy is not automatically backed
up by Steam Cloud.

## A game is blocked on my macOS version

Read the game's warning. Some games have an operating-system restriction
because launching on an affected macOS version can restart the Mac. Follow
the stated requirement; do not bypass that block. Updating macOS does not
guarantee compatibility with every game. D3DMetal separately requires macOS 15
or later, while the Pixel Port app supports macOS 14.0 or later.

## Black screens, missing audio, or crashes after the intro

These symptoms can have different causes across games and runtime routes.
Update Pixel Port, record the selected runtime and graphics backend, and
report where the failure occurs. Updating does not guarantee a fix for every
cutscene or audio problem.

<!-- App #323 owns this deferred investigation; the public help needs no private issue access. -->
**South Park: The Stick of Truth** has an unresolved report of a black screen
with audio followed by a crash. Its investigation is deferred to **0.5.2**;
no remedy has been qualified for 0.5.1. Windowed mode is not a
confirmed remedy, and the deferral does not promise a fix in 0.5.2. If you
encounter it, include Steam App ID **213670** and your launch conditions in
the [report](/docs/support/).

## My controller is not detected

Connect the controller before launching and check whether macOS recognizes it.
Then start the game from Pixel Port and check its input settings. Recognition
by macOS alone does not establish support in a particular game or runtime.
Controller behavior depends on the game, route, controller model, and connection;
we do not promise support for every Xbox, PlayStation, USB, or Bluetooth pad.

If it fails, report the controller model, USB or Bluetooth connection, game,
runtime, macOS version, and which inputs fail.

## Voice chat cannot hear me

If macOS requests microphone access for Pixel Port, review that request.
If access was denied, check **System Settings → Privacy & Security →
Microphone**, then relaunch the game. Permission alone does not establish
that voice chat works in every game. Report persistent failures with the
game, selected audio device, runtime, and macOS version.

## Still stuck?

Use [reporting and support](/docs/support/) for the in-app report, diagnostic
preview, and Discord help routes. Include what you tried and its result.
