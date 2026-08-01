import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, MessageCircle, ChevronUp, Phone, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * Contact launcher.
 *
 * Previously three stacked circles sat permanently over the page and covered
 * the hero's own call-to-action on phones. It is now a single button that
 * expands on demand, so nothing is obscured until the visitor asks for it.
 */
export const FloatingActions: React.FC = () => {
  const { siteSettings } = useApp();
  const [open, setOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close on outside click and on Escape, the way a menu is expected to behave.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Driven by the admin panel rather than hardcoded, so correcting a channel
  // there actually updates these buttons.
  const findSocial = (platform: string) =>
    siteSettings.socials.find(s => s.platform === platform && s.enabled && s.url);
  const telegram = findSocial('telegram');
  const whatsapp = findSocial('whatsapp');

  const channels = [
    telegram && {
      key: 'tg',
      href: telegram.url,
      label: 'Telegram',
      icon: MessageCircle,
      tone: 'bg-sky-500 hover:bg-sky-600'
    },
    whatsapp && {
      key: 'wa',
      href: whatsapp.url,
      label: 'WhatsApp',
      icon: MessageSquare,
      tone: 'bg-emerald-500 hover:bg-emerald-600'
    },
    {
      key: 'tel',
      href: `tel:${siteSettings.phone.replace(/\s/g, '')}`,
      label: siteSettings.phone,
      icon: Phone,
      tone: 'bg-blue-600 hover:bg-blue-700'
    }
  ].filter(Boolean) as { key: string; href: string; label: string; icon: typeof Phone; tone: string }[];

  return (
    <div
      ref={wrapRef}
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2.5"
    >
      {showBackToTop && !open && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Yuqoriga"
          className="w-9 h-9 rounded-full bg-[#0B1D3F]/85 backdrop-blur-sm text-white border border-white/15
                     hover:bg-[#12305F] flex items-center justify-center transition-colors cursor-pointer"
        >
          <ChevronUp size={17} />
        </button>
      )}

      {/* Channels, revealed above the trigger */}
      <div
        className={`flex flex-col items-end gap-2 transition-all duration-200 ease-out ${
          open ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-2'
        }`}
      >
        {channels.map(c => {
          const Icon = c.icon;
          return (
            <a
              key={c.key}
              href={c.href}
              target={c.key === 'tel' ? undefined : '_blank'}
              rel="noreferrer"
              className={`${c.tone} flex items-center gap-2.5 h-11 px-4 rounded-full text-white shadow-lg
                          text-xs font-bold whitespace-nowrap transition-colors`}
            >
              <span className="tabular">{c.label}</span>
              <Icon size={17} />
            </a>
          );
        })}
      </div>

      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-label={open ? 'Yopish' : "Bog'lanish"}
        className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-900/30
                   flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
      >
        {open ? <X size={22} /> : <MessageCircle size={23} />}
      </button>
    </div>
  );
};
