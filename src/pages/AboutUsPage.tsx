import React from 'react';
import {
  Award,
  Building2,
  CheckCircle2,
  Clock,
  Factory,
  MapPin,
  Palette,
  Phone,
  ShieldCheck,
  TrainFront,
  Truck,
  Warehouse,
  Wrench
} from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * Five capabilities that separate a factory from a reseller. Each one is a
 * link in the chain the company owns end to end, which is the whole argument
 * of this page — so they are listed in the order the goods actually travel.
 */
const CAPABILITIES = [
  {
    icon: Factory,
    title: 'Oʻz ishlab chiqarish zavodimiz',
    body:
      '2020-yildan beri har bir mashina Toshkentdagi zavodimizda, boshidan ' +
      'oxirigacha oʻz nazoratimiz ostida yigʻiladi. Biz chet eldan tayyor ' +
      'texnika keltirib sotmaymiz — biz uni yasaymiz. Shuning uchun narx ' +
      'vositachi ustamalarisiz shakllanadi.'
  },
  {
    icon: Palette,
    title: 'Individual buyurtma (OEM)',
    body:
      'Siz tanlagan rangda ishlab chiqaramiz, sizning brendingiz va ' +
      'logotipingiz ostida chiqaramiz, kerakli texnik parametrlarga ' +
      'moslashtiramiz — quvvat, bak hajmi, choʻtka kengligi, ish rejimi. ' +
      'Yaʼni siz bizning mahsulotimizni emas, oʻzingizning mahsulotingizni olasiz.'
  },
  {
    icon: TrainFront,
    title: 'Shaxsiy temir yoʻl infratuzilmasi',
    body:
      'Oʻz teplovozimiz va shaxsiy temir yoʻl tarmogʻimiz bor. Vagonlar ' +
      'toʻgʻridan-toʻgʻri zavod hududiga kiradi. Bu ortiqcha qayta ' +
      'yuklashlarni, kechikishlarni va qoʻshimcha xarajatlarni butunlay ' +
      'yoʻq qiladi.'
  },
  {
    icon: Warehouse,
    title: 'Oʻz bojxona omborlarimiz',
    body:
      'Bojxona rasmiylashtiruvi biz tomonimizdan, oʻz omborlarimizda amalga ' +
      'oshiriladi. Siz tayyor hujjatlar bilan yukni qabul qilasiz — navbat va ' +
      'noaniq kutishlarsiz.'
  },
  {
    icon: Truck,
    title: 'Oʻz logistikamiz',
    body:
      'Yetkazib berishni tashqi kompaniyalarga topshirmaymiz. Zavoddan to ' +
      'sizning omboringizgacha boʻlgan yoʻlni biz nazorat qilamiz va muddat ' +
      'uchun javob beramiz.'
  }
];

const FIGURES = [
  { value: '5+ yil', label: 'ishlab chiqarish tajribasi (2020-yildan beri)' },
  { value: 'Toʻliq siklli', label: 'zavod — gʻoyadan tayyor mashinagacha' },
  { value: 'OEM', label: 'sizning brendingiz va rangingizda' },
  { value: '100%', label: 'oʻz logistikamiz va bojxona omborimiz' }
];

export const AboutUsPage: React.FC = () => {
  const { setActivePage, setIsQuoteModalOpen, productsList, siteSettings } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-sans space-y-12">

      {/* ------------------------------- banner ---------------------------- */}
      <div className="bg-[#0B1D3F] text-white rounded-lg p-8 sm:p-12 shadow-lg border border-slate-800 space-y-4">
        <span className="inline-block bg-blue-600 text-white font-bold text-xs px-4 py-1 rounded-full uppercase tracking-wider">
          Ishlab chiqaruvchi
        </span>
        <h1 className="text-3xl font-bold text-white">
          {siteSettings.brandName} — biz sotmaymiz, biz ishlab chiqaramiz
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl">
          2020-yildan beri — 5 yildan ortiq koʻcha supuruvchi va pol yuvuvchi
          texnika ishlab chiqaramiz.
        </p>
      </div>

      {/* ------------------------------- intro ----------------------------- */}
      <div className="max-w-3xl space-y-4 text-sm text-slate-600">
        <p>
          {siteSettings.brandName} — oddiy distribyutor yoki vositachi kompaniya
          emas. 2020-yildan beri, 5 yildan ortiq vaqt davomida biz koʻcha
          supuruvchi va pol yuvuvchi texnikani oʻzimiz ishlab chiqaramiz va
          sotamiz.
        </p>
        <p>
          Bu shuni anglatadiki, siz texnikani vositachilarsiz, toʻgʻridan-toʻgʻri
          ishlab chiqaruvchidan olasiz — eng maqbul narxda va sifat uchun toʻliq
          javobgarlik bilan. Sifatga oid savol tugʻilsa, siz uni yetkazib
          beruvchiga emas, mashinani yasagan kompaniyaga berasiz.
        </p>
        <p>
          Bu yillar davomida biz shunchaki mashina yasashni emas, butun zanjirni
          oʻz qoʻlimizda ushlab turishni oʻrgandik: ishlab chiqarish, bojxona,
          temir yoʻl va yetkazib berish — hammasi bizniki.
        </p>
      </div>

      {/* ---------------------------- capabilities ------------------------- */}
      <div className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Ustunliklarimiz
          </span>
          <h2 className="text-2xl font-bold text-[#0B1D3F]">
            Nima uchun aynan {siteSettings.brandName}?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAPABILITIES.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="surface p-6 space-y-4">
                <div className="w-11 h-11 rounded-lg bg-blue-600/10 border border-blue-600/20 text-blue-700 flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-[#0B1D3F] text-sm">{item.title}</h3>
                <p className="text-xs text-slate-600">{item.body}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* --------------------------- what we build ------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Biz nima ishlab chiqaramiz
          </span>
          <h2 className="text-2xl font-bold text-[#0B1D3F]">Ikki yoʻnalish</h2>

          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-4">
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-[#0B1D3F] text-sm">
                  Koʻcha supuruvchi mashinalar
                </h3>
                <p className="text-xs text-slate-600">
                  Shahar koʻchalari, sanoat hududlari va yoʻl xizmatlari uchun.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-[#0B1D3F] text-sm">
                  Pol yuvuvchi mashinalar
                </h3>
                <p className="text-xs text-slate-600">
                  Savdo markazlari, omborlar, ishlab chiqarish sexlari va
                  aeroportlar uchun.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <button onClick={() => setActivePage('products')} className="btn-primary">
              Modellarimiz ({productsList.length} ta)
            </button>
          </div>
        </div>

        <div className="relative">
          <img width={1280} height={960} loading="lazy" decoding="async"
            src="/images/scrubber-hero.jpg"
            alt={`${siteSettings.brandName} pol yuvish mashinasi`}
            className="rounded-lg shadow-lg border border-slate-200 object-cover w-full h-96"
          />
        </div>
      </div>

      {/* ------------------------------ figures ---------------------------- */}
      <div className="bg-[#0B1D3F] rounded-lg p-8 sm:p-12">
        <h2 className="text-xl font-bold text-white mb-8">Raqamlarda</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FIGURES.map(f => (
            <div key={f.value} className="space-y-2">
              <div className="text-2xl font-bold text-blue-400">{f.value}</div>
              <p className="text-xs text-slate-400">{f.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------- certificates ------------------------- */}
      {/* TODO: the client will supply the certificate list and scans. Until
          they arrive this states only what can be stated truthfully — no
          standard numbers or issuing bodies are invented here. */}
      <div className="surface p-8 sm:p-12 space-y-4">
        <div className="w-12 h-12 rounded-lg bg-[#0B1D3F] text-white flex items-center justify-center">
          <Award size={22} />
        </div>
        <h2 className="text-xl font-bold text-[#0B1D3F]">Sertifikatlar va standartlar</h2>
        <p className="text-sm text-slate-600 max-w-3xl">
          Mahsulotlarimiz belgilangan xavfsizlik va sifat talablariga muvofiq
          ishlab chiqariladi va tegishli hujjatlar bilan taʼminlanadi.
        </p>
      </div>

      {/* ------------------------- address and contact --------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: Building2,
            label: 'Ishlab chiqarish va ofis',
            value: `${siteSettings.address}, ${siteSettings.city}`
          },
          { icon: Phone, label: 'Telefon', value: siteSettings.phone },
          { icon: Clock, label: 'Ish vaqti', value: siteSettings.workingHours },
          { icon: MapPin, label: 'Katalog', value: `${productsList.length} ta model` }
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="p-6 bg-white rounded-lg border border-slate-200 shadow-sm space-y-2">
              <div className="w-11 h-11 rounded-lg bg-blue-600/10 border border-blue-600/20 text-blue-700 flex items-center justify-center">
                <Icon size={20} />
              </div>
              <h3 className="font-bold text-[#0B1D3F] text-sm">{item.label}</h3>
              <p className="text-xs text-slate-600 tabular">{item.value}</p>
            </div>
          );
        })}
      </div>

      {/* ------------------------------ service ---------------------------- */}
      <div className="surface p-8 sm:p-12 space-y-4">
        <div className="w-12 h-12 rounded-lg bg-[#0B1D3F] text-white flex items-center justify-center">
          <Wrench size={22} />
        </div>
        <h2 className="text-xl font-bold text-[#0B1D3F]">Servis va ehtiyot qismlar</h2>
        <p className="text-sm text-slate-600 max-w-3xl">
          Mashinani oʻzimiz yasaganimiz uchun ehtiyot qism va servis ham
          bizdan. Kafolat muddati modelga qarab farq qiladi — aniq shartlar har
          bir mahsulot sahifasidagi xarakteristikalar boʻlimida koʻrsatilgan.
        </p>
        <a
          href={`tel:${siteSettings.phone.replace(/\s/g, '')}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 hover:underline"
        >
          <Phone size={14} /> <span className="tabular">{siteSettings.phone}</span>
        </a>
      </div>

      {/* ----------------------------- closing CTA ------------------------- */}
      <div className="bg-[#0B1D3F] rounded-lg p-8 sm:p-12 space-y-6">
        <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center">
          <ShieldCheck size={22} />
        </div>
        <h2 className="text-2xl font-bold text-white max-w-2xl">
          Sizning brendingiz ostida texnika ishlab chiqarishimizni xohlaysizmi?
        </h2>
        <p className="text-sm text-slate-300 max-w-3xl">
          Biz uchun har bir mijoz — bir martalik bitim emas, uzoq muddatli
          hamkorlik. Shuning uchun 2020-yildan beri ishlab chiqarishdan yetkazib
          berishgacha boʻlgan butun zanjirni oʻz qoʻlimizda ushlab turamiz.
          Natijada siz aniq narx, aniq muddat va aniq javobgarlikni olasiz.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <button onClick={() => setIsQuoteModalOpen(true)} className="btn-primary px-6 py-4">
            Kommersiya taklifini olish
          </button>
          <button
            onClick={() => setActivePage('contact')}
            className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg text-xs font-bold text-white bg-white/10 border border-white/20 hover:bg-white/15 transition-colors duration-200 cursor-pointer"
          >
            Zavodga tashrif buyurish
          </button>
        </div>
      </div>

    </div>
  );
};
