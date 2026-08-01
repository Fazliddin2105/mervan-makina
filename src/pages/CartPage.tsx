import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, FileText, Plus, Minus, Tag } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, cartSubtotalUSD, formatPrice, setActivePage, setIsQuoteModalOpen, showToast } = useApp();
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'MEGAVAN10') {
      setDiscountPercent(10);
      showToast('10% korporativ chegirma qo\'llandi!');
    } else {
      showToast('Promokod noto\'g\'ri. MEGAVAN10 kodini sinab ko\'ring.');
    }
  };

  const discountAmount = (cartSubtotalUSD * discountPercent) / 100;
  const grandTotalUSD = Math.max(0, cartSubtotalUSD - discountAmount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-sans space-y-8">
      
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1D3F] flex items-center gap-2">
          <ShoppingBag size={28} className="text-blue-600" /> Savat
        </h1>
        <span className="tabular text-xs text-slate-500 font-bold">{cart.length} ta pozitsiya</span>
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Table Left */}
          <div className="lg:col-span-8 surface p-6 space-y-4">
            <div className="space-y-4 divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item.product.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  
                  <div className="flex items-center gap-4">
                    <img width={800} height={600} loading="lazy" decoding="async" 
                      src={item.product.images[0]} 
                      alt="" 
                      className="w-20 h-20 object-contain bg-slate-50 rounded-2xl p-2 border border-slate-200 shrink-0" 
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase">
                        {item.product.brand}
                      </span>
                      <h3 className="font-bold text-[#0B1D3F] text-sm">{item.product.name}</h3>
                      <span className="tabular text-xs text-slate-400 font-mono">Model: {item.product.model}</span>
                      <div className="tabular text-xs font-black text-slate-900 mt-1 sm:hidden">
                        {formatPrice(item.product.priceUSD)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                    
                    {/* Quantity Stepper */}
                    <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-white text-slate-700 font-bold flex items-center justify-center hover:bg-slate-200 cursor-pointer"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="tabular w-8 text-center font-bold text-xs text-[#0B1D3F]">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-white text-slate-700 font-bold flex items-center justify-center hover:bg-slate-200 cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right hidden sm:block">
                      <div className="tabular text-sm font-black text-[#0B1D3F]">
                        {formatPrice(item.product.priceUSD * item.quantity)}
                      </div>
                      <div className="tabular text-[10px] text-slate-400">
                        {item.quantity} × {formatPrice(item.product.priceUSD)}
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Savatdan olib tashlash"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Cart Order Summary Right */}
          <div className="lg:col-span-4 surface p-6 space-y-6">
            <h2 className="text-lg font-extrabold text-[#0B1D3F]">Buyurtma hisobi</h2>

            <div className="space-y-3 text-xs divide-y divide-slate-100">
              <div className="flex justify-between pt-2">
                <span className="text-slate-500 font-medium">Uskunalar summasi</span>
                <span className="tabular font-bold font-mono text-slate-900">{formatPrice(cartSubtotalUSD)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between pt-2 text-emerald-600 font-semibold">
                  <span className="tabular">Korporativ chegirma ({discountPercent}%)</span>
                  <span className="tabular">-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <span className="text-slate-500 font-medium">Yetkazib berish va montaj</span>
                <span className="font-bold text-slate-700">Kelishuv asosida</span>
              </div>

              <div className="flex justify-between items-baseline pt-3 text-sm">
                <span className="font-black text-[#0B1D3F]">Umumiy summa</span>
                <span className="tabular text-xl font-black text-blue-700 font-mono">{formatPrice(grandTotalUSD)}</span>
              </div>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="Promokod (MEGAVAN10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs uppercase"
              />
              <button type="submit" className="btn-secondary px-4 py-2">
                Qo'llash
              </button>
            </form>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => setActivePage('checkout')}
                className="btn-secondary w-full uppercase tracking-wider"
              >
                <span>Buyurtmani rasmiylashtirish</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => setIsQuoteModalOpen(true)}
                className="btn-ghost w-full uppercase tracking-wider"
              >
                <FileText size={16} /> Tijorat taklifini so'rash
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldCheck size={14} className="text-emerald-500" /> To'lov va hisob-faktura
              </div>
              <p>To'lov shartlari va hisob-faktura menejerimiz bilan tasdiqlanadi.</p>
            </div>

          </div>

        </div>
      ) : (
        <div className="surface p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <ShoppingBag size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#0B1D3F]">Savatingiz bo'sh</h3>
          <p className="text-xs text-slate-500">
            Katalogdan pol yuvish mashinasi yoki boshqa tozalash texnikasini tanlang.
          </p>
          <button
            onClick={() => setActivePage('products')}
            className="btn-secondary"
          >
            Katalogni ko'rish
          </button>
        </div>
      )}

    </div>
  );
};
