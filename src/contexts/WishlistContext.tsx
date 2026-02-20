import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  ids: string[];
  toggle: (productId: string) => void;
  add: (productId: string) => void;
  remove: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  clear: () => void;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist from localStorage based on user
  useEffect(() => {
    try {
      const wishlistKey = user?.id ? `wishlist_${user.id}` : 'wishlist_guest';
      const saved = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
      setIds(Array.isArray(saved) ? saved : []);
    } catch {
      setIds([]);
    }
    setLoading(false);
  }, [user?.id]);

  // Save to localStorage whenever ids change
  useEffect(() => {
    const wishlistKey = user?.id ? `wishlist_${user.id}` : 'wishlist_guest';
    localStorage.setItem(wishlistKey, JSON.stringify(ids));
  }, [ids, user?.id]);

  const add = (productId: string) => {
    if (ids.includes(productId)) return;

    setIds(prev => [...prev, productId]);
    toast({ title: 'Added to wishlist' });
  };

  const remove = (productId: string) => {
    setIds(prev => prev.filter(id => id !== productId));
    toast({ title: 'Removed from wishlist' });
  };

  const toggle = (productId: string) => {
    if (isWishlisted(productId)) {
      remove(productId);
    } else {
      add(productId);
    }
  };

  const isWishlisted = (productId: string) => ids.includes(productId);

  const clear = () => {
    setIds([]);
    const wishlistKey = user?.id ? `wishlist_${user.id}` : 'wishlist_guest';
    localStorage.removeItem(wishlistKey);
    toast({ title: 'Wishlist cleared' });
  };

  const value = useMemo(() => ({ ids, add, remove, toggle, isWishlisted, clear, loading }), [ids, loading]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
