import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';

const CartSidebar = () => {
  const { state, closeCart, updateQuantity, removeItem, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleCheckout = () => {
    // Handle checkout logic here
    console.log('Proceeding to checkout with items:', state.items);
    closeCart();
  };

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 shadow-luxury animate-slide-in-right">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="text-luxury-heading text-lg font-serif font-semibold">
                Shopping Cart
              </h2>
              <span className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-full font-medium">
                {state.itemCount}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-accent rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-luxury-heading text-lg font-semibold mb-2">
                  Your cart is empty
                </h3>
                <p className="text-luxury-body mb-6">
                  Add some beautiful jewelry to get started
                </p>
                <Button onClick={closeCart} className="btn-luxury">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 bg-accent/50 rounded-lg cart-item-enter"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-card border border-border rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-luxury-heading font-medium truncate">
                        {item.name}
                      </h4>
                      <p className="text-luxury-body text-sm">{item.category}</p>
                      <p className="text-primary font-semibold">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-accent rounded transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4 text-muted-foreground" />
                      </button>
                      
                      <span className="w-8 text-center text-luxury-heading font-medium">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-accent rounded transition-colors"
                      >
                        <Plus className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 hover:bg-accent rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
                    </button>
                  </div>
                ))}

                {/* Clear Cart Button */}
                {state.items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-muted-foreground text-sm hover:text-destructive transition-colors"
                  >
                    Clear all items
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-border p-6 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-lg">
                <span className="text-luxury-heading font-semibold">Subtotal:</span>
                <span className="text-luxury-heading font-bold">
                  {formatPrice(state.total)}
                </span>
              </div>

              {/* Tax Notice */}
              <p className="text-luxury-body text-sm">
                Shipping and taxes calculated at checkout
              </p>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                className="w-full btn-luxury py-3 text-lg"
              >
                Proceed to Checkout
              </Button>

              {/* Continue Shopping */}
              <Button
                onClick={closeCart}
                variant="outline"
                className="w-full btn-outline-luxury"
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;