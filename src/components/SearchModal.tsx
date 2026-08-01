import React, { useState } from 'react';
import { X, Search, Zap, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCTS_DATA } from '../data/mockData';

export const SearchModal: React.FC = () => {
  const { productsList, isSearchModalOpen, setIsSearchModalOpen, setSelectedProductId, setActivePage, formatPrice } = useApp();
  const [query, setQuery] = useState('');

  if (!isSearchModalOpen) return null;

  const results = query.trim().length > 1
    ? productsList.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.model.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-24 px-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full shadow-lg overflow-hidden border border-slate-200 animate-in fade-in slide-in-from-top-10 duration-200">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <Search size={22} className="text-blue-600 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Model, nom yoki turi boʻyicha qidiring (MK-3, pol yuvish...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base font-medium text-slate-800 placeholder-slate-400"
          />
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
            aria-label="Yopish"
          >
            <X size={20} />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {query.trim().length > 1 ? (
            results.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs text-slate-400 font-bold px-2 mb-1 uppercase"><span className="tabular">{results.length}</span> ta mashina topildi:</div>
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setSelectedProductId(product.id);
                      setActivePage('product-detail');
                      setIsSearchModalOpen(false);
                    }}
                    className="p-4 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between gap-4 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <img width={800} height={600} loading="lazy" decoding="async" 
                        src={product.images[0]} 
                        alt="" 
                        className="w-12 h-12 object-contain bg-slate-100 rounded-lg p-1 shrink-0" 
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="text-xs font-bold text-blue-700 uppercase bg-blue-50 px-2 py-1 rounded">
                          {product.brand}
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{product.name}</h4>
                        <span className="tabular text-xs text-slate-400 font-mono">{product.productivity} • {product.voltage}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="tabular text-xs font-bold text-[#0B1D3F]">{formatPrice(product.priceUSD)}</div>
                      <ArrowRight size={14} className="text-blue-600 ml-auto mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                "{query}" boʻyicha mashina topilmadi. <span className="font-bold text-slate-700">Pol yuvish</span>, <span className="font-bold text-slate-700">Supurish</span>, <span className="font-bold text-slate-700">MK-3</span> yoki <span className="font-bold text-slate-700">Mervan Makina</span> soʻzlarini sinab koʻring.
              </div>
            )
          ) : (
            <div className="space-y-4 p-2">
              <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Ommabop qidiruvlar</span>
              <div className="flex flex-wrap gap-2 text-xs">
                {['MK-3', 'MK-6', 'Supurish mashinasi', 'Pol yuvish', 'Changyutgich', 'Litiy batareya'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
