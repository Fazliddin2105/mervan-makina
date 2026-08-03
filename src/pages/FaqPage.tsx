import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/mockData';
import { Search, ChevronDown, HelpCircle, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageBanner } from '../components/PageBanner';

/**
 * Opens Telegram with the question already written out.
 *
 * The company's Telegram link is a phone invite (t.me/+998…), and an invite
 * link cannot carry a ?text= payload — only bot and username links can. So the
 * share sheet is used instead: it is the one route that genuinely arrives with
 * the text already typed, and the customer picks the chat in one tap.
 */
const telegramAskUrl = (question: string, siteUrl: string): string => {
  const body = `Savol: ${question}`;
  return `https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(body)}`;
};

export const FaqPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);
  const [activeCat, setActiveCat] = useState<string>('Barchasi');

  const filtered = FAQ_ITEMS.filter(f => {
    if (activeCat !== 'Barchasi' && f.category !== activeCat) return false;
    if (query.trim()) {
      return (
        f.question.toLowerCase().includes(query.toLowerCase()) ||
        f.answer.toLowerCase().includes(query.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-sans space-y-12">

      <PageBanner
        eyebrow="YORDAM MARKAZI"
        title="Koʻp soʻraladigan savollar"
        subtitle="Kafolat, ehtiyot qismlar, yetkazib berish, lizing va texnik xizmat boʻyicha koʻp soʻraladigan savollarga javoblar."
      >
        {/* Search Bar */}
        <div className="max-w-md mx-auto sm:mx-0 relative">
          <input
            type="text"
            placeholder="Savollarni qidiring (masalan: kafolat, litiy batareya, ehtiyot qismlar)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-12 pr-4 py-4 text-xs text-white placeholder-slate-400 focus:border-blue-600"
          />
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </PageBanner>

      {/* Categories Switcher */}
      <div className="flex flex-wrap justify-center gap-2 text-xs">
        {['Barchasi', 'Uskunalar', 'Kafolat', 'Yetkazib berish', 'Servis va Ijara', 'Lizing va Toʻlov'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
              activeCat === cat ? 'bg-[#0B1D3F] text-white shadow' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="max-w-3xl mx-auto space-y-4">
        {filtered.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`surface overflow-hidden transition-colors duration-200 ${
                isOpen ? 'border-blue-200' : ''
              }`}
            >
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                aria-expanded={isOpen}
                className="w-full text-left p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <HelpCircle
                    size={18}
                    className={`shrink-0 transition-colors ${isOpen ? 'text-blue-600' : 'text-slate-400'}`}
                  />
                  <span className="font-bold text-[#0B1D3F] text-sm">{faq.question}</span>
                </div>
                <ChevronDown
                  size={18}
                  className={`shrink-0 transition-transform duration-300 ease-out ${
                    isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* grid-template-rows animates from 0fr to 1fr, which lets the
                  panel ease open to its natural height without hardcoding a
                  max-height that would clip long answers. */}
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 pt-4 border-t border-slate-100 bg-slate-50/50 space-y-4">
                    <p className="text-xs text-slate-600 max-w-none">{faq.answer}</p>

                    <a
                      href={telegramAskUrl(faq.question, window.location.origin)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors duration-200"
                    >
                      <Send size={14} />
                      Shu savolni yuborish
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
