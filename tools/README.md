# tools

The site is a **zero-build static site** — the `.html` files in the repository
root are what deploys, and nothing here runs at deploy time or in a browser.

These scripts exist for one reason: the header, mobile menu and footer are
identical across every page, and editing them in seven files by hand is how
they drift apart.

```sh
python3 tools/build.py          # regenerate every page from tools/bodies/*.html
python3 tools/mk_weddings.py    # regenerate tools/bodies/weddings.html from its data
python3 tools/mk_meta.py        # regenerate sitemap.xml and robots.txt
node    tools/mk_og.js          # re-render the share images (needs Playwright)
BUNDLE_OUT=preview.html python3 tools/bundle.py   # one-file preview of the whole site
```

| File | What it holds |
|---|---|
| `chrome.py` | brand constants, the SVG emblem sprite, `<head>`, preloader, nav, menu, footer |
| `build.py` | page list with titles and meta descriptions; wraps each body in the chrome |
| `bodies/*.html` | the `<main>` content of each page — this is where you edit copy |
| `mk_weddings.py` | the portfolio list; regenerates `bodies/weddings.html` |
| `mk_meta.py` | `sitemap.xml` and `robots.txt`, from the same page list |
| `mk_og.js`, `og-template.html` | the 1200×630 share images, drawn by the site's own art engine |
| `bundle.py` | inlines every page into one self-contained file, for previewing |

Bodies may use `{{icon:name}}`, `{{icon:name|class}}`, `{{email}}`, `{{phone}}`,
`{{phone_href}}`, `{{brand}}`, `{{brand_caps}}`, `{{motto_la}}`, `{{motto_en}}`.

**Editing a single page's copy?** Edit `tools/bodies/<page>.html` and rebuild.
Editing the nav or footer? Edit `chrome.py` and rebuild — that is the whole
point of this directory.

`build.py` writes into the repository root by default; set `SITE_OUT` to send it
elsewhere.
