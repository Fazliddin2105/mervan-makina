import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Calendar, FileText, User, Wrench, Clock, CheckCircle2, Download, LogOut } from 'lucide-react';
import { PageBanner } from '../components/PageBanner';

/** Order status and payment method are stored as typed English values shared with
 *  the admin panel, so only the label shown to the customer is translated. */
const ORDER_STATUS_LABELS: Record<string, string> = {
  Processing: 'Rasmiylashtirilmoqda',
  Shipped: 'Yoʻlda',
  Delivered: 'Yetkazildi',
  Cancelled: 'Bekor qilindi'
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  'Bank Transfer': 'Bank oʻtkazmasi',
  'Credit Card': 'Karta orqali toʻlov',
  'Corporate Invoice': 'Hisob-faktura',
  Installments: 'Boʻlib toʻlash'
};

export const CustomerDashboardPage: React.FC = () => {
  const { user, orders, formatPrice, setIsQuoteModalOpen, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'orders' | 'amc' | 'profile'>('orders');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-sans space-y-8">
      
      {/* Top Banner */}
      <PageBanner
        eyebrow="B2B KORPORATIV HISOB"
        title={user?.company || 'MegaLogistics Central LLC'}
        subtitle={`Masʼul shaxs: ${user?.name || '—'} • STIR: ${user?.tin || '—'}`}
      >
        <button
          onClick={() => setIsQuoteModalOpen(true)}
          className="btn-primary uppercase tracking-wider"
        >
          Yangi soʻrov yuborish
        </button>
      </PageBanner>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 text-xs">
        {[
          { id: 'orders', label: `Buyurtmalar (${orders.length})`, icon: Package },
          { id: 'amc', label: 'Texnik xizmat shartnomalari', icon: Wrench },
          { id: 'profile', label: 'Kompaniya ma\'lumotlari', icon: User }
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === t.id ? 'bg-[#0B1D3F] text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon size={14} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="font-bold text-[#0B1D3F] text-base">Buyurtmalar tarixi</h2>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="surface p-6 space-y-4 text-xs">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="tabular font-bold text-[#0B1D3F] text-sm">{order.id}</span>
                      <span className="tabular text-slate-400 block font-mono">
                        Sana: {order.date} • {PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}
                      </span>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200">
                      {ORDER_STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-slate-700">
                        <span>{item.product.name} (<span className="tabular">{item.quantity}</span> dona)</span>
                        <span className="tabular font-mono font-bold text-slate-900">{formatPrice(item.product.priceUSD * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="font-bold text-[#0B1D3F]">Jami summa: <span className="tabular">{formatPrice(order.totalUSD)}</span></span>
                    <button
                      onClick={() => showToast('Hisob-fakturani yuklab olish hozircha mavjud emas.')}
                      className="text-blue-700 font-bold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Download size={13} /> Hisob-faktura
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">Hozircha buyurtmalar yoʻq.</p>
          )}
        </div>
      )}

      {activeTab === 'amc' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="surface p-6 space-y-3 text-xs">
            <h3 className="font-bold text-[#0B1D3F] text-base">Texnik xizmat shartnomalari</h3>
            <p className="text-slate-600">
              Hisobingizda hozircha faol texnik xizmat shartnomasi yoʻq. Rejali texnik koʻrik shartnomasini rasmiylashtirish uchun menejerimizga soʻrov qoldiring.
            </p>
            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="btn-primary"
            >
              Soʻrov qoldirish
            </button>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="surface p-6 max-w-xl space-y-4 text-xs">
          <h3 className="font-bold text-[#0B1D3F] text-base">Kompaniya rekvizitlari</h3>
          <div className="space-y-2 text-slate-700">
            <div><span className="font-bold text-slate-400">Rasmiy nomi:</span> {user?.company}</div>
            <div><span className="font-bold text-slate-400">STIR:</span> <span className="tabular">{user?.tin}</span></div>
            <div><span className="font-bold text-slate-400">Elektron pochta:</span> {user?.email}</div>
            <div><span className="font-bold text-slate-400">Telefon:</span> <span className="tabular">{user?.phone}</span></div>
          </div>
        </div>
      )}

    </div>
  );
};
