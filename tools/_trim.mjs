import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

/**
 * Trims the baked-in frame from product photos.
 *
 * Several listings on the old site were exported as screenshots of a framed
 * layout, so the file carries a border around the actual photograph — usually
 * white, but on some listings a thin saturated rule (green, grey) sits just
 * inside it. Rendered on a card, that reads as a printing fault.
 *
 * Two passes, because a white-only test leaves the coloured rules behind:
 *   1. strip near-white rows and columns from each edge
 *   2. strip any remaining edge lines that are a single flat colour
 *
 * Runs in Chromium because canvas gives pixel access with no native deps.
 */

const ROOT = 'public/images/products';
const files = [];
for (const dir of fs.readdirSync(ROOT)) {
  for (const f of fs.readdirSync(path.join(ROOT, dir))) {
    files.push(path.join(ROOT, dir, f).replace(/\\/g, '/'));
  }
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:3000/');

const report = [];

for (const file of files) {
  const url = 'http://localhost:3000/' + file.replace(/^public\//, '');

  const result = await page.evaluate(async (src) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
      img.src = src;
    });

    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);

    const at = (x, y) => {
      const i = (y * width + x) * 4;
      return [data[i], data[i + 1], data[i + 2]];
    };

    // ---- pass 1: near-white frame -------------------------------------
    const NEAR_WHITE = 244;
    const WHITE_RATIO = 0.985;

    const isPaleLine = (fixed, isRow) => {
      const n = isRow ? width : height;
      let pale = 0;
      for (let k = 0; k < n; k++) {
        const [r, g, b] = isRow ? at(k, fixed) : at(fixed, k);
        if (r > NEAR_WHITE && g > NEAR_WHITE && b > NEAR_WHITE) pale++;
      }
      return pale / n >= WHITE_RATIO;
    };

    let top = 0, bottom = height - 1, left = 0, right = width - 1;
    while (top < bottom && isPaleLine(top, true)) top++;
    while (bottom > top && isPaleLine(bottom, true)) bottom--;
    while (left < right && isPaleLine(left, false)) left++;
    while (right > left && isPaleLine(right, false)) right--;

    // ---- pass 2: flat coloured rule just inside the white --------------
    // A line counts as a rule when nearly every pixel matches its own first
    // pixel closely. Real photography is never that uniform across a full edge.
    const FLAT_TOL = 26;
    const FLAT_RATIO = 0.97;
    const MAX_RULE_PX = 14;

    const isFlatLine = (fixed, isRow) => {
      const from = isRow ? left : top;
      const to = isRow ? right : bottom;
      const [r0, g0, b0] = isRow ? at(from, fixed) : at(fixed, from);
      let same = 0;
      let count = 0;
      for (let k = from; k <= to; k++) {
        const [r, g, b] = isRow ? at(k, fixed) : at(fixed, k);
        if (Math.abs(r - r0) < FLAT_TOL && Math.abs(g - g0) < FLAT_TOL && Math.abs(b - b0) < FLAT_TOL) {
          same++;
        }
        count++;
      }
      return count > 0 && same / count >= FLAT_RATIO;
    };

    for (let i = 0; i < MAX_RULE_PX && top < bottom && isFlatLine(top, true); i++) top++;
    for (let i = 0; i < MAX_RULE_PX && bottom > top && isFlatLine(bottom, true); i++) bottom--;
    for (let i = 0; i < MAX_RULE_PX && left < right && isFlatLine(left, false); i++) left++;
    for (let i = 0; i < MAX_RULE_PX && right > left && isFlatLine(right, false); i++) right--;

    // A couple of pixels of safety against compression ringing on the seam.
    const INSET = 2;
    top = Math.min(top + INSET, bottom);
    left = Math.min(left + INSET, right);
    bottom = Math.max(bottom - INSET, top);
    right = Math.max(right - INSET, left);

    const w = right - left + 1;
    const h = bottom - top + 1;
    const trimmed = (width * height - w * h) / (width * height);

    if (trimmed < 0.015 || w < 80 || h < 80) {
      return { changed: false, from: [width, height], to: [w, h], trimmed };
    }

    const out = document.createElement('canvas');
    out.width = w;
    out.height = h;
    out.getContext('2d').drawImage(c, left, top, w, h, 0, 0, w, h);

    return {
      changed: true,
      from: [width, height],
      to: [w, h],
      trimmed,
      dataUrl: out.toDataURL('image/webp', 0.93)
    };
  }, url);

  if (result.changed) {
    const b64 = result.dataUrl.split(',')[1];
    fs.writeFileSync(file, Buffer.from(b64, 'base64'));
    report.push(
      `${file}  ${result.from.join('x')} -> ${result.to.join('x')}  (-${(result.trimmed * 100).toFixed(0)}%)`
    );
  }
}

await browser.close();
console.log(report.length ? report.join('\n') : 'no framed images found');
console.log('\ntrimmed:', report.length, 'of', files.length);
