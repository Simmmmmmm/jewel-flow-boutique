import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, Truck } from 'lucide-react';

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  state: string;
}

const OrderSummary = () => {
  const navigate = useNavigate();
  const { state, clearCart } = useCart();
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const deliveryCharge = 50; // Fixed delivery charge

  useEffect(() => {
    const savedShippingInfo = localStorage.getItem('checkout-shipping-info');
    if (savedShippingInfo) {
      setShippingInfo(JSON.parse(savedShippingInfo));
    } else {
      // If no shipping info, redirect to checkout
      navigate('/checkout-info');
    }
  }, [navigate]);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const handlePlaceOrder = () => {
    if (!shippingInfo) return;

    // Create order data
    const orderData = {
      id: Date.now().toString(),
      items: state.items,
      shippingInfo,
      subtotal: state.total,
      deliveryCharge,
      total: state.total + deliveryCharge,
      orderDate: new Date().toISOString(),
      paymentMethod: 'Cash on Delivery',
    };

    // Save order data
    localStorage.setItem('current-order', JSON.stringify(orderData));
    
    // Clear cart
    clearCart();
    
    // Navigate to invoice
    navigate('/invoice');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!shippingInfo || state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading order details...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/checkout-info')}
          className="mb-6 hover:text-cyan-500"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shipping Info
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Items */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Items ({state.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-card/50 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shipping & Payment */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{shippingInfo.fullName}</p>
                  <p className="text-muted-foreground">{shippingInfo.email}</p>
                  <p className="text-muted-foreground">{shippingInfo.phone}</p>
                  <p className="text-muted-foreground">
                    {shippingInfo.address}, {shippingInfo.city}
                  </p>
                  <p className="text-muted-foreground">
                    {shippingInfo.state} - {shippingInfo.postalCode}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(state.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>{formatPrice(deliveryCharge)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount</span>
                  <span className="text-cyan-500">{formatPrice(state.total + deliveryCharge)}</span>
                </div>
                
                <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                  <p className="text-sm font-medium mb-2">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                    <span className="text-sm">Cash on Delivery</span>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    Cancel Order
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    className="flex-1"
                  >
                    Place Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;