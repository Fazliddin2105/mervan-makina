import React from 'react';
import { SERVICES_DATA } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { Wrench, ShieldCheck, CheckCircle2, Phone, Clock, FileText } from 'lucide-react';
import { PageBanner } from '../components/PageBanner';

export const ServicesPage: React.FC = () => {
  const { setIsQuoteModalOpen, siteSettings } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-sans space-y-10">
      
      <PageBanner
        eyebrow="TOʻLIQ TEXNIK XIZMAT"
        title="Texnik xizmat, taʼmirlash va YTXK xizmatlari"
        subtitle="Koʻchma servis avtomobillari va Yillik Texnik Xizmat Koʻrsatish (YTXK) shartnomalari yordamida pol yuvish, supurish mashinalari va yuqori bosimli yuvish apparatlaringizni 100% ish holatida saqlang."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {SERVICES_DATA.map((svc) => (
          <div key={svc.id} className="surface p-6 sm:p-8 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-600/20 text-blue-700 flex items-center justify-center font-bold">
                  <Wrench size={24} />
                </div>
                <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bold">
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#0B1D3F]">{svc.title}</h3>
              <p className="text-xs text-slate-600">{svc.fullDetails}</p>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Xizmatning asosiy afzalliklari:</h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {svc.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                onClick={() => setIsQuoteModalOpen(true)}
                className="btn-secondary"
              >
                <FileText size={15} /> Servis rejasini band qilish
              </button>
              <a href={`tel:${siteSettings.phone.replace(/\s/g, '')}`} className="text-xs text-blue-700 font-bold hover:underline flex items-center gap-1">
                <Phone size={14} /> Toʻgʻridan-toʻgʻri aloqa
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
