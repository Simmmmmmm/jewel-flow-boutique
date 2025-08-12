import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WishlistContextType {
  ids: string[];
  toggle: (productId: string) => void;
  add: (productId: string) => void;
  remove: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
const WISHLIST_KEY = 'wishlist_ids';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
      if (Array.isArray(saved)) setIds(saved);
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
  }, [ids]);

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
