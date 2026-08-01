import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  Instagram,
  Send as TelegramIcon,
  Youtube,
  Facebook,
  MessageCircle,
  Music,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageType, SocialLink } from '../types';
import { Logo } from './Logo';

const SOCIAL_ICONS: Record<SocialLink['platform'], React.ComponentType<{ size?: number; className?: string }>> = {
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

const NAV_LINKS: { label: string; page: PageType }[] = [
  { label: 'Mahsulotlar katalogi', page: 'products' },
  { label: 'Xizmatlar', page: 'services' },
  { label: 'Biz haqimizda', page: 'about' },
  { label: 'Maqolalar', page: 'blog' },
  { label: 'Savol-javob', page: 'faq' },
  { label: "Bogʻlanish", page: 'contact' }
];

export const Footer: React.FC = () => {
  const { setActivePage, setIsQuoteModalOpen, siteSettings, productsList } = useApp();

  const enabledSocials = siteSettings.socials.filter(s => s.enabled && s.url);
  const tel = `tel:${siteSettings.phone.replace(/\s/g, '')}`;

  // Built from the live catalog so it can never advertise a machine we removed.
  const machineLinks = productsList.slice(0, 6);

  return (
    <footer className="bg-[#071531] text-slate-300">

      {/* -------------------------------- CTA band ------------------------- */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Qaysi mashina kerakligini bilmayapsizmi?
            </h2>
            <p className="text-sm text-slate-400 max-w-xl">
              Obyektingiz maydoni va ish rejimini ayting — mos modelni tanlab, narxini
              hisoblab beramiz.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 shrink-0">
            <button onClick={() => setIsQuoteModalOpen(true)} className="btn-primary px-6 py-4">
              <FileText size={15} />
              Taklif olish
            </button>
            <a
              href={tel}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg text-xs font-bold text-white bg-white/10 border border-white/20 hover:bg-white/15 transition-colors duration-200"
            >
              <Phone size={15} />
              <span className="tabular">{siteSettings.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ------------------------------- link grid ------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12">

        {/* Brand + contact */}
        <div className="lg:col-span-5 space-y-6">
          <button
            onClick={() => setActivePage('home')}
            className="flex items-center gap-2 cursor-pointer"
          >
            {siteSettings.logoUrl ? (
              <img width={160} height={44} loading="lazy" decoding="async"
                src={siteSettings.logoUrl}
                alt={siteSettings.brandName}
                className="h-11 w-auto object-contain"
              />
            ) : (
              <Logo tone="dark" />
            )}
          </button>

          <p className="text-sm text-slate-400 max-w-md">
            {siteSettings.aboutShort}
          </p>

          <address className="not-italic space-y-4 text-sm">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-blue-600 shrink-0 mt-1" />
              <span className="text-slate-300">
                {siteSettings.address}, {siteSettings.city}
              </span>
            </div>

            <a href={tel} className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={16} className="text-blue-600 shrink-0" />
              <span className="text-slate-300 tabular">
                {siteSettings.phone}
                {siteSettings.phoneSecondary && ` / ${siteSettings.phoneSecondary}`}
              </span>
            </a>

            {/* Only rendered once a real address is configured in the admin panel. */}
            {siteSettings.email && (
              <a
                href={`mailto:${siteSettings.email}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail size={16} className="text-blue-600 shrink-0" />
                <span className="text-slate-300">{siteSettings.email}</span>
              </a>
            )}

            <div className="flex items-start gap-2">
              <Clock size={16} className="text-blue-600 shrink-0 mt-1" />
              <span className="text-slate-400">{siteSettings.workingHours}</span>
            </div>
          </address>

          {enabledSocials.length > 0 && (
            <div className="flex items-center gap-2 pt-1">
              {enabledSocials.map(s => {
                const Icon = SOCIAL_ICONS[s.platform] || ChevronRight;
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label}
                    aria-label={s.label}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-blue-600 hover:border-blue-600 hover:text-white flex items-center justify-center transition-colors duration-200"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="lg:col-span-3">
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 mb-4">
            Sahifalar
          </h3>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map(link => (
              <li key={link.page}>
                <button
                  onClick={() => setActivePage(link.page)}
                  className="text-slate-400 hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Machines — generated from the catalog, never hardcoded */}
        <div className="lg:col-span-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 mb-4">
            Texnika
          </h3>
          <ul className="space-y-2 text-sm">
            {machineLinks.map(p => (
              <li key={p.id}>
                <button
                  onClick={() => { setActivePage('products'); }}
                  className="text-slate-400 hover:text-blue-400 transition-colors cursor-pointer text-left line-clamp-1"
                >
                  {p.name}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => setActivePage('products')}
                className="text-blue-400 hover:text-blue-300 font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                Barchasi <ChevronRight size={13} />
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* ------------------------------- bottom bar ------------------------ */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{siteSettings.copyrightText}</p>
          <button
            onClick={() => setActivePage('admin')}
            className="hover:text-slate-300 transition-colors cursor-pointer"
          >
            Admin
          </button>
        </div>
      </div>
    </footer>
  );
};
