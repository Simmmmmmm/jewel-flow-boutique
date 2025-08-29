import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  state: string;
}

const CheckoutInfo = () => {
  const navigate = useNavigate();
  const { state } = useCart();
  const { user } = useAuth();
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    state: '',
  });

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save shipping info to localStorage for the order summary
    localStorage.setItem('checkout-shipping-info', JSON.stringify(shippingInfo));
    navigate('/order-summary');
  };

  const isFormValid = Object.values(shippingInfo).every(value => value.trim() !== '');

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 hover:text-cyan-500"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-2xl font-serif">Shipping Information</CardTitle>
            <p className="text-muted-foreground">Please provide your delivery details</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={shippingInfo.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    required
                    className="focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={shippingInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                  className="focus:border-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  type="text"
                  value={shippingInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                  className="focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    type="text"
                    value={shippingInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                    className="focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    type="text"
                    value={shippingInfo.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    required
                    className="focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    type="text"
                    value={shippingInfo.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    required
                    className="focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isFormValid}
                >
                  Continue to Order Summary
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutInfo;