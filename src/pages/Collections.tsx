import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { categories, products } from '../data/products';

const Collections = () => {
  const collections = categories.map(category => {
    const categoryProducts = products.filter(p => p.category === category);
    const featuredProduct = categoryProducts[0];
    
    return {
      name: category,
      description: `Discover our exquisite ${category.toLowerCase()} collection`,
      image: featuredProduct?.image,
      productCount: categoryProducts.length,
      priceRange: categoryProducts.length > 0 ? {
        min: Math.min(...categoryProducts.map(p => p.price)),
        max: Math.max(...categoryProducts.map(p => p.price))
      } : null
    };
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-elegant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-luxury-heading text-4xl md:text-6xl font-serif font-bold mb-6">
              Our Collections
            </h1>
            <p className="text-luxury-body text-xl max-w-3xl mx-auto leading-relaxed">
              Each collection tells a unique story of craftsmanship, elegance, and timeless beauty. 
              Discover pieces that reflect your personal style and celebrate life's special moments.
            </p>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {collections.map((collection, index) => (
            <div
              key={collection.name}
              className="group bg-card border border-border rounded-2xl shadow-elegant overflow-hidden hover:shadow-luxury transition-all duration-500 animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Collection Image */}
              <div className="aspect-[4/3] overflow-hidden bg-gold-50">
                {collection.image ? (
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center">
                    <span className="text-6xl font-serif font-bold text-gold-600">
                      {collection.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Collection Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-luxury-heading text-2xl font-serif font-bold">
                    {collection.name}
                  </h3>
                  <span className="bg-gold-100 text-gold-800 text-sm px-3 py-1 rounded-full font-medium">
                    {collection.productCount} items
                  </span>
                </div>

                <p className="text-luxury-body mb-4 leading-relaxed">
                  {collection.description}
                </p>

                {collection.priceRange && (
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-luxury-body text-sm">Price range:</span>
                    <span className="text-luxury-heading font-semibold">
                      {formatPrice(collection.priceRange.min)} - {formatPrice(collection.priceRange.max)}
                    </span>
                  </div>
                )}

                <Link to={`/shop?category=${collection.name}`}>
                  <Button className="w-full btn-luxury group">
                    Explore Collection
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>


        {/* Newsletter Signup */}
        <div className="mt-16 text-center bg-card border border-border rounded-2xl shadow-elegant p-8 lg:p-12">
          <h3 className="text-luxury-heading text-2xl md:text-3xl font-serif font-bold mb-4">
            Stay Updated
          </h3>
          <p className="text-luxury-body text-lg mb-6 max-w-2xl mx-auto">
            Be the first to know about new collections, exclusive pieces, and special events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:border-gold-400"
            />
            <Button className="btn-luxury px-8 py-3">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collections;