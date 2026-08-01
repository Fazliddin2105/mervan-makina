import React, { useState } from 'react';
import { Calculator, ArrowRight, TrendingUp, Clock, DollarSign, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RoiCalculator: React.FC = () => {
  const { formatPrice, setIsQuoteModalOpen, productsList } = useApp();

  const [floorArea, setFloorArea] = useState<number>(8000);
  const [cleanersCount, setCleanersCount] = useState<number>(4);
  const [monthlySalaryUSD, setMonthlySalaryUSD] = useState<number>(450);

  // Payback has to be measured against a machine the customer can actually buy.
  // The previous version divided by a flat 3,500 USD regardless of the catalog,
  // which does not survive a minute of scrutiny against a real quote.
  const machines = productsList.filter(p => p.priceUSD > 0);
  const [machineId, setMachineId] = useState<string>(() => machines[0]?.id ?? '');
  const machine = machines.find(m => m.id === machineId) ?? machines[0];

  const manualMonthlyCost = cleanersCount * monthlySalaryUSD;
  const machineOperatorCost = 1 * monthlySalaryUSD;
  const monthlyLaborSavings = Math.max(0, manualMonthlyCost - machineOperatorCost);
  const annualSavingsUSD = monthlyLaborSavings * 12;

  const paybackMonths = machine && monthlyLaborSavings > 0
    ? Math.round((machine.priceUSD / monthlyLaborSavings) * 10) / 10
    : null;

  return (
    <div className="bg-gradient-to-br from-[#0B1D3F] via-[#12305F] to-[#0B1D3F] text-white rounded-2xl p-6 md:p-12 shadow-2xl border border-slate-700/80 my-12 font-sans">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-700/80">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 border border-blue-600/30 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Calculator size={14} /> Samadorlik va Tejash Kalkulyatori
          </div>
          <h2 className="text-2xl font-bold text-white">
            Pol Yuvish Uskunasidan Tejash va ROI Hisoblagichi
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl">
            Qoʻlda yuvish va supurish oʻrniga pol yuvish mashinasiga oʻtganda korxonangiz oylik maosh va vaqtdan qancha tejashini hisoblang.
          </p>
        </div>

        <button 
          onClick={() => setIsQuoteModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-4 rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all cursor-pointer shrink-0"
        >
          Shaxsiy ROI Hisobotini Olish
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        
        {/* Controls Left */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <label className="font-bold text-slate-200">Tozalanadigan Pol Maydoni</label>
              <span className="text-blue-400 font-mono font-bold text-sm">{floorArea.toLocaleString()} m²</span>
            </div>
            <input 
              type="range" 
              min={1000} 
              max={30000} 
              step={500}
              value={floorArea}
              onChange={(e) => setFloorArea(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <label className="font-bold text-slate-200">Hozirgi Farroshlar Soni</label>
              <span className="text-blue-400 font-mono font-bold text-sm">{cleanersCount} kishi</span>
            </div>
            <input 
              type="range" 
              min={1} 
              max={20} 
              step={1}
              value={cleanersCount}
              onChange={(e) => setCleanersCount(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <label className="font-bold text-slate-200">Farroshning Oʻrtacha Oylik Maoshi</label>
              <span className="text-blue-400 font-mono font-bold text-sm">{formatPrice(monthlySalaryUSD)} / kishi</span>
            </div>
            <input 
              type="range" 
              min={200} 
              max={1500} 
              step={50}
              value={monthlySalaryUSD}
              onChange={(e) => setMonthlySalaryUSD(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {machines.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-700/80">
              <label className="text-xs font-bold text-slate-200 block">Qaysi mashina uchun hisoblansin?</label>
              <select
                value={machineId}
                onChange={(e) => setMachineId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl p-2 cursor-pointer focus:outline-none focus:border-blue-600"
              >
                {machines.map(m => (
                  <option key={m.id} value={m.id}>{m.name} — {formatPrice(m.priceUSD)}</option>
                ))}
              </select>
            </div>
          )}

        </div>

        {/* Output Cards Right */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
              <TrendingUp size={16} className="text-emerald-400" />
              <span>OYLIK TEJALADIGAN MABLAG'</span>
            </div>
            <div className="my-4">
              <span className="text-2xl font-bold text-emerald-400 tracking-tight">
                {formatPrice(monthlyLaborSavings)}
              </span>
              <span className="text-xs text-slate-400 block font-normal">har oy tejaladigan maosh</span>
            </div>
            <p className="text-xs text-slate-400">Hisob {cleanersCount} ta xodim oʻrniga 1 ta operator qolishi taxminiga asoslangan.</p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
              <DollarSign size={16} className="text-blue-400" />
              <span>YILLIK SOF TEJASH</span>
            </div>
            <div className="my-4">
              <span className="text-2xl font-bold text-blue-400 tracking-tight">
                {formatPrice(annualSavingsUSD)}
              </span>
              <span className="text-xs text-slate-400 block font-normal">yillik operatsion tejamkorlik</span>
            </div>
            <p className="text-xs text-slate-400">Korxonangiz byudjetiga qaytadigan tejalgan mablag'.</p>
          </div>

          <div className="sm:col-span-2 bg-gradient-to-r from-blue-600/20 to-blue-500/10 border border-blue-600/40 rounded-2xl p-6 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="text-xs text-blue-300 font-bold uppercase tracking-wider block">
                Oʻzini oqlash muddati
              </span>
              <div className="text-xl md:text-2xl font-bold text-white mt-1">
                {paybackMonths !== null ? (
                  <>
                    Taxminan <span className="text-blue-400 tabular">{paybackMonths}</span> oy
                  </>
                ) : (
                  <span className="text-slate-300 text-base">Hisoblash uchun xodimlar sonini oshiring</span>
                )}
              </div>
              {machine && (
                <p className="text-xs text-slate-400 mt-1 truncate">
                  {machine.name} — {formatPrice(machine.priceUSD)}
                </p>
              )}
            </div>
            <ShieldCheck size={36} className="text-blue-400 shrink-0" />
          </div>

          <p className="sm:col-span-2 text-xs text-slate-500">
            Hisob siz kiritgan maʼlumotlar asosidagi taxminiy baho. Real natija obyekt
            turi, ish rejimi va foydalanish sharoitiga qarab farq qiladi.
          </p>

        </div>

      </div>

    </div>
  );
};
