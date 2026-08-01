import { chromium } from 'playwright';

/** Captures the hero at several moments so an entrance sequence can be checked. */
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });

const marks = [400, 900, 1500, 2200, 3200];
let prev = 0;
for (const t of marks) {
  await page.waitForTimeout(t - prev);
  prev = t;
  await page.screenshot({ path: `seq-${t}.png`, clip: { x: 0, y: 100, width: 1440, height: 560 } });
}

console.log('captured', marks.join(', '), 'ms');
await browser.close();
