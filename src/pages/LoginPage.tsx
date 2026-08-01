import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { loginAsCustomer, user, setActivePage, siteSettings } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    loginAsCustomer(email.trim());
    setPassword('');
    setActivePage('dashboard');
  };

  return (
    <div className="min-h-[70vh] bg-[radial-gradient(circle_at_top,_rgba(255,138,0,0.18),_transparent_45%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-700 shadow-sm">
            <Sparkles size={14} />
            B2B kabinet
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-[#0B1D3F]">
              {siteSettings.brandName} kabinetiga kiring
            </h1>
            <p className="max-w-2xl text-lg text-slate-600">
              Tijorat takliflari, buyurtmalar va soʻrovlaringizni bitta joyda boshqaring.
            </p>
          </div>

          <div className="grid gap-4 surface p-6 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
                <ShieldCheck size={18} />
              </div>
              <h2 className="font-bold text-[#0B1D3F]">Buyurtmalarni kuzatish</h2>
              <p className="mt-1 text-sm text-slate-600">Xaridlar tarixi va yuborilgan soʻrovlaringizni koʻrib chiqing.</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
                <Lock size={18} />
              </div>
              <h2 className="font-bold text-[#0B1D3F]">Maʼlumotlar brauzeringizda</h2>
              <p className="mt-1 text-sm text-slate-600">Kiritilgan maʼlumotlar serverga yuborilmaydi — faqat shu brauzeringizda saqlanadi.</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-xl surface p-8 shadow-lg">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">Xush kelibsiz</p>
            <h2 className="mt-2 text-2xl font-bold text-[#0B1D3F]">Tizimga kirish</h2>
            <p className="mt-2 text-sm text-slate-600">Kabinetga kirish uchun ish pochtangizdan foydalaning.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-bold text-slate-700">
              Elektron pochta
              <div className="mt-2 flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
                <Mail size={16} className="text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="siz@kompaniya.uz"
                  className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none"
                  required
                />
              </div>
            </label>

            <label className="block text-sm font-bold text-slate-700">
              Parol
              <div className="mt-2 flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
                <Lock size={16} className="text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parolni kiriting"
                  className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none"
                />
              </div>
            </label>

            <button
              type="submit"
              className="btn-secondary w-full"
            >
              Kabinetga oʻtish
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-600">
            <button
              type="button"
              onClick={() => setActivePage('admin')}
              className="rounded-lg border border-slate-200 px-4 py-4 text-left font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 cursor-pointer"
            >
              Administrator panelini ochish
            </button>
            {user && (
              <button
                type="button"
                onClick={() => setActivePage('dashboard')}
                className="rounded-lg bg-blue-50 px-4 py-4 text-left font-bold text-blue-800 transition hover:bg-blue-100 cursor-pointer"
              >
                Siz allaqachon tizimdasiz. Kabinetga oʻtish.
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
