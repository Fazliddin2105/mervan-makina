import React, { useState } from 'react';
import { X, Download, CheckCircle2, ArrowLeft, User, Phone, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { printQuote } from '../lib/quotePdf';

/**
 * A labelled field with its glyph inside the control, matching the checkout
 * form so the two do not read as two different products.
 */
const Field: React.FC<{
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}> = ({ label, icon: Icon, children }) => (
  <div>
    <label className="block text-slate-700 font-bold mb-1">{label}</label>
    <div className="relative">
      <Icon size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      {children}
    </div>
  </div>
);

export const QuoteModal: React.FC = () => {
  const {
    isQuoteModalOpen,
    setIsQuoteModalOpen,
    quoteModalProduct,
    setQuoteModalProduct,
    submitQuoteRequest,
    formatPrice,
    cart,
    siteSettings
  } = useApp();

  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [facilityType, setFacilityType] = useState('Zavod / ishlab chiqarish');
  const [quantity] = useState(1);

  if (!isQuoteModalOpen) return null;

  const targetProducts = quoteModalProduct
    ? [{ product: quoteModalProduct, quantity }]
    : cart.length > 0
      ? cart
      : [];

  const totalEstimateUSD = targetProducts.reduce(
    (acc, item) => acc + item.product.priceUSD * item.quantity,
    0
  );

  const close = () => {
    setIsQuoteModalOpen(false);
    setQuoteModalProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !phone) return;

    // The fields the client asked to drop are still part of QuoteRequest, so
    // they are submitted empty rather than removed from the record — the admin
    // panel can fill them in later without a data migration.
    submitQuoteRequest({
      companyName: '',
      contactName,
      email: '',
      phone,
      tinNumber: '',
      city: 'Toshkent',
      facilityType,
      facilityAreaM2: 0,
      items: targetProducts,
      notes: '',
      totalEstimateUSD
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative bg-white rounded-lg max-w-2xl w-full shadow-lg overflow-hidden border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="bg-[#0B1D3F] text-white p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              onClick={close}
              aria-label="Ortga"
              className="w-9 h-9 shrink-0 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors duration-200 cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-0">
              <h3 className="font-bold text-lg">Tijorat taklifi soʻrash</h3>
              <p className="text-xs text-slate-300">Soʻrovingiz boʻyicha siz bilan bogʻlanamiz</p>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Yopish"
            className="w-8 h-8 shrink-0 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors duration-200 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Machine scope */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
              Tanlangan texnika ({targetProducts.length} ta)
            </h4>
            {targetProducts.length > 0 ? (
              <div className="space-y-2 max-h-36 overflow-y-auto pr-2">
                {targetProducts.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-slate-200/70"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold text-blue-700">[{item.product.brand}]</span>
                      <span className="font-bold text-slate-800 line-clamp-1">{item.product.name}</span>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 font-bold">
                      <span className="tabular">{item.quantity} dona</span>
                      <span className="text-[#0B1D3F] tabular">
                        {formatPrice(item.product.priceUSD * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Katalogdan yoki savatdan texnika tanlansa, u shu yerda koʻrinadi.
              </p>
            )}

            <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-200 text-sm font-bold text-[#0B1D3F]">
              <span>Taxminiy summa:</span>
              <span className="text-blue-700 text-base tabular">{formatPrice(totalEstimateUSD)}</span>
            </div>
          </div>

          {/* Form inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <Field label="Ismingiz *" icon={User}>
              <input
                type="text"
                required
                placeholder="Masalan: Jasur Saidov"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 pl-10 pr-4 text-slate-800 focus:bg-white focus:border-blue-600"
              />
            </Field>

            <Field label="Telefon raqami *" icon={Phone}>
              <input
                type="tel"
                required
                placeholder="+998 90 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 pl-10 pr-4 text-slate-800 tabular focus:bg-white focus:border-blue-600"
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="Obyekt turi" icon={Building2}>
                <select
                  value={facilityType}
                  onChange={(e) => setFacilityType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 pl-10 pr-4 text-slate-800 focus:bg-white focus:border-blue-600"
                >
                  <option value="Zavod / ishlab chiqarish">Zavod / ishlab chiqarish</option>
                  <option value="Logistika ombori">Logistika ombori</option>
                  <option value="Savdo markazi">Savdo markazi</option>
                  <option value="Shifoxona / tibbiyot muassasasi">Shifoxona / tibbiyot muassasasi</option>
                  <option value="Mehmonxona">Mehmonxona</option>
                  <option value="Aeroport / transport uzeli">Aeroport / transport uzeli</option>
                  <option value="Ofis binosi">Ofis binosi</option>
                  <option value="Koʻcha / yoʻl xizmati">Koʻcha / yoʻl xizmati</option>
                </select>
              </Field>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={close}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
              >
                <ArrowLeft size={15} /> Ortga
              </button>

              <button
                type="button"
                onClick={() =>
                  printQuote({
                    settings: siteSettings,
                    contactName,
                    phone,
                    facilityType,
                    items: targetProducts,
                    formatPrice
                  })
                }
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
              >
                <Download size={15} /> Taklifni PDF qilib olish
              </button>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all duration-200 cursor-pointer"
            >
              <CheckCircle2 size={16} /> Soʻrovni yuborish
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
