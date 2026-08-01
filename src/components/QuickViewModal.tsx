import React, { useState } from 'react';
import { X, Star, ShoppingBag, FileText, CheckCircle2, ShieldCheck, Zap, Sparkles, Ruler, Droplets } from 'lucide-react';
import { useApp } from '../context/AppContext';

/* Mirrors the product page: "—" in the data means the spec does not apply to
   that machine, so it is de-emphasised rather than shown at full contrast. */
const hasValue = (value?: string) => {
  const v = (value ?? '').trim();
  return v !== '' && v !== '—' && v !== '-';
};

const KeySpec: React.FC<{ label: string; value: string; icon?: React.ReactNode }> = ({ label, value, icon }) => {
  const filled = hasValue(value);
  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 px-2.5 py-2">
      <span className="block text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
        {label}
      </span>
      <span
        className={`mt-0.5 flex items-center gap-1.5 text-xs font-bold tabular ${
          filled ? 'text-[#0B1D3F]' : 'text-slate-400'
        }`}
      >
        {filled && icon}
        {filled ? value : '—'}
      </span>
    </div>
  );
};

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, formatPrice, addToCart, setIsQuoteModalOpen, setQuoteModalProduct, setSelectedProductId, setActivePage } = useApp();
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      {/* Capped to the visible area and scrolled internally, so the modal stays
          usable on short/landscape viewports instead of overflowing them. */}
      <div className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">

        {/* Close Button — outside the scroll area so it stays reachable. */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/90 text-slate-600 backdrop-blur-sm transition-colors hover:bg-slate-100 hover:text-[#0B1D3F] cursor-pointer"
          aria-label="Yopish"
        >
          <X size={18} />
        </button>

        <div
          className="overflow-y-auto overscroll-contain"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 transparent' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Gallery Left */}
            <div className="relative flex flex-col justify-between border-b border-slate-100 bg-gradient-to-b from-slate-50 to-slate-100/70 p-5 md:border-b-0 md:border-r">
              <div className="flex h-56 w-full items-center justify-center p-3 sm:h-64">
                <img width={800} height={600} loading="lazy" decoding="async"
                  src={product.images[selectedImgIndex] || product.images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain drop-shadow-[0_14px_22px_rgba(10,37,64,0.14)]"
                />
              </div>

              <span className="pill absolute top-4 left-4 bg-[#0B1D3F] text-white shadow-sm">
                {product.brand}
              </span>

              {/* Thumbnails — scrolled, not wrapped: several machines carry 8
                  images, which would overflow the column at 360px. */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pt-4 pb-1">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImgIndex(i)}
                      aria-label={`${i + 1}-surat`}
                      aria-current={selectedImgIndex === i}
                      className={`h-12 w-12 shrink-0 rounded-xl border bg-white p-1 transition-all cursor-pointer ${
                        selectedImgIndex === i
                          ? 'border-[#0B1D3F] ring-2 ring-blue-600/70 ring-offset-1 ring-offset-slate-50'
                          : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
                      }`}
                    >
                      <img width={800} height={600} loading="lazy" decoding="async" src={img} alt="" className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Right */}
            <div className="flex flex-col justify-between p-5 sm:p-6">
              <div>
                {/* pr-10 keeps the heading clear of the close button. */}
                <div className="flex items-center justify-between gap-3 pr-10">
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

                <h2 className="mt-2 text-xl sm:text-2xl font-bold text-[#0B1D3F] pr-10">
                  {product.name}
                </h2>

                <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500">
                  <span className="uppercase tracking-wider">Model</span>
                  <span className="h-3 w-px bg-slate-200" />
                  <span className="tabular font-bold text-slate-700">{product.model}</span>
                </div>

                <p className="mt-3 text-sm text-slate-600 line-clamp-4">
                  {product.description}
                </p>

                {/* Specs Grid */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <KeySpec
                    label="Kuchlanish"
                    value={product.voltage}
                    icon={<Zap size={12} className="shrink-0 text-blue-600" />}
                  />
                  <KeySpec
                    label="Unumdorlik"
                    value={product.productivity}
                    icon={<Sparkles size={12} className="shrink-0 text-blue-600" />}
                  />
                  <KeySpec
                    label="Choʻtka kengligi"
                    value={product.brushWidth}
                    icon={<Ruler size={12} className="shrink-0 text-blue-600" />}
                  />
                  <KeySpec
                    label="Bak hajmi"
                    value={product.tankCapacity}
                    icon={<Droplets size={12} className="shrink-0 text-blue-600" />}
                  />
                </div>
              </div>

              {/* Price & Buttons */}
              <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-2">
                  <div className="min-w-0">
                    <span className="block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                      Narxi
                    </span>
                    <div className="mt-1 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                      <span className="tabular text-2xl font-bold tracking-tight text-[#0B1D3F]">
                        {formatPrice(product.priceUSD)}
                      </span>
                      {product.oldPriceUSD && (
                        <span className="tabular text-xs font-medium text-slate-400 line-through">
                          {formatPrice(product.oldPriceUSD)}
                        </span>
                      )}
                    </div>
                  </div>

                  {product.inStock ? (
                    <span className="flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                      <CheckCircle2 size={12} /> Omborda bor
                    </span>
                  ) : (
                    <span className="flex shrink-0 items-center gap-1.5 rounded-xl bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Buyurtma asosida
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={() => { addToCart(product); setQuickViewProduct(null); }}
                    className="btn-secondary w-full px-4"
                  >
                    <ShoppingBag size={16} className="shrink-0" />
                    <span className="truncate">Savatga qoʻshish</span>
                  </button>
                  <button
                    onClick={() => { setQuoteModalProduct(product); setIsQuoteModalOpen(true); setQuickViewProduct(null); }}
                    className="btn-primary w-full px-4"
                  >
                    <FileText size={16} className="shrink-0" />
                    <span className="truncate">Tijorat taklifi</span>
                  </button>
                </div>

                <button
                  onClick={() => { setSelectedProductId(product.id); setActivePage('product-detail'); setQuickViewProduct(null); }}
                  className="w-full text-center text-xs font-bold text-blue-700 hover:text-blue-800 hover:underline cursor-pointer"
                >
                  Toʻliq texnik maʼlumotlar →
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
