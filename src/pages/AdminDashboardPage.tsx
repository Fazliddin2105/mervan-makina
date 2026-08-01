import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  Package,
  FileText,
  Plus,
  Trash2,
  Edit,
  Search,
  Settings,
  Share2,
  KeyRound,
  ShoppingBag,
  ShieldAlert,
  LogIn,
  LogOut,
  Save,
  X,
  Eye,
  EyeOff,
  Palette,
  ImageIcon,
  RotateCcw
} from 'lucide-react';
import { Product, SocialLink, SiteSettings, AdminCredentials, QuoteRequest, Order } from '../types';

type Tab = 'kpi' | 'products' | 'orders' | 'quotes' | 'settings' | 'socials' | 'credentials';

const EMPTY_PRODUCT: Product = {
  id: '',
  name: '',
  model: '',
  brand: 'Mervan Makina',
  brandId: 'mervan-makina',
  category: 'floor-scrubbers',
  priceUSD: 0,
  rating: 5,
  reviewsCount: 0,
  inStock: true,
  stockCount: 1,
  isFeatured: false,
  isNew: false,
  voltage: '',
  power: '',
  brushWidth: '',
  tankCapacity: '',
  productivity: '',
  usageArea: [],
  machineType: 'Walk-behind',
  description: '',
  longDescription: '',
  specs: [],
  images: ['']
};

// -------------------------------------------------------------
// Login screen (shown if user is not admin)
// -------------------------------------------------------------
const AdminLoginScreen: React.FC = () => {
  const { adminLogin, adminCredentials } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = adminLogin(username, password);
    if (!ok) setError('Login yoki parol noto\'g\'ri');
  };

  const isDefault = adminCredentials.username === 'admin' && adminCredentials.password === 'admin123';

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-br from-[#0B1D3F] to-[#071531] p-8 text-white text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-black">Admin Panel</h1>
          <p className="text-slate-300 text-sm mt-1">Boshqaruv paneliga kirish</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {isDefault && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              <b>Boshlang'ich ma'lumotlar:</b><br />
              Login: <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">admin</code><br />
              Parol: <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">admin123</code><br />
              <span className="italic">Kirgach, ushbu ma'lumotlarni almashtiring.</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Login</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="mt-1 w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600"
              placeholder="admin"
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Parol</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 pr-11"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-xs text-rose-600 font-semibold">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-[#0B1D3F] hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <LogIn size={16} /> Tizimga Kirish
          </button>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Product Form Modal
// -------------------------------------------------------------
const ProductFormModal: React.FC<{
  initial: Product | null;
  onClose: () => void;
  onSave: (p: Product) => void;
}> = ({ initial, onClose, onSave }) => {
  const [p, setP] = useState<Product>(initial ?? { ...EMPTY_PRODUCT, id: 'p-' + Date.now() });
  const [imagesText, setImagesText] = useState((initial?.images ?? ['']).join('\n'));
  const [usageAreaText, setUsageAreaText] = useState((initial?.usageArea ?? []).join(', '));
  const [specsText, setSpecsText] = useState(
    (initial?.specs ?? []).map(s => `${s.label} | ${s.value}`).join('\n')
  );

  const patch = (upd: Partial<Product>) => setP(prev => ({ ...prev, ...upd }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const images = imagesText.split('\n').map(s => s.trim()).filter(Boolean);
    const usageArea = usageAreaText.split(',').map(s => s.trim()).filter(Boolean);
    const specs = specsText.split('\n')
      .map(line => line.split('|').map(s => s.trim()))
      .filter(arr => arr.length === 2 && arr[0] && arr[1])
      .map(([label, value]) => ({ label, value }));

    onSave({
      ...p,
      // Falls back to a real catalog photo rather than a stock image, so a
      // product saved without pictures still shows one of our own machines.
      images: images.length ? images : ['/images/products/mk-3/1.webp'],
      usageArea,
      specs
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl my-8">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b rounded-t-3xl">
          <h2 className="font-black text-lg text-[#0B1D3F]">
            {initial ? 'Mahsulotni Tahrirlash' : 'Yangi Mahsulot Qo\'shish'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-600 uppercase">Nomi *</label>
            <input required value={p.name} onChange={e => patch({ name: e.target.value })}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Model</label>
            <input value={p.model} onChange={e => patch({ model: e.target.value })}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Brand</label>
            <input value={p.brand} onChange={e => patch({ brand: e.target.value })}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Kategoriya (id)</label>
            <select value={p.category} onChange={e => patch({ category: e.target.value })}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600 bg-white">
              <option value="floor-scrubbers">Pol Yuvish Mashinalari</option>
              <option value="sweepers">Supurish Mashinalari</option>
              <option value="ride-on-machines">Haydaladigan Texnikalar</option>
              <option value="vacuum-cleaners">Sanoat Changyutgichlari</option>
              <option value="industrial-vacuums">Maxsus Vakuum</option>
              <option value="pressure-washers">Yuqori Bosim</option>
              <option value="carpet-cleaners">Gilam Yuvish</option>
              <option value="steam-cleaners">Bug'li Tozalagichlar</option>
              <option value="cleaning-chemicals">Kimyoviy Vositalar</option>
              <option value="accessories">Aksessuarlar</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Mashina Tipi</label>
            <select value={p.machineType} onChange={e => patch({ machineType: e.target.value as Product['machineType'] })}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 bg-white">
              <option>Ride-on</option>
              <option>Walk-behind</option>
              <option>Compact</option>
              <option>Vertical</option>
              <option>Stationary</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Narx (USD) *</label>
            <input required type="number" min={0} step={0.01} value={p.priceUSD}
              onChange={e => patch({ priceUSD: parseFloat(e.target.value) || 0 })}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Eski Narx (USD)</label>
            <input type="number" min={0} step={0.01} value={p.oldPriceUSD ?? ''}
              onChange={e => patch({ oldPriceUSD: e.target.value ? parseFloat(e.target.value) : undefined })}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Ombordagi Soni</label>
            <input type="number" min={0} value={p.stockCount}
              onChange={e => patch({ stockCount: parseInt(e.target.value) || 0, inStock: (parseInt(e.target.value) || 0) > 0 })}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Kuchlanish</label>
            <input value={p.voltage} onChange={e => patch({ voltage: e.target.value })}
              placeholder="36V Litiy"
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Quvvat</label>
            <input value={p.power} onChange={e => patch({ power: e.target.value })}
              placeholder="1200W"
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Cho'tka Kengligi</label>
            <input value={p.brushWidth} onChange={e => patch({ brushWidth: e.target.value })}
              placeholder="510 mm"
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Bak Sig'imi</label>
            <input value={p.tankCapacity} onChange={e => patch({ tankCapacity: e.target.value })}
              placeholder="50L / 55L"
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-600 uppercase">Unumdorlik</label>
            <input value={p.productivity} onChange={e => patch({ productivity: e.target.value })}
              placeholder="2,500 m²/soat"
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-600 uppercase">Foydalanish Sohalari (vergul bilan ajrating)</label>
            <input value={usageAreaText} onChange={e => setUsageAreaText(e.target.value)}
              placeholder="Zavodlar, Ombor, Aeroport"
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-600 uppercase">Qisqa Tavsif *</label>
            <textarea required value={p.description} onChange={e => patch({ description: e.target.value })}
              rows={2}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-600 uppercase">To'liq Tavsif</label>
            <textarea value={p.longDescription} onChange={e => patch({ longDescription: e.target.value })}
              rows={4}
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-600 uppercase">Rasm URL lari (har biri yangi qatorda)</label>
            <textarea value={imagesText} onChange={e => setImagesText(e.target.value)}
              rows={3}
              placeholder="https://..."
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600 font-mono text-xs" />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-600 uppercase">Texnik Xarakteristikalar (har qator: "Nomi | Qiymati")</label>
            <textarea value={specsText} onChange={e => setSpecsText(e.target.value)}
              rows={6}
              placeholder="Model | MK-3&#10;Quvvat | 200W"
              className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600 font-mono text-xs" />
          </div>

          <div className="flex flex-wrap gap-4 sm:col-span-2 text-xs">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={p.isFeatured ?? false} onChange={e => patch({ isFeatured: e.target.checked })} />
              <span>Bosh sahifada ko'rsatish (Featured)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={p.isNew ?? false} onChange={e => patch({ isNew: e.target.checked })} />
              <span>Yangi mahsulot (Yangi belgi)</span>
            </label>
          </div>

          <div className="sm:col-span-2 flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
              Bekor qilish
            </button>
            <button type="submit"
              className="px-5 py-2.5 bg-[#0B1D3F] hover:bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
              <Save size={16} /> Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Main Admin Dashboard
// -------------------------------------------------------------
export const AdminDashboardPage: React.FC = () => {
  const {
    user,
    logout,
    productsList,
    addNewProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    deleteOrder,
    quoteRequests,
    updateQuoteStatus,
    deleteQuote,
    siteSettings,
    updateSiteSettings,
    updateSocials,
    resetSiteSettings,
    adminCredentials,
    updateAdminCredentials,
    formatPrice,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<Tab>('kpi');
  const [searchInventory, setSearchInventory] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  if (!user || user.role !== 'admin') {
    return <AdminLoginScreen />;
  }

  const filteredInventory = productsList.filter(p =>
    p.name.toLowerCase().includes(searchInventory.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchInventory.toLowerCase()) ||
    p.model.toLowerCase().includes(searchInventory.toLowerCase())
  );

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalUSD, 0);
  const pendingOrders = orders.filter(o => o.status === 'Processing').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-sans space-y-6">

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0B1D3F] to-[#071531] text-white rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="bg-blue-600 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
            {siteSettings.brandName} — Admin Panel
          </span>
          <h1 className="text-2xl font-black text-white mt-1">Boshqaruv Konsoli</h1>
          <p className="text-xs text-slate-300">Xush kelibsiz, {user.name}</p>
        </div>
        <button
          onClick={logout}
          className="bg-slate-800 hover:bg-rose-600 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
        >
          <LogOut size={14} /> Chiqish
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 text-xs">
        {([
          { id: 'kpi', label: 'Dashboard', icon: BarChart3 },
          { id: 'products', label: `Mahsulotlar (${productsList.length})`, icon: Package },
          { id: 'orders', label: `Buyurtmalar (${orders.length})`, icon: ShoppingBag },
          { id: 'quotes', label: `So'rovlar (${quoteRequests.length})`, icon: FileText },
          { id: 'settings', label: 'Sayt Sozlamalari', icon: Settings },
          { id: 'socials', label: 'Ijtimoiy Tarmoqlar', icon: Share2 },
          { id: 'credentials', label: 'Admin Ma\'lumotlari', icon: KeyRound }
        ] as { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[]).map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-[#0B1D3F] text-white shadow'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon size={14} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- Dashboard Tab --- */}
      {activeTab === 'kpi' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Umumiy Daromad</span>
            <div className="text-2xl font-black text-[#0B1D3F] mt-1">{formatPrice(totalRevenue)}</div>
            <p className="text-[11px] text-slate-500 mt-1">{orders.length} buyurtma</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Mahsulotlar</span>
            <div className="text-2xl font-black text-[#0B1D3F] mt-1">{productsList.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Katalogda</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Kutilayotgan</span>
            <div className="text-2xl font-black text-blue-700 mt-1">{pendingOrders}</div>
            <p className="text-[11px] text-slate-500 mt-1">Buyurtmalar</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase">So'rovlar</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">{quoteRequests.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Yangi mijozlar</p>
          </div>
        </div>
      )}

      {/* --- Products Tab --- */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="font-bold text-[#0B1D3F] text-base">Mahsulotlar Katalogi</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <input
                  type="text"
                  placeholder="Model, brend yoki nomni qidirish..."
                  value={searchInventory}
                  onChange={e => setSearchInventory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs"
                />
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              </div>
              <button
                onClick={() => setIsCreating(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <Plus size={14} /> Qo'shish
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="p-3">Mahsulot</th>
                  <th className="p-3">Brend / Model</th>
                  <th className="p-3">Narx</th>
                  <th className="p-3">Ombor</th>
                  <th className="p-3">Holat</th>
                  <th className="p-3 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInventory.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3 font-bold text-slate-900">
                        <img src={p.images[0]} alt="" className="w-10 h-10 object-cover bg-slate-100 rounded-lg" referrerPolicy="no-referrer" />
                        <span className="line-clamp-1 max-w-xs">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600">{p.brand}<br /><span className="text-slate-400">{p.model}</span></td>
                    <td className="p-3 font-mono font-bold text-[#0B1D3F]">{formatPrice(p.priceUSD)}</td>
                    <td className="p-3 font-mono text-slate-500">{p.stockCount}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {p.inStock ? 'Mavjud' : 'Yo\'q'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                        title="Tahrirlash"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`"${p.name}" mahsulotini o'chirasizmi?`)) deleteProduct(p.id);
                        }}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg"
                        title="O'chirish"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredInventory.length === 0 && (
                  <tr><td colSpan={6} className="p-6 text-center text-slate-400">Mahsulot topilmadi</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- Orders Tab --- */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-[#0B1D3F] text-base">Buyurtmalar</h2>
          {orders.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">Hozircha buyurtmalar yo'q</p>
          ) : (
            <div className="space-y-3">
              {orders.map(o => (
                <OrderRow key={o.id} order={o} formatPrice={formatPrice} onStatus={updateOrderStatus} onDelete={deleteOrder} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- Quotes Tab --- */}
      {activeTab === 'quotes' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-[#0B1D3F] text-base">Tijorat Taklifi So'rovlari</h2>
          {quoteRequests.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">Hozircha so'rovlar yo'q</p>
          ) : (
            <div className="space-y-3">
              {quoteRequests.map(q => (
                <QuoteRow key={q.id} quote={q} onStatus={updateQuoteStatus} onDelete={deleteQuote} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- Site Settings Tab --- */}
      {activeTab === 'settings' && (
        <SiteSettingsForm settings={siteSettings} onSave={updateSiteSettings} onReset={resetSiteSettings} />
      )}

      {/* --- Social Media Tab --- */}
      {activeTab === 'socials' && (
        <SocialsEditor socials={siteSettings.socials} onSave={updateSocials} />
      )}

      {/* --- Admin Credentials Tab --- */}
      {activeTab === 'credentials' && (
        <CredentialsForm current={adminCredentials} onSave={updateAdminCredentials} />
      )}

      {(editingProduct || isCreating) && (
        <ProductFormModal
          initial={editingProduct}
          onClose={() => { setEditingProduct(null); setIsCreating(false); }}
          onSave={(p) => {
            if (editingProduct) updateProduct(p);
            else addNewProduct(p);
            setEditingProduct(null);
            setIsCreating(false);
          }}
        />
      )}
    </div>
  );
};

// -------------------------------------------------------------
// Order row
// -------------------------------------------------------------
const OrderRow: React.FC<{
  order: Order;
  formatPrice: (n: number) => string;
  onStatus: (id: string, s: Order['status']) => void;
  onDelete: (id: string) => void;
}> = ({ order, formatPrice, onStatus, onDelete }) => (
  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
    <div className="flex flex-wrap justify-between items-start gap-3">
      <div>
        <div className="font-bold text-[#0B1D3F] text-sm">#{order.orderNumber}</div>
        <div className="text-xs text-slate-500 mt-0.5">{order.customerName} • {order.phone}</div>
        <div className="text-xs text-slate-400 mt-0.5">{order.date} • {order.items.length} mahsulot</div>
      </div>
      <div className="text-right">
        <div className="font-black text-[#0B1D3F]">{formatPrice(order.totalUSD)}</div>
        <select
          value={order.status}
          onChange={e => onStatus(order.id, e.target.value as Order['status'])}
          className="mt-2 text-[10px] border border-slate-300 rounded px-2 py-1 bg-white font-semibold"
        >
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      <button
        onClick={() => { if (confirm('Buyurtmani o\'chirasizmi?')) onDelete(order.id); }}
        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg self-start"
      >
        <Trash2 size={13} />
      </button>
    </div>
  </div>
);

// -------------------------------------------------------------
// Quote row
// -------------------------------------------------------------
const QuoteRow: React.FC<{
  quote: QuoteRequest;
  onStatus: (id: string, s: QuoteRequest['status']) => void;
  onDelete: (id: string) => void;
}> = ({ quote, onStatus, onDelete }) => (
  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
    <div className="flex flex-wrap justify-between items-start gap-3">
      <div>
        <div className="font-bold text-[#0B1D3F] text-sm">{quote.companyName}</div>
        <div className="text-xs text-slate-500 mt-0.5">{quote.contactName} • {quote.phone} • {quote.email}</div>
        <div className="text-xs text-slate-400 mt-0.5">{quote.city} • {quote.createdAt} • {quote.items.length} pozitsiya</div>
        {quote.notes && <div className="text-xs italic text-slate-600 mt-2">"{quote.notes}"</div>}
      </div>
      <div className="text-right">
        <select
          value={quote.status}
          onChange={e => onStatus(quote.id, e.target.value as QuoteRequest['status'])}
          className="text-[10px] border border-slate-300 rounded px-2 py-1 bg-white font-semibold"
        >
          <option value="Pending">Pending</option>
          <option value="In Review">In Review</option>
          <option value="Approved">Approved</option>
          <option value="Contacted">Contacted</option>
        </select>
      </div>
      <button
        onClick={() => { if (confirm('So\'rovni o\'chirasizmi?')) onDelete(quote.id); }}
        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg self-start"
      >
        <Trash2 size={13} />
      </button>
    </div>
  </div>
);

// -------------------------------------------------------------
// Site Settings Form
// -------------------------------------------------------------
const SiteSettingsForm: React.FC<{
  settings: SiteSettings;
  onSave: (p: Partial<SiteSettings>) => void;
  onReset: () => void;
}> = ({ settings, onSave, onReset }) => {
  const [s, setS] = useState<SiteSettings>(settings);
  const patch = (u: Partial<SiteSettings>) => setS(prev => ({ ...prev, ...u }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(s);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-[#0B1D3F] text-base flex items-center gap-2">
          <Settings size={18} /> Sayt Sozlamalari
        </h2>
        <button
          type="button"
          onClick={() => { if (confirm('Barcha sozlamalarni boshlang\'ich holatga qaytarasizmi?')) { onReset(); setS(settings); } }}
          className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1"
        >
          <RotateCcw size={13} /> Qayta tiklash
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase">Kompaniya Nomi</label>
          <input value={s.brandName} onChange={e => patch({ brandName: e.target.value })}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase">Qisqa Kod (Logotip harf)</label>
          <input value={s.brandShort} maxLength={4} onChange={e => patch({ brandShort: e.target.value })}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600 uppercase" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-slate-600 uppercase">Slogan / Tagline</label>
          <input value={s.tagline} onChange={e => patch({ tagline: e.target.value })}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1"><ImageIcon size={12} /> Logo URL (bo'sh — harf ko'rsatiladi)</label>
          <input value={s.logoUrl} onChange={e => patch({ logoUrl: e.target.value })}
            placeholder="https://..."
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600 font-mono text-xs" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-slate-600 uppercase">Hero (bosh sahifa) sarlavhasi</label>
          <input value={s.heroTitle} onChange={e => patch({ heroTitle: e.target.value })}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-slate-600 uppercase">Hero Kichik matni</label>
          <textarea value={s.heroSubtitle} onChange={e => patch({ heroSubtitle: e.target.value })}
            rows={2}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-slate-600 uppercase">Hero Rasm URL</label>
          <input value={s.heroImage} onChange={e => patch({ heroImage: e.target.value })}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600 font-mono text-xs" />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1"><Palette size={12} /> Asosiy rang</label>
          <div className="mt-1 flex gap-2">
            <input type="color" value={s.primaryColor} onChange={e => patch({ primaryColor: e.target.value })}
              className="w-14 h-10 border border-slate-300 rounded-lg cursor-pointer" />
            <input value={s.primaryColor} onChange={e => patch({ primaryColor: e.target.value })}
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 font-mono text-xs" />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1"><Palette size={12} /> Aksent rang</label>
          <div className="mt-1 flex gap-2">
            <input type="color" value={s.accentColor} onChange={e => patch({ accentColor: e.target.value })}
              className="w-14 h-10 border border-slate-300 rounded-lg cursor-pointer" />
            <input value={s.accentColor} onChange={e => patch({ accentColor: e.target.value })}
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 font-mono text-xs" />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 uppercase">Telefon (asosiy)</label>
          <input value={s.phone} onChange={e => patch({ phone: e.target.value })}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase">Telefon (qo'shimcha)</label>
          <input value={s.phoneSecondary} onChange={e => patch({ phoneSecondary: e.target.value })}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 uppercase">Email (asosiy)</label>
          <input value={s.email} onChange={e => patch({ email: e.target.value })}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase">Email (qo'shimcha)</label>
          <input value={s.emailSecondary} onChange={e => patch({ emailSecondary: e.target.value })}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-slate-600 uppercase">Manzil</label>
          <input value={s.address} onChange={e => patch({ address: e.target.value })}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase">Shahar</label>
          <input value={s.city} onChange={e => patch({ city: e.target.value })}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase">Ish soatlari</label>
          <input value={s.workingHours} onChange={e => patch({ workingHours: e.target.value })}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-slate-600 uppercase">Google Maps embed URL</label>
          <input value={s.mapEmbedUrl} onChange={e => patch({ mapEmbedUrl: e.target.value })}
            placeholder="https://maps.google.com/maps?q=..."
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600 font-mono text-xs" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-slate-600 uppercase">Kompaniya haqida qisqa matn</label>
          <textarea value={s.aboutShort} onChange={e => patch({ aboutShort: e.target.value })}
            rows={3}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-slate-600 uppercase">Copyright matni</label>
          <input value={s.copyrightText} onChange={e => patch({ copyrightText: e.target.value })}
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600" />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button type="submit"
          className="px-6 py-3 bg-[#0B1D3F] hover:bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
          <Save size={16} /> Sozlamalarni Saqlash
        </button>
      </div>
    </form>
  );
};

// -------------------------------------------------------------
// Socials Editor
// -------------------------------------------------------------
const SocialsEditor: React.FC<{
  socials: SocialLink[];
  onSave: (list: SocialLink[]) => void;
}> = ({ socials, onSave }) => {
  const [list, setList] = useState<SocialLink[]>(socials);

  const patchOne = (id: string, u: Partial<SocialLink>) =>
    setList(prev => prev.map(s => s.id === id ? { ...s, ...u } : s));

  const remove = (id: string) => setList(prev => prev.filter(s => s.id !== id));

  const add = () => setList(prev => [
    ...prev,
    { id: 's-' + Date.now(), platform: 'other', label: 'Yangi', url: '', enabled: true }
  ]);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-[#0B1D3F] text-base flex items-center gap-2">
          <Share2 size={18} /> Ijtimoiy Tarmoqlar
        </h2>
        <button
          onClick={add}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
        >
          <Plus size={13} /> Qo'shish
        </button>
      </div>

      <div className="space-y-2">
        {list.map(s => (
          <div key={s.id} className="grid grid-cols-1 sm:grid-cols-[130px_130px_1fr_60px_40px] gap-2 items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
            <select value={s.platform} onChange={e => patchOne(s.id, { platform: e.target.value as SocialLink['platform'] })}
              className="border border-slate-300 rounded-lg px-2 py-1.5 text-xs bg-white">
              <option value="instagram">Instagram</option>
              <option value="telegram">Telegram</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="facebook">Facebook</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter/X</option>
              <option value="other">Boshqa</option>
            </select>
            <input value={s.label} onChange={e => patchOne(s.id, { label: e.target.value })}
              placeholder="Ko'rsatiladigan nom"
              className="border border-slate-300 rounded-lg px-2 py-1.5 text-xs" />
            <input value={s.url} onChange={e => patchOne(s.id, { url: e.target.value })}
              placeholder="https://..."
              className="border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-mono" />
            <label className="flex items-center justify-center gap-1 text-xs">
              <input type="checkbox" checked={s.enabled} onChange={e => patchOne(s.id, { enabled: e.target.checked })} />
              <span>Yoq</span>
            </label>
            <button onClick={() => { if (confirm('O\'chirasizmi?')) remove(s.id); }}
              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        {list.length === 0 && (
          <p className="text-center text-slate-400 py-6 text-sm">Ijtimoiy tarmoqlar qo'shilmagan</p>
        )}
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button
          onClick={() => onSave(list)}
          className="px-6 py-3 bg-[#0B1D3F] hover:bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
          <Save size={16} /> Ijtimoiy tarmoqlarni Saqlash
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Admin Credentials Form
// -------------------------------------------------------------
const CredentialsForm: React.FC<{
  current: AdminCredentials;
  onSave: (c: AdminCredentials) => void;
}> = ({ current, onSave }) => {
  const [username, setUsername] = useState(current.username);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) { setError('Login bo\'sh bo\'lmasligi kerak'); return; }
    if (password && password.length < 4) { setError('Parol kamida 4 belgidan iborat bo\'lsin'); return; }
    if (password && password !== confirmPassword) { setError('Parollar mos kelmayapti'); return; }

    onSave({
      username: username.trim(),
      password: password || current.password
    });
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 max-w-lg">
      <h2 className="font-bold text-[#0B1D3F] text-base flex items-center gap-2">
        <KeyRound size={18} /> Admin Ma'lumotlarini O'zgartirish
      </h2>
      <p className="text-xs text-slate-500">Ushbu login va parol admin panelga kirish uchun ishlatiladi. Xavfsiz saqlang.</p>

      <div>
        <label className="text-xs font-bold text-slate-600 uppercase">Yangi Login</label>
        <input value={username} onChange={e => setUsername(e.target.value)}
          className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-600" />
      </div>

      <div>
        <label className="text-xs font-bold text-slate-600 uppercase">Yangi Parol (bo'sh — o'zgartirilmaydi)</label>
        <div className="relative mt-1">
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 pr-11 focus:outline-none focus:border-blue-600" />
          <button type="button" onClick={() => setShowPassword(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-600 uppercase">Parolni Tasdiqlash</label>
        <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-600" />
      </div>

      {error && <div className="text-xs text-rose-600 font-semibold">{error}</div>}

      <div className="flex justify-end pt-2">
        <button type="submit"
          className="px-6 py-3 bg-[#0B1D3F] hover:bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
          <Save size={16} /> O'zgarishlarni Saqlash
        </button>
      </div>
    </form>
  );
};
