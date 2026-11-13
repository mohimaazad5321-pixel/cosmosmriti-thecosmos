# CosmoSmriti — requirements checklist

Legend: [x] done · [~] partial / honest alternative · [ ] open

## Stage 1 — foundation & signature experience
- [x] Design system (ink / bone / amber signal, Moon silver, Mars rust; Instrument Serif + Manrope + JetBrains Mono)
- [x] Robot "Cosmic Memory Keeper" with Moon (left eye) and Mars (right eye), blinking, pointer-following eyes, talking LED mouth
- [x] Cinematic opening sequence, skip intro, replay intro, returning visitors get short intro
- [x] Eye hover (glow, zoom, name) and click → expanding planet warp into the world

## Stage 2–7 — worlds & ten memories
- [x] Moon world: cratered terrain, maria, long low-sun shadows, stars, Earth, dust
- [x] Mars world: mesas, ridges, dry channel, dusty sky dome & haze, drifting dust
- [x] Markers placed by real coordinates (equirectangular, compressed, labelled as illustrative)
- [x] Discovery sequence: "Unknown memory detected" → fly-in → reveal → panel; chime (no autoplay, mutable)
- [x] Progress HUD (planet + total, remaining), planet switch keeps progress, chronological strip
- [x] All 10 artifacts researched with dates, coordinates (accuracy labelled), status, sources
- [x] Hidden memories (3 per world)
- [x] Mouse/keyboard (orbit + WASD camera-relative) and touch (orbit/pinch) controls; low-power mode on phones
- [x] Non-3D map fallback when WebGL is missing or the 3D view crashes

## Museum & learning
- [x] Story · Explain Like I'm 10 · Scientist · Parts · Did You Know flip cards · Timeline · Then vs Now · Last Signal · Evidence
- [x] Real NASA photos (NASA Image Library ids, dates, credits); NASA vs project-written content distinguished
- [x] Memory Archive, Cosmic Passport (stamps, stats, achievements, restart), Mission Time Machine, Detective, Quiz, About + final message
- [x] Dedicated 3D inspection viewer (/inspect/:id): 360° rotate, zoom, full screen, numbered part hotspots, exploded "take apart" view
- [x] NASA 3D Resources evaluated: Apollo Lunar Module (descent stage cut) and MER-B Opportunity (also shown for twin Spirit) used in-world and in the inspector; NASA's library has no LRV, ALSEP, Pathfinder, Sojourner or Phoenix models, so those stay labelled reconstructions

## Data integration (needs technical validation)
- [x] NASA Moon Trek / Mars Trek basemap & shaded-relief elevation tiles (verified endpoints, CORS): Real map tab, map overlay in the worlds, no-3D fallback. The 3D terrain stays illustrative on purpose, because sites are compressed there
- [x] Verified later images for Apollo 12 (PIA12922), 14 (PIA12889), 15 (LRO oblique of Hadley), Pathfinder & Sojourner (HiRISE PIA09105), with honest captions where the hardware is too small to see
- [x] Live NASA APOD on the About page via a server function (optional NASA_API_KEY secret; DEMO_KEY fallback is rate-limited)

## Quality
- [x] Reduced-motion toggle + OS setting, mute toggle, large touch targets, keyboard focus states
- [x] Rule tests (collection counts, achievements, projection)
- [ ] Real-device check of frame rate, sound and touch feel (blocked: needs a person on a real phone/laptop)
