# index.html — Build Instructions

## Navigation
← from: (entry point — no previous page)
→ to: none (single-page project; no other pages are built)

## Source
Figma file: `song-video-slates` — https://www.figma.com/design/DPNIANfBhQz1tsAr5VZR8h/song-video-slates
All 4 rows in figma-links.md's index.html table point at the same `home` frame, captured as
4 near-duplicate node states (read via Figma MCP `get_design_context`):

| Node   | What it shows |
|--------|---------------|
| 1:160  | Door/arch scene, title pill pushed off-canvas below (not yet risen), play button higher in the arch, language switch hidden (opacity 0) |
| 1:149  | Door/arch scene, title pill risen into view at the bottom, play button lower in the arch, language switch visible |
| 1:170  | Full-bleed "now playing" scene (glowing figure in clouds), title pill at the top, single play/pause icon centered, video-control bar present but hidden (opacity 0) |
| 1:182  | Same "now playing" scene, title pill hidden (opacity 0), BOTH a pause icon and a replay/play icon shown centered |

**Simplification (flagged to and approved by user):** no Figma prototype/interaction data exists on
this frame (confirmed via MCP — no reactions/connections), so the 4 near-duplicate captures don't
encode a documented state machine. They're collapsed into 2 real UI states for this build:
- **poster** = 1:160 + 1:149 merged (title always shown at the bottom position — the "hidden below
  canvas" position in 1:160 reads as an unfinished entrance animation with no defined trigger/timing,
  so it's dropped)
- **playing** = 1:170 + 1:182 merged (a single play/pause toggle icon, rather than two overlapping
  near-identical icon variants)

No video file exists yet in `assets/videos/` — per user decision, "playing" swaps in the static
`bg2.png` scene (the glowing-figure frame) as a poster image only; there is no real `<video>`
element or playback. Swap in a real `<video>` + poster once a source file is supplied.

## Frame Guidelines — home (poster + playing states)

1- read node 1:149 (poster) and 1:170 (playing) from figma mcp local server, https://www.figma.com/design/DPNIANfBhQz1tsAr5VZR8h/song-video-slates
   for image reference use @assets/images/

  1.1- `bg 4 1` (arch/door illustration, poster state only) — full-bleed background, `assets/images/bg 4 1.png`
  1.2- arch opening preview (poster state only) — sits inside the arch, arch-shaped (rounded top, flat bottom) via border-radius; per user request this now shows `assets/images/bg2.png` (the SAME image as the playing scene, 1.3) instead of a separate photo, so the arch previews the actual video and the zoom grows one continuous image rather than handing off between two different pictures
  1.3- `bg 4` (glowing-figure scene, playing state only) — full-bleed background, `assets/images/bg2.png`
  1.4- frame border (orange rounded outline over the whole canvas, both states) — `assets/images/figma-frame-border.svg`
  1.5- HOME icon (top-left, both states) — `assets/images/HOME.png`
    1.5.1- on click of HOME → this file IS the site's home page; link points at `./index.html` (self) for convention, not a real navigation away from here
  1.6- language switch (top-right, both states) — global element, **never restyle**; existing `#langSelect`/`#language` markup and style.css rules are reused unmodified, not rebuilt to match this Figma's pink pill colors
  1.7- TITLE pill ("Nanna munna Bachha") — poster state: bottom-center; playing state: top-center
    1.7.1- English/Hindi/Gujarati spans per project.md rule 4 — **only the English string was available from Figma**; Hindi/Gujarati spans currently repeat the English text as a placeholder pending real translations from the user
  1.8- Play button (`assets/images/_button-play 8.png`, poster state) — centered in the arch opening; purely decorative, the actual hover/click target is 1.10 below
    1.8.1- on click → switch `.main-container` to the **playing** state, via the "camera flies through the door" transition (1.11)
  1.9- Pause/replay icon (`assets/images/figma-pause-icon.svg`, playing state) — centered on the video scene
    1.9.1- on click of Pause icon → switch `.main-container` back to the **poster** state (instant, no transition)
  1.10- poster hover/click zone (invisible, spans the photo + play button + title bar as one box) — added per user request, not from a recorded Figma interaction
    1.10.1- on hover → title pill slides up into place from below the frame; play button fades in (opacity only, no slide)
    1.10.2- on click (anywhere in the zone) → triggers 1.8.1
  1.11- "camera flies through the door" transition (poster → playing), added per user request — added
    1.11.1- the photo inside the arch (`.photo-arch`) scales up ~14x from its own center over 0.7s, while the door illustration fades out underneath it — reads as the camera passing through the door opening, not the whole image zooming in place
    1.11.2- the playing scene fades in partway through, so it's revealed once the photo has grown past the frame
    1.11.3- `index.js` swaps `is-poster`→`is-playing` only after the transition finishes (fixed 700ms timer matching the CSS duration)

## Layout architecture
- `.main-container` is locked to Figma's 1920:1080 canvas as ONE proportional unit (`width:100%`,
  `aspect-ratio:1920/1080`) so it scales like a Figma preview and never reflows — matches
  project.md's "no px/rem/em/pt/vh" rule; every child position/size is a `%` of that locked frame,
  per project.md's CSS-units table (top/left/width/height as `%`, padding/border/radius/font in
  `vw`, font-size via `clamp()`).
- Both background images (`bg 4 1.png` for poster, `bg2.png` for playing) and the frame border SVG
  are stacked absolutely, `inset:0`, cross-faded by opacity between the two states — nothing
  reflows or is removed from the DOM on toggle.
