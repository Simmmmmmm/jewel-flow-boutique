import React, { useEffect, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';
import { useWishlist } from '@/contexts/WishlistContext';

const Wishlist: React.FC = () => {
  const { ids } = useWishlist();

  useEffect(() => {
    document.title = 'Wishlist | Artlery';
  }, []);

  const wishlistProducts = useMemo(() => products.filter((p) => ids.includes(p.id)), [ids]);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border shadow-elegant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-luxury-heading text-4xl md:text-5xl font-serif font-bold mb-4">Your Wishlist</h1>
            <p className="text-luxury-body">Saved items you love</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-luxury-body">Your wishlist is empty. Explore products and tap the heart to save them.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
