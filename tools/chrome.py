# -*- coding: utf-8 -*-
"""Shared chrome for the Ad Altare site: head, sprite, loader, nav, menu, footer."""

import math

BRAND = "Ad Altare"
BRAND_CAPS = "AD ALTARE"
MOTTO_LA = "Introibo ad altare Dei"
MOTTO_EN = "I will go unto the altar of God"
SITE_URL = "https://adaltare.ie"      # placeholder — see README
EMAIL = "hello@adaltare.ie"
PHONE = "+353 1 234 5678"
PHONE_HREF = "+35312345678"


# --------------------------------------------------------------------------
# Ornament — every emblem is hand-authored here, nothing is fetched.
# --------------------------------------------------------------------------

def _star(points=8, outer=9.6, inner=3.6, cx=12.0, cy=12.0):
    """An eight-pointed Marian star — Stella Maris."""
    coords = []
    for k in range(points * 2):
        r = outer if k % 2 == 0 else inner
        a = -math.pi / 2 + k * math.pi / points
        coords.append((cx + math.cos(a) * r, cy + math.sin(a) * r))
    d = "M%.2f %.2f" % coords[0]
    for x, y in coords[1:]:
        d += "L%.2f %.2f" % (x, y)
    return d + "Z"


def _laurel():
    """Two sprung branches with paired leaves — the victor's wreath."""
    left = "M12 21.4c-4.9-.6-8.4-4.6-8.4-9.4 0-4.2 2.5-7.7 6.2-9.2"
    right = "M12 21.4c4.9-.6 8.4-4.6 8.4-9.4 0-4.2-2.5-7.7-6.2-9.2"
    leaves = []
    for i in range(5):
        t = 0.16 + i * 0.17
        ang = math.pi * (0.62 + t * 0.78)
        r = 8.4
        x = 12 + math.cos(ang) * r
        y = 12 + math.sin(ang) * r * -1 + 1.2
        leaves.append(
            "M%.2f %.2fc-1.5-1.0-3.2-.7-3.9.7.9 1.2 2.6 1.3 3.9-.7Z" % (x, y))
        leaves.append(
            "M%.2f %.2fc1.5-1.0 3.2-.7 3.9.7-.9 1.2-2.6 1.3-3.9-.7Z" % (24 - x, y))
    return left, right, leaves


_L, _R, _LEAVES = _laurel()

SPRITE = """<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"
     style="position:absolute;width:0;height:0;overflow:hidden" data-sprite>
  <defs>
    <g id="sprite-defaults" fill="none" stroke="currentColor" stroke-width="1"
       stroke-linecap="round" stroke-linejoin="round"></g>
  </defs>

  <symbol id="i-cross" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round">
    <path d="M12 2.6v18.8M3.4 10.4h17.2"/>
    <path d="M10.3 3.7a1.7 1.7 0 0 1 3.4 0M10.3 20.3a1.7 1.7 0 0 0 3.4 0M4.5 8.8a1.7 1.7 0 0 0 0 3.2M19.5 8.8a1.7 1.7 0 0 1 0 3.2"/>
  </symbol>

  <symbol id="i-chalice" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="3.6" r="2.4"/>
    <path d="M12 1.9v3.4M10.3 3.6h3.4"/>
    <path d="M6.4 8.2h11.2c0 4.3-2.3 6.7-5.6 6.7S6.4 12.5 6.4 8.2Z"/>
    <path d="M12 14.9v3.8M8.2 21.2h7.6M9.8 18.7h4.4"/>
  </symbol>

  <symbol id="i-rings" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
    <circle cx="8.8" cy="14.4" r="6.2"/>
    <circle cx="15.2" cy="9.6" r="6.2"/>
    <path d="M12 4.2l1.2-2 1.2 2"/>
  </symbol>

  <symbol id="i-lily" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2.4c-1.7 2.6-1.7 5 0 7.2 1.7-2.2 1.7-4.6 0-7.2Z"/>
    <path d="M12 9.6C9.8 7 6.6 6.8 5.2 8.9c-1.2 1.9.3 4.4 2.7 4.9M12 9.6c2.2-2.6 5.4-2.8 6.8-.7 1.2 1.9-.3 4.4-2.7 4.9"/>
    <path d="M6.6 14.4h10.8M12 9.6v11.8M9.4 21.4h5.2"/>
  </symbol>

  <symbol id="i-laurel" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <path d="__L__"/><path d="__R__"/>
    __LEAVES__
    <path d="M12 2.4v3.4M10.6 3.6h2.8"/>
  </symbol>

  <symbol id="i-dove" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21.4 4.6c-4 .3-7.1 2.2-9 5.6l-1.5 2.7-1.7 2.5c-1.5 2-3.8 3.2-6.6 3.4 1.1-3.1 3.2-5.3 6-6.3"/>
    <path d="M12.4 9.4C10.5 7.7 8 7.3 5.6 8.5"/>
    <path d="M10.9 12.9c2.6.7 5.1-.2 6.9-2.3"/>
    <circle cx="18.6" cy="6.4" r=".55" fill="currentColor" stroke="none"/>
  </symbol>

  <symbol id="i-flame" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2.4c1.9 2.6 2.9 4.4 2.9 5.8a2.9 2.9 0 0 1-5.8 0c0-1.4 1-3.2 2.9-5.8Z"/>
    <path d="M12 11.2v1.4"/>
    <path d="M9.2 12.6h5.6v8.8H9.2Z"/>
  </symbol>

  <symbol id="i-book" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 7.6C10.2 6.1 7.5 5.5 3.8 5.7v13.1c3.7-.2 6.4.4 8.2 1.9 1.8-1.5 4.5-2.1 8.2-1.9V5.7c-3.7-.2-6.4.4-8.2 1.9Z"/>
    <path d="M12 7.6v13.1"/>
    <path d="M12 1.6v3.2M10.6 3h2.8"/>
  </symbol>

  <symbol id="i-note" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9.2 17.6V5.4l10-2v12"/>
    <path d="M9.2 8.6l10-2"/>
    <circle cx="6.6" cy="17.8" r="2.6"/>
    <circle cx="16.6" cy="15.6" r="2.6"/>
  </symbol>

  <symbol id="i-arch" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4.4 21V11.6a7.6 7.6 0 0 1 15.2 0V21"/>
    <path d="M2.2 21h19.6"/>
    <path d="M9.2 21v-4.6a2.8 2.8 0 0 1 5.6 0V21"/>
    <path d="M12 1.4v3.2M10.6 2.8h2.8"/>
  </symbol>

  <symbol id="i-star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
    <path d="__STAR__"/>
  </symbol>

  <symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3.5 12h17M14 5.5l6.5 6.5L14 18.5"/>
  </symbol>

  <symbol id="i-tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
    <path d="M12 3.5v17M4.5 9.5h15"/>
  </symbol>

  <symbol id="i-diamond" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
    <path d="M12 2.6 21.4 12 12 21.4 2.6 12Z"/>
    <path d="M12 7.4 16.6 12 12 16.6 7.4 12Z"/>
  </symbol>
</svg>"""

SPRITE = (SPRITE
          .replace("__L__", _L)
          .replace("__R__", _R)
          .replace("__LEAVES__", "\n    ".join('<path d="%s"/>' % d for d in _LEAVES))
          .replace("__STAR__", _star()))


def icon(name, cls=""):
    """Reference a sprite symbol.  supplies a 1em default that any
    component class declared later in the stylesheet overrides."""
    classes = ("ico " + cls).strip()
    return ('<svg class="%s" aria-hidden="true" focusable="false">'
            '<use href="#i-%s"></use></svg>') % (classes, name)


# --------------------------------------------------------------------------
# Head
# --------------------------------------------------------------------------

FONT_HREF = ("https://fonts.googleapis.com/css2?"
             "family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&"
             "family=Inter:wght@300;400;500;600&display=swap")

# Loaded with media="print" and promoted on load, so a slow or unreachable font
# CDN can never block rendering or hold up the scripts beneath it. The system
# serif and sans in the stacks carry the page until the webfonts arrive.
FONTS = (
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
    '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
    '  <link rel="stylesheet" href="%s" media="print" onload="this.media=\'all\'">\n'
    '  <noscript><link rel="stylesheet" href="%s"></noscript>' % (FONT_HREF, FONT_HREF)
)


def head(title, description, path, og_image=None):
    full_title = "%s — %s" % (title, BRAND) if title != "home" else \
        "%s — Catholic Wedding Atelier, Ireland" % BRAND
    og = og_image or ("assets/images/og/%s.jpg" % path.replace(".html", ""))
    og_abs = "%s/%s" % (SITE_URL, og)
    # The home page lives at the bare domain; canonicalising it to
    # /index.html would split it from the URL everyone actually links to.
    canonical = SITE_URL + "/" + ("" if path == "index.html" else path)
    return """<!doctype html>
<html lang="en-IE" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{full_title}</title>
  <meta name="description" content="{description}">
  <link rel="canonical" href="{canonical}">
  <meta name="theme-color" content="#0f0c09">
  <meta name="color-scheme" content="dark">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="{brand}">
  <meta property="og:title" content="{full_title}">
  <meta property="og:description" content="{description}">
  <meta property="og:locale" content="en_IE">
  <meta property="og:url" content="{canonical}">
  <meta property="og:image" content="{og_abs}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="{full_title}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="{og_abs}">
  <script>document.documentElement.className =
    document.documentElement.className.replace('no-js', '').trim() + ' js';</script>
  {fonts}
  <link rel="stylesheet" href="assets/css/style.css">""".format(full_title=full_title, description=description, path=path,
                 brand=BRAND, fonts=FONTS, site=SITE_URL, og_abs=og_abs,
                 canonical=canonical)


# --------------------------------------------------------------------------
# Loader, nav, menu
# --------------------------------------------------------------------------

LOADER = """
  <div class="loader" data-loader>
    <div class="loader__inner">
      <span class="loader__mark">{cross}</span>
      <p class="loader__motto">&ldquo;{motto_la}.&rdquo;<br>{motto_en}.</p>
      <span class="loader__meter"><i></i></span>
      <span class="loader__count">000</span>
    </div>
  </div>""".format(cross=icon("cross"), motto_la=MOTTO_LA, motto_en=MOTTO_EN)


NAV_ITEMS = [
    ("Philosophy", "philosophy.html"),
    ("The Rite", "rite.html"),
    ("The Atelier", "atelier.html"),
    ("Weddings", "weddings.html"),
]

MENU_ITEMS = ([("Home", "index.html")] + NAV_ITEMS +
              [("Budget Guide", "budget.html"), ("Contact", "contact.html")])


def brand_block(sub=True):
    return """<a class="brand" href="index.html" aria-label="{brand} — home">
          <span class="brand__mark">{cross}</span>
          <span>
            <span class="brand__type">{caps}</span>
            {sub}
          </span>
        </a>""".format(
        brand=BRAND, cross=icon("cross"), caps=BRAND_CAPS,
        sub='<span class="brand__sub">Catholic Wedding Atelier</span>' if sub else "")


def nav(current):
    links = "".join(
        '\n            <a class="nav__link" href="%s"%s>%s</a>' % (
            href, ' aria-current="page"' if href == current else "", label)
        for label, href in NAV_ITEMS)
    return """
  <header class="nav" data-nav>
    <div class="nav__inner">
      {brand}
      <nav class="nav__links" aria-label="Primary">{links}
      </nav>
      <div class="nav__actions">
        <a class="btn" href="contact.html" data-magnetic="0.28">Inquire {arrow}</a>
        <button class="menu-toggle" type="button" data-menu-toggle
                aria-expanded="false" aria-controls="site-menu" aria-label="Menu">
          <i></i><i></i>
        </button>
      </div>
    </div>
  </header>

  <div class="menu" id="site-menu" data-menu aria-hidden="true">
    <div></div>
    <nav class="menu__body" aria-label="Full">
      <ul>
        {menu}
      </ul>
    </nav>
    <div class="menu__foot">
      <span>{motto_la}</span>
      <a href="mailto:{email}">{email}</a>
      <a href="tel:{phone_href}">{phone}</a>
    </div>
  </div>""".format(
        brand=brand_block(), links=links, arrow=icon("arrow"),
        menu="\n        ".join(
            '<li class="menu__item"><a class="menu__link" href="%s">'
            '<span class="num">%02d</span>%s</a></li>' % (href, i + 1, label)
            for i, (label, href) in enumerate(MENU_ITEMS)),
        motto_la=MOTTO_LA, email=EMAIL, phone=PHONE, phone_href=PHONE_HREF)


# --------------------------------------------------------------------------
# Footer
# --------------------------------------------------------------------------

FOOTER = """
  <footer class="footer">
    <div class="shell shell--wide">
      <div class="footer__grid">
        <div class="footer__brand">
          {brand}
          <p class="footer__blurb">A Catholic wedding atelier in Ireland. We plan the
            liturgy first and the day around it, so that what a couple remembers is
            the sacrament and not the seating plan.</p>
          <p class="latin">&ldquo;{motto_la}.&rdquo;</p>
        </div>

        <div class="footer__col">
          <h3>Atelier</h3>
          <ul>
            <li><a href="philosophy.html">Philosophy</a></li>
            <li><a href="rite.html">The Rite</a></li>
            <li><a href="atelier.html">Services &amp; Investment</a></li>
            <li><a href="weddings.html">Weddings</a></li>
            <li><a href="budget.html">The Budget Guide</a></li>
          </ul>
        </div>

        <div class="footer__col">
          <h3>Enquiries</h3>
          <ul>
            <li><a href="contact.html">Begin an enquiry</a></li>
            <li><a href="mailto:{email}">{email}</a></li>
            <li><a href="tel:{phone_href}">{phone}</a></li>
            <li><a href="contact.html#faq">Questions</a></li>
          </ul>
        </div>

        <div class="footer__col">
          <h3>Elsewhere</h3>
          <ul>
            <li><a href="https://www.instagram.com/" rel="noopener">Instagram</a></li>
            <li><a href="https://www.pinterest.ie/" rel="noopener">Pinterest</a></li>
            <li><a href="rite.html#music">Sacred music</a></li>
            <li><a href="contact.html">Consultations</a></li>
          </ul>
        </div>
      </div>

      <p class="footer__wordmark" aria-hidden="true">{caps}</p>

      <div class="footer__bar">
        <span>&copy; <span data-year>2026</span> {brand}. Dublin &amp; Galway, Ireland.</span>
        <span><a href="privacy.html">Privacy</a> &middot; {motto_en}.</span>
      </div>
    </div>
  </footer>"""


def footer():
    return FOOTER.format(brand=brand_block(sub=False), motto_la=MOTTO_LA,
                         motto_en=MOTTO_EN, email=EMAIL, phone=PHONE,
                         phone_href=PHONE_HREF, caps=BRAND_CAPS)


TAIL = """
  <script src="assets/js/canvas-art.js"></script>
  <script src="assets/js/site.js"></script>
</body>
</html>
"""


# --------------------------------------------------------------------------
# Structured data
#
# Search engines cannot infer from prose that this is a wedding business in
# Ireland. The FAQ entities are parsed out of the accordions already on the
# page rather than written a second time, so the two cannot drift apart.
# --------------------------------------------------------------------------

import html as _html
import json as _json
import re as _re


def _text(fragment):
    """Flatten an HTML fragment to plain text."""
    t = _re.sub(r"<[^>]+>", " ", fragment)
    t = _html.unescape(t)
    return _re.sub(r"\s+", " ", t).strip()


ACCORDION_RE = _re.compile(
    r'<button class="accordion__trigger".*?>(?P<q>.*?)<span class="accordion__icon"'
    r'.*?<div class="accordion__body">(?P<a>.*?)</div>',
    _re.S)


def faq_entities(body_html):
    """Every accordion on the page, as schema.org Question/Answer pairs."""
    out = []
    for m in ACCORDION_RE.finditer(body_html):
        q, a = _text(m.group("q")), _text(m.group("a"))
        if q and a:
            out.append({
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {"@type": "Answer", "text": a},
            })
    return out


LADDER_RE = _re.compile(
    r'<h3 class="ladder__title">(?P<name>.*?)</h3>\s*'
    r'<p class="ladder__body">(?P<text>.*?)</p>', _re.S)


def howto_steps(body_html, section_id):
    """Steps from one named section only. The budget page has two ladders —
    the twelve levers are options, not steps, and must not be described as a
    procedure."""
    m = _re.search(r'<section[^>]*id="%s".*?</section>' % _re.escape(section_id),
                   body_html, _re.S)
    if not m:
        return []
    return [{"@type": "HowToStep", "position": i + 1,
             "name": _text(s.group("name")), "text": _text(s.group("text"))}
            for i, s in enumerate(LADDER_RE.finditer(m.group(0)))]


ORGANISATION = {
    "@type": "ProfessionalService",
    "@id": SITE_URL + "/#organisation",
    "name": BRAND,
    "alternateName": BRAND_CAPS,
    "description": ("A Catholic wedding atelier in Ireland. We plan the nuptial "
                    "Mass first — in the Order of Celebrating Matrimony or the "
                    "traditional Latin rite — and design the day outward from the altar."),
    "url": SITE_URL + "/",
    "email": EMAIL,
    "telephone": PHONE.replace(" ", ""),
    "areaServed": [
        {"@type": "Country", "name": "Ireland"},
        {"@type": "Country", "name": "United Kingdom"},
        {"@type": "Country", "name": "Italy"},
    ],
    "address": {"@type": "PostalAddress", "addressCountry": "IE",
                "addressRegion": "Leinster", "addressLocality": "Dublin"},
    "priceRange": "€€€",
    "knowsAbout": ["Catholic wedding planning", "Nuptial Mass",
                   "Order of Celebrating Matrimony", "Traditional Latin Mass",
                   "Missa pro Sponso et Sponsa", "Sacred music", "Gregorian chant"],
    "slogan": MOTTO_LA,
}


def structured_data(page, body_html, title, description):
    """One @graph per page: the business, this page, its trail, and whatever
    the page's own markup supports."""
    url = SITE_URL + "/" + ("" if page == "index.html" else page)
    graph = [ORGANISATION, {
        "@type": "WebPage",
        "@id": url + "#page",
        "url": url,
        "name": title,
        "description": description,
        "isPartOf": {"@type": "WebSite", "@id": SITE_URL + "/#website",
                     "name": BRAND, "url": SITE_URL + "/",
                     "inLanguage": "en-IE"},
        "about": {"@id": SITE_URL + "/#organisation"},
    }]

    if page != "index.html":
        graph.append({
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL + "/"},
                {"@type": "ListItem", "position": 2, "name": title, "item": url},
            ],
        })

    faqs = faq_entities(body_html)
    if faqs:
        graph.append({"@type": "FAQPage", "@id": url + "#faq", "mainEntity": faqs})

    if page == "budget.html":
        steps = howto_steps(body_html, "countdown")
        if steps:
            graph.append({
                "@type": "HowTo",
                "@id": url + "#howto",
                "name": "How to plan a Catholic wedding in Ireland, month by month",
                "description": ("A countdown from twelve months out to the wedding "
                                "week, covering the church, the paperwork, the "
                                "suppliers and the preparation."),
                "step": steps,
            })

    payload = {"@context": "https://schema.org", "@graph": graph}
    return ('  <script type="application/ld+json">\n  '
            + _json.dumps(payload, ensure_ascii=False, indent=2).replace("\n", "\n  ")
            + "\n  </script>")
