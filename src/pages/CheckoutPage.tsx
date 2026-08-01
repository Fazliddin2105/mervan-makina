import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Building2,
  CreditCard,
  Truck,
  FileText,
  CheckCircle2,
  ArrowRight,
  Lock,
  Banknote,
  Landmark,
  Hash,
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  Receipt
} from 'lucide-react';

/**
 * A labelled field with its own glyph.
 *
 * The icon sits inside the control rather than beside the label so the eye
 * can scan the column of inputs and know what each one wants without
 * reading. Padding on the input leaves room for it.
 */
const Field: React.FC<{
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  className?: string;
  children: React.ReactNode;
}> = ({ label, icon: Icon, className = '', children }) => (
  <div className={className}>
    <label className="block text-slate-700 font-bold mb-1">{label}</label>
    <div className="relative">
      <Icon size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      {children}
    </div>
  </div>
);

/** One place to name the payment methods, used by the summary and the receipt. */
const PAYMENT_LABEL: Record<'wire' | 'card' | 'cash' | 'leasing', string> = {
  wire: 'Bank oʻtkazmasi',
  card: 'Karta orqali toʻlov',
  cash: 'Naqd pul',
  leasing: 'Lizing / boʻlib toʻlash'
};

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotalUSD, formatPrice, clearCart, setActivePage, showToast, addOrder } = useApp();

  // The fields used to open pre-filled with an invented company, tax number and
  // contact. On a live checkout that is a real hazard: a customer who does not
  // notice submits someone else's details, and the order is unusable.
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'wire' | 'card' | 'leasing' | 'cash'>('wire');
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
      paymentMethod:
        paymentMethod === 'wire'
          ? 'Bank Transfer'
          : paymentMethod === 'card'
            ? 'Credit Card'
            : paymentMethod === 'cash'
              ? 'Cash'
              : 'Installments',
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
            <span>{PAYMENT_LABEL[paymentMethod]}</span>
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
              <Field label="Kompaniyaning rasmiy nomi *" icon={Building2}>
                <input
                  type="text"
                  required
                  value={companyName}
                  placeholder="MChJ Nomi"
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-10 pr-4 font-medium"
                />
              </Field>

              <Field label="STIR (soliq toʻlovchi raqami) *" icon={Hash}>
                <input
                  type="text"
                  required
                  value={taxId}
                  placeholder="123456789"
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-10 pr-4 font-mono tabular"
                />
              </Field>

              <Field label="Masʼul shaxs ismi *" icon={User}>
                <input
                  type="text"
                  required
                  value={contactName}
                  placeholder="Ism Familiya"
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-10 pr-4 font-medium"
                />
              </Field>

              <Field label="Telefon raqami *" icon={Phone}>
                <input
                  type="tel"
                  required
                  value={phone}
                  placeholder="+998 __ ___ __ __"
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-10 pr-4 font-medium tabular"
                />
              </Field>

              <Field label="Korporativ elektron pochta *" icon={Mail} className="sm:col-span-2">
                <input
                  type="email"
                  required
                  value={email}
                  placeholder="buxgalteriya@kompaniya.uz"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-10 pr-4 font-medium"
                />
              </Field>
            </div>
          </div>

          {/* Step 2: Shipping */}
          <div className="surface p-6 space-y-4">
            <h2 className="text-base font-bold text-[#0B1D3F] flex items-center gap-2">
              <Truck size={18} className="text-blue-600" /> 2. Yetkazib berish manzili
            </h2>

            <div className="space-y-4 text-xs">
              <Field label="Toʻliq manzil *" icon={MapPin}>
                <input
                  type="text"
                  required
                  value={address}
                  placeholder="Ko'cha, uy, tuman, shahar"
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-10 pr-4 font-medium"
                />
              </Field>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div 
                onClick={() => setPaymentMethod('wire')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'wire' ? 'border-blue-600 bg-blue-50/50 font-bold' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Landmark size={20} className="text-blue-600 mb-1" />
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
                onClick={() => setPaymentMethod('cash')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cash' ? 'border-blue-600 bg-blue-50/50 font-bold' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Banknote size={20} className="text-blue-600 mb-1" />
                <div className="text-slate-900">Naqd pul</div>
                <div className="text-xs text-slate-500 font-normal mt-1">Ofisda yoki texnika topshirilganda</div>
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
          <h3 className="font-bold text-[#0B1D3F] text-lg flex items-center gap-2">
            <Package size={18} className="text-blue-600" /> Buyurtma tarkibi
          </h3>

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
              <span className="font-bold text-[#0B1D3F] text-base flex items-center gap-2">
                <Receipt size={16} className="text-blue-600" /> Jami summa
              </span>
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
