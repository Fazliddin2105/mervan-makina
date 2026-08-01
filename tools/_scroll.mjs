import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

// Scroll through the page the way a visitor would, then report whether any
// section is still invisible. A Reveal that never fires leaves a blank band.
for (let y = 0; y < 6000; y += 700) {
  await page.mouse.wheel(0, 700);
  await page.waitForTimeout(220);
}
await page.waitForTimeout(1200);

const hidden = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll('section').forEach((el, i) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (parseFloat(cs.opacity) < 0.99) {
      out.push({ i, opacity: cs.opacity, top: Math.round(r.top), h: Math.round(r.height) });
    }
  });
  return out;
});

const stats = await page.evaluate(() =>
  [...document.querySelectorAll('dd')].slice(0, 4).map(d => d.textContent.trim())
);

console.log(JSON.stringify({ hiddenSections: hidden, firstStats: stats }, null, 1));

await page.screenshot({ path: 'shot-scrolled.png' });
await browser.close();
