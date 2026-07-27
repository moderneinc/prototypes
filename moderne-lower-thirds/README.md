# Moderne — animated title graphics & lower thirds

Two animated graphics built on the Moderne design kit, rendered from HTML so
the text, colour, scale and timing stay editable right up to the render.

- **Name / title** — speaker name + role, with the Digital Green rule
- **Topic / callout** — mono eyebrow, headline, optional meta line, strand-spectrum underline

Both come in a **Panel** treatment (surface card, for busy footage) and a
**Bare** treatment (type + rule only, for clean footage), in dark or light,
anchored lower-left, lower-right or upper-left, all inside the 10% title-safe area.

---

## 1. Design in the browser

Open `index.html`. Everything on the right panel is live:

| Control | What it does |
|---|---|
| Graphic / Treatment / Theme / Position | Layout variants |
| Content fields | Type your own copy. The headline is a text box — one line per line |
| **Row switches** | Every content row has an on/off switch, plus switch-only rows for the spectrum bar and the accent rule. Switching a row off drops it from the graphic but keeps the text, so you can bring it back without retyping. The panel resizes around what's left, closes its open edge when the rule is off, and disappears entirely if every row is off |
| Accent | Five strand-spectrum pairs. Each chip shows bright over deep — dark theme uses the bright half, light theme the deep half |
| **Motion** | Four easing presets — Moderne, Snappy, Smooth, Mechanical. Each sets the in/out curves, the overall pace and the per-line stagger |
| **Scale** | 60–180%. Every dimension is in `em` off one root size, so the whole graphic scales cleanly and stays pinned to its corner |
| Hold | How long it sits on screen between the in and out animations. Not affected by Speed |
| Speed | 0.5–2.0×. Retimes the in and out animations, and is baked into the render |
| Background | Checkerboard (= transparent), chroma key, or a fake footage backdrop to check legibility |
| Scrub | Frame-accurate timeline — what you scrub is exactly what renders |

Settings also come through the URL, so you can bookmark a look:

```
index.html?variant=topic&eyebrow=Pillar%2002&accent=%2325D0C0&position=br
```

The **Export** group at the bottom of the panel turns whatever you've set up
into a deliverable without leaving the browser:

- **Download HTML player** — a standalone `.html` with your settings baked in;
  transparent, autoplays, loops. No CLI needed.
- **Copy OBS / embed URL** — the same thing as a live URL (`?embed=1&loop=2`).
- **Copy render command** — the CLI line for step 2, with the quality picker
  (1080p 30 / 1080p 60 / 4K 60) translated into `--fps` / `--scale` flags.
- **Copy batch job (JSON)** — one entry for `export/batch.json`, so you can
  design each graphic in the browser and render the whole set in one pass.

---

## 2. Render with real transparency

```bash
npm install          # playwright, one time
npm run export       # both presets → out/
```

Each render produces three files in `out/`:

| File | Codec | Use it in |
|---|---|---|
| `*.webm` | VP9 + alpha | Premiere, Resolve, web, OBS media source. Small files |
| `*.mov` | ProRes 4444 | Final Cut, After Effects, Premiere. Big files, mastering quality |
| `*.png` | RGBA still | Thumbnails, slides, quick checks |
| `*.html` | Standalone player (`--html`) | OBS browser source, screen shares, anywhere a browser runs. Autoplays, loops, transparent |

Which to reach for:

- **Final Cut Pro** — the `.mov`. ProRes 4444 with straight alpha is FCP's native overlay format; drop it on a connected storyline and it just works.
- **After Effects** — the `.mov`, or `--keep-frames` for the raw PNG sequence if you want frame-level control (AE imports the sequence as footage; interpret alpha as Straight).
- **Premiere / Resolve** — either; the `.webm` is 100× smaller for the same picture.
- **OBS / live** — the `.html` as a browser source (set it to 1920×1080), or the `.webm` as a media source.

The renderer drives the same paused WAAPI timeline the browser scrubs, one
frame at a time, so there are no dropped or duplicated frames.

### Options

```bash
node export/render.mjs --preset=name
node export/render.mjs --preset=topic --accent=#25D0C0 --position=br

node export/render.mjs \
  --variant=name --name="Johnny Appleseed" \
  --role="Head of Engineering" --org=Moderne \
  --style=bare --hold=3000 --out=lt-johnny

node export/render.mjs --preset=name --easing=snappy --speed=1.25
node export/render.mjs --preset=topic --hide=meta,spectral   # drop rows
node export/render.mjs --fps=60 --scale=2      # 60fps, 3840×2160
node export/render.mjs --batch=export/batch.json
node export/render.mjs --preset=name --keep-frames   # leave the PNG sequence
node export/render.mjs --preset=topic --html         # also write out/<name>.html
node export/render.mjs --batch=export/batch.json --html-only --loop=2
```

`--html` writes a standalone `.html` next to the videos: the full prototype
with your settings baked in, chrome stripped, transparent background,
autoplaying on load and looping after a pause (`--loop` seconds between plays,
`--loop=-1` for play-once). Point an OBS browser source at it, or open it in
any browser over your footage. The live prototype does the same trick with
`?embed=1&loop=2` plus your usual URL params — no file needed.

`--hide` takes the same comma-separated row keys the switches use: `name`,
`role`, `org` on the name graphic; `eyebrow`, `topic`, `meta`, `spectral` on
the topic graphic; and `rule` on both. It works in URL params and batch files too.

`--batch` takes a JSON array of jobs — one entry per graphic, each with an
`out` filename. That's the fast way to render every lower third for a video in
one pass. See `export/batch.json`.

### Importing the alpha files

- **Premiere / Resolve** — drop the `.webm` or `.mov` straight on a track above your footage. Alpha is picked up automatically.
- **Final Cut** — use the `.mov`. ProRes 4444 carries straight alpha.
- **After Effects** — `.mov`, interpret footage → alpha: *Straight – Unmatted*.
- **Web / OBS** — the `.webm` plays with alpha in Chrome and as an OBS browser or media source.

---

## 3. If you'd rather screen-record than render

Set Background to **Chroma key**, put the browser full-screen, hit Play, and
capture. Magenta `#FF00FF` is the default key colour on purpose: standard
green screen `#00B140` sits close to Digital Green `#30F284` in hue and the
keyer will chew the accent rule. Magenta is nowhere in the Moderne palette, so
it keys clean.

Rendering to alpha is still better — no spill, no edge fringing on the type.

---

## Design notes

Everything comes from the Moderne design kit — Digital Green `#30F284` as the
one live accent, `#1C1714` surface, `#F2EDE4` paper ink, hairline `--line`
borders, Geist (standing in for Beausite) for headings and body, and Geist
Mono for anything systematic: eyebrows, roles, URLs, CVE IDs — all-caps
transforms, sizes and wide tracking unchanged, matching the docs prototype.
The light theme is warm paper (`#F0EFEA` canvas, `#262240` midnight-violet
ink) rather than cool grey, and the accent drops to its deep strand
counterpart (Green `#30F284` → `#1D5937`) so it stays legible on that paper. Flat, no shadows, one
accent, one idea per graphic. The strand-spectrum bar on the topic variant is
the only place more than one colour appears.

Motion is a wipe, not a fade: the accent rule draws first, the panel wipes out
from it, then each line of type masks up in sequence. Out is the same move,
faster and reversed. The Motion presets change the curves and pace of that
sequence, not its choreography:

| Preset | Feel | Curve (in / out) |
|---|---|---|
| Moderne | The house default — decisive in, quick out | `.16,1,.3,1` / `.7,0,.84,0` |
| Snappy | Faster, tighter stagger, slight overshoot on entry | `.22,1.15,.36,1` / `.55,0,1,.45` |
| Smooth | Slower and more even, wider stagger | `.33,1,.68,1` / `.32,0,.67,0` |
| Mechanical | Same curve both ways, no overshoot, uniform stagger | `.83,0,.17,1` both |

## Files

```
moderne-lower-thirds.html   the prototype — open this
export/render.mjs           headless alpha renderer
export/batch.json           example multi-graphic batch
out/                        rendered webm / mov / png
```
