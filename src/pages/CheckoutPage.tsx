import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Building2, CreditCard, Truck, FileText, CheckCircle2, ArrowRight, Lock } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotalUSD, formatPrice, clearCart, setActivePage, showToast, addOrder } = useApp();

  const [companyName, setCompanyName] = useState('MegaLogistics Central LLC');
  const [taxId, setTaxId] = useState('309887123');
  const [contactName, setContactName] = useState('Sardor Saidov');
  const [phone, setPhone] = useState('+998 90 123 45 67');
  const [email, setEmail] = useState('s.saidov@megalogistics.uz');
  const [address, setAddress] = useState('Sergeli tumani, 4-sanoat zonasi, Toshkent');
  const [paymentMethod, setPaymentMethod] = useState<'wire' | 'card' | 'leasing'>('wire');
  const [needsRamp, setNeedsRamp] = useState(true);

  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrderNum, setCompletedOrderNum] = useState('');

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !phone) return;

    const orderId = `CLN-${Math.floor(100000 + Math.random() * 900000)}`;
    setCompletedOrderNum(orderId);

    // Record in global app state
    addOrder({
      id: orderId,
      orderNumber: orderId,
      date: new Date().toISOString().split('T')[0],
      customerName: contactName,
      email,
      phone,
      companyName,
      items: cart,
      subtotalUSD: cartSubtotalUSD,
      taxUSD: 0,
      shippingUSD: 0,
      discountUSD: 0,
      totalUSD: cartSubtotalUSD,
      status: 'Processing',
      paymentMethod: paymentMethod === 'wire' ? 'Bank Transfer' : paymentMethod === 'card' ? 'Credit Card' : 'Installments',
      // Nothing in this app processes a payment, so an order is never 'Paid'
      // on submission — the manager marks it paid from the admin panel.
      paymentStatus: 'Pending Invoice',
      shippingAddress: address,
      city: 'Tashkent'
    });

    clearCart();
    setOrderComplete(true);
    showToast(`${orderId} raqamli buyurtma qayd etildi. Menejerimiz siz bilan bogʻlanadi.`);
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto my-12 surface p-8 sm:p-12 text-center space-y-6 font-sans">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl animate-bounce">
          <CheckCircle2 size={44} />
        </div>

        <div className="space-y-2">
          <span className="pill bg-emerald-100 text-emerald-800">
            BUYURTMA QAYD ETILDI
          </span>
          <h1 className="text-3xl font-bold text-[#0B1D3F]">Buyurtmangiz uchun rahmat!</h1>
          <p className="text-xs text-slate-500 font-mono">Buyurtma raqami: <span className="tabular font-bold text-slate-900">{completedOrderNum}</span></p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2 text-left">
          <div className="flex justify-between font-bold text-[#0B1D3F]">
            <span>Tashkilot:</span>
            <span>{companyName}</span>
          </div>
          <div className="flex justify-between font-bold text-[#0B1D3F]">
            <span>STIR:</span>
            <span className="tabular">{taxId}</span>
          </div>
          <div className="flex justify-between font-bold text-[#0B1D3F]">
            <span>Tanlangan toʻlov usuli:</span>
            <span>{paymentMethod === 'wire' ? 'Bank oʻtkazmasi' : paymentMethod === 'card' ? 'Karta orqali toʻlov' : 'Lizing / boʻlib toʻlash'}</span>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Buyurtmangiz qayd etildi. Menejerimiz <span className="tabular font-bold text-slate-800">{phone}</span> raqamiga qoʻngʻiroq qilib, buyurtma tarkibi, toʻlov va yetkazib berish shartlarini tasdiqlaydi. Hisob-faktura va shartnoma shundan keyin rasmiylashtiriladi.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <button
            onClick={() => setActivePage('dashboard')}
            className="btn-secondary"
          >
            Buyurtmalarim
          </button>
          <button
            onClick={() => setActivePage('home')}
            className="btn-ghost"
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-sans space-y-8">
      
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-[#0B1D3F] flex items-center gap-2">
          <Lock size={26} className="text-emerald-600" /> Buyurtmani rasmiylashtirish
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kompaniya maʼlumotlarini kiriting — menejerimiz buyurtmani telefon orqali tasdiqlaydi.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Inputs Left */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Step 1: Company details */}
          <div className="surface p-6 space-y-4">
            <h2 className="text-base font-bold text-[#0B1D3F] flex items-center gap-2">
              <Building2 size={18} className="text-blue-600" /> 1. Tashkilot va soliq maʼlumotlari
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Kompaniyaning rasmiy nomi *</label>
                <input 
                  type="text" 
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">STIR (soliq toʻlovchi raqami) *</label>
                <input
                  type="text"
                  required
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="tabular w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Masʼul shaxs ismi *</label>
                <input 
                  type="text" 
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Telefon raqami *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="tabular w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Korporativ elektron pochta *</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Shipping */}
          <div className="surface p-6 space-y-4">
            <h2 className="text-base font-bold text-[#0B1D3F] flex items-center gap-2">
              <Truck size={18} className="text-blue-600" /> 2. Yetkazib berish manzili
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Toʻliq manzil *</label>
                <input 
                  type="text" 
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-medium"
                />
              </div>

              <label className="flex items-center gap-2 text-slate-700 font-bold cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={needsRamp}
                  onChange={(e) => setNeedsRamp(e.target.checked)}
                  className="w-4 h-4 accent-blue-600"
                />
                <span>Yuklamani tushirish uchun gidravlik koʻtargichli mashina kerak</span>
              </label>
            </div>
          </div>

          {/* Step 3: Payment */}
          <div className="surface p-6 space-y-4">
            <h2 className="text-base font-bold text-[#0B1D3F] flex items-center gap-2">
              <CreditCard size={18} className="text-blue-600" /> 3. Toʻlov usuli
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div 
                onClick={() => setPaymentMethod('wire')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'wire' ? 'border-blue-600 bg-blue-50/50 font-bold' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <FileText size={20} className="text-blue-600 mb-1" />
                <div className="text-slate-900">Bank oʻtkazmasi</div>
                <div className="text-xs text-slate-500 font-normal mt-1">Rekvizitlar va hisob-faktura menejer bilan tasdiqlanadi</div>
              </div>

              <div 
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50 font-bold' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <CreditCard size={20} className="text-blue-600 mb-1" />
                <div className="text-slate-900">Karta orqali toʻlov</div>
                <div className="text-xs text-slate-500 font-normal mt-1">Uzcard, Humo, Visa, Mastercard</div>
              </div>

              <div 
                onClick={() => setPaymentMethod('leasing')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'leasing' ? 'border-blue-600 bg-blue-50/50 font-bold' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Building2 size={20} className="text-blue-600 mb-1" />
                <div className="text-slate-900">Lizing / boʻlib toʻlash</div>
                <div className="text-xs text-slate-500 font-normal mt-1">Shartlar menejer bilan alohida kelishiladi</div>
              </div>
            </div>
          </div>

        </div>

        {/* Order Summary Right */}
        <div className="lg:col-span-4 surface p-6 space-y-6">
          <h3 className="font-bold text-[#0B1D3F] text-lg">Buyurtma tarkibi</h3>

          <div className="space-y-4 divide-y divide-slate-100 text-xs max-h-60 overflow-y-auto">
            {cart.map(c => (
              <div key={c.product.id} className="pt-2 first:pt-0 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-900">{c.product.name}</div>
                  <div className="tabular text-xs text-slate-400">{c.quantity} dona</div>
                </div>
                <div className="tabular font-bold text-[#0B1D3F] font-mono">
                  {formatPrice(c.product.priceUSD * c.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-[#0B1D3F] text-base">Jami summa</span>
              <span className="tabular text-xl font-bold text-blue-700 font-mono">{formatPrice(cartSubtotalUSD)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn-secondary w-full py-4 uppercase tracking-wider"
          >
            <ShieldCheck size={18} /> Buyurtmani yuborish
          </button>
        </div>

      </form>

    </div>
  );
};
