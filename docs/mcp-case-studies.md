# MCP page: Use cases block

The original six-case carousel with Spectrum photographs. Sits between "How it works"
and "Why Makini MCP", id `#use-cases`, at roughly 43% of the page. The reader has just seen
the mechanism, the cases answer what to do with it, and Capabilities then reads as the
argument on top of the evidence.

| File | What it is |
|---|---|
| `page example/mcp.html` | The MCP page with the block in place |
| `page example/_build_casestudies.js` | Holds the case texts and writes the block into `mcp.html` |
| `page example/_frag_casestudies.html` | The block's CSS as it is injected into `mcp.html` |
| `page example/assets/use-cases/` | 30 photographs, selected Spectrum WebP images, catalog and six-case export |
| `page example/assets/use-cases/grade.js` | Build-time image shader; the baker exports Spectrum only |
| `page example/assets/use-cases/review.js` | Category tabs scoped exclusively to the separate image library |
| `page example/_usecase_tools.cjs` | Image baking, Chrome screenshots, verification and local preview server |

```
cd "page example"
node _build_casestudies.js          # write the block into mcp.html
node _build_casestudies.js json     # print the current CASES payload
```

Re-running is safe: the previous block and its CSS are removed first (including blocks from
earlier builds named "Case studies"). Windows or Unix line endings are kept as found.

## Design

A gallery after Stripe's "What's happening" section, in the Makini palette.

- **Track.** The open panel is wide, the next ones step down to slivers, the ones already seen
  collapse to the left. Under 900px of track the followers shrink to phone-size slivers so the
  open panel keeps room for the caption.
- **Caption on the image.** Title and text sit on the open panel over a dark scrim. Every
  caption takes the height of the longest one, measured by the script at the open panel's
  width, so titles start at the same height on every slide, the text follows 8px under the
  title, and shorter cases leave room at the bottom. It re-measures on resize.
- **Controls.** Counter, gradient progress bars and arrows under the gallery. Clicking a panel,
  a bar or the keyboard arrows also moves it.
- **The track loops.** After the last case the first ones are already waiting on the right and
  the arrows never disable. The script clones the panels in the browser; the page source still
  carries each case once, and the clones stay out of the accessibility tree and the tab order.
  Moving between copies shows identical pixels and runs with animation off, so it cannot be seen.

- **Swipe.** On touch screens a mostly horizontal drag of 40px or more moves one case. Vertical
  drags still scroll the page (`touch-action: pan-y`), and the tap a swipe can leave behind is
  ignored.
- **Autoplay.** One case every 6 seconds. (The live MCP pages step their tabs every 9s and the
  Why highlight every 2.8s; 6s was picked by the client as the pace for this block.) The active
  progress bar fills
  over the step and its `animationend` moves the gallery, so the bar and the slide never drift
  apart. It pauses while a mouse is over the gallery, while keyboard focus is inside it, while
  it is mostly off-screen and while the tab is hidden; any manual move restarts the count.
  Touch does not stop it, like the tabs on the site. `prefers-reduced-motion` turns it off
  and shows the active bar full. The step lives in `--cg-dur` on `.cg`.

## Spectrum images and standalone library

`#use-cases` contains exactly six original client cases, with the original heading and copy.
Its six fixed photographs are the first six entries in `assets/use-cases/catalog.json`.
All image URLs use `processed/spectrum/`; no treatment selector or saved style changes them.

Spectrum uses the Makini palette (#71a1ff, #9468f2, #ef68f2), baked into 1200 × 800 WebP files.
The page serves static images and does not need runtime WebGL. Previous treatments and original
JPEGs are not referenced by the page. Original JPEGs are included as editable source material;
earlier color-treatment experiments remain local and are omitted from the developer handoff.

`#industrial-images` is a separate sibling section directly below the use cases. It displays
all 30 Spectrum photographs as plain images, with category tabs and no scenario text or captions.
Tabs filter only this section; clicking an image has no carousel action. The tab script does
not query, update or dispatch events to the use-case section. Arrow keys, Home and End navigate tabs.
The former Image Direction controls and Explore all 30 links have been removed.
The old `cs-ind-*` and `cs-abs-*` files are retained as historical assets and are no longer used.
Generation prompts, file layout and bake/verify/serve commands are documented in
`page example/assets/use-cases/README.md`. Screenshots and verification output go to
`page example/review/`.

## Content model

One case is a title and a short paragraph. The original six client entries are preserved verbatim.

| Field | What it is |
|---|---|
| `title` | The case headline. One line, verb first |
| `text` | Two sentences: what the agent does, then what the person gets |

The current page has six cases. `workflows.json` exports those six entries on every build.
The image library has its own 30-entry source, `catalog.json`. Rebuilding replaces both sections
without duplication. `node _usecase_tools.cjs verify` checks carousel looping, tab isolation,
Spectrum-only image URLs, image decoding and mobile layout, and captures both sections.
