/* ==========================================================================
   AD ALTARE — site.js
   --------------------------------------------------------------------------
   The motion system. Every module is optional, degrades to a plain
   document, and switches itself off under prefers-reduced-motion.

     Scroller      inertial (lerped) page scrolling over native scroll
     ScrollFX      one rAF pass: progress, nav, parallax, pins, illumination
     Split         word-mask reveals that survive inline markup and resize
     Reveal        IntersectionObserver entrances with group stagger
     Cursor        blend-mode cursor with magnetic targets and labels
     Marquee       velocity-reactive infinite tickers
     Chrome        preloader, page-transition curtain, menu, nav
     UI            counters, accordions, testimony, filters, form
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var body = doc.body;

  var mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = mqReduced.matches;
  var coarse = window.matchMedia('(pointer: coarse)').matches;
  var isMobile = window.matchMedia('(max-width: 860px)').matches;

  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var qsa = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel));
  };

  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, wait);
    };
  }

  /* ====================================================================== *
   * Scroller — inertial scrolling that still drives the real scrollTop,
   * so position:sticky, anchors, and assistive tech keep working.
   * ====================================================================== */

  var Scroller = (function () {
    var target = 0, current = 0, running = false, raf = 0;
    var lastSet = -1, enabled = false;
    var velocity = 0;

    function maxY() {
      return Math.max(0, root.scrollHeight - window.innerHeight);
    }

    function start() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    }

    function tick() {
      var prev = current;
      current = lerp(current, target, 0.115);
      velocity = current - prev;

      if (Math.abs(target - current) < 0.35) {
        current = target;
        running = false;
      } else {
        raf = requestAnimationFrame(tick);
      }

      lastSet = current;
      window.scrollTo(0, current);
    }

    function onWheel(e) {
      if (!enabled || e.ctrlKey || e.metaKey) return;
      if (body.classList.contains('is-locked')) return;
      if (e.target && e.target.closest && e.target.closest('[data-native-scroll]')) return;

      var d = e.deltaY;
      if (e.deltaMode === 1) d *= 18;
      else if (e.deltaMode === 2) d *= window.innerHeight;

      e.preventDefault();
      target = clamp(target + d, 0, maxY());
      start();
    }

    function sync() {
      /* Something other than us moved the page (keyboard, scrollbar,
         find-in-page, focus). Adopt its position. */
      if (Math.abs(window.scrollY - lastSet) > 2) {
        target = current = window.scrollY;
        running = false;
        cancelAnimationFrame(raf);
      }
    }

    function to(y, instant) {
      y = clamp(y, 0, maxY());
      if (!enabled || instant || reduced) {
        window.scrollTo(0, y);
        target = current = lastSet = y;
        return;
      }
      target = y;
      start();
    }

    function init() {
      enabled = !reduced && !coarse;
      target = current = lastSet = window.scrollY;
      if (enabled) {
        window.addEventListener('wheel', onWheel, { passive: false });
      }
      window.addEventListener('scroll', sync, { passive: true });
      window.addEventListener('resize', function () {
        target = clamp(target, 0, maxY());
      }, { passive: true });
    }

    return {
      init: init,
      to: to,
      get velocity() { return velocity; },
      get y() { return window.scrollY; }
    };
  })();

  /* ====================================================================== *
   * ScrollFX — a single rAF pass over everything scroll-driven.
   * ====================================================================== */

  var ScrollFX = (function () {
    var parallax = [], pins = [], illuminates = [], marquees = [], reveals = [];
    var revealsArmed = false;
    var progressEl, nav;
    var vh = 0, lastY = 0, navLastY = 0, raf = 0;

    function measure() {
      vh = window.innerHeight;

      parallax.forEach(function (p) {
        var r = p.el.getBoundingClientRect();
        p.top = r.top + window.scrollY;
        p.h = r.height;
      });

      pins.forEach(function (p) {
        if (isMobile) {
          p.section.style.height = '';
          p.track.style.transform = '';
          p.distance = 0;
          return;
        }
        var trackW = p.track.scrollWidth;
        var gutter = parseFloat(getComputedStyle(p.track).paddingLeft) || 0;
        p.distance = Math.max(0, trackW - window.innerWidth + gutter);
        p.section.style.height = (p.distance + vh) + 'px';
        p.top = p.section.getBoundingClientRect().top + window.scrollY;
      });

      illuminates.forEach(function (it) {
        var r = it.el.getBoundingClientRect();
        it.top = r.top + window.scrollY;
        it.h = r.height;
      });

      reveals.forEach(function (rv) {
        var r = rv.el.getBoundingClientRect();
        rv.top = r.top + window.scrollY;
      });

      marquees.forEach(function (m) { m.measure(); });
    }

    function frame() {
      raf = requestAnimationFrame(frame);
      var y = window.scrollY;
      var max = Math.max(1, root.scrollHeight - vh);

      if (progressEl) {
        progressEl.style.transform = 'scaleX(' + (y / max).toFixed(4) + ')';
      }

      /* Nav: solidify past the fold, retract when travelling down. */
      if (nav) {
        nav.classList.toggle('is-stuck', y > 40);
        var goingDown = y > navLastY;
        var hide = goingDown && y > vh * 0.9 && !body.classList.contains('menu-open');
        nav.classList.toggle('is-hidden', hide);
        navLastY = y;
      }

      var i;

      for (i = 0; i < parallax.length; i++) {
        var p = parallax[i];
        if (p.top + p.h < y - vh || p.top > y + vh * 2) continue;
        var centre = p.top + p.h / 2 - (y + vh / 2);
        var shift = centre * p.speed * -1;
        p.el.style.transform =
          'translate3d(0,' + shift.toFixed(2) + 'px,0)' + (p.scale ? ' scale(' + p.scale + ')' : '');
      }

      for (i = 0; i < pins.length; i++) {
        var pin = pins[i];
        if (!pin.distance) continue;
        var prog = clamp((y - pin.top) / pin.distance, 0, 1);
        pin.track.style.transform = 'translate3d(' + (-prog * pin.distance).toFixed(2) + 'px,0,0)';
        if (pin.counter) {
          var idx = Math.min(pin.cards.length, Math.floor(prog * pin.cards.length) + 1);
          if (idx !== pin.lastIdx) {
            pin.counter.textContent = String(idx).padStart(2, '0');
            pin.lastIdx = idx;
          }
        }
      }

      for (i = 0; i < illuminates.length; i++) {
        var it = illuminates[i];
        var startY = it.top - vh * 0.82;
        var endY = it.top + it.h - vh * 0.42;
        var t = clamp((y - startY) / Math.max(1, endY - startY), 0, 1);
        var lit = Math.round(t * it.words.length);
        if (lit !== it.lit) {
          for (var w = 0; w < it.words.length; w++) {
            it.words[w].classList.toggle('is-lit', w < lit);
          }
          it.lit = lit;
        }
      }

      /* Entrances are driven from here rather than from an
         IntersectionObserver: a target whose initial state is
         `clip-path: inset(100%)` has an empty intersection rectangle, so an
         observer would never once report it as visible. Layout geometry is
         already cached for the parallax pass, so this costs nothing. */
      if (revealsArmed) {
        for (i = reveals.length - 1; i >= 0; i--) {
          if (reveals[i].top < y + vh * 0.9) {
            reveals[i].el.classList.add('is-in');
            reveals.splice(i, 1);
          }
        }
      }

      var vel = Scroller.velocity || (y - lastY);
      for (i = 0; i < marquees.length; i++) marquees[i].step(vel);
      lastY = y;
    }

    function register() {
      progressEl = doc.querySelector('[data-progress]');
      nav = doc.querySelector('[data-nav]');

      parallax = qsa('[data-parallax]').map(function (el) {
        return {
          el: el,
          speed: parseFloat(el.dataset.parallax) || 0.12,
          scale: el.dataset.parallaxScale || '',
          top: 0, h: 0
        };
      });

      pins = qsa('[data-pin]').map(function (section) {
        var track = section.querySelector('[data-pin-track]');
        return {
          section: section,
          track: track,
          cards: track ? qsa(':scope > *', track) : [],
          counter: section.querySelector('[data-pin-counter]'),
          lastIdx: -1,
          top: 0, distance: 0
        };
      }).filter(function (p) { return p.track; });

      illuminates = qsa('[data-illuminate]').map(function (el) {
        return { el: el, words: qsa('.split-word', el), lit: -1, top: 0, h: 0 };
      });

      reveals = qsa('[data-reveal]:not(.is-in)').map(function (el) {
        return { el: el, top: 0 };
      });
    }

    function addMarquee(m) { marquees.push(m); }

    function init() {
      register();
      measure();
      frame();
      window.addEventListener('resize', debounce(function () {
        isMobile = window.matchMedia('(max-width: 860px)').matches;
        measure();
      }, 200), { passive: true });
      window.addEventListener('load', measure);
      if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(measure);
    }

    return {
      init: init,
      measure: measure,
      addMarquee: addMarquee,
      armReveals: function () { revealsArmed = true; },
      refresh: function () { register(); measure(); }
    };
  })();

  /* ====================================================================== *
   * Split — wraps every word in its own mask. Survives <em>, <br>, links.
   * ====================================================================== */

  var Split = (function () {
    var originals = new WeakMap();
    var items = [];

    function wrapWords(node, out) {
      var kids = Array.prototype.slice.call(node.childNodes);
      kids.forEach(function (child) {
        if (child.nodeType === 3) {
          var parts = child.textContent.split(/(\s+)/);
          if (!parts.length) return;
          var frag = doc.createDocumentFragment();
          parts.forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(doc.createTextNode(' '));
              return;
            }
            var span = doc.createElement('span');
            span.className = 'split-word';
            span.textContent = part;
            frag.appendChild(span);
            out.push(span);
          });
          child.parentNode.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          if (child.tagName === 'BR') { out.push(child); return; }
          wrapWords(child, out);
        }
      });
    }

    function build(el) {
      if (!originals.has(el)) originals.set(el, el.innerHTML);
      else el.innerHTML = originals.get(el);

      var mode = el.dataset.split || 'mask';
      var words = [];
      wrapWords(el, words);
      words = words.filter(function (n) { return n.nodeType === 1 && n.tagName !== 'BR'; });

      if (mode === 'mask') {
        el.classList.add('is-masked');
        words.forEach(function (w) {
          var inner = doc.createElement('i');
          inner.textContent = w.textContent;
          w.textContent = '';
          w.appendChild(inner);
        });
        stagger(el, words);
      }
      return words;
    }

    /* Words on the same visual line lift together — the read of a line
       mask, without the fragility of rebuilding the DOM into lines. */
    function stagger(el, words) {
      var lineStep = parseFloat(el.dataset.splitLineStep || '95');
      var wordStep = parseFloat(el.dataset.splitWordStep || '16');
      var base = parseFloat(el.dataset.splitDelay || '0');
      var lineIndex = -1, lastTop = null, inLine = 0;

      words.forEach(function (w) {
        var top = Math.round(w.offsetTop);
        if (lastTop === null || Math.abs(top - lastTop) > 3) {
          lineIndex++; inLine = 0; lastTop = top;
        }
        w.style.setProperty('--sw-delay', (base + lineIndex * lineStep + inLine * wordStep) + 'ms');
        inLine++;
      });
    }

    function init() {
      items = qsa('[data-split]');
      items.forEach(build);

      var relayout = debounce(function () {
        items.forEach(function (el) {
          if (el.dataset.split !== 'mask') return;
          stagger(el, qsa('.split-word', el));
        });
      }, 220);

      window.addEventListener('resize', relayout, { passive: true });
      if (doc.fonts && doc.fonts.ready) {
        doc.fonts.ready.then(function () {
          items.forEach(function (el) {
            if (el.dataset.split !== 'mask') return;
            stagger(el, qsa('.split-word', el));
          });
        });
      }
    }

    return { init: init };
  })();

  /* ====================================================================== *
   * Reveal
   * ====================================================================== */

  var Reveal = (function () {
    function init() {
      /* Group stagger: children inherit an incremental delay. */
      qsa('[data-reveal-group]').forEach(function (group) {
        var step = parseFloat(group.dataset.revealGroup) || 90;
        qsa('[data-reveal]', group).forEach(function (child, i) {
          if (child.dataset.revealDelay) return;
          child.style.setProperty('--rv-delay', (i * step) + 'ms');
        });
      });

      qsa('[data-reveal-delay]').forEach(function (el) {
        el.style.setProperty('--rv-delay', el.dataset.revealDelay + 'ms');
      });

      if (reduced) {
        qsa('[data-reveal]').forEach(function (el) { el.classList.add('is-in'); });
        return;
      }

      /* ScrollFX owns the actual triggering — see its frame(). */
      ScrollFX.refresh();
      ScrollFX.armReveals();
    }

    return { init: init };
  })();

  /* ====================================================================== *
   * Cursor
   * ====================================================================== */

  var Cursor = (function () {
    var el, ring, label, x = 0, y = 0, rx = 0, ry = 0, raf = 0;

    function loop() {
      raf = requestAnimationFrame(loop);
      rx = lerp(rx, x, 0.19);
      ry = lerp(ry, y, 0.19);
      el.style.transform = 'translate3d(' + rx.toFixed(2) + 'px,' + ry.toFixed(2) + 'px,0)';
    }

    function init() {
      if (reduced || coarse) return;

      el = doc.createElement('div');
      el.className = 'cursor';
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML =
        '<div class="cursor__ring"><span class="cursor__label"></span></div>' +
        '<div class="cursor__dot"></div>';
      body.appendChild(el);
      ring = el.querySelector('.cursor__ring');
      label = el.querySelector('.cursor__label');

      window.addEventListener('mousemove', function (e) {
        x = e.clientX; y = e.clientY;
        if (!el.classList.contains('is-live')) {
          /* Jump to the pointer before fading in, or it streaks from 0,0. */
          rx = x; ry = y;
          el.classList.add('is-live');
        }
        el.classList.remove('is-hidden');
      }, { passive: true });

      doc.addEventListener('mouseleave', function () { el.classList.add('is-hidden'); });

      doc.addEventListener('mouseover', function (e) {
        var t = e.target.closest('[data-cursor]');
        if (t) {
          el.classList.add('is-hover');
          label.textContent = t.dataset.cursor || '';
          return;
        }
        var link = e.target.closest('a, button, input, select, textarea, [role="button"]');
        el.classList.toggle('is-link', !!link);
        el.classList.remove('is-hover');
        label.textContent = '';
      });

      doc.addEventListener('mouseout', function (e) {
        if (e.target.closest && e.target.closest('[data-cursor]')) {
          el.classList.remove('is-hover');
          label.textContent = '';
        }
      });

      raf = requestAnimationFrame(loop);
    }

    return { init: init };
  })();

  /* ====================================================================== *
   * Magnetic targets
   * ====================================================================== */

  function initMagnetic() {
    if (reduced || coarse) return;
    qsa('[data-magnetic]').forEach(function (el) {
      var strength = parseFloat(el.dataset.magnetic) || 0.32;
      var rx = 0, ry = 0, tx = 0, ty = 0, raf = 0, active = false;

      function loop() {
        rx = lerp(rx, tx, 0.16);
        ry = lerp(ry, ty, 0.16);
        el.style.transform = 'translate3d(' + rx.toFixed(2) + 'px,' + ry.toFixed(2) + 'px,0)';
        if (Math.abs(tx - rx) > 0.1 || Math.abs(ty - ry) > 0.1 || active) {
          raf = requestAnimationFrame(loop);
        } else {
          el.style.transform = '';
          raf = 0;
        }
      }

      el.addEventListener('mouseenter', function () { active = true; if (!raf) raf = requestAnimationFrame(loop); });
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        tx = (e.clientX - (r.left + r.width / 2)) * strength;
        ty = (e.clientY - (r.top + r.height / 2)) * strength;
      });
      el.addEventListener('mouseleave', function () {
        active = false; tx = 0; ty = 0;
        if (!raf) raf = requestAnimationFrame(loop);
      });
    });
  }

  /* ====================================================================== *
   * Marquee
   * ====================================================================== */

  function initMarquees() {
    qsa('[data-marquee]').forEach(function (el) {
      var track = el.querySelector('.marquee__track');
      if (!track) return;

      var speed = parseFloat(el.dataset.marquee) || 0.45;
      var dir = el.dataset.marqueeDir === 'right' ? 1 : -1;
      var seed = track.innerHTML;
      var half = 0, offset = 0;

      function measure() {
        track.innerHTML = seed;
        var one = track.scrollWidth;
        if (!one) return;
        var need = Math.ceil((window.innerWidth * 2) / one) + 1;
        var html = '';
        for (var i = 0; i < need; i++) html += seed;
        track.innerHTML = html;
        half = track.scrollWidth / need * Math.floor(need / 2) || one;
        half = one * Math.max(1, Math.floor(need / 2));
      }

      function step(vel) {
        if (reduced || !half) return;
        offset += dir * speed + (vel || 0) * 0.24 * dir * -1;
        if (offset <= -half) offset += half;
        if (offset >= 0) offset -= half;
        track.style.transform = 'translate3d(' + offset.toFixed(2) + 'px,0,0)';
      }

      measure();
      window.addEventListener('resize', debounce(measure, 250), { passive: true });
      ScrollFX.addMarquee({ measure: measure, step: step });
    });
  }

  /* ====================================================================== *
   * Counters
   * ====================================================================== */

  function initCounters() {
    var els = qsa('[data-count]');
    if (!els.length) return;

    function run(el) {
      var to = parseFloat(el.dataset.count);
      var dur = parseFloat(el.dataset.countDur) || 1600;
      var pad = el.dataset.countPad === 'true';
      if (reduced) { el.textContent = pad ? String(to).padStart(2, '0') : to; return; }
      var t0 = 0;
      function frame(now) {
        if (!t0) t0 = now;
        var p = clamp((now - t0) / dur, 0, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var v = Math.round(to * eased);
        el.textContent = pad ? String(v).padStart(2, '0') : v;
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        run(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ====================================================================== *
   * Accordion
   * ====================================================================== */

  function initAccordions() {
    qsa('[data-accordion]').forEach(function (acc) {
      var single = acc.dataset.accordion !== 'multi';
      qsa('.accordion__trigger', acc).forEach(function (btn) {
        btn.addEventListener('click', function () {
          var item = btn.closest('.accordion__item');
          var open = item.classList.contains('is-open');
          if (single) {
            qsa('.accordion__item', acc).forEach(function (other) {
              other.classList.remove('is-open');
              var t = other.querySelector('.accordion__trigger');
              if (t) t.setAttribute('aria-expanded', 'false');
            });
          }
          item.classList.toggle('is-open', !open);
          btn.setAttribute('aria-expanded', String(!open));
        });
      });
    });
  }

  /* ====================================================================== *
   * Testimony
   * ====================================================================== */

  function initTestimony() {
    qsa('[data-testimony]').forEach(function (wrap) {
      var slides = qsa('.testimony__slide', wrap);
      var dots = qsa('.testimony__dot', wrap);
      if (slides.length < 2) return;
      var i = 0, timer;

      function go(n) {
        i = (n + slides.length) % slides.length;
        slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
        dots.forEach(function (d, k) { d.classList.toggle('is-active', k === i); });
      }

      function auto() {
        clearInterval(timer);
        if (reduced) return;
        timer = setInterval(function () { go(i + 1); }, 7000);
      }

      dots.forEach(function (d, k) {
        d.addEventListener('click', function () { go(k); auto(); });
      });
      wrap.addEventListener('mouseenter', function () { clearInterval(timer); });
      wrap.addEventListener('mouseleave', auto);

      go(0);
      auto();
    });
  }

  /* ====================================================================== *
   * Gallery filters
   * ====================================================================== */

  function initFilters() {
    qsa('[data-filters]').forEach(function (bar) {
      var targetSel = bar.dataset.filters;
      var items = qsa(targetSel + ' [data-tags]');
      qsa('.filter', bar).forEach(function (btn) {
        btn.addEventListener('click', function () {
          var val = btn.dataset.filter;
          qsa('.filter', bar).forEach(function (b) {
            b.classList.toggle('is-active', b === btn);
            b.setAttribute('aria-pressed', String(b === btn));
          });
          items.forEach(function (item) {
            var match = val === 'all' || (' ' + item.dataset.tags + ' ').indexOf(' ' + val + ' ') > -1;
            item.hidden = !match;
          });
          ScrollFX.measure();
        });
      });
    });
  }

  /* ====================================================================== *
   * Inquiry form — validates and hands off to whatever endpoint is set.
   * ====================================================================== */

  function initForms() {
    qsa('[data-form]').forEach(function (form) {
      var status = form.querySelector('[data-form-status]');

      form.addEventListener('submit', function (e) {
        if (!form.checkValidity()) return;           /* let the browser speak */
        var endpoint = form.getAttribute('action');
        if (endpoint && endpoint !== '#') return;    /* a real endpoint is configured */

        /* No endpoint configured yet — compose the enquiry as an email so
           nothing a couple writes is ever lost. See README. */
        e.preventDefault();
        var data = new FormData(form);
        var lines = [];
        data.forEach(function (v, k) {
          if (String(v).trim()) lines.push(k.replace(/_/g, ' ') + ': ' + v);
        });
        var to = form.dataset.form || 'hello@adaltare.ie';
        window.location.href = 'mailto:' + to +
          '?subject=' + encodeURIComponent('Wedding enquiry — ' + (data.get('names') || 'New couple')) +
          '&body=' + encodeURIComponent(lines.join('\n'));

        if (status) {
          status.hidden = false;
          status.textContent =
            'Your email client is opening with the enquiry composed. If nothing appears, write to ' + to + '.';
        }
      });
    });
  }

  /* ====================================================================== *
   * Menu
   * ====================================================================== */

  function initMenu() {
    var toggle = doc.querySelector('[data-menu-toggle]');
    var menu = doc.querySelector('[data-menu]');
    if (!toggle || !menu) return;

    function setOpen(open) {
      body.classList.toggle('menu-open', open);
      body.classList.toggle('is-locked', open);
      toggle.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
    }

    toggle.addEventListener('click', function () {
      setOpen(!body.classList.contains('menu-open'));
    });

    qsa('a', menu).forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });

    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && body.classList.contains('menu-open')) setOpen(false);
    });

    setOpen(false);
  }

  /* ====================================================================== *
   * Anchors
   * ====================================================================== */

  function initAnchors() {
    doc.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var t = doc.querySelector(id);
      if (!t) return;
      e.preventDefault();
      /* Measure the bar rather than parsing --nav-h, which would assume both a
         16px root and that the token is always expressed in rem. */
      var bar = doc.querySelector('[data-nav]');
      var navH = bar ? bar.offsetHeight : 84;
      Scroller.to(t.getBoundingClientRect().top + window.scrollY - navH + 1);
      history.replaceState(null, '', id);
    });
  }

  /* ====================================================================== *
   * Curtain — page transitions
   * ====================================================================== */

  var Curtain = (function () {
    var el;

    function build() {
      el = doc.querySelector('[data-curtain]');
      if (el) return;
      el = doc.createElement('div');
      el.className = 'curtain';
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('data-curtain', '');
      var panels = '';
      for (var i = 0; i < 5; i++) panels += '<div class="curtain__panel"></div>';
      el.innerHTML = panels +
        '<div class="curtain__seal"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" ' +
        'stroke-width="1"><path d="M20 4v32M8 14h24M20 4l-4 6h8l-4-6z"/><circle cx="20" cy="24" r="7"/></svg></div>';
      body.appendChild(el);
    }

    function out() {
      if (!el) return;
      el.classList.add('is-in');
      requestAnimationFrame(function () {
        el.classList.remove('is-in');
        el.classList.add('is-out');
      });
    }

    function leave(href) {
      el.classList.remove('is-out');
      el.classList.add('is-in');
      setTimeout(function () { window.location.href = href; }, 620);
    }

    function init() {
      build();

      if (reduced) return;

      doc.addEventListener('click', function (e) {
        var a = e.target.closest('a');
        if (!a) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        var href = a.getAttribute('href');
        if (!href || href.charAt(0) === '#') return;
        if (a.target && a.target !== '_self') return;
        if (a.hasAttribute('download')) return;
        if (/^(mailto:|tel:|https?:\/\/)/i.test(href)) {
          if (a.hostname && a.hostname !== window.location.hostname) return;
        }
        if (a.href === window.location.href) return;
        e.preventDefault();
        leave(a.href);
      });

      window.addEventListener('pageshow', function (ev) {
        if (ev.persisted) {
          el.classList.remove('is-in');
          el.classList.add('is-out');
        }
      });
    }

    return { init: init, out: out };
  })();

  /* ====================================================================== *
   * Preloader
   * ====================================================================== */

  var Loader = (function () {
    var el, meter, count;

    function finish(cb) {
      body.classList.remove('is-locked');
      body.classList.add('is-ready');
      if (el) {
        el.classList.add('is-out');
        setTimeout(function () { el.hidden = true; }, 700);
      }
      Curtain.out();
      cb();
    }

    function init(cb) {
      el = doc.querySelector('[data-loader]');

      var seen = false;
      try { seen = sessionStorage.getItem('altare:seen') === '1'; } catch (e) {}
      try { sessionStorage.setItem('altare:seen', '1'); } catch (e) {}

      if (!el || seen || reduced) {
        if (el) el.hidden = true;
        finish(cb);
        return;
      }

      meter = el.querySelector('.loader__meter i');
      count = el.querySelector('.loader__count');
      body.classList.add('is-locked');

      var p = 0, done = false, loaded = false;
      window.addEventListener('load', function () { loaded = true; });
      /* Never hold the counter at 88 waiting on a slow or failed asset. */
      setTimeout(function () { loaded = true; }, 1100);

      function frame() {
        /* Climb quickly to 88, then wait on the real load event. */
        var ceiling = loaded ? 100 : 88;
        p = Math.min(ceiling, p + (ceiling - p) * 0.09 + 1.3);
        if (meter) meter.style.transform = 'scaleX(' + (p / 100).toFixed(3) + ')';
        if (count) count.textContent = String(Math.floor(p)).padStart(3, '0');
        if (p >= 99.4 && !done) {
          done = true;
          if (count) count.textContent = '100';
          setTimeout(function () { finish(cb); }, 260);
          return;
        }
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);

      /* Never let a slow asset hold the door shut. */
      setTimeout(function () { if (!done) { done = true; finish(cb); } }, 4000);
    }

    return { init: init };
  })();

  /* ====================================================================== *
   * Small niceties
   * ====================================================================== */

  function initYear() {
    qsa('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  function initTitleTilt() {
    if (reduced || coarse) return;
    qsa('[data-tilt]').forEach(function (el) {
      var max = parseFloat(el.dataset.tilt) || 6;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform =
          'perspective(900px) rotateY(' + (px * max).toFixed(2) + 'deg) rotateX(' + (-py * max).toFixed(2) + 'deg)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ====================================================================== *
   * Boot
   * ====================================================================== */

  function boot() {
    body.classList.add('js');

    if (window.AltareArt) window.AltareArt.mount();

    Curtain.init();
    Scroller.init();
    Split.init();
    ScrollFX.init();
    Cursor.init();
    initMagnetic();
    initMarquees();
    initMenu();
    initAnchors();
    initAccordions();
    initTestimony();
    initFilters();
    initForms();
    initCounters();
    initYear();
    initTitleTilt();

    /* Entrances are held back until the preloader lifts, so the hero plays to
       a visitor rather than to a covered screen. The timer is a hard floor:
       whatever happens to the loader — a throttled background tab, an asset
       that never resolves — the page is never left with its content hidden. */
    var armed = false;
    function ready() {
      if (armed) return;
      armed = true;
      Reveal.init();
      ScrollFX.measure();
    }
    Loader.init(ready);
    setTimeout(ready, 3000);
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* Respond if the visitor changes their motion preference mid-visit. */
  var onPrefChange = function () { window.location.reload(); };
  if (mqReduced.addEventListener) mqReduced.addEventListener('change', onPrefChange);

  window.Altare = { Scroller: Scroller, ScrollFX: ScrollFX };
})();
