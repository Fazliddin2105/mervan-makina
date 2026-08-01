import { chromium } from 'playwright';
import fs from 'fs';

/**
 * Renders the social preview card to public/og-cover.png.
 *
 * Link previews need a real bitmap at a fixed 1200x630 — an SVG or a page URL
 * will not do, and every crawler caches whatever it fetched first. The card is
 * drawn here from the same mark and palette the site uses, so it stays in sync
 * with the brand rather than being a separate asset someone forgets to update.
 *
 * Re-run after any brand change:  node tools/_ogimage.mjs
 */

const W = 1200;
const H = 630;

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,400..900&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${W}px; height: ${H}px;
    background: #0B1D3F;
    font-family: 'Archivo', sans-serif;
    color: #fff;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 96px;
  }
  .wash {
    position: absolute; top: -220px; right: -180px;
    width: 760px; height: 760px; border-radius: 50%;
    background: #2563EB; opacity: .22; filter: blur(150px);
  }
  .wash2 {
    position: absolute; bottom: -260px; left: -200px;
    width: 620px; height: 620px; border-radius: 50%;
    background: #1D4ED8; opacity: .16; filter: blur(140px);
  }
  .row { position: relative; display: flex; align-items: center; gap: 34px; }
  svg { width: 168px; height: 140px; flex: none; }
  .word { font-size: 92px; font-weight: 900; letter-spacing: -.035em; line-height: .9;
          font-variation-settings: 'wdth' 118; }
  .sub  { margin-top: 14px; font-size: 30px; font-weight: 700; letter-spacing: .42em; color: #60A5FA; }
  .rule { margin-top: 20px; height: 5px; width: 100%; border-radius: 99px;
          background: linear-gradient(90deg,#2563EB,#60A5FA); }
  .tag  { position: relative; margin-top: 58px; font-size: 27px; font-weight: 600;
          color: rgba(226,232,240,.82); letter-spacing: -.01em; }
  .meta { position: absolute; left: 96px; bottom: 56px; display: flex; align-items: center; gap: 18px;
          font-size: 22px; font-weight: 700; color: #93B4E8; letter-spacing: .06em; }
  .dot  { width: 6px; height: 6px; border-radius: 50%; background: #2563EB; }
</style>
</head>
<body>
  <div class="wash"></div>
  <div class="wash2"></div>

  <div class="row">
    <svg viewBox="0 0 96 80" aria-hidden="true">
      <defs>
        <linearGradient id="b" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stop-color="#7DB3FF"/>
          <stop offset="55%" stop-color="#3B82F6"/>
          <stop offset="100%" stop-color="#1D4ED8"/>
        </linearGradient>
        <linearGradient id="d" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1E4FA8"/>
          <stop offset="100%" stop-color="#0B1D3F"/>
        </linearGradient>
      </defs>
      <ellipse cx="48" cy="72" rx="42" ry="4" fill="#3B82F6" opacity=".45"/>
      <path d="M15 14a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v22h14a4 4 0 0 1 0 8H20a5 5 0 0 1-5-5V14Z" fill="url(#b)"/>
      <path d="M55 22a4 4 0 0 1 8 0v28h-8V22Z" fill="url(#b)" transform="rotate(9 59 36)"/>
      <path d="M46 16.5a3 3 0 0 1 3-3h18a3 3 0 0 1 0 6H49a3 3 0 0 1-3-3Z" fill="url(#b)" transform="rotate(-24 58 16.5)"/>
      <path d="M12 40h34a7 7 0 0 1 7 7v8a5 5 0 0 1-5 5H17a5 5 0 0 1-5-5V45a5 5 0 0 1 0-5Z" fill="url(#b)"/>
      <rect x="18" y="45" width="17" height="2.5" rx="1.25" fill="#1D4ED8" opacity=".5"/>
      <rect x="18" y="50.5" width="11" height="2.5" rx="1.25" fill="#1D4ED8" opacity=".5"/>
      <circle cx="25" cy="62" r="12" fill="url(#d)"/>
      <circle cx="25" cy="62" r="8.5" fill="none" stroke="#93B4E8" stroke-width="1.6" opacity=".55"/>
      <circle cx="25" cy="62" r="5" fill="#0B1D3F"/>
      <circle cx="25" cy="55.5" r="1.9" fill="#93B4E8"/>
      <ellipse cx="66" cy="66" rx="16" ry="5.5" fill="#1D4ED8"/>
      <ellipse cx="66" cy="63.5" rx="16" ry="5.5" fill="#3B82F6"/>
      <ellipse cx="66" cy="63.5" rx="4" ry="1.5" fill="#0B1D3F" opacity=".55"/>
      <path d="M50 52h14a3 3 0 0 1 0 7H50v-7Z" fill="url(#b)"/>
    </svg>

    <div>
      <div class="word">MERVAN</div>
      <div class="sub">MAKINA</div>
      <div class="rule"></div>
    </div>
  </div>

  <div class="tag">Sanoat tozalash texnikasi &mdash; pol yuvish va koʻcha supurish mashinalari</div>

  <div class="meta">
    <span>TOSHKENT</span><span class="dot"></span><span>SERGELI</span><span class="dot"></span><span>NARXLAR OCHIQ</span>
  </div>
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.waitForTimeout(600); // let the webfont settle before capture
await page.screenshot({ path: 'public/og-cover.png' });
await browser.close();

const kb = (fs.statSync('public/og-cover.png').size / 1024).toFixed(0);
console.log(`public/og-cover.png written — ${W}x${H}, ${kb} KB`);
