# -*- coding: utf-8 -*-
import os
HERE = os.path.dirname(os.path.abspath(__file__))

W = [
 ("01","&Aacute;ine &amp; Cathal","Newman University Church","Dublin","Advent","parish","chiaroscuro",88,"tall",
  "Candlelight, a schola of eight, and the Kyrie of the Missa Papae Marcelli sung from the gallery."),
 ("02","Sorcha &amp; Peadar","Ballintubber Abbey","Co. Mayo","Midsummer","abbey","verdigris",213,"wide",
  "Mass without a break since 1216. A midsummer rite under the roofless transept."),
 ("03","R&oacute;is&iacute;n &amp; Dara","Pontifical Irish College","Rome","Pentecost","abroad tlm","cinabrese",940,"wide",
  "Twenty-two guests on the Coelian Hill, and the whole Mass in Latin. Nothing surplus."),
 ("04","Cl&iacute;odhna &amp; Ruair&iacute;","Kylemore Abbey","Connemara","Michaelmas","abbey","verdigris",1502,"tall",
  "A Benedictine church the size of a chapel, under the Twelve Bens. Forty people and a harp."),
 ("05","Nuala &amp; S&eacute;amus","St Colman&rsquo;s Cathedral","Cobh, Co. Cork","Eastertide","cathedral","lapis",677,"tall",
  "Forty-nine bells and a west front over the harbour. The Widor toccata earned its keep."),
 ("06","Eibhl&iacute;n &amp; Tom&aacute;s","Glenstal Abbey","Co. Limerick","Candlemas","abbey tlm","chiaroscuro",2044,"tall",
  "A traditional Latin nuptial Mass, sung throughout to chant by the monastic community."),
 ("07","Aoife &amp; Conor","St Mel&rsquo;s Cathedral","Longford","Epiphany","cathedral","gesso",311,"tall",
  "A cathedral rebuilt from ash after the fire of 2009. White and gold, and very loud."),
 ("08","Deirdre &amp; Ois&iacute;n","Church of the Most Holy Trinity","Adare, Co. Limerick","Harvest","parish","cinabrese",1899,"tall",
  "A thirteenth-century Trinitarian foundation on the village street. Ninety guests, walked to dinner."),
 ("09","Sin&eacute;ad &amp; Fiachra","Holy Cross Abbey","Thurles, Co. Tipperary","Holy Cross","abbey tlm","lapis",1266,"wide",
  "Missa pro Sponso et Sponsa beneath a relic of the True Cross, and the arrhae given as the old book has it."),
]

CARD = '''        <article class="gallery__item gallery__item--%(shape)s%(offset)s" data-tags="%(tags)s" data-reveal="up">
          <div class="plate %(frame)s" data-cursor="View">
            <canvas class="fresco" data-fresco='{"preset":"plate","palette":"%(pal)s","seed":%(seed)d}' aria-hidden="true"></canvas>
            <img class="plate__img" src="assets/images/wedding-%(n)s.jpg"
                 alt="%(couple)s at %(church)s, %(place)s" loading="lazy" onerror="this.remove()">
            <div class="plate__glaze plate__glaze--scrim" aria-hidden="true"></div>
            <div class="plate__caption">
              <div>
                <p class="gallery__meta">%(church)s &middot; %(place)s</p>
                <h3 class="gallery__title">%(couple)s</h3>
              </div>
              <p class="index-num">%(n)s</p>
            </div>
          </div>
          <p class="micro" style="color:var(--fg-faint);margin-top:.9rem">%(season)s</p>
          <p class="prose" style="font-size:.9rem;margin-top:.5rem">%(note)s</p>
        </article>'''

cards = []
for i, (n, couple, church, place, season, tags, pal, seed, shape, note) in enumerate(W):
    cards.append(CARD % dict(
        n=n, couple=couple, church=church, place=place, season=season, tags=tags,
        pal=pal, seed=seed, shape=shape, note=note,
        offset="",
        frame="frame frame--arch" if shape == "tall" else "frame"))

HEAD = '''  <!-- ================================================ PAGE HERO ===== -->
  <section class="page-hero">
    <div class="page-hero__canvas" aria-hidden="true">
      <canvas data-fresco='{"preset":"ground","palette":"verdigris","seed":4400,"lightX":0.58}'></canvas>
    </div>
    <div class="vignette" aria-hidden="true"></div>

    <div class="shell shell--wide page-hero__inner">
      <p class="eyebrow" data-reveal="up">Weddings</p>
      <h1 class="page-hero__title display" data-reveal="split">
        <span data-split="mask">Nine hundred years</span>
        <span data-split="mask" data-split-delay="140">of <em class="serif-italic gilded">church-building.</em></span>
      </h1>
      <p class="lead measure-wide" data-reveal="up" data-reveal-delay="360">
        Cathedrals, abbeys, parish churches and one hill in Rome. A selection
        from the last few years.
      </p>

      <div class="page-hero__meta">
        <div class="filters" data-filters=".gallery" role="group" aria-label="Filter weddings">
          <button class="filter is-active" type="button" data-filter="all" aria-pressed="true">All</button>
          <button class="filter" type="button" data-filter="cathedral" aria-pressed="false">Cathedrals</button>
          <button class="filter" type="button" data-filter="abbey" aria-pressed="false">Abbeys</button>
          <button class="filter" type="button" data-filter="parish" aria-pressed="false">Parish churches</button>
          <button class="filter" type="button" data-filter="tlm" aria-pressed="false">Latin Mass</button>
          <button class="filter" type="button" data-filter="abroad" aria-pressed="false">Abroad</button>
        </div>
      </div>
    </div>
  </section>

  <!-- ================================================= GALLERY ====== -->
  <section class="section" aria-label="Wedding gallery">
    <div class="shell shell--wide">
      <div class="gallery" data-reveal-group="80">
'''

TAIL = '''
      </div>
    </div>
  </section>

  <div class="ornament-divider" aria-hidden="true">{{icon:diamond}}</div>

  <section class="section section--tight">
    <div class="shell shell--wide">
      <div class="grid grid--4" data-reveal-group="120">
        <div class="tally" data-reveal="up">
          <p class="tally__value"><span data-count="184">0</span></p>
          <p class="tally__label">Weddings accompanied</p>
        </div>
        <div class="tally" data-reveal="up">
          <p class="tally__value"><span data-count="21">0</span></p>
          <p class="tally__label">Dioceses worked in</p>
        </div>
        <div class="tally" data-reveal="up">
          <p class="tally__value"><span data-count="63">0</span></p>
          <p class="tally__label">Churches</p>
        </div>
        <div class="tally" data-reveal="up">
          <p class="tally__value"><span data-count="6">0</span></p>
          <p class="tally__label">Countries</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section on-parchment">
    <div class="shell shell--narrow">
      <p class="eyebrow" data-reveal="up">In their words</p>
      <div class="testimony" data-testimony data-reveal="fade">
        <blockquote class="testimony__slide is-active">
          <p class="testimony__quote">Our church had a two-page music policy nobody had
            ever shown us. They had read it before the first meeting.</p>
          <cite class="testimony__cite"><b>Cl&iacute;odhna &amp; Ruair&iacute;</b> &middot; Kylemore Abbey, Connemara</cite>
        </blockquote>
        <blockquote class="testimony__slide">
          <p class="testimony__quote">Half our guests were not Catholic. Every one of them
            told us afterwards that they had understood what was happening. That
            was the booklet.</p>
          <cite class="testimony__cite"><b>Aoife &amp; Conor</b> &middot; St Mel&rsquo;s Cathedral, Longford</cite>
        </blockquote>
        <blockquote class="testimony__slide">
          <p class="testimony__quote">I was handed a schedule on the Tuesday and asked
            precisely nothing on the Saturday. In thirty years of sacristy work
            that has happened twice.</p>
          <cite class="testimony__cite"><b>A parish sacristan</b> &middot; Co. Tipperary</cite>
        </blockquote>
        <div class="testimony__nav">
          <button class="testimony__dot is-active" type="button" aria-label="Testimonial 1"><i></i></button>
          <button class="testimony__dot" type="button" aria-label="Testimonial 2"><i></i></button>
          <button class="testimony__dot" type="button" aria-label="Testimonial 3"><i></i></button>
        </div>
      </div>
    </div>
  </section>

  <section class="cta">
    <div class="cta__canvas" aria-hidden="true">
      <canvas data-fresco='{"preset":"veil","palette":"cinabrese","seed":2900}'></canvas>
    </div>
    <div class="vignette" aria-hidden="true"></div>
    <div class="shell shell--narrow">
      <h2 class="cta__title display" data-reveal="split">
        <span data-split="mask">Yours could be</span>
        <span data-split="mask" data-split-delay="150"><em class="serif-italic gilded">the next one.</em></span>
      </h2>
      <p class="cta__actions">
        <a class="btn btn--solid btn--lg" href="contact.html" data-magnetic="0.3">Begin an enquiry {{icon:arrow}}</a>
        <a class="btn btn--ghost btn--lg" href="atelier.html" data-magnetic="0.2">Services &amp; investment</a>
      </p>
    </div>
  </section>
'''

out = HEAD + "\n\n".join(cards) + TAIL
with open(os.path.join(HERE, "bodies/weddings.html"), "w", encoding="utf-8") as fh:
    fh.write(out)
print("weddings body: %d lines, %d cards" % (out.count("\n"), len(cards)))
