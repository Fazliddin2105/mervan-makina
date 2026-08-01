import React, { Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { QuickViewModal } from './components/QuickViewModal';
import { QuoteModal } from './components/QuoteModal';
import { SearchModal } from './components/SearchModal';
import { FloatingActions } from './components/FloatingActions';
import { Toast } from './components/Toast';
import { ScrollProgress } from './components/ScrollProgress';

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ServicesPage } from './pages/ServicesPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { WishlistPage } from './pages/WishlistPage';
import { ComparePage } from './pages/ComparePage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
// The admin dashboard is ~1000 lines that only an administrator ever opens,
// so it is split out of the main bundle.
const AdminDashboardPage = lazy(() =>
  import('./pages/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })),
);
import { LoginPage } from './pages/LoginPage';

const MainContent: React.FC = () => {
  const { activePage } = useApp();

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductsPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'about':
        return <AboutUsPage />;
      case 'services':
        return <ServicesPage />;
      case 'blog':
        return <BlogPage />;
      case 'contact':
        return <ContactPage />;
      case 'faq':
        return <FaqPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'compare':
        return <ComparePage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'dashboard':
        return <CustomerDashboardPage />;
      case 'admin':
        return (
          <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Yuklanmoqda...</div>}>
            <AdminDashboardPage />
          </Suspense>
        );
      case 'login':
        return <LoginPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-800 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white">
      <div>
        <Header />
        {/* Keyed on the route so every page swap replays the fade,
            which softens the jump between sections of the site. */}
        <main key={activePage} className="page-enter">
          {renderPage()}
        </main>
      </div>

      <Footer />

      {/* Global Interactive Overlays */}
      <QuickViewModal />
      <QuoteModal />
      <SearchModal />
      <ScrollProgress />
      <FloatingActions />
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
