# -*- coding: utf-8 -*-
"""Bundle the six pages into one self-contained HTML file.

Used to publish a clickable preview. CSS and JS are inlined, every page's
<main> travels with the file, and a small router swaps them on nav clicks —
calling Altare.refresh() so splits, entrances, pins and artwork re-bind.
"""
import os
import re

ROOT = os.environ.get("SITE_ROOT", "/home/user/cwp")
OUT = os.environ.get("BUNDLE_OUT", "/tmp/preview.html")

# Follow the real page list rather than a second copy of it.
import os as _os
import sys as _sys
_sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
import build as _build  # noqa: E402
PAGES = [p["file"].replace(".html", "") for p in _build.PAGES]


def read(*parts):
    with open(os.path.join(ROOT, *parts), encoding="utf-8") as fh:
        return fh.read()


def block(html, tag, attrs=""):
    m = re.search(r"<%s%s[^>]*>(.*?)</%s>" % (tag, attrs, tag), html, re.S)
    return m.group(1) if m else ""


src = {name: read(name + ".html") for name in PAGES}
css = read("assets", "css", "style.css")
art = read("assets", "js", "canvas-art.js")
site = read("assets", "js", "site.js")

# sprite, nav and footer are identical across the six files — take them once
home = src["index"]
sprite = re.search(r'<svg aria-hidden="true" focusable="false".*?</svg>', home, re.S).group(0)
loader = re.search(r'<div class="loader" data-loader>.*?</div>\s*</div>', home, re.S).group(0)
nav = re.search(r'<header class="nav".*?</div>\s*</div>\s*</div>', home, re.S).group(0)
menu = re.search(r'<div class="menu" id="site-menu".*?</div>\s*</div>(?=\s*<main)', home, re.S).group(0)
footer = re.search(r'<footer class="footer">.*?</footer>', home, re.S).group(0)

mains = []
for name in PAGES:
    inner = re.search(r'<main id="main">(.*?)</main>', src[name], re.S).group(1)
    mains.append(
        '<div class="route" data-route="%s"%s>%s</div>'
        % (name, "" if name == "index" else " hidden", inner))

ROUTER = r"""
/* ------------------------------------------------------------------ *
 * Preview router. The published build is six separate HTML files; this
 * bundle keeps all six <main>s in one document and swaps between them so
 * the whole site can be clicked through from a single file.
 * ------------------------------------------------------------------ */
(function () {
  var routes = [].slice.call(document.querySelectorAll('[data-route]'));
  var curtain;

  function nameFor(href) {
    var m = /([a-z0-9-]+)\.html$/.exec(href || '');
    return m ? m[1] : null;
  }

  function show(name, push) {
    var target = routes.filter(function (r) { return r.dataset.route === name; })[0];
    if (!target) return false;

    routes.forEach(function (r) { r.hidden = r !== target; });

    document.querySelectorAll('.nav__link').forEach(function (a) {
      if (nameFor(a.getAttribute('href')) === name) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    window.scrollTo(0, 0);
    if (window.Altare && window.Altare.Scroller) window.Altare.Scroller.to(0, true);
    if (window.Altare) window.Altare.refresh(target);   /* scope to this route */

    /* Sandboxed hosts can refuse history writes; the route swap must not
       depend on the URL updating. */
    if (push) { try { history.replaceState(null, '', '#' + name); } catch (e) {} }
    document.title = name === 'index'
      ? 'Ad Altare — Catholic Wedding Atelier, Ireland'
      : name.charAt(0).toUpperCase() + name.slice(1) + ' — Ad Altare';
    return true;
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    var href = a.getAttribute('href') || '';

    /* in-page anchors and external links behave normally */
    if (href.charAt(0) === '#' || /^(mailto:|tel:|https?:)/i.test(href)) return;

    var name = nameFor(href);
    if (!name) return;
    e.preventDefault();
    e.stopPropagation();

    var hash = href.indexOf('#') > -1 ? href.slice(href.indexOf('#')) : '';
    curtain = curtain || document.querySelector('[data-curtain]');

    if (!curtain || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      show(name, true);
      if (hash) jump(hash);
      return;
    }

    curtain.classList.remove('is-out');
    curtain.classList.add('is-in');
    setTimeout(function () {
      show(name, true);
      if (hash) jump(hash);
      curtain.classList.remove('is-in');
      curtain.classList.add('is-out');
    }, 620);
  }, true);

  function jump(hash) {
    setTimeout(function () {
      var t = document.querySelector(hash);
      if (!t) return;
      var bar = document.querySelector('[data-nav]');
      var y = t.getBoundingClientRect().top + window.scrollY - (bar ? bar.offsetHeight : 84) + 1;
      if (window.Altare) window.Altare.Scroller.to(y);
    }, 120);
  }

  /* Back/forward and hash-only navigation. */
  window.addEventListener('hashchange', function () {
    var name = (location.hash || '').replace('#', '');
    if (name) show(name, false);
  });

  var initial = (location.hash || '').replace('#', '');
  if (initial) show(initial, false);
})();
"""

NOTE = """
  <a class="preview-note" href="#" onclick="this.remove();return false"
     title="Dismiss">
    <b>Preview build</b>
    <span>Every name, price, testimonial and wedding shown is placeholder
    content, not a real client or record.</span>
  </a>
"""

NOTE_CSS = """
/* Preview-only: marks this bundle as a draft carrying placeholder content. */
.preview-note {
  position: fixed; left: 1rem; bottom: 1rem; z-index: 95;
  max-width: 21rem;
  display: block;
  padding: 0.75rem 1rem;
  background: color-mix(in srgb, #17120d 92%, transparent);
  backdrop-filter: blur(10px);
  border: 1px solid color-mix(in srgb, #b9913f 45%, transparent);
  border-radius: 4px;
  font-family: var(--font-ui);
  font-size: 0.68rem; line-height: 1.5;
  color: color-mix(in srgb, #f2ebdd 74%, transparent);
}
.preview-note b {
  display: block; color: #e6c983; font-weight: 600;
  letter-spacing: 0.18em; text-transform: uppercase; font-size: 0.6rem;
  margin-bottom: 0.3rem;
}
.preview-note:hover { border-color: #b9913f; }
@media (max-width: 860px) { .preview-note { display: none; } }
"""

out = """<title>Ad Altare</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap">
<script>document.documentElement.className =
  document.documentElement.className.replace('no-js','').trim() + ' js';</script>
<style>
%(css)s
%(note_css)s
</style>

<a class="skip-link" href="#main">Skip to content</a>
<div class="grain" aria-hidden="true"></div>
<div class="progress" data-progress aria-hidden="true"></div>

%(sprite)s
%(loader)s
%(nav)s
%(menu)s

<main id="main">
%(mains)s
</main>

%(footer)s
%(note)s

<script>
%(art)s
</script>
<script>
%(site)s
</script>
<script>
%(router)s
</script>
""" % dict(css=css, note_css=NOTE_CSS, sprite=sprite, loader=loader, nav=nav,
           menu=menu, mains="\n".join(mains), footer=footer, note=NOTE,
           art=art, site=site, router=ROUTER)

with open(OUT, "w", encoding="utf-8") as fh:
    fh.write(out)
print("bundle: %s  (%.0f KB, %d routes)" % (OUT, len(out) / 1024, len(mains)))
