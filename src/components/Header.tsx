import React, { useState } from 'react';
import { ShoppingBag, Search, User, Menu, X, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { state, toggleCart } = useCart();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Collections', href: '/collections' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-luxury-white shadow-elegant sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
              <span className="text-luxury-white font-bold text-sm">L</span>
            </div>
            <span className="text-luxury-heading text-xl font-serif font-bold">
              Luxe Jewelry
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`btn-ghost-luxury ${
                  isActive(item.href) ? 'text-gold-600' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center max-w-md mx-8 flex-1">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gray w-4 h-4" />
              <Input
                type="search"
                placeholder="Search jewelry..."
                className="pl-10 pr-4 py-2 w-full bg-gold-50 border-gold-200 focus:border-gold-400"
              />
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <button
              className="lg:hidden p-2 text-luxury-gray hover:text-gold-600 transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="p-2 text-luxury-gray hover:text-gold-600 transition-colors">
              <Heart className="w-5 h-5" />
            </Link>

            {/* Account */}
            <Link to="/account" className="p-2 text-luxury-gray hover:text-gold-600 transition-colors">
              <User className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-luxury-gray hover:text-gold-600 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {state.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-600 text-luxury-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-scale-in">
                  {state.itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-luxury-gray hover:text-gold-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="lg:hidden py-4 border-t border-gold-100 animate-slide-up">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gray w-4 h-4" />
              <Input
                type="search"
                placeholder="Search jewelry..."
                className="pl-10 pr-4 py-2 w-full bg-gold-50 border-gold-200 focus:border-gold-400"
              />
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gold-100 animate-slide-up">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-4 py-2 text-luxury-body hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-all ${
                    isActive(item.href) ? 'text-gold-600 bg-gold-50' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;