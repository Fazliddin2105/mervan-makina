import React, { useState } from 'react';
import { X, FileText, CheckCircle2, Download, Building, Mail, Phone, MapPin, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QuoteModal: React.FC = () => {
  const { isQuoteModalOpen, setIsQuoteModalOpen, quoteModalProduct, setQuoteModalProduct, submitQuoteRequest, formatPrice, cart, siteSettings } = useApp();

  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tinNumber, setTinNumber] = useState('');
  const [city, setCity] = useState('Tashkent');
  const [facilityType, setFacilityType] = useState('Factory / Manufacturing');
  const [facilityAreaM2, setFacilityAreaM2] = useState<number>(5000);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!isQuoteModalOpen) return null;

  const targetProducts = quoteModalProduct 
    ? [{ product: quoteModalProduct, quantity }]
    : cart.length > 0 
      ? cart 
      : [];

  const totalEstimateUSD = targetProducts.reduce((acc, item) => acc + (item.product.priceUSD * item.quantity), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactName || !email || !phone) return;

    submitQuoteRequest({
      companyName,
      contactName,
      email,
      phone,
      tinNumber,
      city,
      facilityType,
      facilityAreaM2,
      items: targetProducts,
      notes,
      totalEstimateUSD
    });
  };

  const handleDownloadDraft = () => {
    const textContent = `
=====================================================
${siteSettings.brandName}
TIJORAT TAKLIFI (LOYIHA)
${siteSettings.address}, ${siteSettings.city}
Tel: ${siteSettings.phone}
=====================================================

Client Company: ${companyName || 'N/A'}
Contact Person: ${contactName || 'N/A'}
Phone: ${phone || 'N/A'}
Email: ${email || 'N/A'}
TIN (STIR): ${tinNumber || 'N/A'}
Facility Type: ${facilityType} (${facilityAreaM2} m²)

ITEMS IN QUOTATION:
${targetProducts.map((p, i) => `${i+1}. ${p.product.name} (${p.product.model})
   Qty: ${p.quantity} x ${p.product.priceUSD} USD = ${p.product.priceUSD * p.quantity} USD`).join('\n')}

ESTIMATED TOTAL: ${totalEstimateUSD} USD (${formatPrice(totalEstimateUSD)})
INCLUDES: 2-Year Enterprise Warranty, Free On-site Staff Training, 1st Year Maintenance
=====================================================
    `;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mervan_Makina_taklif_${companyName || 'loyiha'}.txt`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#0B1D3F] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Official B2B Quote Request</h3>
              <p className="text-xs text-slate-300">Soʻrovingiz boʻyicha siz bilan bogʻlanamiz</p>
            </div>
          </div>
          <button 
            onClick={() => { setIsQuoteModalOpen(false); setQuoteModalProduct(null); }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Machine Items Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
              Quotation Machine Scope ({targetProducts.length} items)
            </h4>
            {targetProducts.length > 0 ? (
              <div className="space-y-2 max-h-36 overflow-y-auto pr-2">
                {targetProducts.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded-xl border border-slate-200/70">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-700">[{item.product.brand}]</span>
                      <span className="font-bold text-slate-800 line-clamp-1">{item.product.name}</span>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 font-bold">
                      <span>Qty: {item.quantity}</span>
                      <span className="text-[#0B1D3F]">{formatPrice(item.product.priceUSD * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Select products from catalog or cart to request specific quotation.</p>
            )}
            
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-200 text-sm font-bold text-[#0B1D3F]">
              <span>Estimated Equipment Subtotal:</span>
              <span className="text-blue-700 text-base">{formatPrice(totalEstimateUSD)}</span>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            <div>
              <label className="block text-slate-700 font-bold mb-1">Company Name *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Tashkent Logistics Park LLC"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Contact Person Name *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Jasur Saidov"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Corporate Email *</label>
              <input 
                type="email" 
                required
                placeholder="j.saidov@company.uz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Phone Number *</label>
              <input 
                type="tel" 
                required
                placeholder="+998 90 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Tax ID / TIN (STIR)</label>
              <input 
                type="text" 
                placeholder="9-digit TIN number"
                value={tinNumber}
                onChange={(e) => setTinNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Facility Type</label>
              <select 
                value={facilityType}
                onChange={(e) => setFacilityType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
              >
                <option value="Factory / Manufacturing">Factory / Manufacturing</option>
                <option value="Logistics Warehouse">Logistics Warehouse</option>
                <option value="Shopping Mall">Shopping Mall</option>
                <option value="Hospital / Medical Facility">Hospital / Medical Facility</option>
                <option value="Hotel & Resort">Hotel & Resort</option>
                <option value="Airport / Transit Hub">Airport / Transit Hub</option>
                <option value="Commercial Office Building">Commercial Office Building</option>
              </select>
            </div>

          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1 text-xs">Special Operational Notes / Leasing Request</label>
            <textarea 
              rows={2}
              placeholder="Specify floor area m², special requirements, corporate installment plans, or AMC preferences..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button 
              type="button"
              onClick={handleDownloadDraft}
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Download size={15} /> Download PDF Estimate Draft
            </button>

            <button 
              type="submit"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <CheckCircle2 size={16} /> Submit Quotation Request
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
