# tools

The site is a **zero-build static site** — the `.html` files in the repository
root are what deploys, and nothing here runs at deploy time or in a browser.

These scripts exist for one reason: the header, mobile menu and footer are
identical across every page, and editing them in seven files by hand is how
they drift apart.

```sh
python3 tools/build.py          # regenerate every page from tools/bodies/*.html
python3 tools/mk_weddings.py    # regenerate tools/bodies/weddings.html from its data
```

| File | What it holds |
|---|---|
| `chrome.py` | brand constants, the SVG emblem sprite, `<head>`, preloader, nav, menu, footer |
| `build.py` | page list with titles and meta descriptions; wraps each body in the chrome |
| `bodies/*.html` | the `<main>` content of each page — this is where you edit copy |
| `mk_weddings.py` | the portfolio list; regenerates `bodies/weddings.html` |

Bodies may use `{{icon:name}}`, `{{icon:name|class}}`, `{{email}}`, `{{phone}}`,
`{{phone_href}}`, `{{brand}}`, `{{brand_caps}}`, `{{motto_la}}`, `{{motto_en}}`.

**Editing a single page's copy?** Edit `tools/bodies/<page>.html` and rebuild.
Editing the nav or footer? Edit `chrome.py` and rebuild — that is the whole
point of this directory.

`build.py` writes into the repository root by default; set `SITE_OUT` to send it
elsewhere.
