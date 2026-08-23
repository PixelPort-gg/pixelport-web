---
title: "Known issues and fixes"
description: "Quick answers for the most common hiccups, and exactly what to do about each one."
order: 2
---

Most problems on this page have a fix that takes under a minute. Find your
symptom, follow the steps, and if you are still stuck, come tell us in
[Discord](https://discord.gg/2eQah8DjK6). Real reports from real players are how
this page gets shorter.

## I press Play and nothing happens

Probably nothing is broken. The first launch after a restart does some quiet
setup before any window appears, and it can take up to two minutes with no
spinner.

Press Play once and wait a full two minutes. Try not to press Play again while
you wait, because rapid retries can trip Steam's connection limit (see the next
question). If nothing appears after two minutes, restart your Mac, press Play
once, and wait two minutes again. Still stuck? Send us your logs from the
support panel in the app, or ask in Discord.

## Steam is stuck on "connecting"

If Steam restarted several times in a row (force quits, crashes, rapid Play
retries), Steam's own servers pause your connection for 20 to 30 minutes. There
is no way around it. Waiting is the fix. Close the app, leave it alone for half
an hour, then press Play once and let it connect.

## It says Steam is already running

Quit the regular Mac Steam app first. Pixel Port runs its own copy of Steam
behind the scenes, and the two cannot run at the same time. Quit Steam from the
menu bar (Steam, then Quit Steam), then press Play again.

## The install fails, but I own the game on Steam

A few games hit an error in our one-click installer. Megabonk is the one we know
about. The workaround: click Open Steam inside Pixel Port, sign in, and install
the game from the Library in that Steam window. Once it finishes there, Play
works normally. A proper in-app fix is in progress.

## My Unreal Engine 5 game will not launch on macOS 14 (Sonoma)

That block is on purpose. On macOS 14, some Unreal Engine 5 games can crash the
whole Mac and force a restart. Pixel Port blocks those launches to protect your
machine. The fix is to update to macOS 15 or newer. The bug lives in macOS 14,
not in your Mac and not in the game.

## Cutscenes are a black screen, but I can hear the audio

This one is fixed. Update the app to 0.4.7 or newer. The fix applies
automatically on the next launch, so update, relaunch the game, and replay the
cutscene.

## Skyrim Special Edition: music plays, but nobody speaks

A known issue with Skyrim's voice audio. Update the app to 0.4.6 or newer, then
press Play. The app repairs the install at launch, and you do not need to
reinstall the game. The first launch after the update downloads an extra audio
component (about 100 MB), so give it a few minutes. If dialogue is still silent
after one full launch, please tell us. We want to confirm this fix with real
players.

## My controller is not detected

Controller support arrived in app 0.4.4. Update the app, then relaunch the game
with the controller already connected. Most Xbox, PlayStation, and generic USB
or Bluetooth pads work. If yours is still not seen after the update, ask in
Discord with the game name and the controller model.

## Voice chat cannot hear me

App 0.4.4 added microphone access. Update the app, then approve the macOS
microphone prompt at the next launch. If you dismissed the prompt earlier, open
System Settings, go to Privacy & Security, then Microphone, and turn on
PixelPort. Then relaunch the game.

## I am on hotel WiFi or a VPN and Steam will not sign in

Some VPNs, hotel networks, and campus networks block the connections Steam
needs. Turn the VPN off, or switch to a normal home network, and try again. If
you must stay on that network, a phone hotspot usually works for the sign-in
step.

## The app said the launch failed while the game was still downloading

If you press Play during or right after a large install, the app can give up
too early and report a failure while Steam is still downloading files in the
background. Let the download reach 100% in the Steam window, then press Play
again. A fix for the false alarm is planned.

## Still stuck?

Join our [Discord](https://discord.gg/2eQah8DjK6) and tell us what happened.
Your Mac model, the game, and what you saw on screen is usually enough for us
to help.
