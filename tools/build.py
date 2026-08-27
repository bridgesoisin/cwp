# -*- coding: utf-8 -*-
"""Assemble the six static pages from shared chrome + per-page bodies.

The repository ships the generated HTML; this script exists so the nav, menu
and footer only have to be written once. Nothing at runtime depends on it.
"""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import chrome  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
BODIES = os.path.join(HERE, "bodies")
OUT = os.environ.get("SITE_OUT", os.getcwd())

PAGES = [
    dict(file="index.html", nav="index.html", title="home",
         desc="Ad Altare is a Catholic wedding atelier in Ireland. We plan the "
              "nuptial Mass first — readings, sacred music, the nuptial "
              "blessing — and design the whole day outward from the altar."),
    dict(file="philosophy.html", nav="philosophy.html", title="Philosophy",
         desc="Why we plan the liturgy before the flowers: reverence, beauty, "
              "hospitality and fidelity, and the people behind Ad Altare."),
    dict(file="rite.html", nav="rite.html", title="The Rite",
         desc="Both Catholic wedding rites step by step — the Order of "
              "Celebrating Matrimony and the Traditional Latin nuptial Mass "
              "(Missa pro Sponso et Sponsa) — with readings, sacred music, and "
              "the preparation required to marry in Ireland."),
    dict(file="atelier.html", nav="atelier.html", title="The Atelier",
         desc="Three collections of Catholic wedding planning, from liturgy-only "
              "to full atelier, with investment from €2,400 and our process "
              "set out in full."),
    dict(file="weddings.html", nav="weddings.html", title="Weddings",
         desc="Catholic weddings we have accompanied — cathedrals, abbeys and "
              "parish churches across Ireland, and further afield in Rome."),
    dict(file="budget.html", nav="budget.html", title="The Budget Guide",
         desc="What a Catholic wedding actually costs in Ireland, where the "
              "money goes, twelve ways to spend less, the five things not to "
              "economise on, and a month-by-month countdown."),
    dict(file="contact.html", nav="contact.html", title="Contact",
         desc="Begin an enquiry with Ad Altare. Tell us your date, your church "
              "and your guest count, and we will write back within two working days."),
    dict(file="journal.html", nav="journal.html", title="The Journal",
         desc="Practical writing on planning a Catholic wedding in Ireland — "
              "what it costs, how to arrange a Traditional Latin nuptial Mass, "
              "and the paperwork in the order you actually need it."),
    dict(file="journal-latin-mass.html", nav="journal.html",
         title="Arranging a Traditional Latin nuptial Mass in Ireland",
         desc="Start with the celebrant, not the church. What permission is "
              "required since Traditionis custodes, what differs on the day, "
              "and how to keep your guests with you throughout."),
    dict(file="journal-paperwork.html", nav="journal.html",
         title="The paperwork, in the order you actually need it",
         desc="The church file and the State file, what each wants, and the "
              "order to do it in — including the three-month notice that is "
              "the only hard legal deadline."),
    dict(file="privacy.html", nav="privacy.html", title="Privacy",
         desc="What Ad Altare does with the details you send through the "
              "enquiry form: why we hold them, for how long, who else sees "
              "them, and how to have them deleted."),
]

TOKENS = {
    "{{email}}": chrome.EMAIL,
    "{{phone}}": chrome.PHONE,
    "{{phone_href}}": chrome.PHONE_HREF,
    "{{brand}}": chrome.BRAND,
    "{{brand_caps}}": chrome.BRAND_CAPS,
    "{{motto_la}}": chrome.MOTTO_LA,
    "{{motto_en}}": chrome.MOTTO_EN,
}

ICON_RE = re.compile(r"\{\{icon:([a-z-]+)(?:\|([a-zA-Z0-9_\- ]+))?\}\}")


def expand(html):
    for token, value in TOKENS.items():
        html = html.replace(token, value)
    return ICON_RE.sub(lambda m: chrome.icon(m.group(1), m.group(2) or ""), html)


def build():
    for page in PAGES:
        path = os.path.join(BODIES, page["file"])
        if not os.path.exists(path):
            print("  skip %s (no body yet)" % page["file"])
            continue
        with open(path, encoding="utf-8") as fh:
            body = fh.read()

        html = "".join([
            chrome.head(page["title"], page["desc"], page["file"]),
            "\n",
            chrome.structured_data(page["file"], body, page["title"], page["desc"]),
            "\n</head>\n<body>",
            '\n  <a class="skip-link" href="#main">Skip to content</a>\n',
            '  <div class="grain" aria-hidden="true"></div>\n',
            '  <div class="progress" data-progress aria-hidden="true"></div>\n\n  ',
            chrome.SPRITE.replace("\n", "\n  "),
            "\n",
            chrome.LOADER,
            "\n",
            chrome.nav(page["nav"]),
            '\n\n  <main id="main">\n',
            expand(body),
            "\n  </main>\n",
            chrome.footer(),
            chrome.TAIL,
        ])

        out = os.path.join(OUT, page["file"])
        with open(out, "w", encoding="utf-8") as fh:
            fh.write(html)
        print("  wrote %-18s %6d bytes" % (page["file"], len(html)))


if __name__ == "__main__":
    print("Building Ad Altare into %s" % OUT)
    build()
