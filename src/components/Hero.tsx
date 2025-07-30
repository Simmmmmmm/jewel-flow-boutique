import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import heroImage from '../assets/hero-jewelry.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury Jewelry Collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/60 via-luxury-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gold-100/90 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-gold-600" />
            <span className="text-gold-800 font-medium text-sm">
              Handcrafted Excellence
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-luxury-white font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in">
            Exquisite
            <span className="block text-transparent bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text">
              Jewelry
            </span>
            Collection
          </h1>

          {/* Description */}
          <p className="text-luxury-white/90 text-lg md:text-xl leading-relaxed mb-8 animate-fade-in">
            Discover our curated collection of handcrafted jewelry pieces. 
            Each item tells a story of elegance, craftsmanship, and timeless beauty.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
            <Link to="/shop">
              <Button className="btn-luxury group px-8 py-4 text-lg">
                Shop Collection
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Link to="/collections">
              <Button
                variant="outline"
                className="btn-outline-luxury px-8 py-4 text-lg border-2 border-luxury-white text-luxury-white hover:bg-luxury-white hover:text-luxury-black"
              >
                View Collections
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-8 mt-12 animate-fade-in">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gold-400 font-serif">
                1000+
              </div>
              <div className="text-luxury-white/80 text-sm">
                Happy Customers
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gold-400 font-serif">
                500+
              </div>
              <div className="text-luxury-white/80 text-sm">
                Unique Pieces
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gold-400 font-serif">
                10+
              </div>
              <div className="text-luxury-white/80 text-sm">
                Years Experience
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-2 h-2 bg-gold-400 rounded-full animate-float opacity-60" />
      <div className="absolute bottom-40 left-20 w-3 h-3 bg-gold-500 rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-40 w-1 h-1 bg-gold-300 rounded-full animate-float opacity-80" style={{ animationDelay: '2s' }} />

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-luxury-white/60 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-luxury-white/60 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;