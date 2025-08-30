import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  inStock: boolean;
  rating: number;
  reviews: number;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'OPEN_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        
        return { ...state, items: updatedItems, total, itemCount };
      }
      
      const newItems = [...state.items, { ...action.payload, quantity: 1 }];
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { ...state, items: newItems, total, itemCount };
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { ...state, items: updatedItems, total, itemCount };
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity === 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: action.payload.id });
      }
      
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { ...state, items: updatedItems, total, itemCount };
    }
    
    case 'CLEAR_CART':
      return { ...state, items: [], total: 0, itemCount: 0 };
    
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    
    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isOpen: false,
};

interface CartContextType {
  state: CartState;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  openCart: () => void;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load cart from Supabase when user changes
  const loadCart = async (userId: string) => {
    try {
      setLoading(true);
      dispatch({ type: 'CLEAR_CART' });
      
      const { data, error } = await supabase
        .from('cart_items')
        .select('product_id, quantity')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // We need to get product details for each cart item
      const productIds = data?.map(item => item.product_id) || [];
      if (productIds.length > 0) {
        const { data: products } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);
          
        // Add items to cart with their quantities
        data?.forEach((cartItem) => {
          const product = products?.find(p => p.id === cartItem.product_id);
          if (product) {
            const productForCart: Product = {
              id: product.id,
              name: product.name,
              price: Number(product.price),
              image: product.image_url || '',
              category: product.category_name,
              description: product.description || '',
              inStock: product.in_stock,
              rating: Number(product.rating || 0),
              reviews: product.reviews_count || 0
            };
            
            for (let i = 0; i < cartItem.quantity; i++) {
              dispatch({ type: 'ADD_ITEM', payload: productForCart });
            }
          }
        });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      // Fallback to localStorage
      const savedCart = localStorage.getItem('luxe-jewelry-cart_guest');
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);
          if (cartData.items && Array.isArray(cartData.items)) {
            cartData.items.forEach((item: CartItem) => {
              for (let i = 0; i < item.quantity; i++) {
                dispatch({ type: 'ADD_ITEM', payload: item });
              }
            });
          }
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadCart(user.id);
    } else {
      // Load guest cart from localStorage
      dispatch({ type: 'CLEAR_CART' });
      const savedCart = localStorage.getItem('luxe-jewelry-cart_guest');
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);
          if (cartData.items && Array.isArray(cartData.items)) {
            cartData.items.forEach((item: CartItem) => {
              for (let i = 0; i < item.quantity; i++) {
                dispatch({ type: 'ADD_ITEM', payload: item });
              }
            });
          }
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    }
  }, [user?.id]);

  // Save to localStorage for guest users
  useEffect(() => {
    if (!user?.id) {
      localStorage.setItem('luxe-jewelry-cart_guest', JSON.stringify(state));
    }
  }, [state, user?.id]);

  const addItem = async (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    toast.success(`${product.name} added to cart`, {
      description: 'Item successfully added to your shopping cart',
    });

    if (user?.id) {
      try {
        // Check if item already exists in cart
        const { data: existingItem } = await supabase
          .from('cart_items')
          .select('quantity')
          .eq('user_id', user.id)
          .eq('product_id', product.id)
          .single();

        if (existingItem) {
          // Update quantity
          const { error } = await supabase
            .from('cart_items')
            .update({ quantity: existingItem.quantity + 1 })
            .eq('user_id', user.id)
            .eq('product_id', product.id);
          
          if (error) throw error;
        } else {
          // Insert new item
          const { error } = await supabase
            .from('cart_items')
            .insert({
              user_id: user.id,
              product_id: product.id,
              quantity: 1
            });
          
          if (error) throw error;
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  };

  const removeItem = async (id: string) => {
    const item = state.items.find(item => item.id === id);
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    if (item) {
      toast.success(`${item.name} removed from cart`);
    }

    if (user?.id) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', id);
        
        if (error) throw error;
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });

    if (user?.id) {
      try {
        if (quantity === 0) {
          const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', id);
          
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('user_id', user.id)
            .eq('product_id', id);
          
          if (error) throw error;
        }
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');

    if (user?.id) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);
        
        if (error) throw error;
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const value = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    closeCart,
    openCart,
    loading,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};