# Figma Frame Links & Reading Instructions

---

## How to Read Each Frame
For every frame listed below, read ALL of the following from Figma MCP local server using
get_design_context / get_metadata:

- Layout & spacing — exact positions, padding, margin, gap, alignment
- Layer names — use as class names and image filenames
- Layer hierarchy — parent > child order must match in HTML DOM
- Colors & gradients — exact hex/rgba values
- Typography — font family, size, weight, letter spacing, line height
- Images — read layer name, map to /assets/images/[layer-name].png
- Prototypes & interactions — every click, tap, hover action defined in Figma
- Navigation targets — which frame or page each interaction leads to
- Animations & transitions — type (instant, dissolve, slide, push etc), duration, easing
- Overlays — position, backdrop, close behavior
- Scroll behavior — fixed, sticky, overflow settings
- Component states — default, hover, pressed, disabled
- Variants — read all variant properties for each component
- Auto layout — direction, spacing, padding, fill/hug/fixed sizing
- Constraints — how layers scale or pin relative to parent

---

## Project Scope
Single-page project: **index.html only**. No other pages are planned or built from this file.

## Frame Index

## index.html
Figma file: `song-video-slates` — https://www.figma.com/design/DPNIANfBhQz1tsAr5VZR8h/song-video-slates

| Node   | Figma Link | Represents | Status |
|--------|------------|------------|--------|
| 1:160  | https://www.figma.com/design/DPNIANfBhQz1tsAr5VZR8h/song-video-slates?node-id=1-160&m=dev | door/arch, title off-canvas below (collapsed into "poster" state — see index.md) | built |
| 1:149  | https://www.figma.com/design/DPNIANfBhQz1tsAr5VZR8h/song-video-slates?node-id=1-149&m=dev | door/arch, title risen into view — used as the **poster** state | built |
| 1:170  | https://www.figma.com/design/DPNIANfBhQz1tsAr5VZR8h/song-video-slates?node-id=1-170&m=dev | full-bleed "now playing" scene, title at top — used as the **playing** state | built |
| 1:182  | https://www.figma.com/design/DPNIANfBhQz1tsAr5VZR8h/song-video-slates?node-id=1-182&m=dev | same "now playing" scene, pause+replay icons shown (collapsed into "playing" state — see index.md) | built |

See [index.md](index.md) for the full per-layer breakdown, the poster/playing state-collapse
rationale, and open items (Hindi/Gujarati title text, real video file).

---

## Prototype & Interaction Map
No Figma prototype/interaction data (reactions/connections) was present on this frame when read
via MCP. The interactions below are inferred from the visual design, not a recorded Figma spec.

| Page | Layer Name | Interaction | Result |
|------|------------|-------------|--------|
| index.html | HOME icon | on click | links to `./index.html` (self — this already is the home page) |
| index.html | Play button | on click | switches to the "playing" state (background swaps to the glowing-figure scene, title moves to top) |
| index.html | Pause icon | on click | switches back to the "poster" state |

---

## Image Map

| Page | Layer Name | Image Path | Notes |
|------|------------|------------|-------|
| index.html | HOME | /assets/images/HOME.png | found (user-supplied export) |
| index.html | bg 4 1 (door/arch illustration) | /assets/images/bg 4 1.png | found (user-supplied export) |
| index.html | photo-arch (arch opening preview) | /assets/images/bg2.png | per user request, reuses the same image as the "playing" scene instead of a separate photo (Rectangle 3.png, removed) — so the arch previews the actual video scene and the zoom grows the identical image already sitting behind it |
| index.html | bg 4 (glowing-figure "now playing" scene) | /assets/images/bg2.png | found (user-supplied export) |
| index.html | _button-play 8 | /assets/images/_button-play 8.png | found (user-supplied export) |
| index.html | frame border (orange rounded outline) | /assets/images/figma-frame-border.svg | found (downloaded from Figma MCP asset server) |
| index.html | pause/replay icon | /assets/images/figma-pause-icon.svg | found (downloaded from Figma MCP asset server) |

## Open Items
- Hindi/Gujarati title text: Figma only had the English string "Nanna munna Bachha" — the
  `.hindi`/`.gujrati` spans currently repeat the English text as a placeholder.
- No video file exists in `assets/videos/` — the "playing" state is a static poster image
  (`bg2.png`) only, per user decision. Wire up a real `<video>` element once a source file is
  supplied.
