/**
 * Lead delivery over Telegram, without a backend.
 *
 * This app is a static SPA — there is no server to POST a form to. Writing a
 * submission to localStorage and telling the customer "we'll be in touch" would
 * mean the company never sees it, so every submission is delivered to Telegram.
 *
 * Two modes, in order of preference:
 *
 *  1. BOT (automatic). Set VITE_TELEGRAM_BOT_TOKEN and VITE_TELEGRAM_CHAT_ID in
 *     .env. The lead is POSTed straight to the company's Telegram chat and the
 *     customer never leaves the site.
 *     Trade-off: the token ships inside the JS bundle and can be extracted. A
 *     bot token only allows acting AS that bot, so the realistic damage is
 *     someone spamming your chat — not access to your account. If that matters,
 *     put a one-endpoint proxy in front of it and point sendViaBot at the proxy.
 *
 *  2. DEEP LINK (fallback, no token needed). The message is copied to the
 *     clipboard and the company's Telegram chat is opened so the customer can
 *     paste and send. Telegram has no reliable pre-filled-text link for direct
 *     chats, which is why the clipboard step exists.
 *
 * Either way the UI must only claim success when this resolves 'sent'.
 */

export type DeliveryResult = 'sent' | 'handoff' | 'failed';

export interface LeadField {
  label: string;
  value: string | number | undefined | null;
}

interface TelegramEnv {
  VITE_TELEGRAM_BOT_TOKEN?: string;
  VITE_TELEGRAM_CHAT_ID?: string;
}

// Vite replaces import.meta.env at build time; declaring the shape locally keeps
// this file self-contained rather than depending on the vite/client global.
const env = (import.meta as unknown as { env?: TelegramEnv }).env ?? {};
const BOT_TOKEN = env.VITE_TELEGRAM_BOT_TOKEN;
const CHAT_ID = env.VITE_TELEGRAM_CHAT_ID;

export function isAutoDeliveryConfigured(): boolean {
  return Boolean(BOT_TOKEN && CHAT_ID);
}

export function buildLeadMessage(title: string, fields: LeadField[]): string {
  const lines = fields
    .filter((f) => f.value !== undefined && f.value !== null && String(f.value).trim() !== '')
    .map((f) => `${f.label}: ${f.value}`);
  return [title, ...lines].join('\n');
}

async function sendViaBot(message: string): Promise<boolean> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message, disable_web_page_preview: true }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Clipboard is blocked outside a user gesture or on insecure origins.
    // The chat still opens; the customer just retypes.
  }
}

/**
 * Delivers a lead.
 *  'sent'    — it reached the company's chat, safe to confirm to the customer.
 *  'handoff' — Telegram was opened for the customer to press send themselves.
 *  'failed'  — nothing was delivered; show the phone number instead.
 */
export async function deliverLead(message: string, telegramUrl?: string): Promise<DeliveryResult> {
  if (isAutoDeliveryConfigured() && (await sendViaBot(message))) return 'sent';

  if (telegramUrl) {
    await copyToClipboard(message);
    const win = window.open(telegramUrl, '_blank', 'noopener,noreferrer');
    if (win) return 'handoff';
  }

  return 'failed';
}
