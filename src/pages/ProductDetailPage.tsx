import React, { useState } from 'react';
import {
  Star,
  ShoppingBag,
  FileText,
  Heart,
  GitCompare,
  CheckCircle2,
  ShieldCheck,
  Download,
  Play,
  Zap,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  MessageSquare,
  Share2,
  Ruler,
  Droplets
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCTS_DATA } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { useProductSchema } from '../lib/seo';

/* Several products carry "—" in the data for specs that do not apply to that
   machine type. Rendering that at full contrast reads as a rendering fault, so
   placeholder values are detected and de-emphasised instead. */
const hasValue = (value?: string) => {
  const v = (value ?? '').trim();
  return v !== '' && v !== '—' && v !== '-';
};

const KeySpec: React.FC<{
  label: string;
  value: string;
  icon?: React.ReactNode;
}> = ({ label, value, icon }) => {
  const filled = hasValue(value);
  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-2">
      <span className="block text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
        {label}
      </span>
      <span
        className={`mt-1 flex items-center gap-2 text-xs font-bold tabular ${
          filled ? 'text-[#0B1D3F]' : 'text-slate-400'
        }`}
      >
        {filled && icon}
        {filled ? value : '—'}
      </span>
    </div>
  );
};

const TAB_ITEMS = [
  { id: 'specs', label: 'Texnik xususiyatlar' },
  { id: 'desc', label: 'Tavsif va qoʻllanilishi' },
  { id: 'downloads', label: 'Hujjatlar' },
  { id: 'video', label: 'Video' },
  { id: 'reviews', label: 'Sharhlar' }
] as const;

export const ProductDetailPage: React.FC = () => {
  const {
    productsList,
    selectedProductId,
    setSelectedProductId,
    setActivePage,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    isInCompare,
    setQuoteModalProduct,
    setIsQuoteModalOpen,
    showToast,
    siteSettings
  } = useApp();

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'downloads' | 'video' | 'reviews'>('specs');
  const [quantity, setQuantity] = useState(1);

  // New review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewCompany, setReviewCompany] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const product = productsList.find(p => p.id === selectedProductId) || productsList[0];

  useProductSchema(product);

  const isWish = isInWishlist(product.id);
  const isComp = isInCompare(product.id);

  // Accessories for "Frequently Bought Together"
  const accessories = productsList.filter(p => p.category === 'accessories' || p.category === 'cleaning-chemicals').slice(0, 2);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewText) return;
    showToast('Sharhingiz uchun rahmat!');
    setReviewName('');
    setReviewCompany('');
    setReviewText('');
  };

  const reviewCount = product.reviews?.length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-sans space-y-12">

      {/* Breadcrumb & Back */}
      <div className="flex items-center justify-between gap-4 text-xs text-slate-500 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActivePage('products')}
          className="flex items-center gap-2 font-bold text-blue-700 hover:text-blue-800 cursor-pointer shrink-0"
        >
          <ArrowLeft size={14} /> Katalogga qaytish
        </button>
        {/* The full crumb trail is dropped below sm: at 360px it would crush the
            back link. The product name alone carries the same information. */}
        <div className="hidden sm:flex items-center gap-2 min-w-0">
          <span className="shrink-0">Bosh sahifa</span>
          <ChevronRight size={12} className="text-slate-300 shrink-0" />
          <span className="shrink-0">Mahsulotlar</span>
          <ChevronRight size={12} className="text-slate-300 shrink-0" />
          <span className="font-bold text-slate-800 truncate">{product.name}</span>
        </div>
      </div>

      {/* Top Product Hero Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

        {/* Gallery Left (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">

          <div className="relative surface overflow-hidden">
            {/* Soft plate behind the machine so light product shots do not float
                on flat white. */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-slate-100/70" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-slate-200/70" />

            {/* All frames stay mounted and crossfade. Swapping a single <img width={800} height={600}>
                showed a blank beat while the next file decoded, which read as a
                flicker every time a thumbnail was clicked. */}
            <div className="relative h-[300px] sm:h-[400px] lg:h-[460px]">
              {product.images.map((img, i) => (
                <img width={800} height={600}
                  key={img}
                  src={img}
                  alt={i === activeImgIndex ? product.name : ''}
                  aria-hidden={i !== activeImgIndex}
                  decoding="async"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className={`absolute inset-0 h-full w-full object-contain p-6 sm:p-12
                              drop-shadow-[0_18px_28px_rgba(11,29,63,0.14)]
                              transition-opacity duration-500 ease-out
                              ${i === activeImgIndex ? 'opacity-100' : 'opacity-0'}`}
                />
              ))}
            </div>

            <span className="absolute top-4 left-4 pill bg-[#0B1D3F] text-white shadow-sm">
              {product.brand}
            </span>

            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImgIndex(i => (i - 1 + product.images.length) % product.images.length)}
                  aria-label="Oldingi surat"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/95 border border-slate-200 shadow-sm flex items-center justify-center text-[#0B1D3F] hover:bg-white hover:border-slate-300 hover:shadow transition-all cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setActiveImgIndex(i => (i + 1) % product.images.length)}
                  aria-label="Keyingi surat"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/95 border border-slate-200 shadow-sm flex items-center justify-center text-[#0B1D3F] hover:bg-white hover:border-slate-300 hover:shadow transition-all cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>

                <span className="absolute bottom-4 right-4 rounded-xl bg-[#0B1D3F]/90 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
                  <span className="tabular">{activeImgIndex + 1}</span>
                  <span className="text-white/50"> / </span>
                  <span className="tabular text-white/70">{product.images.length}</span>
                </span>
              </>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImgIndex(i)}
                  aria-label={`${i + 1}-surat`}
                  aria-current={activeImgIndex === i}
                  className={`relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-xl p-2 bg-white shrink-0 cursor-pointer border transition-all ${
                    activeImgIndex === i
                      ? 'border-[#0B1D3F] ring-2 ring-blue-600/70 ring-offset-1 ring-offset-[#F5F7FA]'
                      : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
                  }`}
                >
                  <img width={800} height={600} loading="lazy" decoding="async" src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Info Right (5 Cols) — the decision zone.
            Sticky from lg up. A buy panel this tall would otherwise pin its own
            top edge and strand the CTA below the fold on short laptop screens,
            so the panel is capped to the visible area and scrolls internally
            instead of overflowing it. */}
        <div
          className="lg:col-span-5 surface p-6 sm:p-8 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto overscroll-contain"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 transparent' }}
        >

          {/* Identity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                {product.machineType} uskunasi
              </span>
              {product.reviewsCount > 0 && (
                <div className="flex items-center gap-1 text-xs font-bold text-blue-500">
                  <Star size={14} className="fill-blue-400" />
                  <span className="tabular">{product.rating}</span>
                  <span className="tabular text-slate-400">({product.reviewsCount} sharh)</span>
                </div>
              )}
            </div>

            <h1 className="text-3xl xl:text-3xl font-bold text-[#0B1D3F]">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="uppercase tracking-wider">Model</span>
              <span className="h-3 w-px bg-slate-200" />
              <span className="tabular font-bold text-slate-700">{product.model}</span>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-600">
            {product.description}
          </p>

          {/* Key Specs */}
          <div className="mt-6 grid grid-cols-2 gap-2">
            <KeySpec
              label="Kuchlanish"
              value={product.voltage}
              icon={<Zap size={13} className="text-blue-600 shrink-0" />}
            />
            <KeySpec
              label="Unumdorlik"
              value={product.productivity}
              icon={<Sparkles size={13} className="text-blue-600 shrink-0" />}
            />
            <KeySpec
              label="Yuvish kengligi"
              value={product.brushWidth}
              icon={<Ruler size={13} className="text-blue-600 shrink-0" />}
            />
            <KeySpec
              label="Suv baklari"
              value={product.tankCapacity}
              icon={<Droplets size={13} className="text-blue-600 shrink-0" />}
            />
          </div>

          {/* Price — the anchor of the panel */}
          <div className="mt-6 rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-white p-4">
            <span className="block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Narxi
            </span>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              {/* text-2xl at the smallest step: "361 057 800 soʻm" at text-3xl
                  is ~253px against ~256px of usable panel width at 360px. */}
              <span className="tabular text-2xl font-bold tracking-tight text-[#0B1D3F]">
                {formatPrice(product.priceUSD)}
              </span>
              {product.oldPriceUSD && (
                <span className="tabular text-sm font-medium text-slate-400 line-through">
                  {formatPrice(product.oldPriceUSD)}
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-slate-200/70 pt-4">
              {product.inStock ? (
                <>
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-emerald-700">Omborda bor</span>
                </>
              ) : (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-xs font-bold text-amber-700">Buyurtma asosida</span>
                </>
              )}
            </div>
          </div>

          {/* Quantity & Add to Cart / Quote */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1 shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Sonini kamaytirish"
                  className="w-8 h-8 rounded-xl bg-white text-slate-700 font-bold flex items-center justify-center border border-slate-200/80 hover:bg-slate-50 hover:text-[#0B1D3F] transition-colors cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="tabular w-9 text-center text-sm font-bold text-[#0B1D3F]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Sonini oshirish"
                  className="w-8 h-8 rounded-xl bg-white text-slate-700 font-bold flex items-center justify-center border border-slate-200/80 hover:bg-slate-50 hover:text-[#0B1D3F] transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={() => addToCart(product, quantity)}
                className="btn-secondary flex-1 min-w-0 px-4"
              >
                <ShoppingBag size={16} className="shrink-0" />
                <span className="truncate">Savatga qoʻshish</span>
              </button>
            </div>

            <button
              onClick={() => { setQuoteModalProduct(product); setIsQuoteModalOpen(true); }}
              className="btn-primary w-full uppercase tracking-[0.08em]"
            >
              <FileText size={16} className="shrink-0" /> Tijorat taklifini soʻrash
            </button>
          </div>

          {/* Secondary Actions — a 3-up grid rather than a single flex row, which
              would overflow at 360px once the wishlist label is spelled out. */}
          <div className="mt-4 grid grid-cols-3 gap-1 border-t border-slate-100 pt-4">
            <button
              onClick={() => toggleWishlist(product)}
              className={`flex flex-col items-center gap-2 rounded-xl px-1 py-2 text-xs font-bold text-center transition-colors cursor-pointer ${
                isWish ? 'text-rose-500' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-700'
              }`}
            >
              <Heart size={16} className={isWish ? 'fill-current' : ''} />
              <span>{isWish ? 'Saqlanganlarda' : 'Saqlanganlarga qoʻshish'}</span>
            </button>

            <button
              onClick={() => addToCompare(product)}
              className={`flex flex-col items-center gap-2 rounded-xl px-1 py-2 text-xs font-bold text-center transition-colors cursor-pointer ${
                isComp ? 'text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-700'
              }`}
            >
              <GitCompare size={16} />
              <span>Solishtirish</span>
            </button>

            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('Mahsulot havolasi nusxalandi!'); }}
              className="flex flex-col items-center gap-2 rounded-xl px-1 py-2 text-xs font-bold text-center text-slate-600 hover:bg-slate-50 hover:text-blue-700 transition-colors cursor-pointer"
            >
              <Share2 size={16} />
              <span>Ulashish</span>
            </button>
          </div>

        </div>

      </div>

      {/* Interactive Tabs Section */}
      <div className="surface overflow-hidden">

        {/* Tab Headers — a wrapping segmented control. Wrapping (rather than a
            horizontal scroll strip) guarantees no overflow at 360px, where these
            five Uzbek labels are far wider than the viewport. */}
        <div className="border-b border-slate-200 bg-slate-50/60 p-4 sm:px-6 sm:py-4">
          <div className="flex flex-wrap gap-2">
            {TAB_ITEMS.map((tab) => {
              const label = tab.id === 'reviews' ? `${tab.label} (${reviewCount})` : tab.label;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  aria-current={isActive}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0B1D3F] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200/80 hover:border-slate-300 hover:text-[#0B1D3F]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8">

        {activeTab === 'specs' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                Spetsifikatsiya
              </span>
              <h2 className="text-2xl font-bold text-[#0B1D3F]">
                Toʻliq texnik xususiyatlar
              </h2>
            </div>

            {/* The table keeps a minimum width and scrolls inside this container,
                so long spec values never stretch the page at 360px. */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[520px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#0B1D3F] text-white">
                    <th className="w-[42%] px-4 py-4 text-xs font-bold uppercase tracking-[0.14em]">
                      Parametr
                    </th>
                    <th className="px-4 py-4 text-xs font-bold uppercase tracking-[0.14em]">
                      Qiymat
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {product.specs.map((spec, i) => (
                    <tr
                      key={i}
                      className={`border-t border-slate-100 ${i % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}`}
                    >
                      <td className="px-4 py-4 align-top text-xs font-medium text-slate-500">
                        {spec.label}
                      </td>
                      <td className="tabular px-4 py-4 align-top text-xs font-bold text-[#0B1D3F]">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'desc' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                Tavsif
              </span>
              <h2 className="text-2xl font-bold text-[#0B1D3F]">
                Batafsil maʼlumot
              </h2>
            </div>

            <p className="max-w-3xl text-sm text-slate-600">
              {product.longDescription}
            </p>

            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-[#0B1D3F]">Qoʻllanilish sohalari</h3>
              <div className="flex flex-wrap gap-2">
                {product.usageArea.map((area, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'downloads' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                Hujjatlar
              </span>
              <h2 className="text-2xl font-bold text-[#0B1D3F]">
                Texnik hujjatlar
              </h2>
              <p className="text-sm text-slate-600">
                Quyidagi hujjatlar hozircha yuklab olish uchun tayyor emas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: `${product.model} texnik xususiyatlar broshyurasi (PDF)` },
                { name: `Foydalanuvchi qoʻllanmasi (PDF)` },
                { name: `3D CAD chizma (DWG)` }
              ].map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-4"
                >
                  <div className="min-w-0 space-y-2">
                    <FileText size={16} className="text-slate-400" />
                    <p className="text-xs font-bold text-slate-600">{doc.name}</p>
                    <p className="text-xs text-slate-400">Hozircha mavjud emas</p>
                  </div>
                  <button
                    onClick={() => showToast('Hujjat hozircha yuklab olish uchun mavjud emas.')}
                    className="shrink-0 rounded-xl border border-slate-200 bg-white p-2 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-colors cursor-pointer"
                    aria-label="Hujjatni yuklab olish"
                  >
                    <Download size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'video' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                Video
              </span>
              <h2 className="text-2xl font-bold text-[#0B1D3F]">
                Mashinaning ish jarayoni
              </h2>
            </div>

            {product.videoUrl ? (
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-[#071531]">
                <iframe
                  src={product.videoUrl}
                  title={`${product.name} — video`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
                <div className="mx-auto w-12 h-12 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center mb-4">
                  <Play size={22} />
                </div>
                <p className="text-sm font-bold text-[#0B1D3F]">
                  Bu model uchun video hozircha yoʻq
                </p>
                <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                  Mashinaning ishlashini koʻrmoqchi boʻlsangiz, biz bilan bogʻlaning —
                  obyektingizda jonli koʻrsatib beramiz.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                Sharhlar
              </span>
              <h2 className="text-2xl font-bold text-[#0B1D3F]">
                Mijozlar sharhlari
              </h2>
            </div>

            {/* Existing Reviews */}
            <div className="space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <span className="block text-sm font-bold text-[#0B1D3F] truncate">{r.userName}</span>
                        <span className="block text-xs text-slate-500 truncate">{r.company}</span>
                      </div>
                      <div className="flex shrink-0 text-blue-400">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} size={13} className="fill-blue-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">{r.comment}</p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white">
                    <MessageSquare size={20} className="text-slate-400" />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-[#0B1D3F]">
                    Bu mashina uchun hozircha sharh yoʻq
                  </h3>
                  <p className="mt-1 max-w-sm text-xs text-slate-500">
                    Birinchi sharhni siz qoldirishingiz mumkin.
                  </p>
                </div>
              )}
            </div>

            {/* Write Review Form */}
            <form onSubmit={handleAddReview} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#0B1D3F]">Sharh qoldirish</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Ismingiz *"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="Tashkilot / kompaniya nomi"
                  value={reviewCompany}
                  onChange={(e) => setReviewCompany(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none transition-colors"
                />
              </div>
              <textarea
                rows={3}
                required
                placeholder="Mashina unumdorligi, batareya ish vaqti va tozalash natijalari haqida yozing..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none transition-colors resize-y"
              />
              <button type="submit" className="btn-secondary">
                Sharhni yuborish
              </button>
            </form>
          </div>
        )}

        </div>

      </div>

      {/* Frequently Bought Together */}
      {accessories.length > 0 && (
        <div className="surface p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              Aksessuarlar
            </span>
            <h2 className="text-2xl font-bold text-[#0B1D3F]">
              Koʻpincha shu bilan birga olinadi
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {accessories.map((acc) => (
              <div key={acc.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex min-w-0 items-center gap-4">
                  <img width={800} height={600} loading="lazy" decoding="async" src={acc.images[0]} alt="" className="h-14 w-14 shrink-0 rounded-xl bg-white p-1 object-contain border border-slate-200/80" referrerPolicy="no-referrer" />
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-[#0B1D3F] line-clamp-2">{acc.name}</h3>
                    <span className="tabular mt-1 block text-sm font-bold text-[#0B1D3F]">{formatPrice(acc.priceUSD)}</span>
                  </div>
                </div>
                <button
                  onClick={() => addToCart(acc)}
                  className="btn-primary shrink-0 px-4 py-2"
                >
                  <Plus size={14} /> Qoʻshish
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
