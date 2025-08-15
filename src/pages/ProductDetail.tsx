import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Star, Shield, Truck, RotateCcw, ShoppingBag } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);
  const relatedProducts = products.filter(p => p.category === product?.category && p.id !== id).slice(0, 4);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-luxury-heading mb-4">Product not found</h1>
          <Link to="/shop" className="btn-luxury">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  // For demo purposes, using the same image multiple times
  const productImages = [product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-luxury-body hover:text-gold-600">Home</Link>
            <span className="text-luxury-gray">/</span>
            <Link to="/shop" className="text-luxury-body hover:text-gold-600">Shop</Link>
            <span className="text-luxury-gray">/</span>
            <Link to={`/shop?category=${product.category}`} className="text-luxury-body hover:text-gold-600">
              {product.category}
            </Link>
            <span className="text-luxury-gray">/</span>
            <span className="text-luxury-gray">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/shop"
          className="inline-flex items-center text-luxury-body hover:text-gold-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-card border border-border rounded-xl shadow-elegant overflow-hidden">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-card border border-border rounded-lg overflow-hidden shadow-sm transition-all ${
                    selectedImage === index
                      ? 'ring-2 ring-gold-500 ring-offset-2'
                      : 'hover:shadow-elegant'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Stock */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-gold-600 border-gold-300">
                {product.category}
              </Badge>
              {product.inStock ? (
                <Badge className="bg-green-100 text-green-800">In Stock</Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            {/* Title & Rating */}
            <div>
              <h1 className="text-luxury-heading text-3xl md:text-4xl font-serif font-bold mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-gold-500 fill-current'
                          : 'text-gold-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-luxury-body">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-luxury-heading">
              {formatPrice(product.price)}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-luxury-heading font-semibold mb-2">Description</h3>
              <p className="text-luxury-body leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-luxury-heading font-medium">Quantity:</label>
                <div className="flex items-center border border-gold-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gold-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gold-200">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gold-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="btn-luxury flex-1 py-3 text-lg"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                
                <Button
                  variant="outline"
                  className="p-3 border-gold-300 hover:bg-gold-50"
                >
                  <Heart className="w-5 h-5 text-gold-600" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gold-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gold-100 rounded-lg">
                  <Truck className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <div className="font-medium text-luxury-heading text-sm">Free Shipping</div>
                  <div className="text-luxury-body text-xs">On orders over $500</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gold-100 rounded-lg">
                  <RotateCcw className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <div className="font-medium text-luxury-heading text-sm">30-Day Returns</div>
                  <div className="text-luxury-body text-xs">Easy returns</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gold-100 rounded-lg">
                  <Shield className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <div className="font-medium text-luxury-heading text-sm">Lifetime Warranty</div>
                  <div className="text-luxury-body text-xs">Quality guaranteed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-luxury-heading text-2xl font-serif font-bold mb-8 text-center">
              You might also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;