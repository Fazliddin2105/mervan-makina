import React, { useState } from 'react';
import {
  Filter,
  Search,
  Grid,
  List,
  RotateCcw,
  X,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_DATA, BRANDS_DATA } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { PageBanner } from '../components/PageBanner';

/** Filter values stay in English because they match the product data. Only the
 *  label the customer reads is translated. */
const MACHINE_TYPE_LABELS: Record<string, string> = {
  all: 'Barcha turlar',
  'Ride-on': 'Haydaladigan (Ride-on)',
  'Walk-behind': 'Yurib boshqariladigan',
  Compact: 'Ixcham',
  Vertical: 'Vertikal',
  Stationary: 'Statsionar'
};

/* One label treatment for every filter group keeps the sidebar reading as a
   single panel instead of six unrelated controls. */
const GROUP_LABEL = 'block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400';
const FIELD =
  'w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-3.5 pr-9 py-2.5 ' +
  'text-xs font-semibold text-[#0B1D3F] cursor-pointer transition-colors duration-200 ' +
  'hover:border-slate-300 focus:outline-none focus:border-blue-600';

export const ProductsPage: React.FC = () => {
  const { productsList, filters, setFilters, resetFilters, formatPrice } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter logic
  let filtered = productsList.filter(p => {
    if (filters.category !== 'all' && p.category !== filters.category) return false;
    if (filters.brand !== 'all' && p.brandId !== filters.brand && p.brand.toLowerCase() !== filters.brand.toLowerCase()) return false;
    if (filters.minPrice && p.priceUSD < filters.minPrice) return false;
    if (filters.maxPrice && p.priceUSD > filters.maxPrice) return false;
    if (filters.machineType !== 'all' && p.machineType !== filters.machineType) return false;
    if (filters.voltage !== 'all' && !p.voltage.toLowerCase().includes(filters.voltage.toLowerCase())) return false;
    if (filters.inStockOnly && !p.inStock) return false;
    if (filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase();
      const match = p.name.toLowerCase().includes(q) ||
                    p.brand.toLowerCase().includes(q) ||
                    p.model.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (filters.sortBy === 'price-low') return a.priceUSD - b.priceUSD;
    if (filters.sortBy === 'price-high') return b.priceUSD - a.priceUSD;
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    if (filters.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  /* The chips used to print raw ids ("floor-scrubbers"). Resolve them to the
     names the customer already sees in the dropdowns. */
  const categoryLabel = CATEGORIES_DATA.find(c => c.id === filters.category)?.name ?? filters.category;
  const brandLabel = BRANDS_DATA.find(b => b.id === filters.brand)?.name ?? filters.brand;

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.brand !== 'all' ||
    filters.machineType !== 'all' ||
    Boolean(filters.searchQuery);

  const chip = (label: string, value: string, onClear: () => void) => (
    <span className="inline-flex items-center gap-1.5 max-w-full rounded-xl border border-slate-200 bg-slate-50 pl-2.5 pr-1 py-1 text-[11px]">
      <span className="text-slate-400 font-medium shrink-0">{label}:</span>
      <span className="font-semibold text-[#0B1D3F] truncate">{value}</span>
      <button
        onClick={onClear}
        className="shrink-0 rounded-xl p-0.5 text-slate-400 hover:text-rose-600 transition-colors duration-200 cursor-pointer"
        aria-label={`${label} filtrini olib tashlash`}
      >
        <X size={12} />
      </button>
    </span>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 font-sans space-y-8">

      {/* Title Header */}
      <PageBanner
        eyebrow="SANOAT KATALOGI"
        title="Uskunalar va mashinalar katalogi"
        subtitle="Sanoat tozalash texnikasi: pol yuvish mashinalari, haydaladigan supurish texnikasi, yuqori bosimli yuvish apparatlari va sanoat changyutgichlari."
      >
        {/* Quick Search inside Catalog */}
        <div className="relative w-full md:w-96">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Model yoki nom bo'yicha qidiring..."
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-4 py-3 text-xs font-medium text-white placeholder-slate-400 transition-colors duration-200 hover:border-white/25 focus:outline-none focus:border-blue-600"
          />
        </div>
      </PageBanner>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

        {/* ================= SIDEBAR FILTERS ================= */}
        <aside
          className={`${isMobileFilterOpen ? 'block' : 'hidden'} lg:block lg:col-span-3 surface overflow-hidden lg:sticky lg:top-24`}
        >
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
            <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#0B1D3F]">
              <SlidersHorizontal size={14} className="text-blue-600 shrink-0" />
              Uskuna filtrlari
            </h2>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 rounded-xl px-2 py-1 text-[11px] font-bold text-slate-500 hover:text-blue-700 transition-colors duration-200 cursor-pointer"
              >
                <RotateCcw size={12} /> Tozalash
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="lg:hidden rounded-xl p-1.5 text-slate-400 hover:text-[#0B1D3F] hover:bg-slate-100 transition-colors duration-200 cursor-pointer"
                aria-label="Filtrlarni yopish"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">

            {/* Category Filter */}
            <div className="px-5 py-5 space-y-2.5">
              <label className={GROUP_LABEL} htmlFor="filter-category">Kategoriya</label>
              <div className="relative">
                <select
                  id="filter-category"
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className={FIELD}
                >
                  <option value="all">Barcha kategoriyalar ({productsList.length})</option>
                  {CATEGORIES_DATA.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.itemCount})</option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Brand Filter */}
            <div className="px-5 py-5 space-y-2.5">
              <label className={GROUP_LABEL} htmlFor="filter-brand">Ishlab chiqaruvchi</label>
              <div className="relative">
                <select
                  id="filter-brand"
                  value={filters.brand}
                  onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                  className={FIELD}
                >
                  <option value="all">Barcha brendlar</option>
                  {BRANDS_DATA.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Machine Type */}
            <div className="px-5 py-5 space-y-3">
              <span className={GROUP_LABEL}>Mashina turi</span>
              <div className="space-y-0.5">
                {['all', 'Ride-on', 'Walk-behind', 'Compact', 'Vertical', 'Stationary'].map((type) => {
                  const active = filters.machineType === type;
                  return (
                    <label
                      key={type}
                      className="flex items-center gap-2.5 -mx-2 px-2 py-1.5 rounded-xl cursor-pointer transition-colors duration-200 hover:bg-slate-50"
                    >
                      <input
                        type="radio"
                        name="machineType"
                        checked={active}
                        onChange={() => setFilters(prev => ({ ...prev, machineType: type }))}
                        className="w-3.5 h-3.5 shrink-0 accent-blue-600 cursor-pointer"
                      />
                      <span className={`text-xs truncate ${active ? 'font-semibold text-[#0B1D3F]' : 'text-slate-600'}`}>
                        {MACHINE_TYPE_LABELS[type] || type}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="px-5 py-5 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className={GROUP_LABEL}>Maksimal narx</span>
                <span className="text-xs font-bold text-[#0B1D3F] tabular shrink-0">
                  {formatPrice(filters.maxPrice)}
                </span>
              </div>
              {/* Ceiling must stay above the priciest product (MK-2, $28,655) or it
                  becomes impossible to bring that product back into the results. */}
              <input
                type="range"
                min={100}
                max={30000}
                step={100}
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* In Stock Only */}
            <div className="px-5 py-5">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
                  className="w-4 h-4 shrink-0 accent-blue-600 rounded cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-700">Faqat omborda bor mashinalar</span>
              </label>
            </div>

            {/* Mobile-only: confirm and return to the results */}
            <div className="lg:hidden px-5 py-5">
              <button onClick={() => setIsMobileFilterOpen(false)} className="btn-secondary w-full">
                <span className="tabular">{filtered.length}</span> ta modelni ko'rish
              </button>
            </div>

          </div>
        </aside>

        {/* ================= MAIN PRODUCTS LIST (Right) ================= */}
        <div className="lg:col-span-9 space-y-6">

          {/* Controls Bar */}
          <div className="surface overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3">

              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setIsMobileFilterOpen(open => !open)}
                  className="btn-ghost lg:hidden px-3.5 py-2 shrink-0"
                >
                  <Filter size={15} /> Filtrlar
                </button>

                <p className="text-xs text-slate-500 truncate">
                  <span className="text-sm font-extrabold text-[#0B1D3F] tabular">{filtered.length}</span>
                  {' '}ta model ko'rsatilmoqda
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">

                {/* Sort selector */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="hidden md:inline text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 shrink-0">
                    Saralash
                  </span>
                  <div className="relative min-w-0">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-3 pr-8 py-2 text-xs font-semibold text-[#0B1D3F] cursor-pointer transition-colors duration-200 hover:border-slate-300 focus:outline-none focus:border-blue-600"
                      aria-label="Saralash"
                    >
                      <option value="featured">Tavsiya etilganlar</option>
                      <option value="price-low">Narx: arzondan qimmatga</option>
                      <option value="price-high">Narx: qimmatdan arzonga</option>
                      <option value="rating">Reyting bo'yicha</option>
                      <option value="newest">Yangi modellar</option>
                    </select>
                    <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                {/* View Switcher */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200/80 shrink-0">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-xl transition-colors duration-200 cursor-pointer ${
                      viewMode === 'grid' ? 'bg-white text-[#0B1D3F] shadow-sm' : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="Katak ko'rinishi"
                    aria-label="Katak ko'rinishi"
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-xl transition-colors duration-200 cursor-pointer ${
                      viewMode === 'list' ? 'bg-white text-[#0B1D3F] shadow-sm' : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="Ro'yxat ko'rinishi"
                    aria-label="Ro'yxat ko'rinishi"
                  >
                    <List size={16} />
                  </button>
                </div>

              </div>

            </div>

            {/* Active Filter Tags — part of the same bar, not a floating row */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-t border-slate-100 bg-slate-50/60">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 shrink-0">
                  Faol filtrlar
                </span>

                {filters.category !== 'all' &&
                  chip('Kategoriya', categoryLabel, () => setFilters(p => ({ ...p, category: 'all' })))}

                {filters.brand !== 'all' &&
                  chip('Brend', brandLabel, () => setFilters(p => ({ ...p, brand: 'all' })))}

                {filters.machineType !== 'all' &&
                  chip('Turi', MACHINE_TYPE_LABELS[filters.machineType] || filters.machineType,
                    () => setFilters(p => ({ ...p, machineType: 'all' })))}

                {filters.searchQuery &&
                  chip('Qidiruv', filters.searchQuery, () => setFilters(p => ({ ...p, searchQuery: '' })))}

                <button
                  onClick={resetFilters}
                  className="ml-auto shrink-0 text-[11px] font-bold text-slate-500 hover:text-blue-700 transition-colors duration-200 cursor-pointer"
                >
                  Hammasini tozalash
                </button>
              </div>
            )}
          </div>

          {/* Products Grid / List */}
          {filtered.length > 0 ? (
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6'
              : 'space-y-4 sm:space-y-5'}
            >
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="surface px-6 py-16 sm:py-20 text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-400">
                <Search size={22} />
              </div>
              <h2 className="mt-5 text-2xl font-extrabold text-[#0B1D3F]">
                So'rovingizga mos mashina topilmadi
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                Narx oralig'ini kengaytiring yoki brend va mashina turi filtrlarini tozalab ko'ring.
              </p>
              <button onClick={resetFilters} className="btn-primary mt-7">
                <RotateCcw size={14} /> Filtrlarni tozalash
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
