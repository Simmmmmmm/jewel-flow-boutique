import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import heroImage from '../assets/hero-jewelry.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroImage}
          alt="Luxury Jewelry Collection"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/60" />
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
          <h1 className="text-[#F5E6D3] font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in drop-shadow-lg">
            Exquisite
            <span className="block text-[#FFFFFF] drop-shadow-xl">
              Jewelry
            </span>
            Collection
          </h1>

          {/* Description */}
          <p className="text-[#FFFFFF] text-base sm:text-lg md:text-xl leading-relaxed mb-8 animate-fade-in drop-shadow-md">
            Discover our curated collection of handcrafted jewelry pieces.
            Each item tells a story of elegance, craftsmanship, and timeless beauty.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
            <Link to="/shop">
              <Button
                className="bg-[#4B2E2E] hover:bg-[#3A2323] text-[#FFFFFF] px-8 py-4 text-lg group font-semibold rounded-lg transition-all duration-300 ease-out drop-shadow-lg hover:drop-shadow-xl"
              >
                Shop Collection
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link to="/collections">
              <Button
                className="border-2 border-[#4B2E2E] text-[#4B2E2E] hover:bg-[#4B2E2E] hover:text-[#FFFFFF] px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 ease-out drop-shadow-lg hover:drop-shadow-xl"
              >
                View Collections
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 animate-fade-in">
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gold-400 font-serif">
                1000+
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm">
                Happy Customers
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gold-400 font-serif">
                500+
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm">
                Unique Pieces
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gold-400 font-serif">
                10+
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm">
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