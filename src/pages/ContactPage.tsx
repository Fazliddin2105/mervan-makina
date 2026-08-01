import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Building2, Instagram, Youtube, Facebook, Music, Send as TelegramIcon, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { buildLeadMessage, deliverLead } from '../lib/leadDelivery';
import { SocialLink } from '../types';
import { PageBanner } from '../components/PageBanner';

const SOCIAL_ICONS: Record<SocialLink['platform'], React.ComponentType<{ size?: number }>> = {
  instagram: Instagram,
  telegram: TelegramIcon,
  youtube: Youtube,
  facebook: Facebook,
  whatsapp: MessageCircle,
  tiktok: Music,
  linkedin: Facebook,
  twitter: TelegramIcon,
  other: ChevronRight
};

const SOCIAL_COLORS: Record<SocialLink['platform'], string> = {
  instagram: 'from-pink-500 to-blue-600',
  telegram: 'bg-sky-500 hover:bg-sky-600',
  youtube: 'bg-red-600 hover:bg-red-700',
  facebook: 'bg-blue-600 hover:bg-blue-700',
  whatsapp: 'bg-emerald-500 hover:bg-emerald-600',
  tiktok: 'bg-slate-900 hover:bg-black',
  linkedin: 'bg-blue-700 hover:bg-blue-800',
  twitter: 'bg-slate-800 hover:bg-black',
  other: 'bg-slate-500 hover:bg-slate-600'
};

export const ContactPage: React.FC = () => {
  const { showToast, siteSettings } = useApp();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || sending) return;

    setSending(true);
    const telegram = siteSettings.socials.find(s => s.platform === 'telegram' && s.enabled && s.url)?.url;
    const result = await deliverLead(
      buildLeadMessage('SAYTDAN YANGI MUROJAAT', [
        { label: 'Ism', value: name },
        { label: 'Kompaniya', value: company },
        { label: 'Telefon', value: phone },
        { label: 'Xabar', value: message }
      ]),
      telegram
    );
    setSending(false);

    if (result === 'failed') {
      showToast(`Xabarni yuborib boʻlmadi. Iltimos, ${siteSettings.phone} raqamiga qoʻngʻiroq qiling.`);
      return;
    }

    showToast(
      result === 'sent'
        ? 'Murojaatingiz yuborildi. Tez orada bogʻlanamiz.'
        : 'Xabar matni nusxalandi va Telegram ochildi — endi yuborish tugmasini bosing.'
    );
    // Only clear the form once the lead has actually left the page.
    setName('');
    setCompany('');
    setPhone('');
    setMessage('');
  };

  const enabledSocials = siteSettings.socials.filter(s => s.enabled);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-sans space-y-12">

      {/* Banner */}
      <PageBanner
        eyebrow={`${siteSettings.brandName} — Bogʻlanish`}
        title="Biz bilan bogʻlaning"
        subtitle={siteSettings.aboutShort}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Info & Form Left */}
        <div className="lg:col-span-6 space-y-8">

          <div className="surface p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-[#0B1D3F]">Aloqa Maʼlumotlari</h2>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0B1D3F] block text-sm">Manzil</span>
                  <span>{siteSettings.address}, {siteSettings.city}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={20} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0B1D3F] block text-sm">Telefon</span>
                  <span className="tabular">{siteSettings.phone}{siteSettings.phoneSecondary && ` / ${siteSettings.phoneSecondary}`}</span>
                </div>
              </div>

              {siteSettings.email && (
                <div className="flex items-start gap-3">
                  <Mail size={20} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#0B1D3F] block text-sm">Email</span>
                    <span>{siteSettings.email}{siteSettings.emailSecondary && ` / ${siteSettings.emailSecondary}`}</span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Clock size={20} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0B1D3F] block text-sm">Ish Vaqti</span>
                  <span className="tabular">{siteSettings.workingHours}</span>
                </div>
              </div>
            </div>

            {/* Social Media Icons */}
            {enabledSocials.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <p className="text-xs font-bold text-[#0B1D3F] uppercase tracking-wider">Ijtimoiy tarmoqlarda kuzatib boring</p>
                <div className="flex flex-wrap gap-2">
                  {enabledSocials.map(s => {
                    const Icon = SOCIAL_ICONS[s.platform] || ChevronRight;
                    const colorCls = SOCIAL_COLORS[s.platform] || SOCIAL_COLORS.other;
                    const isGradient = colorCls.includes('from-');
                    return (
                      <a
                        key={s.id}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${isGradient ? 'bg-gradient-to-br ' + colorCls : colorCls} text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all hover:scale-105`}
                      >
                        <Icon size={16} />
                        <span>{s.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Form */}
          <form onSubmit={handleSubmit} className="surface p-6 sm:p-8 space-y-4 text-xs">
            <h3 className="text-base font-bold text-[#0B1D3F]">Tezkor Xabar Yuborish</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Ismingiz *</label>
                <input
                  type="text"
                  required
                  placeholder="Ismingizni yozing"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Telefon raqamingiz *</label>
                <input
                  type="tel"
                  required
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Kompaniya / Tashkilot</label>
              <input
                type="text"
                placeholder="Kompaniya nomi"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Xabar / Talab</label>
              <textarea
                rows={3}
                placeholder="Qanday mahsulot va qancha miqdorda kerak..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              <Send size={15} /> Xabar Yuborish
            </button>
          </form>

        </div>

        {/* Map & location card */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between text-white space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Joylashuv</span>
              <h3 className="font-bold text-xl">{siteSettings.brandName} — {siteSettings.city}</h3>
            </div>

            {siteSettings.mapEmbedUrl ? (
              <div className="relative h-80 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
                <iframe
                  src={siteSettings.mapEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Joylashuv xaritasi"
                />
              </div>
            ) : (
              <div className="relative h-80 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 flex items-center justify-center p-6 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                <div className="relative z-10 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                    <Building2 size={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{siteSettings.address}</h4>
                    <p className="text-xs text-slate-300 mt-1">{siteSettings.city}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs text-slate-300 flex items-center justify-between">
              <span className="tabular">{siteSettings.workingHours}</span>
              <span className="text-blue-400 font-bold">Bugun ochiq</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
