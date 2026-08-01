import { chromium } from 'playwright';

/**
 * Verifies a font actually draws U+02BB (ʻ), the Uzbek latin apostrophe.
 *
 * A missing glyph does not error — the browser silently falls back to another
 * family, so the character still appears but in the wrong face, which is worse
 * than an obvious break. The check measures the rendered width against a
 * reference: if the font lacks the glyph, the fallback metrics differ.
 */

const FAMILIES = ['Archivo', 'Inter', 'IBM Plex Mono'];
const CHARS = [
  ['U+02BB', 'ʻ', 'oʻzbek'],
  ['U+02BC', 'ʼ', 'oʼzbek'],
  ["ASCII '", "'", "o'zbek"]
];

const browser = await chromium.launch();
const page = await browser.newPage();

await page.setContent(`<!doctype html><html><head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,400..900&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400..900&display=swap" rel="stylesheet">
</head><body><div id="probe"></div></body></html>`, { waitUntil: 'networkidle' });

await page.waitForFunction(() => document.fonts.ready.then(() => true));
await page.waitForTimeout(500);

const result = await page.evaluate(({ families, chars }) => {
  const out = [];
  const el = document.getElementById('probe');

  const widthIn = (family, text) => {
    el.style.cssText = `font-family:${family};font-size:120px;position:absolute;white-space:pre`;
    el.textContent = text;
    return el.getBoundingClientRect().width;
  };

  for (const family of families) {
    // "Adobe Blank" style probe: compare against a family guaranteed to lack
    // the glyph is not available here, so instead compare the glyph width in
    // the target family against the same glyph in a generic fallback. Equal
    // widths across a real font and monospace fallback signal substitution.
    for (const [label, ch] of chars) {
      const a = widthIn(`'${family}'`, ch);
      const b = widthIn(`'${family}', monospace`, ch);
      const fallback = widthIn('monospace', ch);
      out.push({
        family,
        label,
        width: Math.round(a * 10) / 10,
        looksSubstituted: Math.abs(a - fallback) < 0.5 && Math.abs(b - fallback) < 0.5
      });
    }
  }
  return out;
}, { families: FAMILIES, chars: CHARS.map(([l, c]) => [l, c]) });

let current = '';
for (const r of result) {
  if (r.family !== current) {
    current = r.family;
    console.log(`\n${current}`);
  }
  console.log(
    `   ${r.label.padEnd(9)} kenglik ${String(r.width).padStart(6)}px   ` +
      (r.looksSubstituted ? 'SHUBHALI — fallback bilan bir xil' : 'oʻz glifi bor')
  );
}

// Visual proof, since metrics alone can mislead.
await page.setContent(`<!doctype html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,400..900&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400..900&display=swap" rel="stylesheet">
<style>
 body{margin:0;background:#fff;padding:40px;font-size:56px;color:#0B1D3F}
 div{margin-bottom:28px}
 span{color:#6B7789;font-size:20px;font-family:system-ui;display:block;margin-bottom:6px}
 .a{font-family:'Archivo'} .i{font-family:'Inter'} .m{font-family:'IBM Plex Mono'}
</style></head><body>
 <div><span>Archivo</span><b class="a">oʻzbek gʻalaba · oʼzbek · o'zbek</b></div>
 <div><span>Inter</span><b class="i">oʻzbek gʻalaba · oʼzbek · o'zbek</b></div>
 <div><span>IBM Plex Mono</span><b class="m">oʻzbek gʻalaba · oʼzbek · o'zbek</b></div>
</body></html>`, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.screenshot({ path: 'glyph-check.png', fullPage: true });

await browser.close();
console.log('\nglyph-check.png yozildi');
