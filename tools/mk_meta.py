# -*- coding: utf-8 -*-
"""Generate sitemap.xml and robots.txt from the page list in build.py."""
import os
import sys
import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import chrome  # noqa: E402
import build   # noqa: E402

OUT = os.environ.get("SITE_OUT", os.getcwd())
TODAY = datetime.date.today().isoformat()

# Priority reflects what we actually want ranked, not a uniform 0.5.
PRIORITY = {
    "index.html": ("1.0", "monthly"),
    "budget.html": ("0.9", "monthly"),
    "rite.html": ("0.9", "monthly"),
    "atelier.html": ("0.8", "monthly"),
    "weddings.html": ("0.7", "monthly"),
    "contact.html": ("0.7", "yearly"),
    "philosophy.html": ("0.6", "yearly"),
}

rows = []
for page in build.PAGES:
    f = page["file"]
    prio, freq = PRIORITY.get(f, ("0.5", "yearly"))
    loc = chrome.SITE_URL + "/" + ("" if f == "index.html" else f)
    rows.append(
        "  <url>\n"
        "    <loc>%s</loc>\n"
        "    <lastmod>%s</lastmod>\n"
        "    <changefreq>%s</changefreq>\n"
        "    <priority>%s</priority>\n"
        "  </url>" % (loc, TODAY, freq, prio))

sitemap = ('<?xml version="1.0" encoding="UTF-8"?>\n'
           '<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">\n'
           .replace("www.sitemap.org", "www.sitemaps.org")
           + "\n".join(rows) + "\n</urlset>\n")

robots = """# %s — Catholic Wedding Atelier
User-agent: *
Allow: /

Sitemap: %s/sitemap.xml
""" % (chrome.BRAND, chrome.SITE_URL)

with open(os.path.join(OUT, "sitemap.xml"), "w", encoding="utf-8") as fh:
    fh.write(sitemap)
with open(os.path.join(OUT, "robots.txt"), "w", encoding="utf-8") as fh:
    fh.write(robots)
print("wrote sitemap.xml (%d urls) and robots.txt" % len(rows))
