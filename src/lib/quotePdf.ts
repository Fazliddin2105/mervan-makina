import { CartItem, SiteSettings } from '../types';

/**
 * Builds a printable commercial offer and hands it to the browser's print
 * dialog, where "Save as PDF" produces a real PDF file.
 *
 * The previous version wrote a .txt blob and called it a PDF — the customer
 * downloaded something their PDF reader could not open. Generating it through
 * print is the one route that yields a genuine PDF without shipping a PDF
 * library: a Unicode-capable one is around 300 KB, and the Uzbek turned comma
 * (U+02BB) cannot be encoded by the base-14 PDF fonts a small library falls
 * back to.
 *
 * An offscreen iframe is used rather than window.open so no popup blocker can
 * swallow it.
 */

const esc = (v: unknown): string =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export interface QuoteDocument {
  settings: SiteSettings;
  contactName: string;
  phone: string;
  facilityType: string;
  items: CartItem[];
  formatPrice: (usd: number) => string;
}

/** Exported so tools/_quotepdf.mjs can render it without a browser session. */
export const buildHtml = (doc: QuoteDocument): string => {
  const { settings, items, formatPrice } = doc;
  const total = items.reduce((acc, i) => acc + i.product.priceUSD * i.quantity, 0);
  const today = new Intl.DateTimeFormat('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date());

  const rows = items
    .map(
      (i, n) => `
        <tr>
          <td class="num">${n + 1}</td>
          <td>
            <div class="name">${esc(i.product.name)}</div>
            <div class="model">${esc(i.product.model)}</div>
          </td>
          <td class="num">${i.quantity}</td>
          <td class="num">${esc(formatPrice(i.product.priceUSD))}</td>
          <td class="num strong">${esc(formatPrice(i.product.priceUSD * i.quantity))}</td>
        </tr>`
    )
    .join('');

  return `<!doctype html>
<html lang="uz"><head><meta charset="utf-8">
<title>Tijorat taklifi — ${esc(settings.brandName)}</title>
<style>
  @page { size: A4; margin: 16mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif;
         color: #0B1D3F; font-size: 11pt; line-height: 1.5; margin: 0; }
  .head { display: flex; justify-content: space-between; gap: 24px;
          border-bottom: 3px solid #0B1D3F; padding-bottom: 12px; }
  .brand { font-size: 20pt; font-weight: 800; letter-spacing: -0.02em; }
  .brand span { color: #2563EB; }
  .meta { font-size: 9pt; color: #475569; text-align: right; white-space: pre-line; }
  h1 { font-size: 14pt; margin: 24px 0 4px; }
  .sub { font-size: 9pt; color: #64748B; margin: 0 0 20px; }
  .who { background: #F4F6F8; border: 1px solid #DFE4EA; border-radius: 6px;
         padding: 12px 16px; font-size: 10pt; margin-bottom: 20px; }
  .who div { display: flex; gap: 8px; }
  .who b { min-width: 130px; color: #475569; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; font-size: 10pt; }
  th { text-align: left; background: #0B1D3F; color: #fff; padding: 8px 10px;
       font-size: 8.5pt; text-transform: uppercase; letter-spacing: 0.06em; }
  td { padding: 10px; border-bottom: 1px solid #DFE4EA; vertical-align: top; }
  .num { text-align: right; white-space: nowrap;
         font-variant-numeric: tabular-nums; }
  th.num { text-align: right; }
  .name { font-weight: 700; }
  .model { font-size: 8.5pt; color: #64748B; }
  .strong { font-weight: 700; }
  .total { display: flex; justify-content: flex-end; gap: 24px;
           margin-top: 14px; font-size: 13pt; font-weight: 800; }
  .total .val { color: #2563EB; font-variant-numeric: tabular-nums; }
  .note { margin-top: 28px; font-size: 8.5pt; color: #64748B;
          border-top: 1px solid #DFE4EA; padding-top: 12px; }
</style></head>
<body>
  <div class="head">
    <div>
      <div class="brand">MERVAN <span>MAKINA</span></div>
      <div class="meta" style="text-align:left">Koʻcha supuruvchi va pol yuvuvchi mashinalar ishlab chiqaruvchi zavod</div>
    </div>
    <div class="meta">${esc(settings.address)}, ${esc(settings.city)}
Tel: ${esc(settings.phone)}${settings.email ? '\n' + esc(settings.email) : ''}</div>
  </div>

  <h1>Tijorat taklifi</h1>
  <p class="sub">Sana: ${esc(today)}</p>

  <div class="who">
    <div><b>Mijoz:</b><span>${esc(doc.contactName) || '—'}</span></div>
    <div><b>Telefon:</b><span>${esc(doc.phone) || '—'}</span></div>
    <div><b>Obyekt turi:</b><span>${esc(doc.facilityType) || '—'}</span></div>
  </div>

  <table>
    <thead><tr>
      <th class="num">#</th><th>Nomi</th><th class="num">Soni</th>
      <th class="num">Narxi</th><th class="num">Summa</th>
    </tr></thead>
    <tbody>${rows || '<tr><td colspan="5">Texnika tanlanmagan</td></tr>'}</tbody>
  </table>

  <div class="total"><span>Jami:</span><span class="val">${esc(formatPrice(total))}</span></div>

  <p class="note">
    Ushbu hujjat dastlabki hisob-kitob boʻlib, rasmiy shartnoma emas. Yakuniy
    narx, yetkazib berish muddati va kafolat shartlari kelishuvdan soʻng
    belgilanadi. Narxlar saytda koʻrsatilgan kunga tegishli.
  </p>
</body></html>`;
};

export const printQuote = (doc: QuoteDocument): void => {
  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
  document.body.appendChild(frame);

  const win = frame.contentWindow;
  if (!win) {
    frame.remove();
    return;
  }

  win.document.open();
  win.document.write(buildHtml(doc));
  win.document.close();

  // Give the frame a tick to lay the document out; printing an empty frame
  // is the classic failure here.
  const run = () => {
    win.focus();
    win.print();
    // Safari fires print synchronously, Chrome after the dialog closes; a
    // delayed removal covers both without leaving the node behind.
    setTimeout(() => frame.remove(), 1000);
  };

  if (win.document.readyState === 'complete') run();
  else win.addEventListener('load', run, { once: true });
};
