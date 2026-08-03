import { chromium } from 'playwright';
import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Renders the commercial offer to a real PDF and a PNG so the layout can be
 * checked without clicking through the modal by hand.
 *
 * The previous export wrote a .txt file named "PDF"; this exists so that claim
 * is never made again without looking at the output.
 */

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'quotepdf-'));
const bundle = path.join(tmp, 'quotePdf.mjs');

await build({
  entryPoints: ['src/lib/quotePdf.ts'],
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  outfile: bundle,
  logLevel: 'error'
});

const { buildHtml } = await import('file://' + bundle.replace(/\\/g, '/'));

const money = (usd) =>
  new Intl.NumberFormat('uz-UZ').format(Math.round(usd * 12600)) + ' soʻm';

const html = buildHtml({
  settings: {
    brandName: 'Mervan Makina',
    address: 'Yangi Sergeli koʻchasi, 35-uy',
    city: 'Toshkent',
    phone: '+998 91 071 87 57',
    email: ''
  },
  contactName: 'Jasur Saidov',
  phone: '+998 90 123 45 67',
  facilityType: 'Logistika ombori',
  items: [
    { product: { name: 'Pol yuvish mashinasi MK-3', model: 'MK-3', priceUSD: 4298.30714 }, quantity: 2 },
    { product: { name: 'Koʻcha supurish mashinasi MK-7', model: 'MK-7', priceUSD: 11500 }, quantity: 1 }
  ],
  formatPrice: money
});

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });
await page.setContent(html, { waitUntil: 'load' });

const out = process.argv[2] || tmp;
fs.mkdirSync(out, { recursive: true });
await page.pdf({ path: path.join(out, 'taklif.pdf'), format: 'A4', printBackground: true });
await page.screenshot({ path: path.join(out, 'taklif.png'), fullPage: true });
await browser.close();

const size = fs.statSync(path.join(out, 'taklif.pdf')).size;
const head = fs.readFileSync(path.join(out, 'taklif.pdf')).subarray(0, 5).toString('latin1');
console.log('PDF:', path.join(out, 'taklif.pdf'));
console.log('hajmi:', size, 'bayt');
console.log('sarlavha:', JSON.stringify(head), head === '%PDF-' ? '-> haqiqiy PDF' : '-> PDF EMAS');
