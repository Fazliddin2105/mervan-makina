import { chromium } from 'playwright';

/**
 * Measures the real contrast ratio of every visible text node against the
 * background actually painted behind it, and reports what fails WCAG AA.
 *
 * Computed styles are read from the live page rather than from the source, so
 * this catches colour that arrives through a class, an inherited value or a
 * parent's background — none of which a grep over the codebase would see.
 */

const PAGES = ['/', '/products', '/services', '/contact', '/faq', '/checkout'];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const all = new Map();

for (const route of PAGES) {
  await page.goto('http://localhost:3000' + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  // Walk the page so lazily revealed sections are painted before measuring.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);

  const rows = await page.evaluate(() => {
    const parse = (c) => {
      const m = c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
      return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] } : null;
    };
    const lum = ({ r, g, b }) => {
      const f = (v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const over = (fg, bg) => ({
      r: fg.r * fg.a + bg.r * (1 - fg.a),
      g: fg.g * fg.a + bg.g * (1 - fg.a),
      b: fg.b * fg.a + bg.b * (1 - fg.a),
      a: 1
    });
    const ratio = (a, b) => {
      const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
      return (x + 0.05) / (y + 0.05);
    };

    // The nearest ancestor that actually paints a background.
    //
    // Returns null when the chain runs through a gradient or an image: the
    // painted colour there varies per pixel and cannot be derived from computed
    // style, so reporting a ratio would be a guess. Those elements are skipped
    // rather than flagged — the first version of this tool called every white
    // heading over the hero photograph a failure.
    const bgOf = (el) => {
      // Collect nearest-first, then composite farthest-first. Blending as we
      // walk up puts the layers in the wrong order and a translucent navy
      // header ends up reported as white.
      const stack = [];
      let n = el;
      while (n && n !== document.documentElement) {
        const cs = getComputedStyle(n);
        if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
        const c = parse(cs.backgroundColor);
        if (c && c.a > 0) {
          stack.push(c);
          if (c.a === 1) break;
        }
        n = n.parentElement;
      }

      let acc = { r: 255, g: 255, b: 255, a: 1 };
      for (let i = stack.length - 1; i >= 0; i--) acc = over(stack[i], acc);
      return acc;
    };

    const out = [];
    for (const el of document.querySelectorAll('*')) {
      if (!el.childNodes.length) continue;
      const hasText = [...el.childNodes].some(
        n => n.nodeType === 3 && n.textContent.trim().length > 1
      );
      if (!hasText) continue;

      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) continue;

      const fg = parse(cs.color);
      if (!fg) continue;
      const bg = bgOf(el);
      if (!bg) continue;
      const eff = fg.a === 1 ? fg : over(fg, bg);
      const r = ratio(eff, bg);

      const px = parseFloat(cs.fontSize);
      const bold = parseInt(cs.fontWeight, 10) >= 700;
      // AA: 3:1 for large text (>=24px, or >=18.66px bold), 4.5:1 otherwise.
      const large = px >= 24 || (bold && px >= 18.66);
      const need = large ? 3 : 4.5;

      if (r < need) {
        out.push({
          text: el.textContent.trim().slice(0, 44),
          ratio: Math.round(r * 100) / 100,
          need,
          px: Math.round(px),
          color: cs.color,
          cls: String(el.className).slice(0, 70)
        });
      }
    }
    return out;
  });

  for (const r of rows) {
    const key = `${r.cls}|${r.color}|${r.px}`;
    if (!all.has(key)) all.set(key, { ...r, routes: new Set() });
    all.get(key).routes.add(route);
  }
}

await browser.close();

const rows = [...all.values()].sort((a, b) => a.ratio - b.ratio);
if (!rows.length) {
  console.log('AA boʻyicha yiqilgan matn yoʻq.');
} else {
  console.log(`AA dan past: ${rows.length} xil\n`);
  for (const r of rows.slice(0, 25)) {
    console.log(
      `${String(r.ratio).padStart(5)} : ${String(r.need)}  ${String(r.px).padStart(2)}px  ` +
        `${r.color.padEnd(22)} "${r.text}"`
    );
    console.log(`        ${r.cls}`);
  }
}
