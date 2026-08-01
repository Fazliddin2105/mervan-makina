import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

/**
 * Second-stage cleanup for the screenshot-exported listings.
 *
 * The frame on those files is not a clean rectangle: the coloured rule only
 * runs along part of each edge, so a "is this whole line one flat colour?"
 * test misses it. Rather than guessing at partial runs, this shaves a small
 * proportional margin off every edge of the affected listings, which removes
 * the residue without noticeably cropping the machine.
 *
 * Only the listings that were exported from a framed layout are touched. The
 * re-shot ones (mk-1, mk-8, mk-9, mk-10) are full-bleed photography and are
 * left alone.
 */

const FRAMED = ['mk-1-legacy', 'mk-2', 'mk-3', 'mk-4', 'mk-5', 'mk-6', 'mk-7'];
const MARGIN = 0.022; // 2.2% per edge

const ROOT = 'public/images/products';
const files = [];
for (const dir of FRAMED) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) continue;
  for (const f of fs.readdirSync(full)) {
    files.push(path.join(full, f).replace(/\\/g, '/'));
  }
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:3000/');

const report = [];

for (const file of files) {
  const url = 'http://localhost:3000/' + file.replace(/^public\//, '');

  const result = await page.evaluate(
    async ({ src, margin }) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
        img.src = src;
      });

      const w0 = img.naturalWidth;
      const h0 = img.naturalHeight;
      const dx = Math.round(w0 * margin);
      const dy = Math.round(h0 * margin);
      const w = w0 - dx * 2;
      const h = h0 - dy * 2;
      if (w < 80 || h < 80) return { changed: false };

      const out = document.createElement('canvas');
      out.width = w;
      out.height = h;
      out.getContext('2d').drawImage(img, dx, dy, w, h, 0, 0, w, h);

      return { changed: true, from: [w0, h0], to: [w, h], dataUrl: out.toDataURL('image/webp', 0.93) };
    },
    { src: url, margin: MARGIN }
  );

  if (result.changed) {
    fs.writeFileSync(file, Buffer.from(result.dataUrl.split(',')[1], 'base64'));
    report.push(`${file}  ${result.from.join('x')} -> ${result.to.join('x')}`);
  }
}

await browser.close();
console.log(report.join('\n'));
console.log('\ninset:', report.length, 'files');
