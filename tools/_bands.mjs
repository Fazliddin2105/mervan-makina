import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

// Walk down in viewport-sized steps so every Reveal has fired before capture.
const steps = Number(process.argv[2] || 7);
for (let i = 0; i < steps; i++) {
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), i * 820);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `band-${i}.png` });
}

console.log('captured', steps, 'bands');
await browser.close();
