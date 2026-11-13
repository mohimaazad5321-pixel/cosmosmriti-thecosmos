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
- [~] Interactive 3D inspection: simplified educational reconstructions in-world (labelled), parts explained in "Parts" tab
- [ ] Dedicated 3D inspection viewer (360° rotate, fullscreen, clickable component hotspots, exploded views)
- [ ] Evaluate authentic NASA 3D Resources models (Apollo LM, LRV, MER) — verify identity/licence, convert & optimise GLB

## Data integration (needs technical validation)
- [ ] NASA Moon Trek / Mars Trek basemap & elevation tiles for the terrain (verify WMTS endpoints/layer names, CORS)
- [ ] Verified later orbital images for Apollo 12/14/15, Pathfinder, Sojourner (LROC / HiRISE product ids)
- [ ] Optional live NASA API content (e.g. APOD) via a server function so the API key stays private

## Quality
- [x] Reduced-motion toggle + OS setting, mute toggle, large touch targets, keyboard focus states
- [x] Rule tests (collection counts, achievements, projection)
- [ ] Real-device check of frame rate, sound and touch feel
