/* Render the Open Graph share images.
 *
 * Not part of the build: run it when a page's title changes, and commit the
 * PNGs. Needs playwright-core and a Chromium; set PW_EXE if yours is elsewhere.
 *
 *   node tools/mk_og.js            (with a static server on :8765 at the repo root)
 */
const path = require('path');
const PW = process.env.PW_MODULE || 'playwright-core';
const { chromium } = require(PW);
const EXE = process.env.PW_EXE || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const BASE = process.env.OG_BASE || 'http://127.0.0.1:8765';
const OUT = path.join(__dirname, '..', 'assets', 'images', 'og');

const PAGES = [
  { file: 'index',      palette: 'chiaroscuro', seed: 417,
    headline: 'Sacred weddings, <em>beautifully made.</em>' },
  { file: 'philosophy', palette: 'chiaroscuro', seed: 1204,
    headline: 'The liturgy is not <em>the backdrop.</em>' },
  { file: 'rite',       palette: 'lapis',       seed: 2201,
    headline: 'The Order of Celebrating <em>Matrimony</em>',
    sub: 'Both rites &middot; modern and traditional Latin' },
  { file: 'atelier',    palette: 'cinabrese',   seed: 3310,
    headline: 'Three ways to <em>work with us.</em>' },
  { file: 'weddings',   palette: 'verdigris',   seed: 4400,
    headline: 'Nine hundred years of <em>church-building.</em>' },
  { file: 'budget',     palette: 'verdigris',   seed: 7701,
    headline: 'A wedding you can afford.',
    sub: 'What a Catholic wedding costs in Ireland',
    motto: '&ldquo;The sacrament costs nothing.&rdquo;' },
  { file: 'contact',    palette: 'chiaroscuro', seed: 5501,
    headline: 'Begin an <em>enquiry.</em>' },
];

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  const ctx = await browser.newContext({
    viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1,
  });
  for (const p of PAGES) {
    const q = new URLSearchParams({ palette: p.palette, seed: String(p.seed),
      headline: p.headline });
    if (p.sub) q.set('sub', p.sub);
    if (p.motto) q.set('motto', p.motto);

    const page = await ctx.newPage();
    await page.goto(`${BASE}/_og.html?${q}`, { waitUntil: 'load' });
    await page.waitForFunction(() => window.__ogReady && window.__ogReady(), null,
                               { timeout: 30000 });
    await page.waitForTimeout(400);
    /* JPEG, not PNG: these are photographic gradients, and a social crawler
       fetches them on every share. Quality 88 is visually identical here at a
       quarter of the weight. */
    const file = path.join(OUT, `${p.file}.jpg`);
    await page.locator('#card').screenshot({ path: file, type: 'jpeg', quality: 88 });
    console.log(`  ${p.file}.jpg`);
    await page.close();
  }
  await browser.close();
})();
