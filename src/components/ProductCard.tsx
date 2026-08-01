import React from 'react';
import {
  Eye,
  Heart,
  GitCompare,
  ShoppingBag,
  Star,
  FileText
} from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

/* One hover signature for both layouts: a single lift plus a single shadow.
   Grid and list are the same card in two shapes, so they must react the same way. */
const CARD_SHELL =
  'group spotlight relative flex bg-white rounded-2xl border border-slate-200/80 shadow-sm ' +
  'transition-all duration-300 ease-out hover:-translate-y-1 hover:border-slate-300 ' +
  'hover:shadow-[0_24px_48px_-24px_rgba(11,29,63,0.45)]';

/* Feeds the .spotlight highlight in index.css. Writing CSS variables straight
   onto the node keeps this off React's render path — moving the pointer never
   triggers a re-render. */
function trackPointer(e: React.MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}

/* The machines are photographed on white, so a white card would let them float.
   A faint slate plate gives every product the same stage. */
const PLATE_SURFACE = 'relative overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-white';

/* Several products legitimately have no figure for a given spec and the data
   stores an em dash. Those rows are dropped rather than rendered empty. */
const EMPTY_SPEC = new Set(['', '-', '--', '–', '—', 'n/a']);

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const {
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    isInCompare,
    setQuickViewProduct,
    setQuoteModalProduct,
    setIsQuoteModalOpen,
    setSelectedProductId,
    setActivePage
  } = useApp();

  const handleCardClick = () => {
    setSelectedProductId(product.id);
    setActivePage('product-detail');
  };

  const isWish = isInWishlist(product.id);
  const isComp = isInCompare(product.id);

  const specs = [
    { label: 'Kuchlanish', value: product.voltage },
    { label: 'Unumdorlik', value: product.productivity },
    { label: "Cho'tka kengligi", value: product.brushWidth }
  ].filter(s => s.value && !EMPTY_SPEC.has(s.value.trim().toLowerCase()));

  /* At most two badges so the photograph is never boxed in. */
  const badges = [
    product.discountPercent
      ? { key: 'discount', label: `-${product.discountPercent}% CHEGIRMA`, className: 'bg-[#2563EB] text-white' }
      : null,
    product.isNew
      ? { key: 'new', label: 'YANGI', className: 'bg-[#0B1D3F] text-white' }
      : null
  ].filter(Boolean).slice(0, 2) as { key: string; label: string; className: string }[];

  const stockLine = (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold shrink-0 ${
        product.inStock ? 'text-emerald-600' : 'text-slate-500'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-slate-400'}`} />
      {product.inStock ? 'Omborda bor' : 'Buyurtma asosida'}
    </span>
  );

  /* Photo plate: identical furniture in both layouts, only the frame changes. */
  const renderPlate = (frameClass: string, padClass: string) => (
    <div className={`${PLATE_SURFACE} ${frameClass}`}>
      {/* Click target sits under the controls so the whole plate opens the product. */}
      <button
        type="button"
        onClick={handleCardClick}
        aria-label={product.name}
        className="absolute inset-0 z-10 cursor-pointer"
      />

      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${padClass}`}>
        <img width={800} height={600} decoding="async"
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
      </div>

      {badges.length > 0 && (
        <div className="absolute top-3 left-3 z-20 flex flex-col items-start gap-1.5">
          {badges.map(b => (
            <span key={b.key} className={`pill shadow-sm ${b.className}`}>{b.label}</span>
          ))}
        </div>
      )}

      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
        <button
          onClick={() => toggleWishlist(product)}
          className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-200 cursor-pointer ${
            isWish
              ? 'bg-rose-500 border-rose-500 text-white'
              : 'bg-white/90 border-slate-200/80 text-slate-500 hover:text-rose-500 hover:border-rose-200'
          }`}
          title="Tanlanganlarga saqlash"
        >
          <Heart size={14} className={isWish ? 'fill-current' : ''} />
        </button>

        <button
          onClick={() => addToCompare(product)}
          className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-200 cursor-pointer ${
            isComp
              ? 'bg-[#2563EB] border-[#2563EB] text-white'
              : 'bg-white/90 border-slate-200/80 text-slate-500 hover:text-blue-700 hover:border-blue-200'
          }`}
          title="Solishtirish"
        >
          <GitCompare size={14} />
        </button>
      </div>

      {/* Hidden until hover, and non-clickable while hidden so a tap on the
          photo always opens the product instead of the quick view. */}
      <div className="absolute bottom-3 inset-x-3 z-20 flex opacity-0 translate-y-2 pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
        <button
          onClick={() => setQuickViewProduct(product)}
          className="flex-1 min-w-0 bg-[#0B1D3F]/90 backdrop-blur text-white text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-lg hover:bg-[#0B1D3F] transition-colors duration-200 cursor-pointer"
        >
          <Eye size={14} className="shrink-0" />
          <span className="truncate">Tezkor Ko'rish</span>
        </button>
      </div>
    </div>
  );

  const priceBlock = (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className="text-xl font-black text-[#0B1D3F] tabular leading-none">
        {formatPrice(product.priceUSD)}
      </span>
      {product.oldPriceUSD && (
        <span className="text-xs font-semibold text-slate-400 line-through tabular">
          {formatPrice(product.oldPriceUSD)}
        </span>
      )}
    </div>
  );

  const priceCaption = (
    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
      Rasmiy Narxi
    </span>
  );

  /* ============================== LIST ============================== */
  if (viewMode === 'list') {
    return (
      <div onMouseMove={trackPointer} className={`${CARD_SHELL} flex-col md:flex-row md:items-stretch p-4 sm:p-5 gap-5 md:gap-6`}>

        {renderPlate(
          'w-full h-52 md:w-56 md:h-44 lg:w-64 lg:h-48 shrink-0 rounded-xl border border-slate-200/70',
          'p-6'
        )}

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2.5 min-w-0">
              <BrandLogo brandId={product.brandId} name={product.brand} variant="tile" size="sm" />
              <span className="truncate text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                {product.machineType} Uskunasi
              </span>
            </span>
            {product.reviewsCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] shrink-0">
                <Star size={12} className="fill-blue-400 text-blue-400" />
                <span className="font-bold text-slate-700 tabular">{product.rating}</span>
                <span className="text-slate-400 tabular">({product.reviewsCount})</span>
              </span>
            )}
          </div>

          <h3
            onClick={handleCardClick}
            title={product.name}
            className="mt-3 text-lg font-bold text-[#0B1D3F] leading-snug hover:text-blue-700 cursor-pointer transition-colors duration-200"
          >
            {product.name}
          </h3>

          <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-2">
            {product.description}
          </p>

          {specs.length > 0 && (
            <dl className="mt-4 pt-4 border-t border-slate-200/70 flex flex-wrap gap-x-8 gap-y-3">
              {specs.map(s => (
                <div key={s.label} className="min-w-0">
                  <dt className="text-[11px] text-slate-500">{s.label}</dt>
                  <dd className="mt-0.5 text-xs font-semibold text-[#0B1D3F] tabular">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {/* Price & actions */}
        <div className="w-full md:w-52 lg:w-56 shrink-0 flex flex-col justify-between gap-5 pt-4 md:pt-0 md:pl-6 border-t md:border-t-0 md:border-l border-slate-200/70">
          <div>
            <div className="flex items-center justify-between gap-2">
              {priceCaption}
              <span className="md:hidden">{stockLine}</span>
            </div>
            <div className="mt-1.5">{priceBlock}</div>
            <div className="hidden md:block mt-2.5">{stockLine}</div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => addToCart(product)}
              className="btn-secondary w-full px-4"
            >
              <ShoppingBag size={15} className="shrink-0" />
              <span className="truncate">Savatga Qo'shish</span>
            </button>
            <button
              onClick={() => { setQuoteModalProduct(product); setIsQuoteModalOpen(true); }}
              className="btn-ghost w-full px-4 py-2.5"
            >
              <FileText size={14} className="shrink-0" />
              <span className="truncate">Tijorat Taklifi</span>
            </button>
          </div>
        </div>

      </div>
    );
  }

  /* ============================== GRID ============================== */
  return (
    <div onMouseMove={trackPointer} className={`${CARD_SHELL} h-full flex-col overflow-hidden`}>

      {renderPlate('aspect-[4/3] w-full border-b border-slate-200/70', 'p-6 sm:p-7')}

      <div className="flex-1 flex flex-col p-5">

        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2.5 min-w-0">
            <BrandLogo brandId={product.brandId} name={product.brand} variant="tile" size="sm" />
            <span className="truncate text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
              {product.machineType} Uskunasi
            </span>
          </span>
          {product.reviewsCount > 0 && (
            <span className="flex items-center gap-1 text-[11px] shrink-0">
              <Star size={12} className="fill-blue-400 text-blue-400" />
              <span className="font-bold text-slate-700 tabular">{product.rating}</span>
              <span className="text-slate-400 tabular">({product.reviewsCount})</span>
            </span>
          )}
        </div>

        <h3
          onClick={handleCardClick}
          title={product.name}
          className="mt-3 text-[15px] font-bold text-[#0B1D3F] leading-snug line-clamp-2 min-h-[2.6rem] hover:text-blue-700 cursor-pointer transition-colors duration-200"
        >
          {product.name}
        </h3>

        {specs.length > 0 && (
          <dl className="mt-4 border-t border-slate-100 divide-y divide-slate-100">
            {specs.map(s => (
              <div key={s.label} className="flex items-baseline justify-between gap-3 py-2">
                <dt className="text-[11px] text-slate-500 truncate">{s.label}</dt>
                <dd className="text-xs font-semibold text-[#0B1D3F] tabular text-right shrink-0">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-2">
            {priceCaption}
            {stockLine}
          </div>

          <div className="mt-1.5">{priceBlock}</div>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => addToCart(product)}
              className="btn-secondary flex-1 min-w-0 px-4"
            >
              <ShoppingBag size={15} className="shrink-0" />
              <span className="truncate">Savatga Qo'shish</span>
            </button>
            <button
              onClick={() => { setQuoteModalProduct(product); setIsQuoteModalOpen(true); }}
              className="btn-ghost shrink-0 px-3.5"
              title="Tijorat Taklifi"
              aria-label="Tijorat Taklifi"
            >
              <FileText size={16} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
