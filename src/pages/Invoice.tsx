import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Download, Home } from 'lucide-react';

interface OrderData {
  id: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  shippingInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    state: string;
  };
  subtotal: number;
  deliveryCharge: number;
  total: number;
  orderDate: string;
  paymentMethod: string;
}

const Invoice = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem('current-order');
    if (savedOrder) {
      setOrderData(JSON.parse(savedOrder));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownloadInvoice = () => {
    window.print();
  };

  const handleContinueShopping = () => {
    localStorage.removeItem('current-order');
    localStorage.removeItem('checkout-shipping-info');
    navigate('/');
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading invoice...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground">Thank you for your purchase. Your order has been confirmed.</p>
        </div>

        {/* Invoice Card */}
        <Card className="shadow-elegant">
          <CardHeader className="text-center border-b">
            <CardTitle className="text-2xl font-serif">Invoice</CardTitle>
            <div className="flex justify-between text-sm text-muted-foreground mt-4">
              <div>
                <p><strong>Order ID:</strong> #{orderData.id}</p>
                <p><strong>Order Date:</strong> {formatDate(orderData.orderDate)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">Artlery</p>
                <p>Premium Jewelry Store</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 mt-6">
            {/* Customer & Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Billing & Shipping Address:</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{orderData.shippingInfo.fullName}</p>
                  <p>{orderData.shippingInfo.email}</p>
                  <p>{orderData.shippingInfo.phone}</p>
                  <p>{orderData.shippingInfo.address}</p>
                  <p>{orderData.shippingInfo.city}, {orderData.shippingInfo.state} - {orderData.shippingInfo.postalCode}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Payment Method:</h3>
                <p className="text-sm text-muted-foreground">{orderData.paymentMethod}</p>
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-4">Order Items:</h3>
              <div className="space-y-3">
                {orderData.items.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                      <p className="text-sm text-muted-foreground">{formatPrice(item.price)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Order Summary */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(orderData.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges:</span>
                <span>{formatPrice(orderData.deliveryCharge)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-cyan-500">{formatPrice(orderData.total)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                variant="outline"
                onClick={handleDownloadInvoice}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Invoice
              </Button>
              <Button
                onClick={handleContinueShopping}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Continue Shopping
              </Button>
            </div>

            {/* Footer Note */}
            <div className="text-center pt-6 border-t text-sm text-muted-foreground">
              <p>Thank you for shopping with Artlery!</p>
              <p>For any queries, please contact our customer support.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Invoice;