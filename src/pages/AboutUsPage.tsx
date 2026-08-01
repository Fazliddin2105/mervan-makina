import React from 'react';
import { Box, CheckCircle2, Clock, MapPin, Phone, Wrench } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutUsPage: React.FC = () => {
  const { setActivePage, setIsQuoteModalOpen, productsList, siteSettings } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-sans space-y-12">

      {/* Banner */}
      <div className="bg-[#0B1D3F] text-white rounded-2xl p-8 sm:p-12 shadow-xl border border-slate-800 space-y-4 text-center sm:text-left">
        <span className="bg-blue-600 text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
          Biz haqimizda
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white">{siteSettings.brandName}</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          O'zbekistonda ko'cha va pol tozalash uchun elektr mashinalari sotuvi bilan
          shug'ullanamiz. Katalogimizda supurish mashinalari, pol yuvish mashinalari,
          bir diskli tozalash apparati, bog' changyutgichi va gusenitsali yuk tashuvchi
          arava mavjud.
        </p>
      </div>

      {/* Main Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Nima taklif qilamiz</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1D3F]">
            Sanoat va kommunal tozalash texnikasi
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Mashinalarimiz omborxonalar, ishlab chiqarish sexlari, savdo majmualari,
            avtoturargohlar va ko'cha hududlarini tozalash uchun mo'ljallangan.
            Har bir model uchun to'liq texnik xarakteristikalar va narx saytda ochiq
            ko'rsatilgan — so'rov yuborishdan oldin taqqoslab ko'rishingiz mumkin.
          </p>

          <div className="space-y-2 pt-2 text-xs font-medium text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <span>Katalogda {productsList.length} ta texnika modeli, narxi ochiq ko'rsatilgan</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <span>Har bir model uchun bir nechta haqiqiy surat va to'liq xarakteristika</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <span>Toshkentdagi ofisimizda mashinalarni jonli ko'rish imkoni</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl text-xs hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Tijorat taklifi so'rash
            </button>
            <button
              onClick={() => setActivePage('contact')}
              className="bg-slate-100 text-slate-800 font-bold px-6 py-3 rounded-xl text-xs hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Bog'lanish
            </button>
          </div>
        </div>

        <div className="relative">
          <img width={1280} height={960} loading="lazy" decoding="async"
            src="/images/scrubber-hero.jpg"
            alt={`${siteSettings.brandName} pol yuvish mashinasi`}
            className="rounded-2xl shadow-2xl border border-slate-200 object-cover w-full h-96"
          />
        </div>
      </div>

      {/* Practical details — every value here comes from site settings, so the
          admin panel stays the single source of truth. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: MapPin, label: 'Manzil', value: `${siteSettings.address}, ${siteSettings.city}` },
          { icon: Phone, label: 'Telefon', value: siteSettings.phone },
          { icon: Clock, label: 'Ish vaqti', value: siteSettings.workingHours },
          { icon: Box, label: 'Katalog', value: `${productsList.length} ta model` }
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-600/20 text-blue-700 flex items-center justify-center">
                <Icon size={20} />
              </div>
              <h3 className="font-bold text-[#0B1D3F] text-sm">{item.label}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.value}</p>
            </div>
          );
        })}
      </div>

      {/* Service */}
      <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-4">
        <div className="w-12 h-12 rounded-xl bg-[#0B1D3F] text-white flex items-center justify-center">
          <Wrench size={22} />
        </div>
        <h2 className="text-xl font-extrabold text-[#0B1D3F]">Servis va ehtiyot qismlar</h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          Sotilgan texnika bo'yicha servis, ehtiyot qism va rasxodniklar masalasida
          telefon orqali bog'laning. Kafolat muddati modelga qarab farq qiladi — aniq
          shartlar har bir mahsulot sahifasidagi xarakteristikalar bo'limida
          ko'rsatilgan.
        </p>
        <a
          href={`tel:${siteSettings.phone.replace(/\s/g, '')}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 hover:underline"
        >
          <Phone size={14} /> {siteSettings.phone}
        </a>
      </div>

    </div>
  );
};
