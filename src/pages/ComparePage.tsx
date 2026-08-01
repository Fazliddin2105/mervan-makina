import React from 'react';
import { useApp } from '../context/AppContext';
import { GitCompare, X, Check, ShoppingBag, FileText, ArrowRight } from 'lucide-react';

export const ComparePage: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare, formatPrice, addToCart, setIsQuoteModalOpen, setSelectedProductId, setActivePage } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-sans space-y-8">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1D3F] flex items-center gap-2">
            <GitCompare size={28} className="text-blue-600" /> Texnik taqqoslash jadvali
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Unumdorlik, kuchlanish, choʻtka kengligi va suv baklari hajmini yonma-yon solishtiring.
          </p>
        </div>

        {compareList.length > 0 && (
          <button
            onClick={clearCompare}
            className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
          >
            Jadvalni tozalash (<span className="tabular">{compareList.length}</span> ta)
          </button>
        )}
      </div>

      {compareList.length > 0 ? (
        <div className="surface overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-100 min-w-[700px]">
            
            {/* Machine Headers */}
            <thead>
              <tr className="bg-slate-50">
                <th className="p-4 font-bold text-slate-500 w-48 sticky left-0 bg-slate-50">Texnik parametr</th>
                {compareList.map((p) => (
                  <th key={p.id} className="p-4 w-64 text-center space-y-2">
                    <div className="relative">
                      <button 
                        onClick={() => removeFromCompare(p.id)}
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 cursor-pointer"
                        title="Oʻchirish"
                      >
                        <X size={12} />
                      </button>
                      <img width={800} height={600} loading="lazy" decoding="async" 
                        src={p.images[0]} 
                        alt="" 
                        className="h-28 object-contain mx-auto bg-white p-2 rounded-lg border border-slate-200" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="font-bold text-[#0B1D3F] text-sm line-clamp-1">{p.name}</div>
                    <div className="text-blue-700 font-mono font-bold tabular">{formatPrice(p.priceUSD)}</div>
                    <button
                      onClick={() => addToCart(p)}
                      className="btn-secondary w-full"
                    >
                      Savatga qoʻshish
                    </button>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Spec Matrix Rows */}
            <tbody className="divide-y divide-slate-100">
              
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/50 sticky left-0">Brend va model</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-4 text-center font-bold text-slate-900">{p.brand} ({p.model})</td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/50 sticky left-0">Tozalash unumdorligi</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-4 text-center font-mono font-bold text-blue-700 tabular">{p.productivity}</td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/50 sticky left-0">Kuchlanish / Quvvat</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-4 text-center font-medium tabular">{p.voltage}</td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/50 sticky left-0">Choʻtka kengligi / Ish yoʻlagi</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-4 text-center font-medium tabular">{p.brushWidth}</td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/50 sticky left-0">Toza / Iflos suv baki</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-4 text-center font-medium tabular">{p.tankCapacity}</td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/50 sticky left-0">Mashina turi</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-4 text-center font-medium">{p.machineType}</td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/50 sticky left-0">Kafolat qamrovi</td>
                {compareList.map(p => {
                  const warranty = p.specs.find(sp => sp.label.toLowerCase().includes('kafolat'))?.value;
                  return (
                    <td key={p.id} className="p-4 text-center font-bold">
                      {warranty
                        ? <span className="text-emerald-600 tabular">{warranty}</span>
                        : <span className="text-slate-400 font-medium">Soʻrov boʻyicha</span>}
                    </td>
                  );
                })}
              </tr>

            </tbody>

          </table>
        </div>
      ) : (
        <div className="surface p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <GitCompare size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#0B1D3F]">Taqqoslash uchun texnika tanlanmagan</h3>
          <p className="text-xs text-slate-500">
            Texnik parametrlarni yonma-yon koʻrish uchun mahsulot kartochkalaridagi "Solishtirish" belgisini bosing.
          </p>
          <button
            onClick={() => setActivePage('products')}
            className="btn-secondary"
          >
            Katalogga oʻtish
          </button>
        </div>
      )}

    </div>
  );
};
