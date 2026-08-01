import { chromium } from 'playwright';

const OUT = process.argv[2] || 'shot';
const URL = process.argv[3] || 'http://localhost:3000/';
const W = Number(process.argv[4] || 1440);
const H = Number(process.argv[5] || 900);
const FULL = process.argv[6] === 'full';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });

const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push('PAGE ERROR: ' + e.message));

await page.goto(URL, { waitUntil: 'networkidle', timeout: 45000 });
// Let entrance animations settle so the shot shows the resting state.
await page.waitForTimeout(1800);

await page.screenshot({ path: `${OUT}.png`, fullPage: FULL });

// Report anything that would make the page look broken.
const overflow = await page.evaluate(() => {
  const de = document.documentElement;
  const wide = [];
  document.querySelectorAll('*').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && (r.right > de.clientWidth + 2 || r.left < -2)) {
      wide.push(el.tagName.toLowerCase() + '.' + String(el.className).slice(0, 60));
    }
  });
  return {
    docWidth: de.scrollWidth,
    clientWidth: de.clientWidth,
    horizontalScroll: de.scrollWidth > de.clientWidth + 1,
    offenders: [...new Set(wide)].slice(0, 6)
  };
});

console.log(JSON.stringify({ out: `${OUT}.png`, viewport: `${W}x${H}`, errors: errors.slice(0, 8), overflow }, null, 1));
await browser.close();
