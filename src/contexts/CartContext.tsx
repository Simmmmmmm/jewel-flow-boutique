 import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
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

  // Load cart from localStorage based on user
  const loadCart = (userId?: string) => {
    try {
      setLoading(true);
      dispatch({ type: 'CLEAR_CART' });

      const cartKey = userId ? `luxe-jewelry-cart_${userId}` : 'luxe-jewelry-cart_guest';
      // Clear localStorage cart data to ensure empty cart on load
      localStorage.removeItem(cartKey);

      // Do not load saved cart data to keep cart empty on load
      /*
      const savedCart = localStorage.getItem(cartKey);

      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        if (cartData.items && Array.isArray(cartData.items)) {
          cartData.items.forEach((item: CartItem) => {
            for (let i = 0; i < item.quantity; i++) {
              dispatch({ type: 'ADD_ITEM', payload: item });
            }
          });
        }
      }
      */
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart(user?.id);
  }, [user?.id]);

  // Save to localStorage when cart changes
  useEffect(() => {
    const cartKey = user?.id ? `luxe-jewelry-cart_${user.id}` : 'luxe-jewelry-cart_guest';
    localStorage.setItem(cartKey, JSON.stringify(state));
  }, [state, user?.id]);

  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    toast.success(`${product.name} added to cart`, {
      description: 'Item successfully added to your shopping cart',
    });
  };

  const removeItem = (id: string) => {
    const item = state.items.find(item => item.id === id);
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    if (item) {
      toast.success(`${item.name} removed from cart`);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
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