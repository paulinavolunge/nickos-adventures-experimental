# Nicko's Adventures (Experimental)

A complete, playable browser game for ages 4-8 starring Nicko the kitten.
An independent experiment: explore six connected rooms, tap everything,
watch Nicko react, complete little activity chains, earn Paw Points,
collect 8 Golden Paw Prints, and unlock 8 achievements.

No backend. No login. No tracking. Progress saves in the browser's
local storage. All sound is synthesized live with WebAudio (mutable).

## Play

Open `index.html` in any modern browser, or serve the folder:

```bash
cd nickos-adventures-exp
python3 -m http.server 8000
# then visit http://localhost:8000
```

Append `?selftest=1` to run the automated 29-check walkthrough
(all rooms, interactions, achievements, collectibles, save persistence).

## The six rooms

Bedroom, Bathroom, Kitchen, Living Room, Playroom, Backyard,
connected in a loop through doors on each side of every room.

## Controls

- Tap / click the floor: Nicko walks there
- Tap / click glowing objects: Nicko interacts
- Arrow keys / A D: walk left and right
- Top-right buttons: collection (🎒), achievements (🏅), sound on/off (🔊)

## Project layout

```
index.html        page shell, HUD, overlays
css/style.css     all styling, room themes, animations
js/audio.js       synthesized SFX + gentle music (WebAudio, no files)
js/state.js       localStorage save: points, prints, achievements, flags
js/nicko.js       Nicko the kitten: SVG sprite, walk, moods, reactions
js/rooms_a.js     bedroom, bathroom, kitchen
js/rooms_b.js     living room, playroom, backyard
js/game.js        engine: rooms, doors, HUD, rewards, events, self-test
```

## Notes

- Experimental build, September 2026. Standalone repo on purpose:
  it never touches the production Nicko game or its deployment.
- Everything runs client-side; nothing leaves the device.
