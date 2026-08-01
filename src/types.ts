export type Language = 'EN' | 'UZ' | 'RU';
export type Currency = 'USD' | 'UZS' | 'EUR';

export type PageType = 
  | 'home' 
  | 'products' 
  | 'product-detail'
  | 'about' 
  | 'services' 
  | 'blog' 
  | 'contact' 
  | 'faq' 
  | 'wishlist' 
  | 'compare' 
  | 'cart' 
  | 'checkout' 
  | 'dashboard' 
  | 'admin'
  | 'login';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  company: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  model: string;
  brand: string; // Display name of the manufacturer, e.g. "Mervan Makina"
  brandId: string;
  category: string; // Category ID e.g. "scrubbers", "vacuums", "pressure-washers", "sweepers"
  priceUSD: number;
  oldPriceUSD?: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  isNew?: boolean;
  discountPercent?: number;
  // Industrial Specs
  voltage: string; // e.g., "36V Lithium", "24V Battery", "230V Cable"
  power: string; // e.g., "1200W", "2000W", "3.5 kW"
  brushWidth: string; // e.g., "510 mm", "850 mm"
  tankCapacity: string; // e.g., "50L / 55L", "110L / 125L"
  productivity: string; // e.g., "2,500 m²/h", "6,200 m²/h"
  usageArea: string[]; // e.g., ["Factories", "Warehouses", "Hospitals", "Malls"]
  machineType: 'Ride-on' | 'Walk-behind' | 'Compact' | 'Vertical' | 'Stationary';
  description: string;
  longDescription: string;
  specs: ProductSpec[];
  images: string[];
  videoUrl?: string;
  manualPdfUrl?: string;
  cadFileUrl?: string;
  frequentlyBoughtWith?: string[]; // IDs of accessory products
  reviews?: ProductReview[];
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  description: string;
  itemCount: number;
  image: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  country: string;
  established: string;
  description: string;
  isOfficialPartner: boolean;
  featured: boolean;
  productCount: number;
  website: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface QuoteItem {
  product: Product;
  quantity: number;
}

export interface QuoteRequest {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  tinNumber?: string;
  city: string;
  facilityType: string;
  facilityAreaM2?: number;
  items: QuoteItem[];
  notes?: string;
  totalEstimateUSD: number;
  createdAt: string;
  status: 'Pending' | 'In Review' | 'Approved' | 'Contacted';
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  email: string;
  phone: string;
  companyName?: string;
  items: CartItem[];
  subtotalUSD: number;
  taxUSD: number;
  shippingUSD: number;
  discountUSD: number;
  totalUSD: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: 'Credit Card' | 'Corporate Invoice' | 'Bank Transfer' | 'Installments';
  paymentStatus: 'Paid' | 'Pending Invoice' | 'In Escrow';
  shippingAddress: string;
  city: string;
  trackingNumber?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  icon: string;
  summary: string;
  fullDetails: string;
  benefits: string[];
  responseHours: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Machines' | 'Warranty' | 'Shipping & Freight' | 'Rental & AMC' | 'Leasing' | string;
}

export interface FilterState {
  category: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  voltage: string;
  machineType: string;
  usageArea: string;
  inStockOnly: boolean;
  searchQuery: string;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
}

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  role: 'customer' | 'admin';
  phone: string;
  tin?: string;
  address?: string;
}

export interface SocialLink {
  id: string;
  platform: 'instagram' | 'telegram' | 'youtube' | 'tiktok' | 'facebook' | 'whatsapp' | 'linkedin' | 'twitter' | 'other';
  label: string;
  url: string;
  enabled: boolean;
}

export interface SiteSettings {
  brandName: string;
  brandShort: string;
  tagline: string;
  logoUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  primaryColor: string;
  accentColor: string;
  phone: string;
  phoneSecondary: string;
  email: string;
  emailSecondary: string;
  address: string;
  city: string;
  workingHours: string;
  mapEmbedUrl: string;
  socials: SocialLink[];
  aboutShort: string;
  copyrightText: string;
}

export interface AdminCredentials {
  username: string;
  password: string;
}
