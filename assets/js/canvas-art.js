/* ==========================================================================
   AD ALTARE — canvas-art.js
   --------------------------------------------------------------------------
   Every image on this site that is not a photograph is generated here, at
   runtime, from noise and geometry. No external art is fetched.

     fresco()      sfumato oil-panel grounds (fBm value noise + palette ramp)
     roseWindow()  gothic rose-window tracery
     motes()       drifting gold-leaf dust
     gildGrain()   the gesso tooth laid over the whole document

   Everything honours prefers-reduced-motion and pauses when off-screen.
   ========================================================================== */
(function (global) {
  'use strict';

  var reduced = global.matchMedia
    ? global.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  /* ------------------------------------------------------------------ *
   * Value noise
   * ------------------------------------------------------------------ */

  function hash2(x, y, seed) {
    var h = x * 374761393 + y * 668265263 + seed * 1274126177;
    h = (h ^ (h >> 13)) * 1274126177;
    return ((h ^ (h >> 16)) >>> 0) / 4294967295;
  }

  function smooth(t) { return t * t * (3 - 2 * t); }

  function valueNoise(x, y, seed) {
    var xi = Math.floor(x), yi = Math.floor(y);
    var xf = x - xi, yf = y - yi;
    var u = smooth(xf), v = smooth(yf);
    var a = hash2(xi, yi, seed);
    var b = hash2(xi + 1, yi, seed);
    var c = hash2(xi, yi + 1, seed);
    var d = hash2(xi + 1, yi + 1, seed);
    return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
  }

  function fbm(x, y, seed, octaves) {
    var total = 0, amp = 0.5, freq = 1, norm = 0;
    for (var i = 0; i < octaves; i++) {
      total += valueNoise(x * freq, y * freq, seed + i * 97) * amp;
      norm += amp;
      amp *= 0.5;
      freq *= 2.03;
    }
    return total / norm;
  }

  /* ------------------------------------------------------------------ *
   * Palettes — ground pigments of the quattrocento
   * ------------------------------------------------------------------ */

  var PALETTES = {
    chiaroscuro: [
      [0.00, [8, 6, 4]],
      [0.34, [26, 19, 13]],
      [0.52, [58, 44, 30]],
      [0.68, [110, 79, 40]],
      [0.82, [176, 135, 62]],
      [0.93, [223, 190, 126]],
      [1.00, [243, 228, 196]]
    ],
    lapis: [
      [0.00, [7, 8, 12]],
      [0.36, [20, 27, 44]],
      [0.56, [39, 57, 95]],
      [0.72, [74, 86, 116]],
      [0.86, [150, 126, 86]],
      [1.00, [230, 201, 131]]
    ],
    cinabrese: [
      [0.00, [10, 6, 5]],
      [0.34, [40, 20, 14]],
      [0.54, [90, 40, 27]],
      [0.70, [154, 55, 34]],
      [0.85, [188, 122, 66]],
      [1.00, [238, 214, 174]]
    ],
    gesso: [
      [0.00, [124, 106, 78]],
      [0.28, [172, 153, 122]],
      [0.52, [206, 189, 158]],
      [0.76, [232, 222, 203]],
      [1.00, [251, 247, 239]]
    ],
    verdigris: [
      [0.00, [8, 10, 8]],
      [0.34, [24, 32, 25]],
      [0.55, [56, 70, 52]],
      [0.72, [93, 107, 84]],
      [0.88, [162, 143, 88]],
      [1.00, [230, 201, 131]]
    ]
  };

  function ramp(stops, t) {
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    for (var i = 1; i < stops.length; i++) {
      if (t <= stops[i][0]) {
        var a = stops[i - 1], b = stops[i];
        var f = (t - a[0]) / (b[0] - a[0] || 1);
        return [
          a[1][0] + (b[1][0] - a[1][0]) * f,
          a[1][1] + (b[1][1] - a[1][1]) * f,
          a[1][2] + (b[1][2] - a[1][2]) * f
        ];
      }
    }
    return stops[stops.length - 1][1];
  }

  /* ------------------------------------------------------------------ *
   * fresco — a painted ground
   *
   * Renders at a deliberately small resolution and is scaled up by CSS,
   * which is what gives it the softness of oil on panel. Two plates are
   * generated and cross-drifted so the surface never sits still.
   * ------------------------------------------------------------------ */

  function paintPlate(w, h, opts) {
    var cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    var ctx = cv.getContext('2d');
    var img = ctx.createImageData(w, h);
    var data = img.data;

    var stops = PALETTES[opts.palette] || PALETTES.chiaroscuro;
    var seed = opts.seed;
    var scale = opts.scale;
    var lx = opts.lightX, ly = opts.lightY;
    var level = opts.level;
    var detail = opts.detail;
    var glow = opts.glow;
    var reach = opts.reach;
    var contrast = opts.contrast;
    var octaves = opts.octaves;

    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var nx = (x / w) * scale;
        var ny = (y / h) * scale * (h / w);

        /* Domain warp — the drift of a brush loaded with medium. */
        var wx = fbm(nx + 5.2, ny + 1.3, seed, 3);
        var wy = fbm(nx + 9.7, ny + 7.1, seed + 41, 3);
        var n = fbm(nx + wx * 1.9, ny + wy * 1.9, seed, octaves);

        /* fBm of value noise clusters hard around 0.5; expand it or the
           whole panel collapses into one flat tone. */
        n = (n - 0.5) * 1.85;

        /* The light source — a single high window, as in any Caravaggio. */
        var dx = (x / w - lx);
        var dy = (y / h - ly) * (h / w) * 1.7;
        var dist = Math.sqrt(dx * dx + dy * dy) / reach;
        var lum = dist >= 1 ? 0 : (1 - dist) * (1 - dist);

        /* Value is built around a stated level rather than scaled toward
           black, so the pigment keeps its range wherever the light falls. */
        var v = level + n * detail + lum * glow;
        v = (v - 0.5) * contrast + 0.5;

        /* A whisper of craquelure. */
        v += (fbm(nx * 7.5, ny * 7.5, seed + 313, 2) - 0.5) * 0.06;

        var c = ramp(stops, v);
        var i = (y * w + x) * 4;
        data[i] = c[0]; data[i + 1] = c[1]; data[i + 2] = c[2]; data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return cv;
  }

  /* Named looks. Markup asks for one by name and overrides what it likes:
     data-fresco='{"preset":"plate","palette":"cinabrese","seed":940}' */
  var PRESETS = {
    /* Full-bleed backgrounds sitting behind display type — held back so the
       type keeps its contrast. */
    ground: { scale: 7, level: 0.40, detail: 0.34, glow: 0.50, reach: 0.95, contrast: 1.20 },
    /* Framed panels standing in for a painting. The richest of the four. */
    plate:  { scale: 8.5, level: 0.52, detail: 0.42, lightY: 0.34, glow: 0.58, reach: 0.85 },
    /* Vellum — for cards and sections that read as parchment. */
    vellum: { scale: 6.5, level: 0.52, detail: 0.30, glow: 0.45, reach: 0.9, contrast: 1.10 },
    /* A thin wash, for large quiet areas. */
    veil:   { scale: 6, level: 0.45, detail: 0.30, glow: 0.48, reach: 1.05, contrast: 1.12 }
  };

  function fresco(canvas, options) {
    if (!canvas) return null;
    options = options || {};
    var preset = PRESETS[options.preset] || {};
    var opts = Object.assign({
      palette: 'chiaroscuro',
      seed: Math.floor(Math.random() * 9999),
      scale: 8,          /* how many noise cells across the plate */
      octaves: 5,
      level: 0.5,        /* the tone the panel sits at before light */
      detail: 0.4,       /* how far the pigment ranges either side of it */
      lightX: 0.5,
      lightY: 0.3,
      glow: 0.55,        /* how much the light lifts the value */
      reach: 0.85,       /* how far the light carries */
      contrast: 1.18,
      resolution: 300,
      drift: 0.55,
      still: false
    }, preset, options);

    var ctx = canvas.getContext('2d');
    if (!ctx) return null;

    var W = opts.resolution;
    var H = Math.round(W * 0.68);
    var plateA = paintPlate(W, H, opts);
    var plateB = paintPlate(W, H, Object.assign({}, opts, {
      seed: opts.seed + 617,
      scale: opts.scale * 1.45,
      lightX: 1 - opts.lightX,
      level: 0.5,              /* overlay is neutral at 0.5 — see draw() */
      detail: opts.detail * 0.7,
      glow: opts.glow * 0.45
    }));

    var raf = 0, t = 0, visible = true;

    function size() {
      var r = canvas.getBoundingClientRect();
      var dpr = Math.min(global.devicePixelRatio || 1, 1.5);
      var w = Math.max(1, Math.round(r.width * dpr));
      var h = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
      }
    }

    function draw() {
      var w = canvas.width, h = canvas.height;
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      var ax = Math.sin(t * 0.00021) * w * 0.05 * opts.drift;
      var ay = Math.cos(t * 0.00017) * h * 0.05 * opts.drift;
      var bx = Math.cos(t * 0.00013) * w * 0.07 * opts.drift;
      var by = Math.sin(t * 0.00011) * h * 0.07 * opts.drift;

      ctx.globalAlpha = 1;
      ctx.drawImage(plateA, -w * 0.09 + ax, -h * 0.09 + ay, w * 1.18, h * 1.18);

      ctx.globalCompositeOperation = 'overlay';
      ctx.globalAlpha = 0.42;
      ctx.drawImage(plateB, -w * 0.12 + bx, -h * 0.12 + by, w * 1.24, h * 1.24);

      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }

    function loop(now) {
      raf = global.requestAnimationFrame(loop);
      if (!visible) return;
      t = now;
      draw();
    }

    size();
    draw();

    if (!reduced && !opts.still) {
      raf = global.requestAnimationFrame(loop);
      if ('IntersectionObserver' in global) {
        new IntersectionObserver(function (entries) {
          visible = entries[0].isIntersecting;
        }, { rootMargin: '120px' }).observe(canvas);
      }
    }

    var resizeTimer;
    global.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { size(); draw(); }, 180);
    }, { passive: true });

    return { destroy: function () { global.cancelAnimationFrame(raf); } };
  }

  /* ------------------------------------------------------------------ *
   * roseWindow — the tracery of a gothic oculus
   * ------------------------------------------------------------------ */

  function roseWindow(canvas, options) {
    if (!canvas) return null;
    var opts = Object.assign({
      petals: 12,
      inner: 6,
      color: '#c9a253',
      lineWidth: 1,
      glass: true
    }, options || {});

    var ctx = canvas.getContext('2d');
    if (!ctx) return null;

    function circle(x, y, r) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    function draw() {
      var rect = canvas.getBoundingClientRect();
      var dpr = Math.min(global.devicePixelRatio || 1, 2);
      var side = Math.max(2, Math.round(Math.min(rect.width, rect.height) * dpr));
      canvas.width = side; canvas.height = side;

      var c = side / 2;
      var R = side * 0.47;

      ctx.clearRect(0, 0, side, side);
      ctx.strokeStyle = opts.color;
      ctx.lineWidth = Math.max(0.6, opts.lineWidth * dpr);
      ctx.lineJoin = 'round';

      /* three concentric bounding rings */
      ctx.globalAlpha = 0.85; circle(c, c, R);
      ctx.globalAlpha = 0.45; circle(c, c, R * 0.965);
      ctx.globalAlpha = 0.7;  circle(c, c, R * 0.80);
      ctx.globalAlpha = 0.35; circle(c, c, R * 0.30);
      ctx.globalAlpha = 0.6;  circle(c, c, R * 0.145);

      /* the great rosette — lobes struck from the centre */
      var n = opts.petals;
      var lobeD = R * 0.55;
      var lobeR = R * 0.255;
      var i, a;

      for (i = 0; i < n; i++) {
        a = (i / n) * Math.PI * 2 - Math.PI / 2;
        var px = c + Math.cos(a) * lobeD;
        var py = c + Math.sin(a) * lobeD;

        ctx.globalAlpha = 0.62;
        circle(px, py, lobeR);

        /* cusped foil inside each lobe */
        ctx.globalAlpha = 0.3;
        circle(px, py, lobeR * 0.55);

        /* mullion running out to the rim */
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(c + Math.cos(a) * R * 0.145, c + Math.sin(a) * R * 0.145);
        ctx.lineTo(c + Math.cos(a) * R * 0.965, c + Math.sin(a) * R * 0.965);
        ctx.stroke();

        /* quatrefoil set between each pair of lobes */
        var a2 = a + Math.PI / n;
        var qx = c + Math.cos(a2) * R * 0.885;
        var qy = c + Math.sin(a2) * R * 0.885;
        ctx.globalAlpha = 0.34;
        for (var q = 0; q < 4; q++) {
          var qa = a2 + (q / 4) * Math.PI * 2;
          circle(qx + Math.cos(qa) * R * 0.032, qy + Math.sin(qa) * R * 0.032, R * 0.036);
        }
      }

      /* the inner rosette */
      for (i = 0; i < opts.inner; i++) {
        a = (i / opts.inner) * Math.PI * 2;
        ctx.globalAlpha = 0.42;
        circle(c + Math.cos(a) * R * 0.145, c + Math.sin(a) * R * 0.145, R * 0.145);
      }

      /* stained glass — a faint wash behind the tracery */
      if (opts.glass) {
        var g = ctx.createRadialGradient(c, c, 0, c, c, R);
        g.addColorStop(0, 'rgba(230,201,131,0.16)');
        g.addColorStop(0.42, 'rgba(154,55,34,0.07)');
        g.addColorStop(0.72, 'rgba(39,57,95,0.09)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalCompositeOperation = 'destination-over';
        ctx.globalAlpha = 1;
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(c, c, R, 0, Math.PI * 2); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }

      ctx.globalAlpha = 1;
    }

    draw();
    var timer;
    global.addEventListener('resize', function () {
      clearTimeout(timer);
      timer = setTimeout(draw, 200);
    }, { passive: true });

    return { redraw: draw };
  }

  /* ------------------------------------------------------------------ *
   * motes — gold-leaf dust in a shaft of light
   * ------------------------------------------------------------------ */

  function motes(canvas, options) {
    if (!canvas || reduced) return null;
    var opts = Object.assign({ count: 46, color: '230,201,131' }, options || {});
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;

    var dots = [], w = 0, h = 0, raf = 0, visible = true;

    function size() {
      var r = canvas.getBoundingClientRect();
      var dpr = Math.min(global.devicePixelRatio || 1, 2);
      w = canvas.width = Math.max(1, Math.round(r.width * dpr));
      h = canvas.height = Math.max(1, Math.round(r.height * dpr));
    }

    function seed() {
      dots = [];
      for (var i = 0; i < opts.count; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.7 + 0.35,
          vy: -(Math.random() * 0.16 + 0.03),
          sway: Math.random() * 0.5 + 0.1,
          phase: Math.random() * Math.PI * 2,
          a: Math.random() * 0.5 + 0.12
        });
      }
    }

    function loop(now) {
      raf = global.requestAnimationFrame(loop);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.y += d.vy;
        if (d.y < -8) { d.y = h + 8; d.x = Math.random() * w; }
        var x = d.x + Math.sin(now * 0.0004 + d.phase) * d.sway * 22;
        var tw = 0.55 + Math.sin(now * 0.0013 + d.phase * 2.3) * 0.45;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + opts.color + ',' + (d.a * tw).toFixed(3) + ')';
        ctx.arc(x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    size(); seed();
    raf = global.requestAnimationFrame(loop);

    if ('IntersectionObserver' in global) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; })
        .observe(canvas);
    }

    var timer;
    global.addEventListener('resize', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { size(); seed(); }, 200);
    }, { passive: true });

    return { destroy: function () { global.cancelAnimationFrame(raf); } };
  }

  /* ------------------------------------------------------------------ *
   * gildGrain — the tooth of the gesso, as a tiled SVG turbulence
   * ------------------------------------------------------------------ */

  function gildGrain() {
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">' +
      '<filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch"/>' +
      '<feColorMatrix type="saturate" values="0"/></filter>' +
      '<rect width="180" height="180" filter="url(#g)" opacity="0.42"/></svg>';
    document.documentElement.style.setProperty(
      '--grain-src', 'url("data:image/svg+xml;utf8,' + encodeURIComponent(svg) + '")'
    );
  }

  /* ------------------------------------------------------------------ *
   * Declarative bootstrapping
   *
   *   <canvas data-fresco='{"palette":"lapis","seed":12}'></canvas>
   *   <canvas data-rose></canvas>
   *   <canvas data-motes></canvas>
   * ------------------------------------------------------------------ */

  function parse(el, attr) {
    var raw = el.getAttribute(attr);
    if (!raw) return {};
    try { return JSON.parse(raw); } catch (e) { return {}; }
  }

  function mount(root) {
    root = root || document;

    Array.prototype.forEach.call(root.querySelectorAll('[data-fresco]'), function (el) {
      if (el.dataset.frescoMounted) return;
      el.dataset.frescoMounted = '1';
      fresco(el, parse(el, 'data-fresco'));
    });

    Array.prototype.forEach.call(root.querySelectorAll('[data-rose]'), function (el) {
      if (el.dataset.roseMounted) return;
      el.dataset.roseMounted = '1';
      roseWindow(el, parse(el, 'data-rose'));
    });

    Array.prototype.forEach.call(root.querySelectorAll('[data-motes]'), function (el) {
      if (el.dataset.motesMounted) return;
      el.dataset.motesMounted = '1';
      motes(el, parse(el, 'data-motes'));
    });
  }

  global.AltareArt = {
    fresco: fresco,
    presets: Object.keys(PRESETS),
    roseWindow: roseWindow,
    motes: motes,
    gildGrain: gildGrain,
    mount: mount,
    palettes: Object.keys(PALETTES)
  };

  gildGrain();
})(window);
