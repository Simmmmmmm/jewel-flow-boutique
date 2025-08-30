import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
  const { user, session } = useAuth();
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist from Supabase when user changes
  const loadWishlist = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('product_id')
        .eq('user_id', userId);
      
      if (error) throw error;
      setIds(data?.map(item => item.product_id) || []);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      // Fallback to localStorage for guest users
      const saved = JSON.parse(localStorage.getItem('wishlist_guest') || '[]');
      setIds(Array.isArray(saved) ? saved : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadWishlist(user.id);
    } else {
      // Load guest wishlist from localStorage
      try {
        const saved = JSON.parse(localStorage.getItem('wishlist_guest') || '[]');
        setIds(Array.isArray(saved) ? saved : []);
      } catch {
        setIds([]);
      }
    }
  }, [user?.id]);

  // Save to localStorage for guest users
  useEffect(() => {
    if (!user?.id) {
      localStorage.setItem('wishlist_guest', JSON.stringify(ids));
    }
  }, [ids, user?.id]);

  const add = async (productId: string) => {
    if (ids.includes(productId)) return;

    setIds(prev => [...prev, productId]);
    toast({ title: 'Added to wishlist' });

    if (user?.id) {
      try {
        const { error } = await supabase
          .from('wishlist_items')
          .insert({ user_id: user.id, product_id: productId });
        
        if (error) throw error;
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        // Revert local state on error
        setIds(prev => prev.filter(id => id !== productId));
        toast({ title: 'Error adding to wishlist', description: 'Please try again.' });
      }
    }
  };

  const remove = async (productId: string) => {
    setIds(prev => prev.filter(id => id !== productId));
    toast({ title: 'Removed from wishlist' });

    if (user?.id) {
      try {
        const { error } = await supabase
          .from('wishlist_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
        
        if (error) throw error;
      } catch (error) {
        console.error('Error removing from wishlist:', error);
        // Revert local state on error
        setIds(prev => [...prev, productId]);
        toast({ title: 'Error removing from wishlist', description: 'Please try again.' });
      }
    }
  };

  const toggle = (productId: string) => {
    if (isWishlisted(productId)) {
      remove(productId);
    } else {
      add(productId);
    }
  };

  const isWishlisted = (productId: string) => ids.includes(productId);

  const clear = async () => {
    setIds([]);
    
    if (user?.id) {
      try {
        const { error } = await supabase
          .from('wishlist_items')
          .delete()
          .eq('user_id', user.id);
        
        if (error) throw error;
        toast({ title: 'Wishlist cleared' });
      } catch (error) {
        console.error('Error clearing wishlist:', error);
        toast({ title: 'Error clearing wishlist', description: 'Please try again.' });
      }
    } else {
      localStorage.removeItem('wishlist_guest');
      toast({ title: 'Wishlist cleared' });
    }
  };

  const value = useMemo(() => ({ ids, add, remove, toggle, isWishlisted, clear, loading }), [ids, loading]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
