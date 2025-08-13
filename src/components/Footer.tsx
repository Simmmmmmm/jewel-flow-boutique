import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-luxury-black text-luxury-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                <span className="text-luxury-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-serif font-bold">Artlery</span>
            </div>
            <p className="text-luxury-white/80 mb-4">
              Exquisite handcrafted jewelry for life's precious moments.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-luxury-white/60 hover:text-gold-400 cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-luxury-white/60 hover:text-gold-400 cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-luxury-white/60 hover:text-gold-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-luxury-white/80 hover:text-gold-400 transition-colors">Home</Link></li>
              <li><Link to="/shop" className="text-luxury-white/80 hover:text-gold-400 transition-colors">Shop</Link></li>
              <li><Link to="/collections" className="text-luxury-white/80 hover:text-gold-400 transition-colors">Collections</Link></li>
              <li><Link to="/about" className="text-luxury-white/80 hover:text-gold-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-serif font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-luxury-white/80">
              <li>Shipping & Returns</li>
              <li>Size Guide</li>
              <li>Care Instructions</li>
              <li>Warranty</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 text-luxury-white/80">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>hello@luxejewelry.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>New York, NY</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-luxury-white/20 mt-8 pt-8 text-center text-luxury-white/60">
          <p>&copy; 2024 Artlery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;