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
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [ids, setIds] = useState<string[]>([]);

  const getUserWishlistKey = (userEmail: string | null) => 
    userEmail ? `wishlist_${userEmail}` : 'wishlist_guest';

  // Load wishlist when user changes
  useEffect(() => {
    try {
      const key = getUserWishlistKey(user?.email || null);
      const saved = JSON.parse(localStorage.getItem(key) || '[]');
      if (Array.isArray(saved)) {
        setIds(saved);
      } else {
        setIds([]);
      }
    } catch {
      setIds([]);
    }
  }, [user?.email]);

  // Save wishlist when ids change
  useEffect(() => {
    const key = getUserWishlistKey(user?.email || null);
    localStorage.setItem(key, JSON.stringify(ids));
  }, [ids, user?.email]);

  const add = (productId: string) => {
    setIds((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
    toast({ title: 'Added to wishlist' });
  };

  const remove = (productId: string) => {
    setIds((prev) => prev.filter((id) => id !== productId));
    toast({ title: 'Removed from wishlist' });
  };

  const toggle = (productId: string) => {
    setIds((prev) => {
      if (prev.includes(productId)) {
        toast({ title: 'Removed from wishlist' });
        return prev.filter((id) => id !== productId);
      }
      toast({ title: 'Added to wishlist' });
      return [...prev, productId];
    });
  };

  const isWishlisted = (productId: string) => ids.includes(productId);

  const clear = () => setIds([]);

  const value = useMemo(() => ({ ids, add, remove, toggle, isWishlisted, clear }), [ids]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
