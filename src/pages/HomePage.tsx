import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Wrench,
  ChevronRight,
  Building2,
  Box,
  Zap,
  Gauge,
  Tag,
  Layers,
  MapPin,
  BadgeCheck,
  Grid3x3,
  Sparkles,
  Calculator,
  Newspaper,
  PhoneCall,
  Truck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_DATA, SERVICES_DATA, BLOG_POSTS } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { RoiCalculator } from '../components/RoiCalculator';
import { HeroStat } from '../components/HeroStat';
import { Reveal } from '../components/Reveal';
import { HeroBackdrop } from '../components/HeroBackdrop';
import { SplitText } from '../components/SplitText';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { useMagnetic } from '../hooks/useMagnetic';

/** How long each hero machine holds before the carousel advances. */
const HERO_INTERVAL_MS = 5000;

/* --------------------------------------------------------------------------
   SectionHeader
   Six sections were each hand-rolling their own eyebrow + title block, which
   drifted apart on font size, spacing and colour. One component means the
   rhythm of the page is defined in a single place.
   -------------------------------------------------------------------------- */
interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  /** `dark` is for the navy bands, where the light palette would disappear. */
  tone?: 'light' | 'dark';
  /** Right-hand slot for controls (the product filter) instead of a link. */
  trailing?: React.ReactNode;
  /** Editorial index, e.g. 1 renders as "01". Gives the page a spine. */
  index?: number;
  /** Marks the band. Paired with the index so the eye has both a number and
   *  a glyph to navigate by. */
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  action,
  tone = 'light',
  trailing,
  index,
  icon: Icon
}) => {
  const dark = tone === 'dark';

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <span
          className={`inline-flex items-center gap-4 text-xs font-bold uppercase tracking-[0.18em] ${
            dark ? 'text-blue-400' : 'text-blue-700'
          }`}
        >
          {Icon && (
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                dark
                  ? 'bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/25'
                  : 'bg-blue-600/10 text-blue-700 ring-1 ring-blue-600/15'
              }`}
            >
              <Icon size={15} />
            </span>
          )}
          {index !== undefined && (
            <span className={`tabular font-bold ${dark ? 'text-white/25' : 'text-[#0B1D3F]/20'}`}>
              {String(index).padStart(2, '0')}
            </span>
          )}
          <span className={`h-px w-7 ${dark ? 'bg-blue-400' : 'bg-blue-600'}`} />
          {eyebrow}
        </span>

        {/* Heading steps up a size from the previous pass — section titles were
            competing with card titles instead of leading them. */}
        <h2
          className={`mt-4 text-2xl  lg:text-2xl font-bold tracking-[-0.03em] ${
            dark ? 'text-white' : 'text-[#0B1D3F]'
          }`}
        >
          {title}
        </h2>

        {description && (
          <p className={`mt-4 text-sm ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
            {description}
          </p>
        )}
      </div>

      {(trailing || action) && (
        <div>
          {trailing}
          {action && (
            <button
              onClick={action.onClick}
              className={`group inline-flex items-center gap-2 text-left text-xs font-bold
                          transition-colors cursor-pointer ${
                            dark ? 'text-white hover:text-blue-400' : 'text-[#0B1D3F] hover:text-blue-700'
                          }`}
            >
              <span>{action.label}</span>
              <ChevronRight size={15} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const HomePage: React.FC = () => {
  const { productsList, setActivePage, setSelectedProductId, setSelectedCategoryId, setIsQuoteModalOpen, siteSettings, formatPrice } = useApp();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [heroIndex, setHeroIndex] = useState(0);
  // Pauses the carousel while the visitor is reading or interacting with it.
  const [heroPaused, setHeroPaused] = useState(false);
  const magnet = useMagnetic<HTMLButtonElement>(0.28, 10);

  // Six of the ten categories have no products since the invented catalog was
  // removed, and empty "0 ta" cards read as a broken page. Derive the list from
  // the live catalog so it can never show an empty category again, and use a
  // real machine photo instead of stock imagery.
  const stockedCategories = useMemo(() => {
    // Four listings were re-shot and are full-frame; the rest are tighter
    // phone crops. Prefer a good one for the category tile so the card does
    // not open on a close-up of a body panel.
    const WELL_SHOT = new Set([
      'mm-mk-1-sweeper',
      'mm-mk-8-transporter',
      'mm-mk-9-single-disc',
      'mm-mk-10-leaf-vacuum'
    ]);

    return CATEGORIES_DATA.map(category => {
      const products = productsList.filter(p => p.category === category.id && p.images?.length);
      const cover = products.find(p => WELL_SHOT.has(p.id)) ?? products[0];
      return { category, products, cover };
    }).filter(entry => entry.products.length > 0);
  }, [productsList]);

  // The hero showcases real machines from the live catalog. The visitor can
  // step between them, so the first screen already proves there is a range.
  // These four are the only listings whose photography is full-frame and sharp.
  // The rest are lower-resolution phone shots with white framing artefacts, so
  // they stay in the catalog grid where they are shown small.
  const heroPool = useMemo(() => {
    const picked = ['mm-mk-8-transporter', 'mm-mk-1-sweeper', 'mm-mk-10-leaf-vacuum', 'mm-mk-9-single-disc']
      .map(id => productsList.find(p => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p?.images?.length));
    return picked.length > 0 ? picked : productsList.slice(0, 4);
  }, [productsList]);
  const heroProduct = heroPool[Math.min(heroIndex, heroPool.length - 1)];

  // Advance the hero on its own so the range is visible without any input.
  // Skipped entirely when the visitor prefers reduced motion.
  useEffect(() => {
    if (heroPaused || heroPool.length < 2) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const id = window.setInterval(
      () => setHeroIndex(i => (i + 1) % heroPool.length),
      HERO_INTERVAL_MS
    );
    return () => window.clearInterval(id);
  }, [heroPaused, heroPool.length]);

  // Tabs are derived from the catalog rather than hardcoded, so a filter can
  // never be offered for a machine type we do not stock.
  const featuredTabs = [
    { id: 'all', label: 'Barchasi' },
    ...stockedCategories.map(({ category }) => ({ id: category.id, label: category.name }))
  ];

  const filteredProducts = useMemo(
    () =>
      activeTab === 'all'
        ? productsList.slice(0, 6)
        : productsList
            .filter(p => p.category === activeTab || p.machineType.toLowerCase() === activeTab)
            .slice(0, 6),
    [productsList, activeTab]
  );

  return (
    // Vertical rhythm lives on the sections themselves, not on a flat
    // space-y stack, so the navy bands can run edge to edge.
    <div className="font-sans">
      
      {/* ================= HERO SECTION ================= */}
      {/* The type layer spans the full width and crosses over the photograph
          rather than sitting in a column beside it. A scrim under the copy
          keeps it legible where the two overlap. */}
      <section
        className="relative isolate flex min-h-[78vh] lg:min-h-[calc(100vh-104px)] flex-col justify-end overflow-hidden bg-[#071531] text-white"
        onMouseEnter={() => setHeroPaused(true)}
        onMouseLeave={() => setHeroPaused(false)}
      >
        {/* Photograph: full bleed on mobile, anchored right on desktop so the
            machine sits clear of the headline. */}
        <div className="absolute inset-0 lg:left-[34%]">
          <HeroBackdrop products={heroPool} activeIndex={heroIndex} />
        </div>

        {/* Scrim. Two passes: a horizontal one that carries the copy column,
            and a vertical one that seats the rail at the bottom. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, #071531 0%, #071531 26%, rgba(7,21,49,0.72) 46%, rgba(7,21,49,0.18) 70%, rgba(7,21,49,0) 88%)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071531] via-transparent to-[#071531]/45" />
        <div className="absolute inset-0 bg-[#071531]/55 lg:hidden" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-6 lg:pt-16 lg:pb-8">

          <AnimatedLogo className="h-16 sm:h-24 lg:h-32 mb-6 sm:mb-8" />

          <span
            className="rise-in flex items-center gap-4 text-xs font-bold tracking-[0.24em] uppercase text-blue-300"
            style={{ animationDelay: '1900ms' }}
          >
            <span className="h-px w-9 bg-blue-400" />
            <span className="whitespace-nowrap">
              {siteSettings.city} &middot; <span className="tabular">{productsList.length}</span> ta model
            </span>
            <span className="hidden sm:inline">&middot; narxlar ochiq</span>
          </span>

          {/* Deliberately oversized: at these sizes the second and third lines
              run past the scrim and onto the photograph, which is the point. */}
          <h1 className="mt-6 font-bold tracking-[-0.045em] text-3xl">
            <span className="block">
              <SplitText text="Sanoat" delay={2000} />
            </span>
            <span className="block text-blue-400">
              <SplitText text="tozalash" delay={2120} />
            </span>
            <span className="block">
              <SplitText text="texnikasi" delay={2240} />
            </span>
          </h1>

          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <p
              className="rise-in max-w-md text-sm sm:text-base text-slate-300/80"
              style={{ animationDelay: '2380ms' }}
            >
              {siteSettings.heroSubtitle}
            </p>

            <div
              className="rise-in flex flex-wrap items-center gap-4 shrink-0"
              style={{ animationDelay: '2460ms' }}
            >
              <button
                ref={magnet.ref}
                onPointerMove={magnet.onPointerMove}
                onPointerLeave={magnet.onPointerLeave}
                onClick={() => setActivePage('products')}
                className="btn-primary magnetic px-8 py-4 text-xs"
              >
                Katalogni ko&apos;rish
                <ArrowRight size={17} />
              </button>

              <button
                onClick={() => setIsQuoteModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg text-xs font-bold text-white bg-white/10 border border-white/25 backdrop-blur-md hover:bg-white/20 transition-all duration-200 cursor-pointer active:scale-[0.98]"
              >
                <FileText size={17} />
                Narxini so&apos;rash
              </button>
            </div>
          </div>
        </div>

        {/* Rail */}
        <div className="relative z-10 border-t border-white/15 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">

            <div className="min-w-0 lg:flex-1">
              <span className="block text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                {heroProduct?.model}
              </span>
              <button
                onClick={() => {
                  if (!heroProduct) return;
                  setSelectedProductId(heroProduct.id);
                  setActivePage('product-detail');
                }}
                className="group mt-1 flex items-center gap-2 text-left cursor-pointer max-w-full"
              >
                <span className="text-sm sm:text-base font-bold text-white truncate">
                  {heroProduct?.name}
                </span>
                <ArrowRight
                  size={15}
                  className="shrink-0 text-blue-300 transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>

            <dl className="flex items-center gap-6 sm:gap-12 shrink-0 overflow-x-auto lg:ml-auto">
              {[
                { label: 'Unumdorlik', value: heroProduct?.productivity, icon: Gauge },
                { label: 'Kuchlanish', value: heroProduct?.voltage, icon: Zap },
                { label: 'Narxi', value: heroProduct ? formatPrice(heroProduct.priceUSD) : '', icon: Tag }
              ]
                .filter(spec => spec.value && spec.value !== '—')
                .map(spec => {
                  const Icon = spec.icon;
                  return (
                    <div key={spec.label} className="shrink-0">
                      <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400">
                        <Icon size={12} className="text-blue-400" />
                        {spec.label}
                      </dt>
                      <dd className="mt-1 text-sm font-bold text-white tabular whitespace-nowrap">{spec.value}</dd>
                    </div>
                  );
                })}
            </dl>

            {heroPool.length > 1 && (
              <div className="flex items-center gap-2 shrink-0">
                {heroPool.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => setHeroIndex(i)}
                    aria-label={p.name}
                    aria-current={i === heroIndex}
                    className="group relative h-1 w-12 sm:w-16 rounded-full bg-white/20 overflow-hidden cursor-pointer"
                  >
                    {i === heroIndex ? (
                      <span
                        key={'p-' + String(heroIndex) + '-' + String(heroPaused)}
                        className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-blue-400"
                        style={
                          heroPaused
                            ? { transform: 'scaleX(1)' }
                            : { animation: 'hero-progress ' + String(HERO_INTERVAL_MS) + 'ms linear forwards' }
                        }
                      />
                    ) : (
                      <span className="absolute inset-0 rounded-full group-hover:bg-white/30 transition-colors" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= FACTS STRIP — deep navy, tight ================= */}
      <section className="bg-[#071531] border-y border-white/5">
        <dl className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8">
          {[
            { icon: Box, label: 'Texnika modeli', value: productsList.length },
            { icon: Layers, label: 'Texnika toifasi', value: stockedCategories.length },
            { icon: MapPin, label: 'Ombor va ofis', value: siteSettings.city },
            { icon: BadgeCheck, label: 'Narxlar', value: 'Ochiq' }
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-start gap-4">
                <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/15 text-blue-400 ring-1 ring-blue-500/25">
                  <Icon size={17} />
                </span>
                <HeroStat label={stat.label} value={stat.value} />
              </div>
            );
          })}
        </dl>
      </section>

      {/* ================= CATEGORIES GRID — white band ================= */}
      <Reveal as="section" className="bg-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            index={1}
            icon={Grid3x3}
            eyebrow="Toʻliq mahsulotlar katalogi"
            title="Uskuna Kategoriyalarini Tanlang"
          />

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stockedCategories.map(({ category, products, cover }) => (
              <button
                key={category.id}
                onClick={() => { setSelectedCategoryId(category.id); setActivePage('products'); }}
                className="group relative h-64 lg:h-72 rounded-lg overflow-hidden text-left cursor-pointer ring-1 ring-[#0B1D3F]/10 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <img width={800} height={600} loading="lazy" decoding="async"
                  src={cover.images[0]}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Navy wash keeps the white type readable over any photo. */}
                <span className="absolute inset-0 bg-gradient-to-t from-[#071531] via-[#0B1D3F]/80 to-[#0B1D3F]/5" />

                <span className="absolute top-4 right-4 pill bg-white/15 text-white backdrop-blur-sm border border-white/25">
                  <span className="tabular">{products.length}</span> ta
                </span>

                <span className="absolute inset-x-0 bottom-0 p-6 flex flex-col gap-2">
                  <span className="text-base font-bold text-white">
                    {category.name}
                  </span>
                  <span className="text-xs text-slate-300 line-clamp-2">
                    {category.description}
                  </span>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em] text-blue-400">
                    Koʻrish
                    <ChevronRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </span>

                {/* Accent rule wipes in on hover — the only motion the tile needs. */}
                <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-blue-600 transition-transform duration-300 group-hover:scale-x-100" />
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ================= FEATURED PRODUCTS SHOWCASE — canvas band ================= */}
      <Reveal as="section" className="bg-[#F5F7FA] py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            index={2}
            icon={Sparkles}
            eyebrow="Ogʻir sanoat sharoitlari uchun"
            title="Saralangan Sanoat Uskunalari"
            trailing={
              /* Segmented control: one bordered track, the active segment filled. */
              <div className="flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                {featuredTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-lg px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-[#0B1D3F] text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-[#0B1D3F]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            }
          />

          {filteredProducts.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* A filter can legitimately match nothing; an empty grid just looks
               like the page failed to load. */
            <div className="mt-12 surface p-12 sm:p-16 text-center">
              <p className="text-sm text-slate-600">
                Tanlangan filtr boʻyicha model topilmadi.
              </p>
              <button onClick={() => setActiveTab('all')} className="btn-ghost mt-6">
                Barcha saralanganlarni koʻrsatish
              </button>
            </div>
          )}
        </div>
      </Reveal>

      {/* ================= ROI CALCULATOR — white band =================
          RoiCalculator carries its own my-12, so the band padding is reduced
          to keep the gap identical to every other section. */}
      <Reveal as="section" className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RoiCalculator />
        </div>
      </Reveal>

      {/* ================= WHY CHOOSE US — canvas band =================
          Six identical cards read as filler. Split into a fixed header column
          and a hairline-ruled spec table, which is how the trade reads specs. */}
      <Reveal as="section" className="bg-[#F5F7FA] py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12">

          <div className="lg:col-span-4">
            <SectionHeader
            index={3}
            icon={Calculator}
              eyebrow="Ishlash tartibimiz"
              title="Nima uchun bizni tanlashadi?"
              description="Ochiq narx, toʻliq texnik maʼlumot va haqiqiy suratlar — xarid qarorini telefon qilmasdan oldin ham qabul qila olasiz."
            />
          </div>

          <div className="lg:col-span-8">
            <div className="surface overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200">
                {[
                  {
                    icon: FileText,
                    title: "Narxlar ochiq",
                    desc: "Har bir mashinaning narxi saytda koʻrsatilgan. Soʻrov yuborishdan oldin taqqoslab koʻrishingiz mumkin."
                  },
                  {
                    icon: CheckCircle2,
                    title: "Toʻliq texnik maʼlumot",
                    desc: "Kuchlanish, quvvat, bak hajmi, unumdorlik, ogʻirlik — zavod koʻrsatkichlari toʻliq keltirilgan."
                  },
                  {
                    icon: Box,
                    title: "Haqiqiy mahsulot suratlari",
                    desc: "Katalogdagi suratlar — aynan biz sotadigan mashinalarning oʻzi, stok rasm emas."
                  },
                  {
                    icon: Building2,
                    title: "Toshkentda ofis va ombor",
                    desc: `${siteSettings.address}. Mashinani kelib koʻrishingiz mumkin.`
                  },
                  {
                    icon: ShieldCheck,
                    title: "Kafolat",
                    desc: "Kafolat muddati modelga qarab farq qiladi va mahsulot sahifasida koʻrsatilgan."
                  },
                  {
                    icon: Wrench,
                    title: "Servis va ehtiyot qismlar",
                    desc: "Sotilgan texnika boʻyicha sozlash, texnik yordam va ehtiyot qism masalasida bogʻlaning."
                  }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-white p-6 flex gap-4 transition-colors hover:bg-slate-50"
                    >
                      <span className="shrink-0 w-10 h-10 rounded-lg bg-[#0B1D3F] text-blue-400 flex items-center justify-center">
                        <Icon size={18} />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-[#0B1D3F]">{item.title}</h3>
                        <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </Reveal>

      {/* ================= SERVICES PREVIEW — navy band ================= */}
      <Reveal as="section" className="relative overflow-hidden bg-[#071531] py-24 sm:py-32">
        {/* Same drafting grid as the hero, so the dark bands read as a family. */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '64px 64px'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <SectionHeader
            index={4}
            icon={ShieldCheck}
            tone="dark"
            eyebrow="Kafolat va servis"
            title="Korxona Uskunalariga Servis Xizmati va YTXK"
            action={{
              label: "Barcha Xizmatlar va Servis Rejalarini Koʻrish",
              onClick: () => setActivePage('services')
            }}
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES_DATA.slice(0, 3).map((svc) => (
              <div
                key={svc.id}
                className="flex flex-col rounded-lg border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-blue-600/40 hover:bg-white/[0.07]"
              >
                <h3 className="text-base font-bold text-white">{svc.title}</h3>
                <p className="mt-4 text-sm text-slate-300">{svc.summary}</p>

                <ul className="mt-6 space-y-2 border-t border-white/10 pt-6 text-xs text-slate-400">
                  {svc.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="mt-px shrink-0 text-emerald-400" />
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <button
                    onClick={() => setIsQuoteModalOpen(true)}
                    className="w-full rounded-lg border border-white/15 bg-white/5 py-4 text-xs font-bold text-white transition-colors hover:border-blue-600 hover:bg-blue-600 cursor-pointer"
                  >
                    Servis Konsultatsiyasini Olish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ================= BLOG PREVIEW — canvas band ================= */}
      <Reveal as="section" className="bg-[#F5F7FA] py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            index={5}
            icon={Newspaper}
            eyebrow="Maqolalar va qoʻllanmalar"
            title="Soʻnggi Sanoat Tozalash Maqolalari"
            action={{
              label: "Barcha Maqola va Qoʻllanmalarni Oʻqish",
              onClick: () => setActivePage('blog')
            }}
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.id}
                onClick={() => setActivePage('blog')}
                className="surface-interactive group flex flex-col overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img width={800} height={600} loading="lazy" decoding="async"
                    src={post.image}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 pill bg-white/95 text-[#0B1D3F] shadow-sm">
                    {post.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <span className="text-xs text-slate-500">{post.readTime}</span>

                  <h3 className="mt-2 text-sm font-bold text-[#0B1D3F] transition-colors group-hover:text-blue-700">
                    {post.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                    {post.summary}
                  </p>

                  <span className="mt-auto pt-6 inline-flex items-center gap-2 text-xs font-bold text-blue-700">
                    Maqolani Oʻqish
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ================= FINAL QUOTE CTA BANNER — white band =================
          The loudest moment after the hero, and it deliberately echoes it:
          same navy gradient, same accent wash, same drafting grid. */}
      <Reveal as="section" className="bg-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[#071531] via-[#0B1D3F] to-[#12305F] px-6 py-12 sm:px-12 sm:py-16 shadow-lg">

            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full bg-blue-600/25 blur-[140px]" />
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                  backgroundSize: '56px 56px'
                }}
              />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-center">

              <div className="lg:col-span-7 text-center lg:text-left">
                <span className="pill bg-blue-600 text-white">
                  BEPUL OBYEKT AUDITI
                </span>

                <h2 className="mt-4 text-3xl font-bold text-white">
                  Sanoat Tozalash Texnikalaringizni Yangilamoqchimisiz?
                </h2>

                <p className="mt-4 text-sm text-slate-300 max-w-xl mx-auto lg:mx-0">
                  Obyektingizda mashinani jonli sinab koʻrish uchun biz bilan bogʻlaning.
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-4">
                <button
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="btn-primary sm:flex-1 px-6 sm:px-8 py-4 uppercase tracking-wider"
                >
                  Tijorat Taklifi Olish
                </button>

                <a
                  href={`tel:${siteSettings.phone.replace(/\s/g, '')}`}
                  className="sm:flex-1 inline-flex flex-wrap items-center justify-center gap-x-2 rounded-lg border border-white/20 bg-white/10 px-6 sm:px-8 py-4 text-center text-xs font-bold text-white transition-all hover:bg-white/20 active:scale-[0.98] cursor-pointer"
                >
                  <span className="tabular">{siteSettings.phone}</span>
                  <span>ga qoʻngʻiroq qiling</span>
                </a>
              </div>

            </div>
          </div>
        </div>
      </Reveal>

    </div>
  );
};
