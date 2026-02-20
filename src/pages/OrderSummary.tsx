import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, Truck } from 'lucide-react';
import { toast } from 'sonner';

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  state: string;
}

interface PaymentInfo {
  method: string;
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
  upiId?: string;
  onlineBankingDetails?: string;
}

const OrderSummary = () => {
  const navigate = useNavigate();
  const { state, clearCart } = useCart();
  const { user } = useAuth();
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({ method: 'Cash on Delivery' });
  const deliveryCharge = 50; // Fixed delivery charge

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/order-summary' } });
    }
  }, [user, navigate]);

  useEffect(() => {
    const savedShippingInfo = localStorage.getItem('checkout-shipping-info');
    if (savedShippingInfo) {
      setShippingInfo(JSON.parse(savedShippingInfo));
    } else {
      // If no shipping info, redirect to checkout
      navigate('/checkout-info');
    }
  }, [navigate]);

  // Load saved payment info if any
  useEffect(() => {
    const savedPaymentInfo = localStorage.getItem('saved-payment-info');
    if (savedPaymentInfo) {
      setPaymentInfo(JSON.parse(savedPaymentInfo));
    }
  }, []);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const handlePaymentChange = (field: keyof PaymentInfo, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!shippingInfo) return;

    try {
      if (paymentInfo.method === 'Razorpay') {
        // Load Razorpay script dynamically
        const loadRazorpayScript = () => {
          return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });
        };

        const res = await loadRazorpayScript();
        if (!res) {
          toast.error('Failed to load Razorpay SDK. Please try again.');
          return;
        }

        // Create order on backend
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('You must be logged in to place an order.');
          return;
        }

        const orderData = {
          items: state.items.map(item => ({
            id: item.id,
            product_id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          shipping_info: {
            full_name: shippingInfo.fullName,
            email: shippingInfo.email,
            phone: shippingInfo.phone,
            address: shippingInfo.address,
            city: shippingInfo.city,
            postal_code: shippingInfo.postalCode,
            state: shippingInfo.state
          },
          subtotal: state.total,
          delivery_charge: deliveryCharge,
          total: state.total + deliveryCharge,
          payment_method: paymentInfo.method,
          payment_details: paymentInfo,
        };

        // Create order on backend to get Razorpay order id
        const response = await fetch('http://localhost:4000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(orderData)
        });

        if (!response.ok) {
          toast.error('Failed to create order. Please try again.');
          return;
        }

        const result = await response.json();

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || '', // Your Razorpay Key ID from .env
          amount: result.order.total * 100, // in paise
          currency: 'INR',
          name: 'Jewel Flow Boutique',
          description: 'Order Payment',
          order_id: result.razorpayOrder?.id,
          handler: async function (response: any) {
            // Verify payment on backend
            const verifyResponse = await fetch('http://localhost:4000/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyResult = await verifyResponse.json();
            if (verifyResult.success) {
              toast.success('Payment successful!');

              // Clear cart and navigate to invoice
              clearCart();
              navigate('/invoice');
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          },
          prefill: {
            name: shippingInfo.fullName,
            email: shippingInfo.email,
            contact: shippingInfo.phone
          },
          theme: {
            color: '#0ea5e9'
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();

      } else {
        // Existing Cash on Delivery flow
        const orderData = {
          items: state.items.map(item => ({
            id: item.id,
            product_id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          shipping_info: {
            full_name: shippingInfo.fullName,
            email: shippingInfo.email,
            phone: shippingInfo.phone,
            address: shippingInfo.address,
            city: shippingInfo.city,
            postal_code: shippingInfo.postalCode,
            state: shippingInfo.state
          },
          subtotal: state.total,
          delivery_charge: deliveryCharge,
          total: state.total + deliveryCharge,
          payment_method: paymentInfo.method,
          payment_details: paymentInfo,
        };

        const token = localStorage.getItem('token');

        // For demo purposes, create order locally if backend is not available
        let result;
        if (!token) {
          // Create mock order for guest users
          result = {
            order: {
              id: Date.now().toString(),
              items: orderData.items,
              shipping_info: {
                full_name: shippingInfo.fullName,
                email: shippingInfo.email,
                phone: shippingInfo.phone,
                address: shippingInfo.address,
                city: shippingInfo.city,
                postal_code: shippingInfo.postalCode,
                state: shippingInfo.state
              },
              subtotal: orderData.subtotal,
              delivery_charge: orderData.delivery_charge,
              total: orderData.total,
              status: 'pending',
              payment_method: orderData.payment_method,
              payment_status: 'pending',
              order_date: new Date().toISOString(),
              payment_details: orderData.payment_details,
            }
          };
        } else {
          // Try backend API
          const response = await fetch('http://localhost:4000/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
          });

          if (!response.ok) {
            throw new Error('Failed to create order');
          }

          result = await response.json();
        }

        // Save order data for invoice with camelCase keys for Invoice page
        localStorage.setItem('current-order', JSON.stringify({
          id: result.order.id,
          items: result.order.items,
          shippingInfo: {
            fullName: result.order.shipping_info.full_name,
            email: result.order.shipping_info.email,
            phone: result.order.shipping_info.phone,
            address: result.order.shipping_info.address,
            city: result.order.shipping_info.city,
            postalCode: result.order.shipping_info.postal_code,
            state: result.order.shipping_info.state
          },
          subtotal: result.order.subtotal,
          deliveryCharge: result.order.delivery_charge,
          total: result.order.total,
          orderDate: result.order.order_date,
          paymentMethod: result.order.payment_method,
          paymentDetails: result.order.payment_details,
          paymentStatus: result.order.payment_status || (paymentInfo.method === 'Razorpay' ? 'completed' : 'pending'),
        }));

        // Save shipping address to user's profile if authenticated
        if (token) {
          try {
            const addressData = {
              type: 'shipping',
              is_default: false,
              first_name: shippingInfo.fullName.split(' ')[0] || '',
              last_name: shippingInfo.fullName.split(' ').slice(1).join(' ') || '',
              company: '',
              address_line_1: shippingInfo.address,
              address_line_2: '',
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.postalCode,
              country: 'US',
              phone: shippingInfo.phone
            };

            await fetch('http://localhost:4000/api/addresses', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(addressData)
            });
            // Note: We don't need to handle the response here as it's not critical for order completion
          } catch (error) {
            console.error('Error saving address to profile:', error);
            // Continue with order completion even if address saving fails
          }
        }

        // Save payment info for future use
        localStorage.setItem('saved-payment-info', JSON.stringify(paymentInfo));

        // Clear cart
        clearCart();

        // Navigate to invoice
        navigate('/invoice');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      // Fallback: create order locally even if backend fails
      const fallbackOrder = {
        id: Date.now().toString(),
        items: state.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        shippingInfo: {
          fullName: shippingInfo.fullName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          postalCode: shippingInfo.postalCode,
          state: shippingInfo.state
        },
        subtotal: state.total,
        deliveryCharge: deliveryCharge,
        total: state.total + deliveryCharge,
        status: 'pending',
        paymentMethod: paymentInfo.method,
        paymentStatus: paymentInfo.method === 'Razorpay' ? 'completed' : 'pending',
        orderDate: new Date().toISOString(),
        paymentDetails: paymentInfo,
      };

      localStorage.setItem('current-order', JSON.stringify(fallbackOrder));
      clearCart();
      navigate('/invoice');
    }
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
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash on Delivery"
                        checked={paymentInfo.method === 'Cash on Delivery'}
                        onChange={() => handlePaymentChange('method', 'Cash on Delivery')}
                        className="cursor-pointer"
                      />
                      <span>Cash on Delivery</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Razorpay"
                        checked={paymentInfo.method === 'Razorpay'}
                        onChange={() => handlePaymentChange('method', 'Razorpay')}
                        className="cursor-pointer"
                      />
                      <span>Razorpay (Online Payment)</span>
                    </label>
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
                    disabled={
                      (paymentInfo.method === 'Credit Card' || paymentInfo.method === 'Debit Card') &&
                      (!paymentInfo.cardNumber || !paymentInfo.cardName || !paymentInfo.expiryDate || !paymentInfo.cvv)
                    }
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
