import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart, setActivePage } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-sans space-y-8">
      
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1D3F] flex items-center gap-2">
            <Heart className="text-rose-500 fill-current" size={28} /> Saqlangan texnika ro'yxati
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            <span className="tabular">{wishlist.length}</span> ta model saqlangan
          </p>
        </div>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="surface p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#0B1D3F]">Ro'yxatingiz bo'sh</h3>
          <p className="text-xs text-slate-500">
            Sanoat pol yuvish mashinalari va yuqori bosimli yuvish apparatlarini keyinroq oson topish uchun shu yerga saqlang.
          </p>
          <button
            onClick={() => setActivePage('products')}
            className="btn-secondary"
          >
            Katalogni ko'rish
          </button>
        </div>
      )}

    </div>
  );
};
