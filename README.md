# Makini marketing pages

## MCP page — developer handoff

The current design is in [page example/mcp.html](<page example/mcp.html>).

- **Use cases:** six original client cases, each with a fixed Spectrum image. The expanding carousel includes arrows, progress bars, keyboard navigation, swipe and autoplay.
- **Image library:** a separate section immediately below the cases, containing all 30 Spectrum images with category tabs. Its tabs and images do not change the use-case carousel.
- **Selected treatment:** Spectrum, using Makini blue, violet and pink. The page loads processed WebP files directly.

### Open the page

Clone or download the repository and run this command from its root with Node.js installed:

```sh
node "page example/_usecase_tools.cjs" serve
```

Open **http://127.0.0.1:4173/mcp.html#use-cases** for the cases, or **http://127.0.0.1:4173/mcp.html#industrial-images** for the image library.

The page can also be opened directly as a local HTML file. Keep its relative asset directories intact, including `SAP EWM API integration – connect to anything – Makini_files`.

### Files to use

| File or directory | Purpose |
| --- | --- |
| [mcp.html](<page example/mcp.html>) | Complete page and current visual reference |
| [Spectrum images](<page example/assets/use-cases/processed/spectrum>) | All 30 final images, 1200 × 800 WebP |
| [Original photographs](<page example/assets/use-cases/originals>) | Ungraded generated source images |
| [Case builder](<page example/_build_casestudies.js>) | Original six-case copy and markup for both sections |
| [Section styles](<page example/_frag_casestudies.html>) | CSS used by both sections |
| [Image tabs](<page example/assets/use-cases/review.js>) | Independent category filtering, scoped to the image library |
| [Case data](<page example/assets/use-cases/workflows.json>) | Six cases and their image paths |
| [Image catalog](<page example/assets/use-cases/catalog.json>) | Image IDs, categories and generation prompts |
| [Implementation notes](docs/mcp-case-studies.md) | Layout, behavior and verification details |

To rebuild both sections after editing their sources:

```sh
node "page example/_build_casestudies.js"
```

The `{SAP EWM}` placeholder follows the existing page convention for system-specific copy.

### Previews

[Desktop use cases](<page example/review/mcp-use-cases-desktop.png>) · [Mobile use cases](<page example/review/mcp-use-cases-mobile.png>) · [All 30 images](<page example/review/mcp-use-cases-library.png>)

![MCP use cases](<page example/review/mcp-use-cases-desktop.png>)
