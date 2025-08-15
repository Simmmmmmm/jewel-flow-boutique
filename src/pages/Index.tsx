import React from 'react';
import { ArrowRight, Star, Award, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { featuredProducts, bestSellers } from '../data/products';

const Index = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      text: 'Absolutely stunning jewelry! The craftsmanship is exceptional and the customer service was outstanding.',
      product: 'Diamond Engagement Ring'
    },
    {
      name: 'Michael Chen',
      rating: 5,
      text: 'Bought a necklace for my wife\'s anniversary. She was thrilled! Beautiful packaging and fast delivery.',
      product: 'Gold Necklace'
    },
    {
      name: 'Emily Davis',
      rating: 5,
      text: 'The pearl earrings are even more beautiful in person. Artlery exceeded my expectations!',
      product: 'Pearl Earrings'
    }
  ];

  const features = [
    {
      icon: Award,
      title: 'Master Craftsmanship',
      description: 'Each piece is handcrafted by skilled artisans with decades of experience.'
    },
    {
      icon: Shield,
      title: 'Lifetime Warranty',
      description: 'We stand behind our quality with comprehensive lifetime warranty coverage.'
    },
    {
      icon: Star,
      title: 'Premium Materials',
      description: 'Only the finest diamonds, precious metals, and gemstones make it into our collection.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Products */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-luxury-heading text-3xl md:text-4xl font-serif font-bold mb-4">
              Featured Collection
            </h2>
            <p className="text-luxury-body text-lg max-w-2xl mx-auto">
              Discover our most popular pieces, each carefully selected for their exceptional beauty and craftsmanship.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/shop">
              <Button className="btn-luxury group px-8 py-3 text-lg">
                View All Products
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-luxury-heading text-3xl md:text-4xl font-serif font-bold mb-4">
              Why Choose Artlery
            </h2>
            <p className="text-luxury-body text-lg max-w-2xl mx-auto">
              Experience the difference that comes with true craftsmanship and dedication to excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="text-center p-6 lg:p-8 rounded-xl bg-card border border-border shadow-elegant hover:shadow-luxury transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-gold-600 rounded-full flex items-center justify-center shadow-gold">
                    <IconComponent className="w-8 h-8 text-luxury-white" />
                  </div>
                  <h3 className="text-luxury-heading text-xl font-serif font-semibold mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-luxury-body leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-luxury-heading text-3xl md:text-4xl font-serif font-bold mb-4">
              Best Sellers
            </h2>
            <p className="text-luxury-body text-lg max-w-2xl mx-auto">
              Our customers' favorite pieces, chosen for their timeless appeal and exceptional quality.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-luxury-heading text-3xl md:text-4xl font-serif font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className="text-luxury-body text-lg max-w-2xl mx-auto">
              Real experiences from our valued customers who have found their perfect piece.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="bg-card border border-border rounded-xl p-6 lg:p-8 shadow-elegant hover:shadow-luxury transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold-500 fill-current" />
                  ))}
                </div>
                <p className="text-luxury-body leading-relaxed mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="border-t border-border pt-4">
                  <div className="font-semibold text-luxury-heading">{testimonial.name}</div>
                  <div className="text-gold-600 text-sm">{testimonial.product}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-r from-gold-600 to-gold-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-luxury-white text-3xl md:text-4xl font-serif font-bold mb-4">
            Stay in Touch
          </h2>
          <p className="text-luxury-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Be the first to discover new arrivals, exclusive collections, and special offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-luxury-white"
            />
            <Button className="bg-luxury-white text-gold-700 hover:bg-gold-50 font-semibold px-8 py-3">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
