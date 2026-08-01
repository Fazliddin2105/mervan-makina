import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Clock,
  Search,
  Heart,
  GitCompare,
  ShoppingBag,
  User,
  Menu,
  X,
  Globe,
  DollarSign,
  ChevronDown,
  ShieldAlert,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language, Currency, PageType } from '../types';
import { Logo } from './Logo';
import { useScrolled } from '../hooks/useScrolled';

export const Header: React.FC = () => {
  const {
    activePage,
    setActivePage,
    language,
    setLanguage,
    currency,
    setCurrency,
    cartCount,
    wishlist,
    compareList,
    user,
    logout,
    setIsQuoteModalOpen,
    setIsSearchModalOpen,
    siteSettings
  } = useApp();

  const scrolled = useScrolled();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const navItems: { label: string; page: PageType }[] = [
    { label: 'Bosh sahifa', page: 'home' },
    { label: 'Mahsulotlar', page: 'products' },
    { label: 'Xizmatlar', page: 'services' },
    { label: 'Biz haqimizda', page: 'about' },
    { label: 'Blog', page: 'blog' },
    { label: 'Aloqa', page: 'contact' },
    { label: 'Savol-javob', page: 'faq' }
  ];

  const tel = `tel:${siteSettings.phone.replace(/\s/g, '')}`;

  /** Dark icon button with an optional count bubble. */
  const IconAction: React.FC<{
    label: string;
    count?: number;
    accent?: 'orange' | 'rose';
    onClick: () => void;
    className?: string;
    children: React.ReactNode;
  }> = ({ label, count = 0, accent = 'orange', onClick, className = '', children }) => (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`relative flex items-center justify-center w-10 h-10 rounded-xl text-slate-300
                  bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white
                  transition-colors duration-200 cursor-pointer ${className}`}
    >
      {children}
      {count > 0 && (
        <span
          className={`absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full text-[10px] font-bold
                      flex items-center justify-center text-white tabular ring-2 ring-[#0B1D3F]
                      ${accent === 'rose' ? 'bg-rose-500' : 'bg-blue-600'}`}
        >
          {count}
        </span>
      )}
    </button>
  );

  return (
    <header className="sticky top-0 z-40 w-full">

      {/* ------------------------------- utility bar ------------------------- */}
      <div
        className={`bg-[#071531] text-slate-400 text-[11px] border-b border-white/5 overflow-hidden
                    transition-[height,opacity] duration-300 ease-out ${scrolled ? 'h-0 opacity-0' : 'h-9 opacity-100'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between gap-4">

          <div className="flex items-center gap-5 min-w-0">
            <a href={tel} className="flex items-center gap-1.5 hover:text-white transition-colors shrink-0">
              <Phone size={12} className="text-blue-600" />
              <span className="font-medium text-slate-300 tabular">{siteSettings.phone}</span>
            </a>

            {/* Rendered only when a real address is configured. */}
            {siteSettings.email && (
              <a
                href={`mailto:${siteSettings.email}`}
                className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Mail size={12} className="text-blue-600" />
                <span>{siteSettings.email}</span>
              </a>
            )}

            <span className="hidden lg:flex items-center gap-1.5 truncate">
              <Clock size={12} />
              <span className="truncate">{siteSettings.workingHours}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <label className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
              <Globe size={12} />
              <span className="sr-only">Til</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent focus:outline-none cursor-pointer text-[11px] text-slate-300"
              >
                <option value="UZ" className="bg-[#0B1D3F] text-white">O'zbekcha</option>
                <option value="EN" className="bg-[#0B1D3F] text-white">English</option>
                <option value="RU" className="bg-[#0B1D3F] text-white">Русский</option>
              </select>
            </label>

            <span className="w-px h-3 bg-white/10" />

            <label className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
              <DollarSign size={12} />
              <span className="sr-only">Valyuta</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-transparent focus:outline-none cursor-pointer text-[11px] text-slate-300"
              >
                <option value="UZS" className="bg-[#0B1D3F] text-white">UZS</option>
                <option value="USD" className="bg-[#0B1D3F] text-white">USD</option>
                <option value="EUR" className="bg-[#0B1D3F] text-white">EUR</option>
              </select>
            </label>

            <span className="w-px h-3 bg-white/10 hidden sm:block" />

            {user ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                >
                  <User size={12} className="text-blue-600" />
                  <span className="max-w-[110px] truncate text-slate-300">{user.name}</span>
                  <ChevronDown size={11} />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#0B1D3F] border border-white/10 rounded-xl shadow-2xl py-1.5 z-50 text-xs overflow-hidden">
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="font-semibold text-white truncate">{user.name}</p>
                      {user.company && <p className="text-slate-400 text-[10px] truncate">{user.company}</p>}
                    </div>
                    <button
                      onClick={() => { setActivePage('dashboard'); setIsUserDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-slate-300 hover:bg-white/5 hover:text-blue-400 flex items-center gap-2 cursor-pointer"
                    >
                      <User size={13} /> Mijoz kabineti
                    </button>
                    {user.role === 'admin' && (
                      <button
                        onClick={() => { setActivePage('admin'); setIsUserDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 text-slate-300 hover:bg-white/5 hover:text-blue-400 flex items-center gap-2 cursor-pointer"
                      >
                        <ShieldAlert size={13} className="text-blue-400" /> Admin panel
                      </button>
                    )}
                    <button
                      onClick={() => { logout(); setIsUserDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-rose-400 hover:bg-white/5 flex items-center gap-2 border-t border-white/10 cursor-pointer"
                    >
                      Chiqish
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setActivePage('login')}
                className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              >
                <User size={12} /> Kirish
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --------------------------------- navbar ---------------------------- */}
      <nav
        className={`bg-[#0B1D3F]/95 backdrop-blur-md border-b border-white/10 text-white
                    transition-shadow duration-300 ${scrolled ? 'shadow-lg shadow-black/25' : ''}`}
      >
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-6
                      transition-[height] duration-300 ease-out ${scrolled ? 'h-[58px]' : 'h-[68px]'}`}
        >

          {/* Wordmark */}
          <button
            onClick={() => setActivePage('home')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            {siteSettings.logoUrl ? (
              <img
                src={siteSettings.logoUrl}
                alt={siteSettings.brandName}
                className="h-10 w-auto object-contain"
              />
            ) : (
              <Logo tone="dark" />
            )}
          </button>

          {/* Primary navigation */}
          <div className="hidden lg:flex items-center gap-1 flex-1">
            {navItems.map((item) => {
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => setActivePage(item.page)}
                  className={`relative px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-200 cursor-pointer
                    ${isActive ? 'text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute left-3 right-3 -bottom-[1px] h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto lg:ml-0">
            <IconAction label="Qidirish" onClick={() => setIsSearchModalOpen(true)}>
              <Search size={17} />
            </IconAction>

            <IconAction
              label="Solishtirish"
              count={compareList.length}
              onClick={() => setActivePage('compare')}
              className="hidden sm:flex"
            >
              <GitCompare size={17} />
            </IconAction>

            <IconAction
              label="Saqlanganlar"
              count={wishlist.length}
              accent="rose"
              onClick={() => setActivePage('wishlist')}
              className="hidden sm:flex"
            >
              <Heart size={17} />
            </IconAction>

            <IconAction label="Savat" count={cartCount} onClick={() => setActivePage('cart')}>
              <ShoppingBag size={17} className="text-blue-400" />
            </IconAction>

            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="btn-primary hidden md:inline-flex px-4 py-2.5 ml-1"
            >
              <FileText size={15} />
              Taklif olish
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menyu"
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:text-white cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ----------------------------- mobile drawer ----------------------- */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#071531] border-t border-white/10 px-4 py-4 space-y-4">
            <nav className="flex flex-col">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => { setActivePage(item.page); setIsMobileMenuOpen(false); }}
                  className={`text-left py-3 px-3 rounded-lg text-sm transition-colors cursor-pointer
                    ${activePage === item.page
                      ? 'bg-blue-600/15 text-blue-400 font-semibold'
                      : 'text-slate-300 hover:bg-white/5'}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 text-xs">
              <button
                onClick={() => { setActivePage('wishlist'); setIsMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-white/5 text-slate-300 cursor-pointer"
              >
                <Heart size={14} /> Saqlanganlar <span className="tabular">({wishlist.length})</span>
              </button>
              <button
                onClick={() => { setActivePage('compare'); setIsMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-white/5 text-slate-300 cursor-pointer"
              >
                <GitCompare size={14} /> Solishtirish <span className="tabular">({compareList.length})</span>
              </button>
            </div>

            <button
              onClick={() => { setIsQuoteModalOpen(true); setIsMobileMenuOpen(false); }}
              className="btn-primary w-full py-3"
            >
              <FileText size={16} /> Tijorat taklifi olish
            </button>

            <a href={tel} className="btn-secondary w-full py-3">
              <Phone size={16} /> <span className="tabular">{siteSettings.phone}</span>
            </a>

            {!user && (
              <button
                onClick={() => { setActivePage('login'); setIsMobileMenuOpen(false); }}
                className="w-full text-center text-xs text-slate-400 py-1 cursor-pointer"
              >
                Kabinetga kirish
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};
