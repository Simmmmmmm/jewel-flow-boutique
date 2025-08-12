import React from 'react';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../contexts/CartContext';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const wished = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className={`product-card group cursor-pointer ${className}`}>
      <Link to={`/product/${product.id}`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gold-50">
          <img
            src={product.image}
            alt={product.name}
            className="product-image w-full h-full object-cover"
          />
          
          {/* Wishlist Button */}
          <button
            className="absolute top-4 right-4 p-2 bg-luxury-white rounded-full shadow-elegant opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle(product.id);
            }}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${wished ? 'text-gold-600' : 'text-luxury-gray hover:text-gold-600'}`}
              style={{ fill: wished ? 'currentColor' : 'none' }}
            />
          </button>

          {/* Quick Add Button */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <Button
              onClick={handleAddToCart}
              className="w-full btn-luxury text-sm py-2"
              disabled={!product.inStock}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>

          {/* Stock Badge */}
          {!product.inStock && (
            <div className="absolute top-4 left-4 px-2 py-1 bg-luxury-black text-luxury-white text-xs rounded-md">
              Out of Stock
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <p className="text-gold-600 text-sm font-medium mb-1">{product.category}</p>
          
          {/* Name */}
          <h3 className="text-luxury-heading text-lg font-serif font-semibold mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-gold-500 fill-current'
                      : 'text-gold-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-luxury-gray text-sm ml-2">
              {product.rating} ({product.reviews})
            </span>
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <p className="text-luxury-heading text-xl font-bold">
              {formatPrice(product.price)}
            </p>
            
            {/* Mobile Add to Cart */}
            <div className="md:hidden">
              <Button
                onClick={handleAddToCart}
                size="sm"
                className="btn-luxury"
                disabled={!product.inStock}
              >
                <ShoppingBag className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Description Preview */}
          <p className="text-luxury-body text-sm mt-2 line-clamp-2">
            {product.description}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;