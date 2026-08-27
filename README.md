# Ad Altare
# Catholic Wedding Atelier

A static marketing site for a Catholic wedding planning company in Ireland.
Six pages, no build step, no dependencies. Open `index.html` and it runs.

> *Introibo ad altare Dei* — I will go unto the altar of God.

---

## Contents

- [Running it](#running-it)
- [Deploying](#deploying)
- [Before you launch: placeholder content](#before-you-launch-placeholder-content)
- [Adding your photographs](#adding-your-photographs)
- [Wiring up the enquiry form](#wiring-up-the-enquiry-form)
- [Editing the pages](#editing-the-pages)
- [The motion system](#the-motion-system)
- [The generated artwork](#the-generated-artwork)
- [Accessibility and graceful degradation](#accessibility-and-graceful-degradation)
- [Browser support](#browser-support)

---

## Running it

There is no compile step and nothing to install. Any static server will do:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening the files directly with `file://` mostly works, but a server is better —
some browsers restrict what a `file://` page may do.

## Deploying

Upload the whole folder. That's it.

| Host | What to do |
|---|---|
| **GitHub Pages** | Settings → Pages → deploy from branch, root folder. |
| **Netlify** | Drag the folder onto the dashboard, or connect the repo. No build command; publish directory `/`. |
| **Vercel / Cloudflare Pages** | Framework preset "Other", no build command, output directory `/`. |
| **Traditional hosting** | FTP the folder into your web root. |

The only external request the site makes is to Google Fonts. If you would rather
have no third-party requests at all, download Cormorant Garamond and Inter, drop
the `.woff2` files into `assets/fonts/`, replace the `<link>` in each page's
`<head>` with your own `@font-face` rules, and you are fully self-hosted.

---

## Launch checklist

Work top to bottom. Nothing below is optional except where it says so.

- [ ] **Set your real domain.** `SITE_URL` in `tools/chrome.py`, then
      `python3 tools/build.py && python3 tools/mk_meta.py`. Canonical tags, the
      sitemap and every share-image URL derive from it.
- [ ] **Custom domain on GitHub Pages** — add a `CNAME` file containing just the
      domain (e.g. `adaltare.ie`), point a DNS `ALIAS`/`ANAME` at
      `bridgesoisin.github.io`, and enable *Enforce HTTPS* in Settings → Pages.
      Not created here, because a `CNAME` naming the wrong domain breaks the
      site rather than doing nothing.
- [ ] **Replace every placeholder** in the table below.
- [ ] **Point the enquiry form at a real endpoint** — see below. Test it by
      sending yourself an enquiry.
- [ ] **Check the retention periods** in `privacy.html` say what you actually do.
- [ ] **Have a priest read `rite.html`**, particularly the preparation section
      and what it says about permissions for the older rite.
- [ ] **Check the figures on `budget.html`** against current Irish prices.
- [ ] **Add real photography** to `assets/images/` — see below.
- [ ] **Re-render the share images** if you changed any page title:
      `node tools/mk_og.js`.
- [ ] Submit `sitemap.xml` in Google Search Console.
- [ ] Paste the URL into WhatsApp and confirm the share card looks right.

`.nojekyll` is already present: it stops GitHub Pages running the site through
Jekyll, which is faster and avoids surprises with any future underscore-prefixed
file.

## Before you launch: placeholder content

**Everything in the list below is invented.** It is written to be plausible so
you can see how the site reads when it is full, but none of it is true and none
of it should go live unchanged. Search for each string and replace it.

| What | Where | Currently |
|---|---|---|
| Company name | every page | *Ad Altare* |
| Email | every page | `hello@adaltare.ie` |
| Telephone | every page | `+353 1 234 5678` |
| Canonical URL | `<link rel="canonical">` in each `<head>` | `https://adaltare.ie/…` |
| Studio location | `contact.html`, footer | "Dublin 2 & Galway City" |
| Social links | footer | point at instagram.com / pinterest.ie — swap in your real profile URLs |
| Data retention periods | `privacy.html` | twelve months / six years — change to what you actually do |
| Staff names and biographies | `philosophy.html` | three invented people |
| Company history | `philosophy.html` timeline | invented |
| Statistics (184 weddings, 21 dioceses, 12 years, 6 countries) | `index.html`, `weddings.html` | invented — see `data-count` |
| Every testimonial | `index.html`, `weddings.html` | invented, including the priest and the sacristan |
| Every couple and wedding in the portfolio | `weddings.html`, `index.html` | invented couples. **The churches are real buildings; the weddings are not.** Three are tagged `tlm` and shown as traditional-rite weddings |
| Prices (€2,400 / €9,800 / €3,600 and the add-ons) | `atelier.html` | invented |
| Every figure in the cost table and the twelve levers | `budget.html` | **indicative Irish figures, not quotations** — check them against current local prices before launch |
| Irish terminology — the green book, corkage practice, the marriage course | `budget.html`, `rite.html`, `journal-paperwork.html` | written as the source guide has it; outbound network was blocked, so nothing could be checked against a current source |
| Everything about permissions for the older rite | `rite.html`, `journal-latin-mass.html` | accurate as far as it goes, but diocesan practice varies and changes — have a priest read it |
| Dioceses served | `philosophy.html` | real Irish dioceses, but not a claim we can stand over |

The liturgical content on `rite.html` — both orders of the rite, the readings,
the music, the canonical and civil preparation — is written from the *Order of
Celebrating Matrimony*, the 1962 *Rituale Romanum* and *Missale Romanum*, and
current Irish practice, and is intended to be accurate. The Traditional Latin
Mass section covers the marriage rite, the propers of the *Missa pro Sponso et
Sponsa*, the nuptial blessing after the Pater Noster, and the fact that
permission for the older rite rests with the diocesan bishop under
*Traditionis custodes*. It is still a plain-language summary, not canon law, and the page says
so. Have your own celebrant read it before you publish, particularly the
paperwork section, since dioceses differ in detail.

---

## Adding your photographs

Every frame on the site is a real `<img>` sitting on top of a generated painterly
ground. **Drop a file in with the right name and it appears; there is no code to
change.** If a file is missing the `<img>` removes itself and the generated
artwork shows through, which is why the site never looks broken.

Put files in `assets/images/`:

| Filename | Used on | Shape | Suggested size |
|---|---|---|---|
| `wedding-01.jpg` … `wedding-09.jpg` | `weddings.html`, and 01–03 on `index.html` | odd numbers portrait, even numbers landscape | 1600 px on the long edge |
| `team-01.jpg`, `team-02.jpg`, `team-03.jpg` | `philosophy.html` | portrait 3:4 | 1200 × 1600 |

Notes:

- The site applies its own colour treatment (`saturate(.82) contrast(1.06)`) and
  a vignette, so supply unretouched images and let the CSS do the grading. If you
  don't want that, edit `.plate__img` in `assets/css/style.css`.
- Portrait plates are cut to a round-headed arch (`.frame--arch`). Keep faces
  and horizons out of the top fifth of the frame or the arch will crop them.
- Landscape plates in the gallery carry a caption over the bottom of the image
  (`.plate__glaze--scrim`). Leave that area quiet.
- Write real `alt` text as you go — the markup has descriptive `alt` already, but
  it describes an invented wedding.

To add a tenth wedding, copy any `<article class="gallery__item">` block in
`weddings.html`, change the caption, the `src`, the `data-tags` (used by the
filter buttons) and the `seed` in `data-fresco` so it gets its own artwork.

---

## The budget guide

`budget.html` is built from a real month-by-month planner the owners wrote for
a friend. Two things were deliberately left out of the published version:

- **Every personal name.** The source names the couple, the friend it was
  written for, and family members. None of it is on the site.
- **The photographer recommendation.** The source names a real working
  photographer. Recommending a named business on a commercial page is the
  owners' call to make with that person — add it back if you have their
  agreement.

The cost table is a semantic `<table>` whose last column carries the bar, so the
chart and its accessible table view are the same object; every value is printed
beside its mark, and the "would not economise on" rows are marked by a diamond
as well as by tone, so the distinction survives greyscale and colour-blindness.
Bar colours are stepped per surface (`--bar-from` / `--bar-to`, redefined under
`.on-parchment`) so each clears 3:1 against the ground it sits on.

## Wiring up the enquiry form

The form on `contact.html` currently has `action="#"`. In that state the script
in `assets/js/site.js` collects the fields and opens the visitor's mail client
with the enquiry composed — a working fallback that loses nothing, but not what
you want in production.

To receive enquiries properly, set a real endpoint:

```html
<!-- Formspree -->
<form class="grid grid--2" data-form="hello@adaltare.ie"
      action="https://formspree.io/f/YOUR_ID" method="post" novalidate>

<!-- Netlify Forms — add netlify and a name, keep method="post" -->
<form class="grid grid--2" name="enquiry" method="post" netlify novalidate>
```

Once `action` is anything other than `#`, the script steps out of the way and
lets the browser submit normally. Client-side validation (`required`, `type="email"`)
still applies either way.

---

## Regenerating the pages

The header, mobile menu and footer are identical in every page. They are edited
in one place and the pages regenerated, rather than in seven files by hand:

```sh
python3 tools/build.py       # regenerate every page from tools/bodies/*.html
python3 tools/mk_meta.py     # regenerate sitemap.xml and robots.txt
node tools/mk_og.js          # re-render the share images (needs Playwright)
```

The site itself stays a zero-build static site — `tools/` never runs at deploy
time, and the generated `.html` is what ships. See `tools/README.md`.

**Editing one page's copy?** Edit `tools/bodies/<page>.html`, then
`python3 tools/build.py`.

**Adding a journal article?** Copy `tools/bodies/journal-paperwork.html` as a
starting point, register it in `tools/build.py` with a title and description,
add a card to `tools/bodies/journal.html`, add an entry to `tools/mk_og.js`, and
rebuild. Any page whose filename starts with `journal-` automatically gets
`Article` structured data.

## Being found and shared

- `sitemap.xml` and `robots.txt`, generated from the page list.
- **JSON-LD** in every page: `ProfessionalService` describing the business and
  where it works, `WebPage`, `BreadcrumbList`, `FAQPage` on the rite and contact
  pages, and a `HowTo` for the budget countdown. The FAQ entities are *parsed
  out of the accordions already on the page*, so the structured data and the
  visible content cannot drift apart.
- **Share images** at `assets/images/og/*.jpg`, 1200×630, generated by the
  site's own art engine — a fresco ground, rose-window tracery, the wordmark and
  the page's headline. Re-render them with `node tools/mk_og.js` after changing
  a page title.

All of it points at `https://adaltare.ie`, set as `SITE_URL` in
`tools/chrome.py`. **Change that to your real domain and rebuild** — the
canonical tags, sitemap and share-image URLs all derive from it.

## Editing the pages

Six pages, all plain HTML:

| File | Purpose |
|---|---|
| `index.html` | Home |
| `philosophy.html` | What the house believes, the people, the history |
| `rite.html` | Both rites — the Order of Celebrating Matrimony and the Traditional Latin nuptial Mass — plus readings, music, paperwork |
| `atelier.html` | Collections, investment, the eight-step process |
| `weddings.html` | Portfolio, with filters |
| `budget.html` | What a wedding costs, twelve ways to spend less, and a countdown |
| `contact.html` | Enquiry form and FAQ |
| `journal.html` | Index of the written guides |
| `journal-latin-mass.html` | Arranging a Traditional Latin nuptial Mass in Ireland |
| `journal-paperwork.html` | The church file, the State file, and the order to do them in |
| `privacy.html` | What happens to enquiry data — GDPR notice |

**The header, mobile menu and footer are duplicated in all six files.** That is
the deliberate cost of having no build step: the pages are real HTML that renders
instantly and indexes properly. If you change a nav link or a footer address,
change it in all six. They are marked with `<header class="nav"` and
`<footer class="footer"` and are byte-identical apart from the `aria-current`
attribute on the active nav link.

The SVG emblems live in one `<svg>` sprite near the top of each page's `<body>`
and are referenced with `<svg class="ico"><use href="#i-chalice"></use></svg>`.
Available: `i-cross`, `i-chalice`, `i-rings`, `i-lily`, `i-laurel`, `i-dove`,
`i-flame`, `i-book`, `i-note`, `i-arch`, `i-star`, `i-arrow`, `i-tick`,
`i-diamond`.

---

## The motion system

`assets/js/site.js` reads `data-` attributes off the markup. Nothing needs
initialising by hand; add the attribute and it works.

| Attribute | Effect |
|---|---|
| `data-reveal="up \| fade \| clip \| clip-x \| scale \| rule \| arch \| split"` | Entrance animation when the element scrolls into view. `split` has no visual effect of its own — use it on a heading whose children carry `data-split`. |
| `data-reveal-delay="240"` | Delay in milliseconds. |
| `data-reveal-group="90"` | On a container: give each `[data-reveal]` child an extra 90 ms of delay in order. |
| `data-split="mask"` | Wrap every word in its own mask so the line rises into place. Words on the same visual line move together, and it re-measures on resize. |
| `data-split="words"` | Wrap words without masking — used with `data-illuminate`. |
| `data-split-delay="140"` | Offset the whole line. |
| `data-illuminate` | Words light up one by one as the block is scrolled through. Put it on the same element as `data-split="words"`. |
| `data-parallax="0.12"` | Scroll-linked vertical drift. Higher moves more. |
| `data-pin` / `data-pin-track` | Pinned horizontal scroll. The section's height is calculated from the track's width. Collapses to a swipeable snap rail under 860 px. |
| `data-pin-counter` | Element whose text becomes `01`, `02`, … as the track advances. |
| `data-marquee="0.42"` | Infinite ticker. Content is duplicated to fill; scroll velocity nudges the speed. Add `data-marquee-dir="right"` to reverse. |
| `data-magnetic="0.28"` | The element leans toward the cursor. |
| `data-cursor="View"` | Expands the custom cursor and prints this label inside it. |
| `data-count="184"` | Counts up from zero when scrolled into view. |
| `data-accordion` | Accordion container (`data-accordion="multi"` to allow several open). |
| `data-testimony` | Quote rotator; `.testimony__dot` buttons drive it. |
| `data-filters=".gallery"` | Filter bar; buttons carry `data-filter="tag"`, items carry `data-tags="tag tag"`. |
| `data-native-scroll` | Marks a subtree that should keep the browser's own scrolling rather than the inertial scroller. |
| `data-tilt="6"` | Slight 3-D tilt toward the cursor. |
| `data-year` | Replaced with the current year. |

`window.Altare.refresh()` re-reads the document and rebinds all of the above.
Call it after swapping content in — client-side navigation, a CMS render,
injected markup — and the splits, entrances, parallax, pins and generated
artwork pick up the new nodes.

**Scrolling.** The site uses an inertial scroller that lerps toward a target and
drives the real `scrollTop`, so `position: sticky`, anchor links, find-in-page
and assistive technology all keep working. It disables itself on touch devices
and under reduced-motion.

---

## The generated artwork

There is no stock photography here and nothing is fetched from a CDN. Every
non-photographic image is generated in the browser by `assets/js/canvas-art.js`,
exposed as `window.AltareArt`.

```html
<canvas data-fresco='{"preset":"plate","palette":"cinabrese","seed":940}'></canvas>
<canvas data-rose='{"petals":12,"inner":6}'></canvas>
<canvas data-motes='{"count":54}'></canvas>
```

**`fresco`** — a painted ground. Domain-warped fractal value noise mapped through
a pigment ramp and lit from a single high window, rendered small and scaled up so
it carries the softness of oil on panel. Two plates cross-drift so the surface
never sits perfectly still.

*Presets:* `ground` (full-bleed backgrounds behind display type — held back so
the type keeps its contrast), `plate` (framed panels standing in for a painting),
`vellum` (light parchment cards), `veil` (a thin wash over large quiet areas).

*Palettes,* named for the pigments they imitate: `chiaroscuro` (bistre and gold),
`lapis` (ultramarine), `cinabrese` (vermilion), `gesso` (vellum), `verdigris`.

*Options,* any of which override the preset: `seed`, `scale`, `octaves`, `level`
(the tone the panel sits at before light), `detail` (how far pigment ranges
either side of it), `lightX`, `lightY`, `glow`, `reach`, `contrast`,
`resolution`, `drift`, `still`.

Changing `seed` gives a completely different painting with the same character —
the cheapest way to make a new panel feel distinct.

**`roseWindow`** — gothic tracery drawn as real geometry: lobes struck from the
centre, cusped foils, mullions to the rim, quatrefoils between, and a stained-glass
wash behind. Options: `petals`, `inner`, `color`, `lineWidth`, `glass`.

**`motes`** — gold-leaf dust drifting in a shaft of light. Options: `count`, `color`.

**`gildGrain`** — the gesso tooth laid over the whole document as a tiled SVG
turbulence, wired to the `--grain-src` custom property. Runs automatically.

**Painting is lazy, and cheap to keep on screen.** Three things matter here,
and each was a real stall before it was fixed:

- A `fresco` is not painted until its canvas comes within 400px of the
  viewport. A panel nobody scrolls to is never painted at all.
- Painting is sliced: a band of rows at a time, against a **single global**
  7ms-per-frame budget shared by every panel on the page, with the band size
  adapting to the machine. The budget has to be global — a gallery where nine
  plates enter together would otherwise start nine loops, each claiming its
  own slice of every frame.
- The drift animation redraws at 12fps, not 60, into a backing store capped at
  900px. The source plate is only ~250px and is upscaled with smoothing, so a
  full-resolution 60fps redraw costs a great deal and shows nothing. Before
  this, ten panels redrawing two scaled composites each frame saturated the
  main thread outright.

`window.Altare.refresh(root)` re-mounts artwork in a subtree, and a canvas that
was mounted while hidden repaints when it is shown again.

All of it pauses when off-screen and switches off entirely under reduced-motion.

---

## Accessibility and graceful degradation

- **No JavaScript** — every page renders complete and readable. Entrance
  animations only hide content once the `js` class is on `<html>`, which an
  inline script in the `<head>` adds.
- **Reduced motion** — `prefers-reduced-motion: reduce` disables the inertial
  scroller, the custom cursor, the marquees, the drifting artwork and every
  entrance; all content is shown immediately.
- **Keyboard** — skip link, visible focus rings, Escape closes the menu, and
  keyboard scrolling stays in sync with the inertial scroller.
- **Contrast** — body and label colours are set to clear 4.5:1 against their
  backgrounds. If you change the palette, re-check the small uppercase labels
  first; they are the tightest.
- **Print** — chrome, artwork and animation are stripped; the content prints on
  white.

---

## Browser support

Current Chrome, Edge, Firefox and Safari. The site leans on `color-mix()`,
`clamp()`, `aspect-ratio`, CSS nesting-free custom properties and
`grid-template-rows: 0fr → 1fr` transitions, all of which have been baseline
since 2023. Older browsers get a plainer but complete page.

---

## Layout of the repository

```
.
├── index.html            philosophy.html   rite.html
├── atelier.html          weddings.html     contact.html
├── assets/
│   ├── favicon.svg
│   ├── css/style.css     the whole design system, in 14 numbered sections
│   ├── js/
│   │   ├── canvas-art.js the generated artwork
│   │   └── site.js       the motion system
│   └── images/           drop your photographs here
└── README.md
```
