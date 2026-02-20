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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  return (
    <div className={`bg-card border border-border rounded-xl shadow-elegant transition-all duration-500 cursor-pointer h-full flex flex-col ${className}`}>
      <Link to={`/product/${product.id}`} className="flex flex-col h-full">
        {/* Image Container */}
        <div className={`relative aspect-square overflow-hidden rounded-t-xl flex-shrink-0 ${
          product.category === 'Bracelets'
            ? 'flex items-center justify-center'
            : ''
        }`} style={product.category === 'Bracelets' ? {} : { backgroundColor: 'rgb(248 250 252 / 0.5)' }}>
          <img
            src={product.image}
            alt={product.name}
            className={`product-image transition-opacity duration-500 ${
              product.category === 'Bracelets'
                ? 'w-full h-full object-cover'
                : 'w-full h-full object-cover'
            }`}
          />
          {product.images && product.images.length > 1 && (
            <img
              src={product.images[1]}
              alt={`${product.name} - alternate view`}
              className={`product-image absolute inset-0 opacity-100 transition-opacity duration-500 ${
                product.category === 'Bracelets'
                  ? 'w-full h-full object-cover'
                  : 'w-full h-full object-cover'
              }`}
            />
          )}
          
          {/* Wishlist Button */}
          <button
            className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-full shadow-elegant opacity-100 transition-all duration-300 hover:scale-110"
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
          <div className="absolute bottom-4 left-4 right-4 opacity-100 transition-all duration-300 transform translate-y-0">
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
        <div className="p-4 flex-1 flex flex-col">
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
          
          {/* Description Preview */}
          <p className="text-luxury-body text-sm mb-4 line-clamp-2 flex-1">
            {product.description}
          </p>
          
          {/* Price */}
          <div className="flex items-center justify-between mt-auto">
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
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;