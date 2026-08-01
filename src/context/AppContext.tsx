import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const getPageFromPath = (path: string): PageType => {
  const normalized = path.replace(/^\//, '').split('/')[0] || 'home';
  const routeMap: Record<string, PageType> = {
    '': 'home',
    'home': 'home',
    'products': 'products',
    'product': 'product-detail',
    'about': 'about',
    'services': 'services',
    'blog': 'blog',
    'contact': 'contact',
    'faq': 'faq',
    'wishlist': 'wishlist',
    'compare': 'compare',
    'cart': 'cart',
    'checkout': 'checkout',
    'dashboard': 'dashboard',
    'admin': 'admin',
    'login': 'login'
  };

  return routeMap[normalized] || 'home';
};
import {
  Product,
  CartItem,
  QuoteRequest,
  Order,
  Language,
  Currency,
  PageType,
  FilterState,
  User,
  SiteSettings,
  SocialLink,
  AdminCredentials
} from '../types';
import { PRODUCTS_DATA } from '../data/mockData';
import { buildLeadMessage, deliverLead, type DeliveryResult } from '../lib/leadDelivery';

interface AppContextType {
  // Navigation & Page State
  activePage: PageType;
  setActivePage: (page: PageType) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
  selectedBrandId: string | null;
  setSelectedBrandId: (id: string | null) => void;
  selectedBlogId: string | null;
  setSelectedBlogId: (id: string | null) => void;

  // Language & Currency
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  formatPrice: (priceUSD: number) => string;
  t: (key: string) => string;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotalUSD: number;
  couponCode: string;
  applyCoupon: (code: string) => boolean;
  couponDiscountPercent: number;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Compare
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;

  // Quick View & Modals
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isQuoteModalOpen: boolean;
  setIsQuoteModalOpen: (open: boolean) => void;
  quoteModalProduct: Product | null;
  setQuoteModalProduct: (product: Product | null) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;

  // Search & Filters
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;

  // User & Auth
  user: User | null;
  loginAsCustomer: (email: string) => void;
  adminLogin: (username: string, password: string) => boolean;
  logout: () => void;

  // Site Settings
  siteSettings: SiteSettings;
  updateSiteSettings: (patch: Partial<SiteSettings>) => void;
  updateSocials: (socials: SocialLink[]) => void;
  resetSiteSettings: () => void;

  // Admin Credentials
  adminCredentials: AdminCredentials;
  updateAdminCredentials: (creds: AdminCredentials) => void;

  // Orders & Quotes
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;
  quoteRequests: QuoteRequest[];
  submitQuoteRequest: (req: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateQuoteStatus: (id: string, status: QuoteRequest['status']) => void;
  deleteQuote: (id: string) => void;

  // Products Management
  productsList: Product[];
  addNewProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const defaultFilters: FilterState = {
  category: 'all',
  brand: 'all',
  minPrice: 0,
  maxPrice: 500000,
  voltage: 'all',
  machineType: 'all',
  usageArea: 'all',
  inStockOnly: false,
  searchQuery: '',
  sortBy: 'featured'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const EXCHANGE_RATES = {
  USD: 1,
  UZS: 12600,
  EUR: 0.92
};

/**
 * What the customer is told after a submission. Only the 'sent' branch claims
 * the message reached the company — the others tell the truth.
 */
const DELIVERY_MESSAGE: Record<DeliveryResult, (phone: string) => string> = {
  sent: () => "So'rovingiz yuborildi. Tez orada bog'lanamiz.",
  handoff: () => "So'rov matni nusxalandi va Telegram ochildi — yuborish uchun \"Send\" tugmasini bosing.",
  failed: (phone) => `So'rovni yuborib bo'lmadi. Iltimos, ${phone} raqamiga qo'ng'iroq qiling.`
};

const SYMBOLS = {
  USD: '$',
  UZS: " so'm",
  EUR: '€'
};

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandName: 'Mervan Makina',
  brandShort: 'MM',
  tagline: 'Sanoat va Kommunal Tozalash Uskunalari Rasmiy Yetkazib Beruvchisi',
  logoUrl: '',
  heroTitle: 'Sanoat Darajasidagi Tozalash Uskunalari',
  heroSubtitle: 'Ko\'chalar, ombor va zavodlar uchun professional supurish va pol yuvish mashinalari. To\'g\'ridan-to\'g\'ri ishlab chiqaruvchidan, kafolat bilan.',
  heroImage: '/images/products/mk-3/1.webp',
  primaryColor: '#0B1D3F',
  accentColor: '#2563EB',
  phone: '+998 91 071 87 57',
  phoneSecondary: '+998 90 013 66 00',
  // No email is published on the company's existing site. Left blank rather than
  // invented — every consumer hides the row when it is empty. Fill in from the
  // admin panel once a real address is confirmed.
  email: '',
  emailSecondary: '',
  address: 'Sergeli tumani, Yangi Sergeli ko\'chasi 1',
  city: 'Toshkent',
  workingHours: 'Dush-Juma 09:00-18:00 (tanaffus 13:00-14:00), Shan-Yak: dam olish',
  mapEmbedUrl: 'https://maps.google.com/maps?q=Yangi%20Sergeli%20ko%27chasi%201%2C%20Sergeli%2C%20Toshkent&t=&z=15&ie=UTF8&iwloc=&output=embed',
  socials: [
    // Confirmed by the owner. The instagram/facebook handles on the old site
    // belonged to GLOTR, its hosting platform — not to this company.
    { id: 's1', platform: 'instagram', label: 'Instagram', url: 'https://instagram.com/mervan_makina', enabled: true },
    { id: 's2', platform: 'telegram', label: 'Telegram', url: 'https://t.me/+998910718757', enabled: true },
    { id: 's3', platform: 'youtube', label: 'YouTube', url: '', enabled: false },
    { id: 's4', platform: 'tiktok', label: 'TikTok', url: '', enabled: false },
    { id: 's5', platform: 'facebook', label: 'Facebook', url: '', enabled: false },
    { id: 's6', platform: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/998910718757', enabled: true }
  ],
  aboutShort: 'Mervan Makina — O\'zbekiston bo\'ylab sanoat va kommunal tozalash uskunalari sohasida ishonchli hamkoringiz. Bevosita ishlab chiqaruvchidan, kafolatli mahsulotlar va tezkor xizmat.',
  copyrightText: '© 2026 Mervan Makina. Barcha huquqlar himoyalangan.'
};

const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  username: 'admin',
  password: 'admin123'
};

const LS_KEYS = {
  PRODUCTS: 'mm_products',
  SETTINGS: 'mm_site_settings',
  CREDS: 'mm_admin_creds',
  ORDERS: 'mm_orders',
  QUOTES: 'mm_quotes',
  USER: 'mm_user',
  CART: 'mm_cart',
  WISHLIST: 'mm_wishlist',
  SEED_VERSION: 'mm_seed_version'
};

/**
 * The catalog and site settings are seeded from code but then owned by the admin
 * panel, which writes them to localStorage. That means a browser holding an old
 * copy would never see a corrected default again.
 *
 * Bump this whenever the shipped catalog or default settings change in a way that
 * must reach browsers that already cached the previous values. Doing so discards
 * only the seeded data — carts, wishlists, orders, quotes and logins survive.
 */
const SEED_VERSION = '2026-07-31-real-mervan-catalog-v3';

function loadLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Like loadLS, but a stale seed version falls back to the shipped defaults. */
function loadSeeded<T>(key: string, fallback: T): T {
  try {
    if (localStorage.getItem(LS_KEYS.SEED_VERSION) !== SEED_VERSION) {
      localStorage.removeItem(key);
      return fallback;
    }
  } catch {
    return fallback;
  }
  return loadLS(key, fallback);
}

function saveLS<T>(key: string, val: T) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // storage full or unavailable — ignore
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<PageType>(() => getPageFromPath(window.location.pathname));
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  const [language, setLanguage] = useState<Language>('UZ');
  const [currency, setCurrency] = useState<Currency>('UZS');

  const [cart, setCart] = useState<CartItem[]>(() => loadLS<CartItem[]>(LS_KEYS.CART, []));
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponDiscountPercent, setCouponDiscountPercent] = useState<number>(0);

  const [wishlist, setWishlist] = useState<Product[]>(() => loadLS<Product[]>(LS_KEYS.WISHLIST, []));
  const [compareList, setCompareList] = useState<Product[]>([]);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [quoteModalProduct, setQuoteModalProduct] = useState<Product | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const [productsList, setProductsList] = useState<Product[]>(() =>
    loadSeeded<Product[]>(LS_KEYS.PRODUCTS, PRODUCTS_DATA)
  );

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() =>
    loadSeeded<SiteSettings>(LS_KEYS.SETTINGS, DEFAULT_SITE_SETTINGS)
  );

  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>(() =>
    loadLS<AdminCredentials>(LS_KEYS.CREDS, DEFAULT_ADMIN_CREDENTIALS)
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(() => loadLS<User | null>(LS_KEYS.USER, null));

  const [orders, setOrders] = useState<Order[]>(() => loadLS<Order[]>(LS_KEYS.ORDERS, []));

  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>(() =>
    loadLS<QuoteRequest[]>(LS_KEYS.QUOTES, [])
  );

  // Stamp the seed version once the current defaults are in state, so the reset
  // above happens exactly once per version bump rather than on every load.
  // Written raw, not JSON-encoded, to match the comparison in loadSeeded.
  useEffect(() => {
    try { localStorage.setItem(LS_KEYS.SEED_VERSION, SEED_VERSION); } catch { /* storage unavailable */ }
  }, []);

  // Persist to localStorage whenever these change
  useEffect(() => { saveLS(LS_KEYS.PRODUCTS, productsList); }, [productsList]);
  useEffect(() => { saveLS(LS_KEYS.SETTINGS, siteSettings); }, [siteSettings]);
  useEffect(() => { saveLS(LS_KEYS.CREDS, adminCredentials); }, [adminCredentials]);
  useEffect(() => { saveLS(LS_KEYS.ORDERS, orders); }, [orders]);
  useEffect(() => { saveLS(LS_KEYS.QUOTES, quoteRequests); }, [quoteRequests]);
  useEffect(() => { saveLS(LS_KEYS.USER, user); }, [user]);
  useEffect(() => { saveLS(LS_KEYS.CART, cart); }, [cart]);
  useEffect(() => { saveLS(LS_KEYS.WISHLIST, wishlist); }, [wishlist]);

  // Apply theme colors from settings as CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--brand-primary', siteSettings.primaryColor);
    document.documentElement.style.setProperty('--brand-accent', siteSettings.accentColor);
  }, [siteSettings.primaryColor, siteSettings.accentColor]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const formatPrice = (priceUSD: number): string => {
    const converted = priceUSD * EXCHANGE_RATES[currency];
    if (currency === 'UZS') {
      return new Intl.NumberFormat('uz-UZ').format(Math.round(converted)) + SYMBOLS.UZS;
    }
    if (currency === 'EUR') {
      return SYMBOLS.EUR + new Intl.NumberFormat('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(converted);
    }
    return SYMBOLS.USD + new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(converted);
  };

  const translations: Record<string, Record<Language, string>> = {
    'nav.products': { EN: 'Products', UZ: 'Mahsulotlar', RU: 'Продукция' },
    'nav.services': { EN: 'Services', UZ: 'Xizmatlar', RU: 'Услуги' },
    'nav.about': { EN: 'About Us', UZ: 'Biz haqimizda', RU: 'О нас' },
    'nav.blog': { EN: 'Blog', UZ: 'Blog', RU: 'Блог' },
    'nav.contact': { EN: 'Contact', UZ: 'Aloqa', RU: 'Контакты' },
    'btn.shopNow': { EN: 'Shop Equipment', UZ: 'Uskunalarni ko\'rish', RU: 'Каталог оборудования' },
    'btn.quote': { EN: 'Request Quote', UZ: 'Tijorat taklifi', RU: 'Запросить КП' },
    'btn.addToCart': { EN: 'Add to Cart', UZ: 'Savatga qo\'shish', RU: 'В корзину' },
    'btn.quickView': { EN: 'Quick View', UZ: 'Tezkor ko\'rish', RU: 'Быстрый просмотр' }
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  // Cart
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + quantity };
        return updated;
      }
      return [...prev, { product, quantity }];
    });
    showToast(`${product.name} savatga qo'shildi`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Savatdan olib tashlandi');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotalUSD = cart.reduce((acc, item) => acc + (item.product.priceUSD * item.quantity), 0);

  const applyCoupon = (code: string) => {
    const upper = code.toUpperCase();
    if (upper === 'CLEAN2026' || upper === 'MEGAVAN10' || upper === 'MERVAN10') {
      setCouponCode(upper);
      setCouponDiscountPercent(10);
      showToast('10% korporativ chegirma qo\'llandi!');
      return true;
    }
    if (upper === 'VIPOFFER') {
      setCouponCode('VIPOFFER');
      setCouponDiscountPercent(15);
      showToast('15% VIP chegirma qo\'llandi!');
      return true;
    }
    showToast('Noto\'g\'ri kupon kodi');
    return false;
  };

  // Wishlist
  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        showToast('Sevimlilardan olib tashlandi');
        return prev.filter(p => p.id !== product.id);
      }
      showToast('Sevimlilarga qo\'shildi');
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => wishlist.some(p => p.id === productId);

  // Compare
  const addToCompare = (product: Product) => {
    if (compareList.length >= 4) {
      showToast('Bir vaqtda maksimum 4 ta mahsulotni solishtirish mumkin');
      return;
    }
    if (!compareList.some(p => p.id === product.id)) {
      setCompareList(prev => [...prev, product]);
      showToast('Solishtirishga qo\'shildi');
    }
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
  };

  const isInCompare = (productId: string) => compareList.some(p => p.id === productId);
  const clearCompare = () => setCompareList([]);

  const resetFilters = () => setFilters(defaultFilters);

  // Auth
  const loginAsCustomer = (email: string) => {
    setUser({
      id: 'usr-' + Date.now(),
      name: email.split('@')[0],
      email,
      company: '',
      role: 'customer',
      phone: ''
    });
    showToast('Xush kelibsiz!');
  };

  const adminLogin = (username: string, password: string): boolean => {
    if (username.trim() === adminCredentials.username && password === adminCredentials.password) {
      setUser({
        id: 'admin-1',
        name: username,
        email: siteSettings.email,
        company: siteSettings.brandName,
        role: 'admin',
        phone: siteSettings.phone
      });
      showToast('Administrator sifatida tizimga kirdingiz');
      return true;
    }
    showToast('Login yoki parol noto\'g\'ri');
    return false;
  };

  const logout = () => {
    setUser(null);
    showToast('Tizimdan chiqildi');
  };

  // Site settings
  const updateSiteSettings = (patch: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({ ...prev, ...patch }));
    showToast('Sozlamalar saqlandi');
  };

  const updateSocials = (socials: SocialLink[]) => {
    setSiteSettings(prev => ({ ...prev, socials }));
    showToast('Ijtimoiy tarmoqlar yangilandi');
  };

  const resetSiteSettings = () => {
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    showToast('Sozlamalar boshlang\'ich holatga qaytarildi');
  };

  const updateAdminCredentials = (creds: AdminCredentials) => {
    setAdminCredentials(creds);
    showToast('Administrator ma\'lumotlari o\'zgartirildi');
  };

  // Orders
  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    clearCart();
    showToast(`Buyurtma #${order.orderNumber} muvaffaqiyatli qabul qilindi!`);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    showToast(`Buyurtma holati o'zgartirildi: ${status}`);
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    showToast('Buyurtma o\'chirildi');
  };

  /** The company's own Telegram, as configured in the admin panel. */
  const companyTelegramUrl = (): string | undefined =>
    siteSettings.socials.find(s => s.platform === 'telegram' && s.enabled && s.url)?.url;

  // Quotes
  const submitQuoteRequest = (reqData: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>) => {
    const newQuote: QuoteRequest = {
      ...reqData,
      id: 'qr-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setQuoteRequests(prev => [newQuote, ...prev]);
    setIsQuoteModalOpen(false);

    const message = buildLeadMessage('YANGI TIJORAT TAKLIFI SO\'ROVI', [
      { label: 'Kompaniya', value: newQuote.companyName },
      { label: 'Aloqa uchun shaxs', value: newQuote.contactName },
      { label: 'Telefon', value: newQuote.phone },
      { label: 'Email', value: newQuote.email },
      { label: 'Shahar', value: newQuote.city },
      { label: 'Obyekt turi', value: newQuote.facilityType },
      { label: 'Maydon (m2)', value: newQuote.facilityAreaM2 },
      { label: 'STIR', value: newQuote.tinNumber },
      { label: 'Mahsulotlar', value: newQuote.items.map(i => `${i.product.name} x${i.quantity}`).join(', ') },
      { label: 'Izoh', value: newQuote.notes }
    ]);

    deliverLead(message, companyTelegramUrl()).then(result => {
      showToast(DELIVERY_MESSAGE[result](siteSettings.phone));
    });
  };

  const updateQuoteStatus = (id: string, status: QuoteRequest['status']) => {
    setQuoteRequests(prev => prev.map(q => q.id === id ? { ...q, status } : q));
    showToast(`So'rov holati o'zgartirildi: ${status}`);
  };

  const deleteQuote = (id: string) => {
    setQuoteRequests(prev => prev.filter(q => q.id !== id));
    showToast('So\'rov o\'chirildi');
  };

  // Product CRUD
  const addNewProduct = (product: Product) => {
    setProductsList(prev => [product, ...prev]);
    showToast(`${product.name} katalogga qo'shildi`);
  };

  const updateProduct = (updated: Product) => {
    setProductsList(prev => prev.map(p => p.id === updated.id ? updated : p));
    showToast(`${updated.name} yangilandi`);
  };

  const deleteProduct = (id: string) => {
    setProductsList(prev => prev.filter(p => p.id !== id));
    showToast('Mahsulot katalogdan o\'chirildi');
  };

  const navigateToPage = (page: PageType) => {
    setActivePage(page);
    const route = page === 'home' ? '/' : `/${page}`;
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const syncFromLocation = () => {
      setActivePage(getPageFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', syncFromLocation);
    return () => window.removeEventListener('popstate', syncFromLocation);
  }, []);

  return (
    <AppContext.Provider value={{
      activePage,
      setActivePage: navigateToPage,
      selectedProductId,
      setSelectedProductId,
      selectedCategoryId,
      setSelectedCategoryId,
      selectedBrandId,
      setSelectedBrandId,
      selectedBlogId,
      setSelectedBlogId,

      language,
      setLanguage,
      currency,
      setCurrency,
      formatPrice,
      t,

      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartCount,
      cartSubtotalUSD,
      couponCode,
      applyCoupon,
      couponDiscountPercent,

      wishlist,
      toggleWishlist,
      isInWishlist,

      compareList,
      addToCompare,
      removeFromCompare,
      isInCompare,
      clearCompare,

      quickViewProduct,
      setQuickViewProduct,
      isQuoteModalOpen,
      setIsQuoteModalOpen,
      quoteModalProduct,
      setQuoteModalProduct,
      isSearchModalOpen,
      setIsSearchModalOpen,

      filters,
      setFilters,
      resetFilters,

      user,
      loginAsCustomer,
      adminLogin,
      logout,

      siteSettings,
      updateSiteSettings,
      updateSocials,
      resetSiteSettings,

      adminCredentials,
      updateAdminCredentials,

      orders,
      addOrder,
      updateOrderStatus,
      deleteOrder,
      quoteRequests,
      submitQuoteRequest,
      updateQuoteStatus,
      deleteQuote,

      productsList,
      addNewProduct,
      updateProduct,
      deleteProduct,

      toastMessage,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
